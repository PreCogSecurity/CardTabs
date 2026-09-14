'use strict';

/**
 * Copies the authoritative plugin source (js/ and css/) into docs/ so the
 * GitHub Pages demo always ships exactly the code that is tested in CI.
 *
 * Run with: npm run build:demo
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const pairs = [
	['js/jquery.cardtabs.js', 'docs/jquery.cardtabs.js'],
	['css/jquery.cardtabs.css', 'docs/jquery.cardtabs.css']
];

for (const [src, dest] of pairs) {
	const source = path.join(root, src);
	const target = path.join(root, dest);
	fs.copyFileSync(source, target);
	console.log('Copied ' + src + ' -> ' + dest);
}