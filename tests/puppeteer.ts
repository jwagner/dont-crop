/* eslint-disable import/no-extraneous-dependencies */
import puppeteer from 'puppeteer';
import serveStatic from 'serve-static';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import http from 'http';
import assert from 'assert';

const PORT = 3000;
const PREFIX = '/sandbox/2021/dont-crop/';

async function testReact(browser: puppeteer.Browser) {
  const page = await browser.newPage();
  log(page);
  await page.goto(`http://localhost:${PORT}${PREFIX}react.html`);
  const el = await page.waitForSelector('.frame[style]');
  const actual = await el?.evaluate((node) => node.getAttribute('style'));
  const expected = 'background: linear-gradient(rgb(169, 163, 149), rgb(87, 103, 109));';
  if (actual !== expected) {
    throw new Error(`unexpected image style ${actual}`);
  }
}

async function testTestsuite(browser: puppeteer.Browser) {
  const page = await browser.newPage();
  log(page);

  await page.goto(`http://localhost:${PORT}${PREFIX}index.html`);
  await page.waitForSelector('body.ready');

  const snapshotPath = join(__dirname, 'snapshots', 'testsuite.json');
  const expected = JSON.parse(readFileSync(snapshotPath, 'utf8'));

  const collectStyles = (selector: string) => page.evaluate(
    (s: string) => Array.from(
      document.querySelectorAll(s),
    ).map((el) => el.getAttribute('style')),
    selector,
  );

  const actual = {
    colorStyles: await collectStyles('.color'),
    frameStyles: await collectStyles('.frame'),
  };

  try {
    assert.deepEqual(actual, expected);
    console.log('saving prerendered html');
    const html = await page.content();
    writeFileSync('public/index.html', html);
  } catch (error) {
    console.error(error);
    console.log('expected', JSON.stringify(expected, undefined, ' '));
    console.log('actual', JSON.stringify(actual, undefined, ' '));
    throw error;
  }
}

function log(page: puppeteer.Page) {
  page
    .on('console', (message) => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    .on('pageerror', ({ message }) => console.log(message))
    .on('response', (response) => console.log(`${response.status()} ${response.url()}`))
    .on('requestfailed', (request) => console.log(`${request.failure().errorText} ${request.url()}`));
}

(async function main() {
  const serve = serveStatic(join(__dirname, '../public/'));
  const server = http.createServer((req, res) => {
    req.url = req.url?.replace(PREFIX, '/');
    serve(req, res, () => { res.end('not found'); });
  });
  server.listen(PORT);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  try {
    await Promise.all([
      testTestsuite(browser),
      testReact(browser),
    ]);
  } finally {
    await browser.close();

    server.close();
  }

  console.log('PASS');
}()).catch((reason) => {
  console.error(reason);
  process.exit(1);
});
