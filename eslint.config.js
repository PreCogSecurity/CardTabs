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
	curly: 'error'
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
	}
];