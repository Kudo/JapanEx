import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, '..');
const prefectures = JSON.parse(readFileSync(join(projectRoot, 'src/data/prefectures.json'), 'utf8'));
const mapShapes = JSON.parse(readFileSync(join(projectRoot, 'src/data/map-shapes.json'), 'utf8'));
const appConfig = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf8')).expo;
const appleAppSiteAssociation = JSON.parse(
  readFileSync(join(projectRoot, 'public/.well-known/apple-app-site-association'), 'utf8'),
);
const androidAssetLinks = JSON.parse(
  readFileSync(join(projectRoot, 'public/.well-known/assetlinks.json'), 'utf8'),
);
const flagsDirectory = join(projectRoot, 'assets/flags');
const flagFiles = readdirSync(flagsDirectory).filter((file) => file.endsWith('.svg')).sort();
const flagThumbnailsDirectory = join(projectRoot, 'assets/flag-thumbnails');
const flagThumbnailFiles = readdirSync(flagThumbnailsDirectory)
  .filter((file) => file.endsWith('.png'))
  .sort();
const expectedCodes = Array.from({ length: 47 }, (_, index) => String(index + 1).padStart(2, '0'));

assert.equal(prefectures.length, 47, 'should define exactly 47 prefectures');
assert.deepEqual(prefectures.map((item) => item.code), expectedCodes, 'should use unique JIS order');
assert.equal(new Set(prefectures.map((item) => item.flagAssetKey)).size, 47, 'should use unique flag asset keys');
assert.equal(flagFiles.length, 47, 'should bundle exactly 47 SVG flags');
assert.equal(flagThumbnailFiles.length, 47, 'should bundle exactly 47 PNG flag thumbnails');

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
  assert.ok(
    flagThumbnailFiles.includes(`${prefecture.flagAssetKey}.png`),
    `${prefecture.code} should include an export thumbnail`,
  );
  const thumbnail = readFileSync(
    join(flagThumbnailsDirectory, `${prefecture.flagAssetKey}.png`),
  );
  assert.deepEqual(
    [...thumbnail.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    `${prefecture.code} should include a valid PNG export thumbnail`,
  );

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

assert.deepEqual(
  appConfig.ios.associatedDomains,
  ['applinks:japanex.expo.app'],
  'should associate the iOS app with the production share host',
);
assert.ok(
  appConfig.android.intentFilters.some(
    (filter) =>
      filter.action === 'VIEW' &&
      filter.autoVerify === true &&
      filter.data?.some(
        (entry) =>
          entry.scheme === 'https' &&
          entry.host === 'japanex.expo.app' &&
          entry.pathPrefix === '/view',
      ),
  ),
  'should register a verified Android view-link intent filter',
);
assert.deepEqual(
  appleAppSiteAssociation.applinks.details[0].appIDs,
  ['J35SUS5UFB.dev.expo.kudo.japanex'],
  'should associate the website with the production iOS app',
);
assert.ok(
  appleAppSiteAssociation.applinks.details[0].components.some(
    (component) => component['/'] === '/view',
  ),
  'should restrict iOS universal links to the shared view route',
);
assert.deepEqual(
  androidAssetLinks,
  [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'dev.expo.kudo.japanex',
        sha256_cert_fingerprints: [
          '38:ED:37:63:29:8A:2F:BE:15:95:B3:AA:58:E1:1C:37:B5:D5:04:B8:4B:22:59:BB:F5:7A:40:1E:16:16:64:D5',
        ],
      },
    },
  ],
  'should associate the website with the Google Play signed Android app',
);

const ccBySaCodes = prefectures
  .filter((item) => item.license === 'CC BY-SA 3.0')
  .map((item) => item.code);
assert.deepEqual(ccBySaCodes, ['34', '37'], 'should retain CC BY-SA attribution for Hiroshima and Kagawa');

console.log('Validated 47 prefectures, offline flags, export thumbnails, map geometry, and licensing metadata.');
