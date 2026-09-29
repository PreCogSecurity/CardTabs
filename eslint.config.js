'use strict';

const globals = require('globals');

const sharedRules = {
	'no-undef': 'error',
	'no-unused-vars': ['error', { args: 'none' }],
	'no-dupe-keys': 'error',
	'no-cond-assign': 'error',
	'no-constant-condition': 'error',
	'no-func-assign': 'error',
	'no-unreachable': 'error',
	'use-isnan': 'error',
	'valid-typeof': 'error',
	eqeqeq: ['error', 'always'],
	curly: 'error',
	// Injection sinks. The plugin renders author-supplied data-tab values, so
	// keeping these on across every source set turns the hardening of the
	// plugin into a rule the build enforces rather than a convention.
	'no-eval': 'error',
	'no-implied-eval': 'error',
	'no-new-func': 'error',
	'no-script-url': 'error',
	'no-proto': 'error',
	'no-with': 'error',
	'no-template-curly-in-string': 'error'
};

module.exports = [
	{
		// The plugin itself is a plain ES5 script that runs in the browser
		files: ['js/**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',
			globals: {
				...globals.browser,
				jQuery: 'readonly',
				$: 'readonly'
			}
		},
		rules: sharedRules
	},
	{
		// Build scripts run on Node.js
		files: ['scripts/**/*.js'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'commonjs',
			globals: globals.node
		},
		rules: sharedRules
	},
	{
		// Tests run under Jest in a jsdom environment; tests/setup.js exposes
		// jQuery as the global $ and the jsdom window provides document
		files: ['tests/**/*.js'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'commonjs',
			globals: {
				...globals.node,
				...globals.jest,
				...globals.browser,
				$: 'readonly'
			}
		},
		rules: sharedRules
	},
	{
		// The demo page's bootstrap: plain browser script on top of jQuery. It
		// is first-party code, so it is linted with the same rules as the
		// plugin rather than shipped unchecked.
		files: ['docs/demo.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',
			globals: {
				...globals.browser,
				jQuery: 'readonly',
				$: 'readonly'
			}
		},
		rules: sharedRules
	}
];
