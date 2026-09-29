/*!
 * GENERATED FILE - do not edit.
 *
 * Produced by npm run build:demo from js/jquery.cardtabs.js.
 * Change that source (and this script) instead, then re-run the build;
 * CI fails when the committed copy in docs/ is out of date.
 */

/*!
 * CardTabs jQuery plugin
 * https://github.com/blekerfeld/cardtabs
 *
 * Released under the MIT license
 */

jQuery.fn.cardTabs = function (options) {

	// Every element in the selection is initialized on its own. Sharing a
	// single bar and stack between containers makes them fight over the same
	// state, and a selection of two containers used to leave the second one
	// without any content at all.
	var initialize = function () {
		var settings = $.extend({
			theme: ''
		}, options);

		// Capture element references up front instead of re-querying the DOM by
		// string-concatenated class selectors. This keeps the plugin working when
		// the container has multiple classes, no class attribute at all, or a
		// class name containing special characters.
		var $container = $(this);
		var $bar = $('<div />').addClass('card-tabs-bar').attr('role', 'tablist');
		var $stack = $('<div />').addClass('card-tabs-stack');

		// Build the link bar from the tab divs. The label is inserted with
		// text(), so a data-tab value is never handed to the HTML parser and a
		// value such as `<img src=x onerror=...>` stays inert text. The links
		// point at a placeholder that the click handler cancels, rather than at
		// a javascript: URL, which a strict Content Security Policy blocks.
		$container.children('div[data-tab]').each(function () {
			var tabName = $(this).data('tab');
			$bar.append(
				$('<a />')
					.attr('href', '#')
					.attr('role', 'tab')
					.attr('aria-selected', 'false')
					.data('tab', tabName)
					.text(tabName)
			);
		});

		// Move the original nodes into the stack instead of round-tripping the
		// container through innerHTML. Re-parsing a serialized copy would run the
		// tab content through the HTML parser a second time and would throw away
		// live DOM state such as typed form values, focus and scroll position.
		$container.children().each(function () {
			$stack[0].appendChild(this);
		});

		// The stack is populated now, so the tab nodes are looked up once here
		// rather than re-scanned on every interaction.
		var $tabs = $stack.children('div[data-tab]');

		$container.append($bar).append($stack);

		// Apply the theme class to the generated elements
		if (settings.theme !== '') {
			$bar.addClass(settings.theme);
			$stack.addClass(settings.theme);
		}

		// Show the tab whose data-tab value matches and hide the rest. Values are
		// compared via a filter callback instead of string-interpolated attribute
		// selectors, so tab names containing quotes or other special characters
		// cannot break the selector.
		function toggleTab(tabName) {
			$tabs.each(function () {
				$(this).toggle($(this).data('tab') === tabName);
			});
		}

		// Highlight the selected link and keep aria-selected in step with it, so
		// assistive technology announces the tab the stylesheet highlights.
		function selectTab($link) {
			$bar.find('a').each(function () {
				if (this === $link[0]) {
					$(this).addClass('active').attr('aria-selected', 'true');
				} else {
					$(this).removeClass('active').attr('aria-selected', 'false');
				}
			});
		}

		// The tab to show is the one pre-marked with the active class if there is
		// one, otherwise the first tab in the bar. It is toggled explicitly
		// rather than left to the stylesheet's :first-child rule, which matches
		// the first child of the stack rather than the first tab and therefore
		// reveals nothing when the container opens with other content.
		var $marked = $tabs.filter('.active');
		var activeName = $marked.length > 0
			? $marked.eq(0).data('tab')
			: $bar.find('a:first-child').data('tab');

		selectTab($bar.find('a').filter(function () {
			return $(this).data('tab') === activeName;
		}));
		toggleTab(activeName);

		// The marker lives on the stack, the highlight belongs to the bar.
		$marked.removeClass('active');

		$bar.find('a').click(function (event) {
			// The href is a placeholder, so cancel the navigation instead of
			// pushing a history entry or jumping to the top of the page.
			event.preventDefault();
			selectTab($(this));
			toggleTab($(this).data('tab'));
		});
	};

	return this.each(initialize);
};
