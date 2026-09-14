'use strict';

/**
 * Jest setup: make a jQuery instance bound to the jsdom window available as a
 * global so the plugin (a plain script that attaches itself to `jQuery`) can
 * be loaded with a plain require() in the tests.
 */

const $ = require('jquery');

global.jQuery = $;
global.$ = $;