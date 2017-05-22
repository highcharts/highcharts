/**
 * Exporting module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/* eslint indent:0 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Chart.js';

// create shortcuts
var defaultOptions = H.defaultOptions,
	doc = H.doc,
	Chart = H.Chart,
	addEvent = H.addEvent,
	removeEvent = H.removeEvent,
	fireEvent = H.fireEvent,
	createElement = H.createElement,
	discardElement = H.discardElement,
	css = H.css,
	merge = H.merge,
	pick = H.pick,
	each = H.each,
	objectEach = H.objectEach,
	extend = H.extend,
	isTouchDevice = H.isTouchDevice,
	win = H.win,
	SVGRenderer = H.SVGRenderer;

var symbols = H.Renderer.prototype.symbols,
	isMSBrowser = /Edge\/|Trident\/|MSIE /.test(win.navigator.userAgent),
	isFirefoxBrowser = /firefox/i.test(navigator.userAgent);

	// Add language
	extend(defaultOptions.lang, {
		printChart: 'Print chart',
		downloadPNG: 'Download PNG image',
		downloadJPEG: 'Download JPEG image',
		downloadPDF: 'Download PDF document',
		downloadSVG: 'Download SVG vector image',
		contextButtonTitle: 'Chart context menu'
	});

// Buttons and menus are collected in a separate config option set called 'navigation'.
// This can be extended later to add control buttons like zoom and pan right click menus.
defaultOptions.navigation = {
	buttonOptions: {
		theme: {},
		symbolSize: 14,
		symbolX: 12.5,
		symbolY: 10.5,
		align: 'right',
		buttonSpacing: 3,
		height: 22,
		// text: null,
		verticalAlign: 'top',
		width: 24
	}
};

/*= if (build.classic) { =*/
// Presentational attributes
merge(true, defaultOptions.navigation, {
	menuStyle: {
		border: '1px solid ${palette.neutralColor40}',
		background: '${palette.backgroundColor}',
		padding: '5px 0'
	},
	menuItemStyle: {
		padding: '0.5em 1em',
		background: 'none',
		color: '${palette.neutralColor80}',
		fontSize: isTouchDevice ? '14px' : '11px',
		transition: 'background 250ms, color 250ms'
	},
	menuItemHoverStyle: {
		background: '${palette.highlightColor80}',
		color: '${palette.backgroundColor}'
	},
	buttonOptions: {
		symbolFill: '${palette.neutralColor60}',
		symbolStroke: '${palette.neutralColor60}',
		symbolStrokeWidth: 3,
		theme: {
			fill: '${palette.backgroundColor}', // capture hover
			stroke: 'none',
			padding: 5
		}
	}
});
/*= } =*/


// Add the export related options
defaultOptions.exporting = {
	//enabled: true,
	//filename: 'chart',
	type: 'image/png',
	url: 'https://export.highcharts.com/',
	//width: undefined,
	printMaxWidth: 780,
	scale: 2,
	buttons: {
		contextButton: {
			className: 'highcharts-contextbutton',
			menuClassName: 'highcharts-contextmenu',
			//x: -10,
			symbol: 'menu',
			_titleKey: 'contextButtonTitle',
			menuItems: [{
				textKey: 'printChart',
				onclick: function () {
					this.print();
				}
			}, {
				separator: true
			}, {
				textKey: 'downloadPNG',
				onclick: function () {
					this.exportChart();
				}
			}, {
				textKey: 'downloadJPEG',
				onclick: function () {
					this.exportChart({
						type: 'image/jpeg'
					});
				}
			}, {
				textKey: 'downloadPDF',
				onclick: function () {
					this.exportChart({
						type: 'application/pdf'
					});
				}
			}, {
				textKey: 'downloadSVG',
				onclick: function () {
					this.exportChart({
						type: 'image/svg+xml'
					});
				}
			}]
		}
	}
};

// Add the H.post utility
H.post = function (url, data, formAttributes) {
	// create the form
	var form = createElement('form', merge({
		method: 'post',
		action: url,
		enctype: 'multipart/form-data'
	}, formAttributes), {
		display: 'none'
	}, doc.body);

	// add the data
	objectEach(data, function (val, name) {
		createElement('input', {
			type: 'hidden',
			name: name,
			value: val
		}, null, form);
	});

	// submit
	form.submit();

	// clean up
	discardElement(form);
};

extend(Chart.prototype, /** @lends Highcharts.Chart.prototype */ {

	/**
	 * A collection of fixes on the produced SVG to account for expando properties,
	 * browser bugs, VML problems and other. Returns a cleaned SVG.
	 */
	sanitizeSVG: function (svg, options) {
		// Move HTML into a foreignObject
		if (options && options.exporting && options.exporting.allowHTML) {
			var html = svg.match(/<\/svg>(.*?$)/);
			if (html && html[1]) {
				html = '<foreignObject x="0" y="0" ' +
							'width="' + options.chart.width + '" ' +
							'height="' + options.chart.height + '">' +
					'<body xmlns="http://www.w3.org/1999/xhtml">' +
					html[1] +
					'</body>' +
					'</foreignObject>';
				svg = svg.replace('</svg>', html + '</svg>');
			}
		}
		
		svg = svg
			.replace(/zIndex="[^"]+"/g, '')
			.replace(/isShadow="[^"]+"/g, '')
			.replace(/symbolName="[^"]+"/g, '')
			.replace(/jQuery[0-9]+="[^"]+"/g, '')
			.replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, 'url($2)')
			.replace(/url\([^#]+#/g, 'url(#')
			.replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')
			.replace(/ (NS[0-9]+\:)?href=/g, ' xlink:href=') // #3567
			.replace(/\n/, ' ')
			// Any HTML added to the container after the SVG (#894)
			.replace(/<\/svg>.*?$/, '</svg>')
			// Batik doesn't support rgba fills and strokes (#3095)
			.replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"')
			/* This fails in IE < 8
			.replace(/([0-9]+)\.([0-9]+)/g, function(s1, s2, s3) { // round off to save weight
				return s2 +'.'+ s3[0];
			})*/

			// Replace HTML entities, issue #347
			.replace(/&nbsp;/g, '\u00A0') // no-break space
			.replace(/&shy;/g,  '\u00AD'); // soft hyphen

			/*= if (build.classic) { =*/
			// IE specific
		svg = svg
			.replace(/<IMG /g, '<image ')
			.replace(/<(\/?)TITLE>/g, '<$1title>')
			.replace(/height=([^" ]+)/g, 'height="$1"')
			.replace(/width=([^" ]+)/g, 'width="$1"')
			.replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>')
			.replace(/ id=([^" >]+)/g, ' id="$1"') // #4003
			.replace(/class=([^" >]+)/g, 'class="$1"')
			.replace(/ transform /g, ' ')
			.replace(/:(path|rect)/g, '$1')
			.replace(/style="([^"]+)"/g, function (s) {
				return s.toLowerCase();
			});
			/*= } =*/
		
		return svg;
	},

	/**
	 * Return innerHTML of chart. Used as hook for plugins.
	 */
	getChartHTML: function () {
		/*= if (!build.classic) { =*/
		this.inlineStyles();
		/*= } =*/
		return this.container.innerHTML;
	},

	/**
	 * Return an SVG representation of the chart.
	 *
	 * @param  chartOptions {Options}
	 *         Additional chart options for the generated SVG representation.
	 *         For collections like `xAxis`, `yAxis` or `series`, the additional
	 *         options is either merged in to the orininal item of the same
	 *         `id`, or to the first item if a common id is not found.
	 * @return {String}
	 *         The SVG representation of the rendered chart.
	 * @sample highcharts/members/chart-getsvg/
	 *         View the SVG from a button
	 */
	getSVG: function (chartOptions) {
		var chart = this,
			chartCopy,
			sandbox,
			svg,
			seriesOptions,
			sourceWidth,
			sourceHeight,
			cssWidth,
			cssHeight,
			options = merge(chart.options, chartOptions); // copy the options and add extra options


		// IE compatibility hack for generating SVG content that it doesn't really understand
		if (!doc.createElementNS) {
			doc.createElementNS = function (ns, tagName) {
				return doc.createElement(tagName);
			};
		}

		// create a sandbox where a new chart will be generated
		sandbox = createElement('div', null, {
			position: 'absolute',
			top: '-9999em',
			width: chart.chartWidth + 'px',
			height: chart.chartHeight + 'px'
		}, doc.body);

		// get the source size
		cssWidth = chart.renderTo.style.width;
		cssHeight = chart.renderTo.style.height;
		sourceWidth = options.exporting.sourceWidth ||
			options.chart.width ||
			(/px$/.test(cssWidth) && parseInt(cssWidth, 10)) ||
			600;
		sourceHeight = options.exporting.sourceHeight ||
			options.chart.height ||
			(/px$/.test(cssHeight) && parseInt(cssHeight, 10)) ||
			400;

		// override some options
		extend(options.chart, {
			animation: false,
			renderTo: sandbox,
			forExport: true,
			renderer: 'SVGRenderer',
			width: sourceWidth,
			height: sourceHeight
		});
		options.exporting.enabled = false; // hide buttons in print
		delete options.data; // #3004

		// prepare for replicating the chart
		options.series = [];
		each(chart.series, function (serie) {
			seriesOptions = merge(serie.userOptions, { // #4912
				animation: false, // turn off animation
				enableMouseTracking: false,
				showCheckbox: false,
				visible: serie.visible
			});

			if (!seriesOptions.isInternal) { // used for the navigator series that has its own option set
				options.series.push(seriesOptions);
			}
		});

		// Assign an internal key to ensure a one-to-one mapping (#5924)
		each(chart.axes, function (axis) {
			if (!axis.userOptions.internalKey) { // #6444
				axis.userOptions.internalKey = H.uniqueKey();
			}
		});

		// generate the chart copy
		chartCopy = new H.Chart(options, chart.callback);

		// Axis options and series options  (#2022, #3900, #5982)
		if (chartOptions) {
			each(['xAxis', 'yAxis', 'series'], function (coll) {
				var collOptions = {};
				if (chartOptions[coll]) {
					collOptions[coll] = chartOptions[coll];
					chartCopy.update(collOptions);
				}
			});
		}

		// Reflect axis extremes in the export (#5924)
		each(chart.axes, function (axis) {
			var axisCopy = H.find(chartCopy.axes, function (copy) {
					return copy.options.internalKey === 
						axis.userOptions.internalKey;
				}),
				extremes = axis.getExtremes(),
				userMin = extremes.userMin,
				userMax = extremes.userMax;

			if (axisCopy && (userMin !== undefined || userMax !== undefined)) {
				axisCopy.setExtremes(userMin, userMax, true, false);
			}
		});

		// Get the SVG from the container's innerHTML
		svg = chartCopy.getChartHTML();

		svg = chart.sanitizeSVG(svg, options);

		// free up memory
		options = null;
		chartCopy.destroy();
		discardElement(sandbox);
		
		return svg;
	},

	getSVGForExport: function (options, chartOptions) {
		var chartExportingOptions = this.options.exporting;

		return this.getSVG(merge(
			{ chart: { borderRadius: 0 } },
			chartExportingOptions.chartOptions,
			chartOptions,
			{
				exporting: {
					sourceWidth: (options && options.sourceWidth) || chartExportingOptions.sourceWidth,
					sourceHeight: (options && options.sourceHeight) || chartExportingOptions.sourceHeight
				}
			}
		));
	},

	/**
	 * Exporting module required. Submit an SVG version of the chart to a server
	 * along with some parameters for conversion.
	 * @param  {Object} exportingOptions
	 *         Exporting options in addition to those defined in {@link
	 *         https://api.highcharts.com/highcharts/exporting|exporting}.
	 * @param  {String} exportingOptions.filename
	 *         The file name for the export without extension.
	 * @param  {String} exportingOptions.url
	 *         The URL for the server module to do the conversion.
	 * @param  {Number} exportingOptions.width
	 *         The width of the PNG or JPG image generated on the server.
	 * @param  {String} exportingOptions.type
	 *         The MIME type of the converted image.
	 * @param  {Number} exportingOptions.sourceWidth
	 *         The pixel width of the source (in-page) chart.
	 * @param  {Number} exportingOptions.sourceHeight
	 *         The pixel height of the source (in-page) chart.
	 * @param  {Options} chartOptions
	 *         Additional chart options for the exported chart. For example a
	 *         different background color can be added here, or `dataLabels`
	 *         for export only.
	 *
	 * @sample highcharts/members/chart-exportchart/
	 *         Export with no options
	 * @sample highcharts/members/chart-exportchart-filename/
	 *         PDF type and custom filename
	 * @sample highcharts/members/chart-exportchart-custom-background/
	 *         Different chart background in export
	 * @sample stock/members/chart-exportchart/
	 *         Export with Highstock
	 */
	exportChart: function (exportingOptions, chartOptions) {

		var svg = this.getSVGForExport(exportingOptions, chartOptions);

		// merge the options
		exportingOptions = merge(this.options.exporting, exportingOptions);

		// do the post
		H.post(exportingOptions.url, {
			filename: exportingOptions.filename || 'chart',
			type: exportingOptions.type,
			width: exportingOptions.width || 0, // IE8 fails to post undefined correctly, so use 0
			scale: exportingOptions.scale,
			svg: svg
		}, exportingOptions.formAttributes);

	},

	/**
	 * Exporting module required. Clears away other elements in the page and
	 * prints the chart as it is displayed. By default, when the exporting
	 * module is enabled, a context button with a drop down menu in the upper
	 * right corner accesses this function.
	 *
	 * @sample highcharts/members/chart-print/
	 *         Print from a HTML button
	 */
	print: function () {

		var chart = this,
			container = chart.container,
			origDisplay = [],
			origParent = container.parentNode,
			body = doc.body,
			childNodes = body.childNodes,
			printMaxWidth = chart.options.exporting.printMaxWidth,
			resetParams,
			handleMaxWidth;

		if (chart.isPrinting) { // block the button while in printing mode
			return;
		}

		chart.isPrinting = true;
		chart.pointer.reset(null, 0);

		fireEvent(chart, 'beforePrint');

		// Handle printMaxWidth
		handleMaxWidth = printMaxWidth && chart.chartWidth > printMaxWidth;
		if (handleMaxWidth) {
			resetParams = [chart.options.chart.width, undefined, false];
			chart.setSize(printMaxWidth, undefined, false);
		}

		// hide all body content
		each(childNodes, function (node, i) {
			if (node.nodeType === 1) {
				origDisplay[i] = node.style.display;
				node.style.display = 'none';
			}
		});

		// pull out the chart
		body.appendChild(container);

		// print
		win.focus(); // #1510
		win.print();

		// allow the browser to prepare before reverting
		setTimeout(function () {

			// put the chart back in
			origParent.appendChild(container);

			// restore all body content
			each(childNodes, function (node, i) {
				if (node.nodeType === 1) {
					node.style.display = origDisplay[i];
				}
			});

			chart.isPrinting = false;

			// Reset printMaxWidth
			if (handleMaxWidth) {
				chart.setSize.apply(chart, resetParams);
			}

			fireEvent(chart, 'afterPrint');

		}, 1000);

	},

	/**
	 * Display a popup menu for choosing the export type
	 *
	 * @param {String} className An identifier for the menu
	 * @param {Array} items A collection with text and onclicks for the items
	 * @param {Number} x The x position of the opener button
	 * @param {Number} y The y position of the opener button
	 * @param {Number} width The width of the opener button
	 * @param {Number} height The height of the opener button
	 */
	contextMenu: function (className, items, x, y, width, height, button) {
		var chart = this,
			navOptions = chart.options.navigation,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			cacheName = 'cache-' + className,
			menu = chart[cacheName],
			menuPadding = Math.max(width, height), // for mouse leave detection
			innerMenu,
			hide,
			menuStyle;

		// create the menu only the first time
		if (!menu) {

			// create a HTML element above the SVG
			chart[cacheName] = menu = createElement('div', {
				className: className
			}, {
				position: 'absolute',
				zIndex: 1000,
				padding: menuPadding + 'px'
			}, chart.container);

			innerMenu = createElement('div', { className: 'highcharts-menu' }, null, menu);

			/*= if (build.classic) { =*/
			// Presentational CSS
			css(innerMenu, extend({
					MozBoxShadow: '3px 3px 10px #888',
					WebkitBoxShadow: '3px 3px 10px #888',
					boxShadow: '3px 3px 10px #888'
				}, navOptions.menuStyle));
			/*= } =*/

			// hide on mouse out
			hide = function () {
				css(menu, { display: 'none' });
				if (button) {
					button.setState(0);
				}
				chart.openMenu = false;
			};

			// Hide the menu some time after mouse leave (#1357)
			chart.exportEvents.push(
				addEvent(menu, 'mouseleave', function () {
					menu.hideTimer = setTimeout(hide, 500);
				}),
				addEvent(menu, 'mouseenter', function () {
					clearTimeout(menu.hideTimer);
				}),

				// Hide it on clicking or touching outside the menu (#2258, #2335,
				// #2407)
				addEvent(doc, 'mouseup', function (e) {
					if (!chart.pointer.inClass(e.target, className)) {
						hide();
					}
				})
			);

			// create the items
			each(items, function (item) {
				if (item) {
					var element;

					if (item.separator) {
						element = createElement('hr', null, null, innerMenu);

					} else {
						element = createElement('div', {
							className: 'highcharts-menu-item',
							onclick: function (e) {
								if (e) { // IE7
									e.stopPropagation();
								}
								hide();
								if (item.onclick) {
									item.onclick.apply(chart, arguments);
								}
							},
							innerHTML: item.text || chart.options.lang[item.textKey]
						}, null, innerMenu);

						/*= if (build.classic) { =*/
						element.onmouseover = function () {
							css(this, navOptions.menuItemHoverStyle);
						};
						element.onmouseout = function () {
							css(this, navOptions.menuItemStyle);
						};
						css(element, extend({
							cursor: 'pointer'
						}, navOptions.menuItemStyle));
						/*= } =*/
					}

					// Keep references to menu divs to be able to destroy them
					chart.exportDivElements.push(element);
				}
			});

			// Keep references to menu and innerMenu div to be able to destroy them
			chart.exportDivElements.push(innerMenu, menu);

			chart.exportMenuWidth = menu.offsetWidth;
			chart.exportMenuHeight = menu.offsetHeight;
		}

		menuStyle = { display: 'block' };

		// if outside right, right align it
		if (x + chart.exportMenuWidth > chartWidth) {
			menuStyle.right = (chartWidth - x - width - menuPadding) + 'px';
		} else {
			menuStyle.left = (x - menuPadding) + 'px';
		}
		// if outside bottom, bottom align it
		if (y + height + chart.exportMenuHeight > chartHeight && button.alignOptions.verticalAlign !== 'top') {
			menuStyle.bottom = (chartHeight - y - menuPadding)  + 'px';
		} else {
			menuStyle.top = (y + height - menuPadding) + 'px';
		}

		css(menu, menuStyle);
		chart.openMenu = true;
	},

	/**
	 * Add the export button to the chart
	 */
	addButton: function (options) {
		var chart = this,
			renderer = chart.renderer,
			btnOptions = merge(chart.options.navigation.buttonOptions, options),
			onclick = btnOptions.onclick,
			menuItems = btnOptions.menuItems,
			symbol,
			button,
			symbolSize = btnOptions.symbolSize || 12;
		if (!chart.btnCount) {
			chart.btnCount = 0;
		}

		// Keeps references to the button elements
		if (!chart.exportDivElements) {
			chart.exportDivElements = [];
			chart.exportSVGElements = [];
		}

		if (btnOptions.enabled === false) {
			return;
		}


		var attr = btnOptions.theme,
			states = attr.states,
			hover = states && states.hover,
			select = states && states.select,
			callback;

		delete attr.states;

		if (onclick) {
			callback = function (e) {
				e.stopPropagation();
				onclick.call(chart, e);
			};

		} else if (menuItems) {
			callback = function () {
				chart.contextMenu(
					button.menuClassName,
					menuItems,
					button.translateX,
					button.translateY,
					button.width,
					button.height,
					button
				);
				button.setState(2);
			};
		}


		if (btnOptions.text && btnOptions.symbol) {
			attr.paddingLeft = pick(attr.paddingLeft, 25);

		} else if (!btnOptions.text) {
			extend(attr, {
				width: btnOptions.width,
				height: btnOptions.height,
				padding: 0
			});
		}

		button = renderer.button(btnOptions.text, 0, 0, callback, attr, hover, select)
			.addClass(options.className)
			.attr({
				/*= if (build.classic) { =*/
				'stroke-linecap': 'round',
				/*= } =*/
				title: chart.options.lang[btnOptions._titleKey],
				zIndex: 3 // #4955
			});
		button.menuClassName = options.menuClassName || 'highcharts-menu-' + chart.btnCount++;

		if (btnOptions.symbol) {
			symbol = renderer.symbol(
					btnOptions.symbol,
					btnOptions.symbolX - (symbolSize / 2),
					btnOptions.symbolY - (symbolSize / 2),
					symbolSize,
					symbolSize
				)
				.addClass('highcharts-button-symbol')
				.attr({
					zIndex: 1
				}).add(button);

			/*= if (build.classic) { =*/
			symbol.attr({
				stroke: btnOptions.symbolStroke,
				fill: btnOptions.symbolFill,
				'stroke-width': btnOptions.symbolStrokeWidth || 1
			});
			/*= } =*/
		}

		button.add()
			.align(extend(btnOptions, {
				width: button.width,
				x: pick(btnOptions.x, chart.buttonOffset) // #1654
			}), true, 'spacingBox');

		chart.buttonOffset += (button.width + btnOptions.buttonSpacing) * (btnOptions.align === 'right' ? -1 : 1);

		chart.exportSVGElements.push(button, symbol);

	},

	/**
	 * Destroy the buttons.
	 */
	destroyExport: function (e) {
		var chart = e ? e.target : this,
			exportSVGElements = chart.exportSVGElements,
			exportDivElements = chart.exportDivElements,
			exportEvents = chart.exportEvents,
			cacheName;

		// Destroy the extra buttons added
		if (exportSVGElements) {
			each(exportSVGElements, function (elem, i) {

				// Destroy and null the svg/vml elements
				if (elem) { // #1822
					elem.onclick = elem.ontouchstart = null;
					cacheName = 'cache-' + elem.menuClassName;

					if (chart[cacheName]) {
						delete chart[cacheName];
					}

					chart.exportSVGElements[i] = elem.destroy();
				}
			});
			exportSVGElements.length = 0;
		}

		// Destroy the divs for the menu
		if (exportDivElements) {
			each(exportDivElements, function (elem, i) {

				// Remove the event handler
				clearTimeout(elem.hideTimer); // #5427
				removeEvent(elem, 'mouseleave');

				// Remove inline events
				chart.exportDivElements[i] = elem.onmouseout = elem.onmouseover = elem.ontouchstart = elem.onclick = null;

				// Destroy the div by moving to garbage bin
				discardElement(elem);
			});
			exportDivElements.length = 0;
		}

		if (exportEvents) {
			each(exportEvents, function (unbind) {
				unbind();
			});
			exportEvents.length = 0;
		}
	}
});

/*= if (!build.classic) { =*/
// These ones are translated to attributes rather than styles
SVGRenderer.prototype.inlineToAttributes = [
	'fill',
	'stroke',
	'strokeLinecap',
	'strokeLinejoin',
	'strokeWidth',
	'textAnchor',
	'x',
	'y'
];
// These CSS properties are not inlined. Remember camelCase.
SVGRenderer.prototype.inlineBlacklist = [
	/-/, // In Firefox, both hyphened and camelCased names are listed
	/^(clipPath|cssText|d|height|width)$/, // Full words
	/^font$/, // more specific props are set
	/[lL]ogical(Width|Height)$/,
	/perspective/,
	/TapHighlightColor/,
	/^transition/
	// /^text (border|color|cursor|height|webkitBorder)/
];
SVGRenderer.prototype.unstyledElements = [
	'clipPath',
	'defs',
	'desc'
];

/**
 * Analyze inherited styles from stylesheets and add them inline
 *
 * @todo: What are the border styles for text about? In general, text has a lot of properties.
 * @todo: Make it work with IE9 and IE10.
 */
Chart.prototype.inlineStyles = function () {
	var renderer = this.renderer,
		inlineToAttributes = renderer.inlineToAttributes,
		blacklist = renderer.inlineBlacklist,
		whitelist = renderer.inlineWhitelist, // For IE
		unstyledElements = renderer.unstyledElements,
		defaultStyles = {},
		dummySVG;
	
	/**
	 * Make hyphenated property names out of camelCase
	 */
	function hyphenate(prop) {
		return prop.replace(
			/([A-Z])/g, 
			function (a, b) { 
				return '-' + b.toLowerCase();
			}
		);
	}

	/**
	 * Call this on all elements and recurse to children
	 */
	function recurse(node) {
		var styles,
			parentStyles,
			cssText = '',
			dummy,
			styleAttr,
			blacklisted,
			whitelisted,
			i;

		// Check computed styles and whether they are in the white/blacklist for
		// styles or atttributes
		function filterStyles(val, prop) {

			// Check against whitelist & blacklist
			blacklisted = whitelisted = false;
			if (whitelist) {
				// Styled mode in IE has a whitelist instead.
				// Exclude all props not in this list.
				i = whitelist.length;
				while (i-- && !whitelisted) {
					whitelisted = whitelist[i].test(prop);
				}
				blacklisted = !whitelisted;
			}

			// Explicitly remove empty transforms
			if (prop === 'transform' && val === 'none') {
				blacklisted = true;
			}

			i = blacklist.length;
			while (i-- && !blacklisted) {
				blacklisted = blacklist[i].test(prop) || typeof val === 'function';
			}

			if (!blacklisted) {
				// If parent node has the same style, it gets inherited, no need to inline it
				if (parentStyles[prop] !== val && defaultStyles[node.nodeName][prop] !== val) {
					// Attributes
					if (inlineToAttributes.indexOf(prop) !== -1) {
						node.setAttribute(hyphenate(prop), val);
					// Styles
					} else {
						cssText += hyphenate(prop) + ':' + val + ';';
					}
				}
			}
		}

		if (node.nodeType === 1 && unstyledElements.indexOf(node.nodeName) === -1) {
			styles = win.getComputedStyle(node, null);
			parentStyles = node.nodeName === 'svg' ? {} : win.getComputedStyle(node.parentNode, null);

			// Get default styles from the browser so that we don't have to add these
			if (!defaultStyles[node.nodeName]) {
				if (!dummySVG) {
					dummySVG = doc.createElementNS(H.SVG_NS, 'svg');
					dummySVG.setAttribute('version', '1.1');
					doc.body.appendChild(dummySVG);
				}
				dummy = doc.createElementNS(node.namespaceURI, node.nodeName);
				dummySVG.appendChild(dummy);
				defaultStyles[node.nodeName] = merge(win.getComputedStyle(dummy, null)); // Copy, so we can remove the node
				dummySVG.removeChild(dummy);
			}

			// Loop through all styles and add them inline if they are ok
			if (isFirefoxBrowser || isMSBrowser) {
				// Some browsers put lots of styles on the prototype
				for (var p in styles) {
					filterStyles(styles[p], p);
				}
			} else {
				objectEach(styles, filterStyles);
			}

			// Apply styles
			if (cssText) {
				styleAttr = node.getAttribute('style');
				node.setAttribute('style', (styleAttr ? styleAttr + ';' : '') + cssText);
			}

			// Set default stroke width (needed at least for IE)
			if (node.nodeName === 'svg') {
				node.setAttribute('stroke-width', '1px');
			}

			if (node.nodeName === 'text') {
				return;
			}
			
			// Recurse
			each(node.children || node.childNodes, recurse);
		}
	}

	/**
	 * Remove the dummy objects used to get defaults
	 */
	function tearDown() {
		dummySVG.parentNode.removeChild(dummySVG);
	}

	recurse(this.container.querySelector('svg'));
	tearDown();

};
/*= } =*/


symbols.menu = function (x, y, width, height) {
	var arr = [
		'M', x, y + 2.5,
		'L', x + width, y + 2.5,
		'M', x, y + height / 2 + 0.5,
		'L', x + width, y + height / 2 + 0.5,
		'M', x, y + height - 1.5,
		'L', x + width, y + height - 1.5
	];
	return arr;
};

// Add the buttons on chart load
Chart.prototype.renderExporting = function () {
	var chart = this,
		exportingOptions = chart.options.exporting,
		buttons = exportingOptions.buttons,
		isDirty = chart.isDirtyExporting || !chart.exportSVGElements;
	
	chart.buttonOffset = 0;
	if (chart.isDirtyExporting) {
		chart.destroyExport();
	}
	
	if (isDirty && exportingOptions.enabled !== false) {
		chart.exportEvents = [];

		objectEach(buttons, function (button) {
			chart.addButton(button);
		});

		chart.isDirtyExporting = false;
	}

	// Destroy the export elements at chart destroy
	addEvent(chart, 'destroy', chart.destroyExport);		
};

Chart.prototype.callbacks.push(function (chart) {

	function update(prop, options, redraw) {
		chart.isDirtyExporting = true;
		merge(true, chart.options[prop], options);
		if (pick(redraw, true)) {
			chart.redraw();
		}

	}

	chart.renderExporting();

	addEvent(chart, 'redraw', chart.renderExporting);

	// Add update methods to handle chart.update and chart.exporting.update
	// and chart.navigation.update.
	each(['exporting', 'navigation'], function (prop) {
		chart[prop] = {
			update: function (options, redraw) {
				update(prop, options, redraw);
			}
		};
	});

	// Uncomment this to see a button directly below the chart, for quick
	// testing of export
	/*
	if (!chart.renderer.forExport) {
		var button;

		// View SVG Image
		button = doc.createElement('button');
		button.innerHTML = 'View SVG Image';
		chart.renderTo.parentNode.appendChild(button);
		button.onclick = function () {
			var div = doc.createElement('div');
			div.innerHTML = chart.getSVGForExport();
			chart.renderTo.parentNode.appendChild(div);
		};

		// View SVG Source
		button = doc.createElement('button');
		button.innerHTML = 'View SVG Source';
		chart.renderTo.parentNode.appendChild(button);
		button.onclick = function () {
			var pre = doc.createElement('pre');
			pre.innerHTML = chart.getSVGForExport()
				.replace(/</g, '\n&lt;')
				.replace(/>/g, '&gt;');
			chart.renderTo.parentNode.appendChild(pre);
		};
	}
	// */
});
