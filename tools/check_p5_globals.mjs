// List which of the given global names collide with p5's global-mode functions (p5 throws "Cannot redefine property").
//   node tools/check_p5_globals.mjs name1 name2 ...
import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('out', { recursive: true });
writeFileSync('out/p5blank.html', '<!doctype html><script src="../node_modules/p5/lib/p5.min.js"></script><script>function setup(){}</script>');
const b = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.goto(pathToFileURL(resolve("out/p5blank.html")).href, { waitUntil: "load" });
await p.waitForFunction(() => window.setup && typeof window.dot !== "undefined" || typeof window.p5 !== "undefined", { timeout: 20000 }).catch(() => {});
const names = await p.evaluate(() => Object.getOwnPropertyNames(window));
const mine = process.argv.slice(2);
console.log('collisions:', mine.filter(n => names.includes(n)).join(', ') || 'none');
await b.close();
