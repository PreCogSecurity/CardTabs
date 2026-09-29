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

		it('shows the first tab even when the container starts with other content', function () {
			// The stylesheet reveals a tab with a :first-child rule on the stack,
			// which points at the first child of the stack rather than the first
			// tab. The plugin therefore has to toggle the tab itself, or a
			// container that opens with a heading shows nothing at all.
			mount(
				'<div class="container">' +
					'<p class="intro">Intro</p>' +
					'<div data-tab="One">one</div>' +
					'<div data-tab="Two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $tabs = $('.container .card-tabs-stack div[data-tab]');
			expect($tabs.eq(0)[0].style.display).not.toBe('none');
			expect($tabs.eq(1)[0].style.display).toBe('none');
		});

		it('initializes each container of a multi-element selection on its own', function () {
			mount(
				'<div class="container" id="c1"><div data-tab="A one">first</div></div>' +
				'<div class="container" id="c2"><div data-tab="B one">second</div></div>'
			);

			$('.container').cardTabs();

			expect($('#c1 .card-tabs-bar a').length).toBe(1);
			expect($('#c1 .card-tabs-bar a').text()).toBe('A one');
			expect($('#c2 .card-tabs-bar a').length).toBe(1);
			expect($('#c2 .card-tabs-bar a').text()).toBe('B one');
			expect($('#c1 .card-tabs-stack div[data-tab]').text()).toBe('first');
			expect($('#c2 .card-tabs-stack div[data-tab]').text()).toBe('second');
		});
	});

	describe('empty containers', function () {
		it('handles a container without any data-tab children', function () {
			mount('<div class="container"><p>Nothing to tab</p></div>');

			expect(function () {
				$('.container').cardTabs();
			}).not.toThrow();

			expect($('.container .card-tabs-bar').length).toBe(1);
			expect($('.container .card-tabs-bar a').length).toBe(0);
			expect($('.container .card-tabs-stack p').length).toBe(1);
		});

		it('handles a completely empty container', function () {
			mount('<div class="container"></div>');

			expect(function () {
				$('.container').cardTabs();
			}).not.toThrow();

			expect($('.container .card-tabs-bar a').length).toBe(0);
		});
	});

	describe('content safety', function () {
		it('renders a tab label as text and never as markup', function () {
			// A data-tab value reaches the plugin as author-supplied data. If it
			// is handed to the HTML parser, a value such as
			// `<img src=x onerror=...>` becomes a live element and executes.
			mount(
				'<div class="container">' +
					'<div data-tab="&lt;img src=x onerror=alert(1)&gt;">markup</div>' +
					'<div data-tab="plain">plain</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $links = $('.container .card-tabs-bar a');
			expect($links.eq(0).text()).toBe('<img src=x onerror=alert(1)>');
			expect($links.eq(0).find('img').length).toBe(0);
			expect(document.querySelectorAll('img').length).toBe(0);
		});

		it('moves the tab content instead of re-parsing a copy of it', function () {
			// Round-tripping the container through innerHTML would hand the tab
			// content to the HTML parser a second time and rebuild every node.
			mount(
				'<div class="container">' +
					'<div data-tab="One"><img id="marker" src="broken.png" onerror="void 0">one</div>' +
				'</div>'
			);

			var original = document.getElementById('marker');

			$('.container').cardTabs();

			var moved = document.querySelector('.card-tabs-stack div[data-tab] #marker');
			expect(moved).toBe(original);
			expect(original.parentNode).toBe(document.querySelector('.card-tabs-stack div[data-tab]'));
		});

		it('preserves live form state inside tabs', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="Form"><input id="field" type="text" value="initial"></div>' +
				'</div>'
			);

			document.getElementById('field').value = 'typed by the user';

			$('.container').cardTabs();

			expect(document.getElementById('field').value).toBe('typed by the user');
		});
	});

	describe('accessibility', function () {
		it('marks up the bar and its links as a tab widget', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="One">one</div>' +
					'<div data-tab="Two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $bar = $('.container .card-tabs-bar');
			var $links = $bar.find('a');
			expect($bar.attr('role')).toBe('tablist');
			expect($links.eq(0).attr('role')).toBe('tab');
			expect($links.eq(0).attr('aria-selected')).toBe('true');
			expect($links.eq(1).attr('aria-selected')).toBe('false');
		});

		it('keeps aria-selected in step with the highlighted link', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="One">one</div>' +
					'<div data-tab="Two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $links = $('.container .card-tabs-bar a');
			$links.eq(1).trigger('click');

			expect($links.eq(0).attr('aria-selected')).toBe('false');
			expect($links.eq(1).attr('aria-selected')).toBe('true');
		});

		it('uses an inert link target instead of a javascript: URL', function () {
			mount(
				'<div class="container">' +
					'<div data-tab="One">one</div>' +
					'<div data-tab="Two">two</div>' +
				'</div>'
			);

			$('.container').cardTabs();

			var $links = $('.container .card-tabs-bar a');
			expect($links.eq(0).attr('href')).toBe('#');
			expect($links.eq(1).attr('href')).toBe('#');

			// The placeholder href must not navigate when a tab is clicked.
			var prevented = null;
			$links.eq(1).on('click', function (event) {
				prevented = event.isDefaultPrevented();
			});
			$links.eq(1).trigger('click');
			expect(prevented).toBe(true);
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