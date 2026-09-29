/*!
 * CardTabs demo bootstrap
 *
 * Kept in its own file rather than inline in index.html so the demo can run
 * under a Content-Security-Policy that allows same-origin scripts only, with
 * no inline script and no 'unsafe-inline' escape hatch.
 *
 * Loaded after jquery.min.js and jquery.cardtabs.js at the end of <body>.
 */

$(function () {
	$('.tabsholder1').cardTabs();
	$('.tabsholder2').cardTabs({ theme: 'inset' });
	$('.tabsholder3').cardTabs({ theme: 'graygreen' });
	$('.tabsholder4').cardTabs({ theme: 'wiki' });
});
