type MapLocale = 'ja' | 'zh-Hant' | 'en';

export const MAP_FLAG_WIDTH = 38;
export const MAP_FLAG_HEIGHT = MAP_FLAG_WIDTH / 1.5;
export const MAP_FLAG_GAP = 2;
export const MAP_LABEL_FONT_SIZES: Readonly<Record<MapLocale, number>> = {
  ja: 18,
  'zh-Hant': 18,
  en: 16,
};

const ANNOTATION_SEPARATION = 4;
const COLLISION_EPSILON = 0.01;
const MAX_COLLISION_PASSES = 200;

type MapShapeLike =
  | { kind: 'rect'; x: number; y: number; width: number; height: number }
  | { kind: 'polygon'; points: string };

export type PrefectureMapLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
};

export type AnnotationBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type MapLabelAnnotation = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  outlineWidth: number;
  bounds: AnnotationBounds;
};

type MapFlagAnnotation = {
  x: number;
  y: number;
  width: number;
  height: number;
  bounds: AnnotationBounds;
};

export type MapAnnotationLayout = {
  code: string;
  offsetX: number;
  offsetY: number;
  label: MapLabelAnnotation;
  flag?: MapFlagAnnotation;
};

const PREFECTURE_FLAG_OFFSETS: Readonly<Record<string, { x: number; y: number }>> = {
  // Fukuoka needs extra space between its long label and flag.
  '40': { x: 0, y: -12 },
};

export function createMapAnnotation({
  code,
  name,
  locale,
  mapLayout,
  showFlag,
}: {
  code: string;
  name: string;
  locale: MapLocale;
  mapLayout: PrefectureMapLayout;
  showFlag: boolean;
}): MapAnnotationLayout {
  const text = getMapLabel(name, locale);
  const textWidthUnits = getTextWidthUnits(text);
  const fontSize = MAP_LABEL_FONT_SIZES[locale];
  const outlineWidth = Math.max(2.4, fontSize * 0.18);
  const outlineRadius = outlineWidth / 2;
  const labelOffset = showFlag
    ? Math.min(mapLayout.height * 0.26, fontSize * 0.9)
    : 0;
  const labelY = mapLayout.y + labelOffset + fontSize * 0.34;
  const labelWidth = textWidthUnits * fontSize;
  const label: MapLabelAnnotation = {
    text,
    x: mapLayout.x,
    y: labelY,
    fontSize,
    outlineWidth,
    bounds: {
      left: mapLayout.x - labelWidth / 2 - outlineRadius,
      right: mapLayout.x + labelWidth / 2 + outlineRadius,
      top: labelY - fontSize * 0.8 - outlineRadius,
      bottom: labelY + fontSize * 0.2 + outlineRadius,
    },
  };

  if (!showFlag) {
    return { code, offsetX: 0, offsetY: 0, label };
  }

  const flagOffset = PREFECTURE_FLAG_OFFSETS[code];
  const flagX = mapLayout.x + (flagOffset?.x ?? 0);
  const flagAnchorY = mapLayout.y + (flagOffset?.y ?? 0);
  const flagY = flagAnchorY - MAP_FLAG_HEIGHT - MAP_FLAG_GAP;

  return {
    code,
    offsetX: 0,
    offsetY: 0,
    label,
    flag: {
      x: flagX - MAP_FLAG_WIDTH / 2,
      y: flagY,
      width: MAP_FLAG_WIDTH,
      height: MAP_FLAG_HEIGHT,
      bounds: {
        left: flagX - MAP_FLAG_WIDTH / 2,
        right: flagX + MAP_FLAG_WIDTH / 2,
        top: flagY,
        bottom: flagY + MAP_FLAG_HEIGHT,
      },
    },
  };
}

export function resolveMapAnnotationCollisions(
  annotations: readonly MapAnnotationLayout[],
  containerBounds?: AnnotationBounds,
): MapAnnotationLayout[] {
  const workingAnnotations = annotations.map((annotation) => ({
    annotation,
    offsetX: 0,
    offsetY: 0,
  }));

  for (let pass = 0; pass < MAX_COLLISION_PASSES; pass += 1) {
    let collisionCount = 0;

    for (let firstIndex = 0; firstIndex < workingAnnotations.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < workingAnnotations.length;
        secondIndex += 1
      ) {
        const first = workingAnnotations[firstIndex];
        const second = workingAnnotations[secondIndex];
        const resolution = getCollisionResolution(first, second);

        if (!resolution) {
          continue;
        }

        collisionCount += 1;
        const displacement = resolution.amount / 2 + COLLISION_EPSILON;

        if (resolution.axis === 'x') {
          first.offsetX += resolution.direction * displacement;
          second.offsetX -= resolution.direction * displacement;
        } else {
          first.offsetY += resolution.direction * displacement;
          second.offsetY -= resolution.direction * displacement;
        }
      }
    }

    let boundaryAdjustmentCount = 0;
    if (containerBounds) {
      for (const annotation of workingAnnotations) {
        const adjustment = getContainerAdjustment(annotation, containerBounds);
        if (
          Math.abs(adjustment.x) <= COLLISION_EPSILON &&
          Math.abs(adjustment.y) <= COLLISION_EPSILON
        ) {
          continue;
        }

        annotation.offsetX += adjustment.x;
        annotation.offsetY += adjustment.y;
        boundaryAdjustmentCount += 1;
      }
    }

    if (collisionCount === 0 && boundaryAdjustmentCount === 0) {
      return workingAnnotations.map(applyAnnotationOffset);
    }
  }

  throw new Error('Unable to find a collision-free map annotation layout.');
}

export function doMapAnnotationsOverlap(
  first: MapAnnotationLayout,
  second: MapAnnotationLayout,
  separation = 0,
): boolean {
  return getAnnotationBounds(first).some((firstBounds) =>
    getAnnotationBounds(second).some((secondBounds) =>
      doBoundsOverlap(firstBounds, secondBounds, separation),
    ),
  );
}

export function getShapeLayout(shape: MapShapeLike): PrefectureMapLayout {
  if (shape.kind === 'rect') {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
      width: shape.width,
      height: shape.height,
      area: shape.width * shape.height,
    };
  }

  const points = shape.points
    .trim()
    .split(/\s+/)
    .map((point) => point.split(',').map(Number) as [number, number]);
  const xCoordinates = points.map(([x]) => x);
  const yCoordinates = points.map(([, y]) => y);
  const minimumX = Math.min(...xCoordinates);
  const maximumX = Math.max(...xCoordinates);
  const minimumY = Math.min(...yCoordinates);
  const maximumY = Math.max(...yCoordinates);
  const twiceSignedArea = points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];
    return sum + x * nextY - nextX * y;
  }, 0);

  return {
    x: (minimumX + maximumX) / 2,
    y: (minimumY + maximumY) / 2,
    width: maximumX - minimumX,
    height: maximumY - minimumY,
    area: Math.abs(twiceSignedArea) / 2,
  };
}

function getMapLabel(name: string, locale: MapLocale): string {
  if (locale === 'en' || name === '北海道') {
    return name;
  }

  return name.replace(/[都道府県縣]$/, '');
}

function getTextWidthUnits(label: string): number {
  return [...label].reduce(
    (width, character) => width + (character.charCodeAt(0) > 255 ? 1 : 0.64),
    0,
  );
}

type WorkingAnnotation = {
  annotation: MapAnnotationLayout;
  offsetX: number;
  offsetY: number;
};

type CollisionResolution = {
  axis: 'x' | 'y';
  direction: -1 | 1;
  amount: number;
};

function getCollisionResolution(
  first: WorkingAnnotation,
  second: WorkingAnnotation,
): CollisionResolution | null {
  const firstBounds = getWorkingAnnotationBounds(first);
  const secondBounds = getWorkingAnnotationBounds(second);
  let hasCollision = false;
  let moveFirstLeft = 0;
  let moveFirstRight = 0;
  let moveFirstUp = 0;
  let moveFirstDown = 0;

  for (const firstItem of firstBounds) {
    for (const secondItem of secondBounds) {
      const overlapX = getAxisOverlap(
        firstItem.left,
        firstItem.right,
        secondItem.left,
        secondItem.right,
      );
      const overlapY = getAxisOverlap(
        firstItem.top,
        firstItem.bottom,
        secondItem.top,
        secondItem.bottom,
      );

      if (overlapX > 0 && overlapY > 0) {
        hasCollision = true;
      }

      if (overlapY > 0) {
        moveFirstLeft = Math.max(
          moveFirstLeft,
          firstItem.right - secondItem.left + ANNOTATION_SEPARATION,
        );
        moveFirstRight = Math.max(
          moveFirstRight,
          secondItem.right - firstItem.left + ANNOTATION_SEPARATION,
        );
      }

      if (overlapX > 0) {
        moveFirstUp = Math.max(
          moveFirstUp,
          firstItem.bottom - secondItem.top + ANNOTATION_SEPARATION,
        );
        moveFirstDown = Math.max(
          moveFirstDown,
          secondItem.bottom - firstItem.top + ANNOTATION_SEPARATION,
        );
      }
    }
  }

  if (!hasCollision) {
    return null;
  }

  const candidates: CollisionResolution[] = [
    { axis: 'x', direction: -1, amount: moveFirstLeft },
    { axis: 'x', direction: 1, amount: moveFirstRight },
    { axis: 'y', direction: -1, amount: moveFirstUp },
    { axis: 'y', direction: 1, amount: moveFirstDown },
  ];

  return candidates.reduce((best, candidate) =>
    candidate.amount < best.amount ? candidate : best,
  );
}

function getWorkingAnnotationBounds(annotation: WorkingAnnotation): AnnotationBounds[] {
  return getAnnotationBounds(annotation.annotation).map((bounds) =>
    translateBounds(bounds, annotation.offsetX, annotation.offsetY),
  );
}

function getContainerAdjustment(
  annotation: WorkingAnnotation,
  containerBounds: AnnotationBounds,
): { x: number; y: number } {
  const annotationBounds = getWorkingAnnotationBounds(annotation);
  const left = Math.min(...annotationBounds.map((bounds) => bounds.left));
  const right = Math.max(...annotationBounds.map((bounds) => bounds.right));
  const top = Math.min(...annotationBounds.map((bounds) => bounds.top));
  const bottom = Math.max(...annotationBounds.map((bounds) => bounds.bottom));

  return {
    x: getAxisContainerAdjustment(left, right, containerBounds.left, containerBounds.right),
    y: getAxisContainerAdjustment(top, bottom, containerBounds.top, containerBounds.bottom),
  };
}

function getAxisContainerAdjustment(
  itemStart: number,
  itemEnd: number,
  containerStart: number,
  containerEnd: number,
): number {
  const minimumAdjustment = containerStart - itemStart;
  const maximumAdjustment = containerEnd - itemEnd;

  if (minimumAdjustment > maximumAdjustment) {
    throw new Error('Map annotation is too large to fit inside its container.');
  }

  return Math.min(Math.max(0, minimumAdjustment), maximumAdjustment);
}

function getAnnotationBounds(annotation: MapAnnotationLayout): AnnotationBounds[] {
  return annotation.flag
    ? [annotation.flag.bounds, annotation.label.bounds]
    : [annotation.label.bounds];
}

function applyAnnotationOffset({
  annotation,
  offsetX,
  offsetY,
}: WorkingAnnotation): MapAnnotationLayout {
  return {
    ...annotation,
    offsetX,
    offsetY,
    label: {
      ...annotation.label,
      x: annotation.label.x + offsetX,
      y: annotation.label.y + offsetY,
      bounds: translateBounds(annotation.label.bounds, offsetX, offsetY),
    },
    flag: annotation.flag
      ? {
          ...annotation.flag,
          x: annotation.flag.x + offsetX,
          y: annotation.flag.y + offsetY,
          bounds: translateBounds(annotation.flag.bounds, offsetX, offsetY),
        }
      : undefined,
  };
}

function getAxisOverlap(
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number,
): number {
  return (
    Math.min(firstEnd, secondEnd) -
    Math.max(firstStart, secondStart) +
    ANNOTATION_SEPARATION
  );
}

function doBoundsOverlap(
  first: AnnotationBounds,
  second: AnnotationBounds,
  separation: number,
): boolean {
  return (
    first.left < second.right + separation &&
    first.right > second.left - separation &&
    first.top < second.bottom + separation &&
    first.bottom > second.top - separation
  );
}

function translateBounds(
  bounds: AnnotationBounds,
  offsetX: number,
  offsetY: number,
): AnnotationBounds {
  return {
    left: bounds.left + offsetX,
    right: bounds.right + offsetX,
    top: bounds.top + offsetY,
    bottom: bounds.bottom + offsetY,
  };
}
