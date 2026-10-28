import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { deflateRawSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { createWriteStream } = require('node:fs');
const { pipeline } = require('node:stream/promises');
const { Readable } = require('node:stream');
const sourceExtension = path.join(root, 'src', 'extension');
const sourceWebsite = path.join(root, 'src', 'website');
const output = path.join(root, 'dist');
const uploadDirectory = path.join(root, 'download');
const extensionOnly = process.argv.includes('--extension-only');

async function zipDirectory(directory, destination) {
  const files = [];
  async function collect(current, prefix = '') {
    const { readdir, stat, readFile } = await import('node:fs/promises');
    for (const name of await readdir(current)) {
      const fullPath = path.join(current, name);
      const info = await stat(fullPath);
      if (info.isDirectory()) await collect(fullPath, path.posix.join(prefix, name));
      else files.push({ name: path.posix.join(prefix, name), data: await readFile(fullPath) });
    }
  }
  await collect(directory);
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  const crc32 = (data) => {
    let crc = 0xffffffff;
    for (const byte of data) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  };
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name, 'utf8');
    const crc = crc32(file.data);
    const compressed = deflateRawSync(file.data, { level: 9 });
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(file.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + compressed.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  await pipeline(Readable.from([Buffer.concat([...localParts, centralDirectory, end])]), createWriteStream(destination));
}

async function makeExtensionPackage(browser) {
  const staging = path.join(output, `.stage-${browser}`);
  await rm(staging, { recursive: true, force: true });
  await cp(sourceExtension, staging, { recursive: true });
  const manifest = JSON.parse(await readFile(path.join(staging, 'manifest.json'), 'utf8'));
  if (browser === 'firefox') {
    manifest.background = { scripts: ['background.js'] };
    manifest.browser_specific_settings = {
      gecko: {
        id: 'cevirmenx@haking.tr',
        strict_min_version: '128.0',
        data_collection_permissions: { required: ['websiteContent'] }
      }
    };
  }
  await writeFile(path.join(staging, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const extension = browser === 'firefox' ? 'xpi' : 'zip';
  await zipDirectory(staging, path.join(output, 'download', `cevirmenx-${browser}.${extension}`));
  if (browser === 'chrome') await cp(staging, path.join(output, 'chrome'), { recursive: true });
  await rm(staging, { recursive: true, force: true });
}

await mkdir(output, { recursive: true });
await mkdir(path.join(output, 'download'), { recursive: true });
await rm(path.join(output, 'chrome'), { recursive: true, force: true });
for (const name of ['cevirmenx-chrome.zip', 'cevirmenx-edge.zip', 'cevirmenx-firefox.xpi']) {
  await rm(path.join(output, 'download', name), { force: true });
}
await rm(path.join(output, 'sitemap.xml'), { force: true });
await makeExtensionPackage('chrome');
await makeExtensionPackage('edge');
await makeExtensionPackage('firefox');
await mkdir(uploadDirectory, { recursive: true });
await cp(
  path.join(output, 'download', 'cevirmenx-edge.zip'),
  path.join(uploadDirectory, 'cevirmenx-edge.zip')
);
if (!extensionOnly) await cp(sourceWebsite, output, { recursive: true });
console.log(`ÇevirmenX paketleri hazır: ${path.relative(root, output)}`);
