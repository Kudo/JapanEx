const MAX_DISPLAY_UNITS = 14;
const ELLIPSIS_UNITS = 1.4;

function splitGraphemes(value: string): string[] {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value), ({ segment }) => segment);
  }

  const graphemes: string[] = [];
  let joinNext = false;
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    const joinsPrevious = joinNext || codePoint === 0x200d ||
      (codePoint >= 0x300 && codePoint <= 0x36f) ||
      (codePoint >= 0xfe00 && codePoint <= 0xfe0f) ||
      (codePoint >= 0x1f3fb && codePoint <= 0x1f3ff);
    if (joinsPrevious && graphemes.length > 0) {
      graphemes[graphemes.length - 1] += character;
    } else {
      graphemes.push(character);
    }
    joinNext = codePoint === 0x200d;
  }
  return graphemes;
}

function displayUnits(grapheme: string): number {
  const codePoint = grapheme.codePointAt(0) ?? 0;
  if (
    (codePoint >= 0x2e80 && codePoint <= 0x9fff) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7af) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xff01 && codePoint <= 0xff60) ||
    codePoint >= 0x1f000
  ) {
    return 2;
  }
  if (grapheme === ' ') return 0.5;
  if (grapheme === 'M' || grapheme === 'W') return 1.7;
  if (grapheme >= 'A' && grapheme <= 'Z') return 1.4;
  return 1;
}

// @ref LLP 0000#result-rendering-and-export — the saved name can exceed the image header's available width.
export function resultDisplayName(name: string): string {
  const value = name.trim();
  if (!value) return '';

  const graphemes = splitGraphemes(value);
  const totalUnits = graphemes.reduce((sum, grapheme) => sum + displayUnits(grapheme), 0);
  if (totalUnits <= MAX_DISPLAY_UNITS) return value;

  let shown = '';
  let units = 0;
  for (const grapheme of graphemes) {
    const nextUnits = displayUnits(grapheme);
    if (units + nextUnits + ELLIPSIS_UNITS > MAX_DISPLAY_UNITS) break;
    shown += grapheme;
    units += nextUnits;
  }
  return `${shown.trimEnd()}…`;
}
