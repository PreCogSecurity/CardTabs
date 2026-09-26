'use strict';

/**
 * Tests for the CardTabs jQuery plugin.
 *
 * The plugin is a plain script that attaches itself to the global jQuery
 * object, so it is loaded for its side effect via require() after tests/setup.js
 * has installed a jsdom-bound jQuery instance.
 */

require('../js/jquery.cardtabs.js');

function mount(html) {
	document.body.innerHTML = html;
}

describe('CardTabs', function () {
	afterEach(function () {
		document.body.innerHTML = '';
	});

	describe('initialization', function () {
		it('generates a link bar and a stack from the tab divs', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="Tab one">one</div>' +
					'<div data-tab="Tab two">two</div>' +
					'<div data-tab="Tab three">three</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $container = $('.container');
			expect($container.find('.card-tabs-bar').length).toBe(1);
			expect($container.find('.card-tabs-stack').length).toBe(1);
			expect($container.find('.card-tabs-bar a').length).toBe(3);
			expect($container.find('.card-tabs-stack div[data-tab]').length).toBe(3);
		});

		it('marks the first tab active when no tab is pre-marked', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="Tab one">one</div>' +
					'<div data-tab="Tab two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $links = $('.container .card-tabs-bar a');
			expect($links.eq(0).hasClass('active')).toBe(true);
			expect($links.eq(1).hasClass('active')).toBe(false);
		});

		it('returns the original collection so calls stay chainable', function () {
			mount('<div class="container"><div data-tab="Tab one">one</div></div>');

			var result = $('.container').cardTabs();

			expect(result.length).toBe(1);
			expect(result.is('.container')).toBe(true);
		});
	});

	describe('tab toggling', function () {
		it('shows the clicked tab and hides the others', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="Tab one">one</div>' +
					'<div data-tab="Tab two">two</div>' +
					'<div data-tab="Tab three">three</div>' +
				'</div>'
			);

			$('.container').cardTabs();
			$('.container .card-tabs-bar a').eq(1).trigger('click');

			var $tabs = $('.container .card-tabs-stack div[data-tab]');
			expect($tabs.eq(0)[0].style.display).toBe('none');
			expect($tabs.eq(1)[0].style.display).not.toBe('none');
			expect($tabs.eq(2)[0].style.display).toBe('none');

			var $links = $('.container .card-tabs-bar a');
			expect($links.eq(1).hasClass('active')).toBe(true);
			expect($links.eq(0).hasClass('active')).toBe(false);
		});

		it('honors a tab pre-marked with the active class', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="Tab one">one</div>' +
					'<div class="active" data-tab="Tab two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $links = $('.container .card-tabs-bar a');
			expect($links.eq(1).hasClass('active')).toBe(true);
			expect($links.eq(0).hasClass('active')).toBe(false);

			var $tabs = $('.container .card-tabs-stack div[data-tab]');
			expect($tabs.eq(0)[0].style.display).toBe('none');
			expect($tabs.eq(1)[0].style.display).not.toBe('none');
		});
	});

	describe('themes', function () {
		it('applies the theme class to the bar and the stack', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="Tab one">one</div>' +
					'<div data-tab="Tab two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs({ theme: 'inset' });

			expect($('.container .card-tabs-bar').hasClass('inset')).toBe(true);
			expect($('.container .card-tabs-stack').hasClass('inset')).toBe(true);
		});
	});

	describe('robustness', function () {
		it('handles tab names containing quotes and special characters', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="It\'s a tab">quoted</div>' +
					'<div data-tab="A &amp; B &lt;tag&gt;">escaped</div>' +
					'<div data-tab="123">numeric</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $links = $('.container .card-tabs-bar a');
			expect($links.length).toBe(3);

			// Click the tab whose name contains a single quote
			$links.eq(0).trigger('click');
			var $tabs = $('.container .card-tabs-stack div[data-tab]');
			expect($tabs.eq(0)[0].style.display).not.toBe('none');
			expect($tabs.eq(1)[0].style.display).toBe('none');
			expect($tabs.eq(2)[0].style.display).toBe('none');

			// Click the numeric tab name
			$links.eq(2).trigger('click');
			expect($tabs.eq(0)[0].style.display).toBe('none');
			expect($tabs.eq(1)[0].style.display).toBe('none');
			expect($tabs.eq(2)[0].style.display).not.toBe('none');
		});

		it('works when the container has multiple classes', function () {
			mount(
				'<div class="container extra-class">' +
					'<div data-tab="Tab one">one</div>' +
					'<div data-tab="Tab two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			expect($('.container .card-tabs-bar a').length).toBe(2);
			$('.container .card-tabs-bar a').eq(1).trigger('click');
			expect($('.container .card-tabs-stack div[data-tab]').eq(1)[0].style.display).not.toBe('none');
		});

		it('works when the container has no class attribute', function () {
			mount(
				'<div id="plain">' +
					'<div data-tab="Tab one">one</div>' +
					'<div data-tab="Tab two">two</div>' +
				'</div>'
			);

			$('#plain').cardTabs();

			expect($('#plain .card-tabs-bar a').length).toBe(2);
			$('#plain .card-tabs-bar a').eq(1).trigger('click');
			expect($('#plain .card-tabs-stack div[data-tab]').eq(1)[0].style.display).not.toBe('none');
		});
	});
});