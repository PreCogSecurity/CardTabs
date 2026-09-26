/*!
 * CardTabs jQuery plugin
 * https://github.com/blekerfeld/cardtabs
 *
 * Released under the MIT license
 */

jQuery.fn.cardTabs = function (options) {

	var settings = $.extend({
		theme: ''
	}, options);

	// Capture element references up front instead of re-querying the DOM by
	// string-concatenated class selectors. This keeps the plugin working when
	// the container has multiple classes, no class attribute at all, or a
	// class name containing special characters.
	var $container = $(this);
	var $stack = $('<div />').addClass('card-tabs-stack').html($container.html());
	var $bar = $('<div />').addClass('card-tabs-bar');

	// Build the link bar from the tab divs
	$container.children('div[data-tab]').each(function () {
		var tabName = $(this).data('tab');
		$bar.append($('<a />').attr('href', 'javascript:void();').data('tab', tabName).append(tabName));
	});

	$container.empty().append($bar).append($stack);

	// Apply the theme class to the generated elements
	if (settings.theme !== '') {
		$bar.addClass(settings.theme);
		$stack.addClass(settings.theme);
	}

	// Show the tab whose data-tab value matches and hide the rest. Values are
	// compared via a filter callback instead of string-interpolated attribute
	// selectors, so tab names containing quotes or other special characters
	// cannot break the selector.
	function toggleTab(obj) {
		var tabName = obj.data('tab');
		$stack.find('div[data-tab]').each(function () {
			$(this).toggle($(this).data('tab') === tabName);
		});
	}

	// Check whether a tab is marked as active
	var activeCount = 0;
	$stack.children('div[data-tab]').each(function () {
		if ($(this).hasClass('active')) {
			var tabName = $(this).data('tab');
			$bar.find('a').filter(function () {
				return $(this).data('tab') === tabName;
			}).addClass('active');
			toggleTab($(this));
			$(this).removeClass('active');
			activeCount++;
		}
	});

	// Otherwise the first tab in the bar is the active one
	if (activeCount === 0) {
		$bar.find('a:first-child').addClass('active');
	}

	$bar.find('a').click(function () {
		$bar.find('a').removeClass('active');
		$(this).addClass('active');
		toggleTab($(this));
	});

	return this;
};