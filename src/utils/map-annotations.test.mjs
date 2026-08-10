import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createMapAnnotation,
  doMapAnnotationsOverlap,
  getShapeLayout,
  MAP_LABEL_FONT_SIZES,
  resolveMapAnnotationCollisions,
} from './map-annotations.ts';

const utilsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(utilsDirectory, '../..');
const prefectures = JSON.parse(
  readFileSync(join(projectRoot, 'src/data/prefectures.json'), 'utf8'),
);
const mapShapes = JSON.parse(
  readFileSync(join(projectRoot, 'src/data/map-shapes.json'), 'utf8'),
);
const mapLayouts = Object.fromEntries(
  prefectures.map((prefecture) => [
    prefecture.code,
    mapShapes[prefecture.code]
      .map(getShapeLayout)
      .sort((first, second) => second.area - first.area)[0],
  ]),
);
const mapAnnotationBounds = {
  left: 321,
  right: 1462.5,
  top: -314.5,
  bottom: 827,
};

describe('Map annotations', () => {
  it('should keep annotations in place when they do not overlap', () => {
    const annotations = [
      createMapAnnotation({
        code: 'a',
        name: 'Alpha',
        locale: 'en',
        mapLayout: { x: 100, y: 100, width: 100, height: 80, area: 8_000 },
        showFlag: true,
      }),
      createMapAnnotation({
        code: 'b',
        name: 'Beta',
        locale: 'en',
        mapLayout: { x: 300, y: 300, width: 100, height: 80, area: 8_000 },
        showFlag: true,
      }),
    ];

    const resolved = resolveMapAnnotationCollisions(annotations);

    assert.deepEqual(
      resolved.map(({ offsetX, offsetY }) => ({ offsetX, offsetY })),
      [
        { offsetX: 0, offsetY: 0 },
        { offsetX: 0, offsetY: 0 },
      ],
    );
  });

  it('should separate colliding annotations with balanced displacement', () => {
    const mapLayout = { x: 100, y: 100, width: 100, height: 80, area: 8_000 };
    const annotations = [
      createMapAnnotation({
        code: 'a',
        name: 'Alpha',
        locale: 'en',
        mapLayout,
        showFlag: true,
      }),
      createMapAnnotation({
        code: 'b',
        name: 'Beta',
        locale: 'en',
        mapLayout,
        showFlag: true,
      }),
    ];

    const [first, second] = resolveMapAnnotationCollisions(annotations);

    assert.equal(doMapAnnotationsOverlap(first, second, 4), false);
    assert.ok(Math.abs(first.offsetX + second.offsetX) < 0.001);
    assert.ok(Math.abs(first.offsetY + second.offsetY) < 0.001);
  });

  it('should return an empty layout when no annotations are provided', () => {
    assert.deepEqual(resolveMapAnnotationCollisions([]), []);
  });

  it('should keep annotations inside the provided bounds', () => {
    const annotation = createMapAnnotation({
      code: 'a',
      name: 'Nagasaki',
      locale: 'en',
      mapLayout: { x: 30, y: 100, width: 50, height: 50, area: 2_500 },
      showFlag: true,
    });

    const [resolved] = resolveMapAnnotationCollisions([annotation], {
      left: 20,
      right: 180,
      top: 20,
      bottom: 180,
    });

    assert.ok(resolved.label.bounds.left >= 20);
    assert.ok(resolved.flag.bounds.left >= 20);
  });

  it('should use the configured font size for every locale', () => {
    assert.deepEqual(MAP_LABEL_FONT_SIZES, {
      ja: 18,
      'zh-Hant': 18,
      en: 16,
    });

    for (const locale of ['ja', 'zh-Hant', 'en']) {
      for (const showFlag of [false, true]) {
        for (const prefecture of prefectures) {
          const annotation = createMapAnnotation({
            code: prefecture.code,
            name: prefecture.names[locale],
            locale,
            mapLayout: mapLayouts[prefecture.code],
            showFlag,
          });

          assert.equal(
            annotation.label.fontSize,
            MAP_LABEL_FONT_SIZES[locale],
            `${locale} annotation ${prefecture.code} should use its locale label size`,
          );
        }
      }
    }
  });

  it('should prevent all prefecture label and flag collisions in every locale', () => {
    for (const locale of ['ja', 'zh-Hant', 'en']) {
      for (const showFlag of [false, true]) {
        const annotations = prefectures.map((prefecture) =>
          createMapAnnotation({
            code: prefecture.code,
            name: prefecture.names[locale],
            locale,
            mapLayout: mapLayouts[prefecture.code],
            showFlag,
          }),
        );
        const resolved = resolveMapAnnotationCollisions(annotations, mapAnnotationBounds);

        if (showFlag) {
          for (const annotation of resolved) {
            assert.ok(annotation.flag);
            assert.ok(
              annotation.flag.bounds.bottom < annotation.label.bounds.top,
              `${locale} annotation ${annotation.code} should keep its own flag clear of its label`,
            );
          }
        }

        for (let firstIndex = 0; firstIndex < resolved.length; firstIndex += 1) {
          const annotationBounds = resolved[firstIndex].flag
            ? [resolved[firstIndex].label.bounds, resolved[firstIndex].flag.bounds]
            : [resolved[firstIndex].label.bounds];

          for (const bounds of annotationBounds) {
            assert.ok(bounds.left >= mapAnnotationBounds.left);
            assert.ok(bounds.right <= mapAnnotationBounds.right);
            assert.ok(bounds.top >= mapAnnotationBounds.top);
            assert.ok(bounds.bottom <= mapAnnotationBounds.bottom);
          }

          for (
            let secondIndex = firstIndex + 1;
            secondIndex < resolved.length;
            secondIndex += 1
          ) {
            assert.equal(
              doMapAnnotationsOverlap(resolved[firstIndex], resolved[secondIndex], 4),
              false,
              `${locale} ${showFlag ? 'flag' : 'label'} annotations ${resolved[firstIndex].code} and ${resolved[secondIndex].code} should not overlap`,
            );
          }
        }

        assert.ok(
          Math.max(
            ...resolved.map(({ offsetX, offsetY }) => Math.hypot(offsetX, offsetY)),
          ) < 30,
          `${locale} annotations should remain close to their prefectures`,
        );
      }
    }
  });
});
