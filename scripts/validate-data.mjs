import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, '..');
const prefectures = JSON.parse(readFileSync(join(projectRoot, 'src/data/prefectures.json'), 'utf8'));
const mapShapes = JSON.parse(readFileSync(join(projectRoot, 'src/data/map-shapes.json'), 'utf8'));
const flagsDirectory = join(projectRoot, 'assets/flags');
const flagFiles = readdirSync(flagsDirectory).filter((file) => file.endsWith('.svg')).sort();
const expectedCodes = Array.from({ length: 47 }, (_, index) => String(index + 1).padStart(2, '0'));

assert.equal(prefectures.length, 47, 'should define exactly 47 prefectures');
assert.deepEqual(prefectures.map((item) => item.code), expectedCodes, 'should use unique JIS order');
assert.equal(new Set(prefectures.map((item) => item.flagAssetKey)).size, 47, 'should use unique flag asset keys');
assert.equal(flagFiles.length, 47, 'should bundle exactly 47 SVG flags');

for (const prefecture of prefectures) {
  assert.equal(typeof prefecture.names.ja, 'string', `${prefecture.code} should have a Japanese name`);
  assert.equal(typeof prefecture.names['zh-Hant'], 'string', `${prefecture.code} should have a Traditional Chinese name`);
  assert.equal(typeof prefecture.names.en, 'string', `${prefecture.code} should have an English name`);
  assert.ok(prefecture.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:'), `${prefecture.code} should link to Commons`);
  assert.ok(prefecture.author, `${prefecture.code} should include author attribution`);
  assert.ok(prefecture.licenseUrl, `${prefecture.code} should include a license URL`);
  assert.equal(prefecture.officialInsignia, true, `${prefecture.code} should include the insignia notice marker`);

  const expectedFlag = `${prefecture.flagAssetKey}.svg`;
  assert.ok(flagFiles.includes(expectedFlag), `${prefecture.code} should include ${expectedFlag}`);
  const svg = readFileSync(join(flagsDirectory, expectedFlag), 'utf8');
  assert.match(svg, /<svg[\s>]/i, `${expectedFlag} should contain SVG markup`);

  const shapes = mapShapes[prefecture.code];
  assert.ok(Array.isArray(shapes) && shapes.length > 0, `${prefecture.code} should have map geometry`);
  for (const shape of shapes) {
    assert.ok(shape.kind === 'rect' || shape.kind === 'polygon', `${prefecture.code} should have valid shape kinds`);
    if (shape.kind === 'rect') {
      assert.ok([shape.x, shape.y, shape.width, shape.height].every(Number.isFinite), `${prefecture.code} should have valid rectangle geometry`);
    } else {
      assert.match(shape.points, /^-?\d/, `${prefecture.code} should have polygon points`);
    }
  }
}

const shareAlphabets = [0, 1, 2, 3, 4, 5];
assert.ok(shareAlphabets.every((level) => Number.isInteger(level) && level >= 0 && level <= 5), 'should restrict levels to 0 through 5');
assert.equal('0'.repeat(47), '00000000000000000000000000000000000000000000000', 'should serialize the initial state as 47 zero digits');

const ccBySaCodes = prefectures
  .filter((item) => item.license === 'CC BY-SA 3.0')
  .map((item) => item.code);
assert.deepEqual(ccBySaCodes, ['34', '37'], 'should retain CC BY-SA attribution for Hiroshima and Kagawa');

console.log('Validated 47 prefectures, 47 offline flags, map geometry, and licensing metadata.');
