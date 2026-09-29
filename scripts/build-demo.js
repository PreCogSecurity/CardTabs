'use strict';

/**
 * Copies the authoritative sources into docs/ so the GitHub Pages demo always
 * ships exactly the code that is tested in CI.
 *
 * Run with: npm run build:demo
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const files = [
	{
		source: 'js/jquery.cardtabs.js',
		target: 'docs/jquery.cardtabs.js',
		origin: 'js/jquery.cardtabs.js',
		banner: true
	},
	{
		source: 'css/jquery.cardtabs.css',
		target: 'docs/jquery.cardtabs.css',
		origin: 'css/jquery.cardtabs.css',
		banner: true
	},
	{
		// The demo serves jQuery from the working tree instead of a public CDN,
		// so nothing a third party controls sits in the page a visitor loads.
		// The version comes from the committed lockfile, and the file is copied
		// byte for byte so it can be diffed against the published artifact.
		source: 'node_modules/jquery/dist/jquery.min.js',
		target: 'docs/jquery.min.js',
		origin: 'the jquery dev dependency pinned in package-lock.json',
		banner: false
	}
];

/**
 * Build the "do not edit" header for a generated file, using the line ending
 * of the source it is generated from so a regeneration on any platform cannot
 * rewrite every line of the file.
 */
function banner(origin, eol) {
	return [
		'/*!',
		' * GENERATED FILE - do not edit.',
		' *',
		' * Produced by npm run build:demo from ' + origin + '.',
		' * Change that source (and this script) instead, then re-run the build;',
		' * CI fails when the committed copy in docs/ is out of date.',
		' */',
		''
	].join(eol) + eol;
}

for (const file of files) {
	const source = path.join(root, file.source);
	const target = path.join(root, file.target);

	let content;
	try {
		content = fs.readFileSync(source, 'utf8');
	} catch (err) {
		console.error('Cannot read ' + file.source + ': ' + err.message);
		console.error('Run `npm ci` first so the dev dependencies are installed.');
		process.exit(1);
	}

	if (file.banner) {
		const eol = content.indexOf('\r\n') === -1 ? '\n' : '\r\n';
		content = banner(file.origin, eol) + content;
	}

	fs.writeFileSync(target, content, 'utf8');
	console.log('Copied ' + file.source + ' -> ' + file.target);
}
