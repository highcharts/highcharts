/** 
 * @license Highcharts JS v2.0 (prerelease)
 * Exporting module
 * 
 * (c) 2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

/*
 * TODO:
 * - split into exporting and general button/menu modules as a foundation 
 *   for later interactivity
 * 
 */
// create shortcuts
var HC = Highcharts,
	Chart = HC.Chart,
	addEvent = HC.addEvent,
	defaultOptions = HC.defaultOptions,
	defaultPlotOptions = defaultOptions.plotOptions,
	seriesTypes = HC.seriesTypes,
	createElement = HC.createElement,
	discardElement = HC.discardElement,
	css = HC.css,
	doc = document,
	win = window,
	map = HC.map,
	merge = HC.merge,
	each = HC.each,
	extend = HC.extend,
	symbols = HC.symbols,
	math = Math,
	mathMax = math.max;

var //defaultOptions = Highcharts.defaultOptions,
	lang = defaultOptions.lang,
	M = 'M',
	L = 'L',
	DIV = 'div',
	HIDDEN = 'hidden',
	NONE = 'none',
	PREFIX = 'highcharts-',
	ABSOLUTE = 'absolute',
	PX = 'px';



// Add language
extend(lang, {
	downloadPNG: 'Download PNG image',
	downloadJPEG: 'Download JPEG image',
	downloadPDF: 'Download PDF document',
	downloadSVG: 'Download SVG vector image',
	exportButtonTitle: 'Export to raster or vector image',
	printButtonTitle: 'Print chart'
});

// Add the export related options
defaultOptions.exporting = {
	type: 'svg/image',
	width: 800,
	url: 'http://highslide.com/convert/',
	
	// todo: move menu styles to chart level in case other modules will use it?
	menuStyle: {
		border: '1px solid #A0A0A0',
		background: '#FFFFFF'
	},
	menuItemStyle: {
		padding: '0 5px',
		background: NONE,
		color: '#303030'
	},
	menuItemHoverStyle: {
		background: '#4572A5',
		color: '#FFFFFF'
	},
	
	buttonOptions: { // general button options - todo: move to general chart buttons for other modules?
		align: 'right',
		verticalAlign: 'top',
		offsetY: 10,
		width: 24,
		height: 20,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#C0C0C0',
		backgroundColor: '#FFFFFF',
		symbolFill: '#E0E0E0',
		symbolStroke: '#A0A0A0',
		hoverSymbolFill: '#4572A5',
		hoverSymbolStroke: '#4572A5',
		hoverBackgroundColor: '#EFF7FF',
		hoverBorderColor: '#4572A5'
	},
	buttons: {
		exportButton: {
			symbol: 'exportIcon',
			offsetX: 10,
			menuItems: [{
				text: lang.downloadPNG,
				onclick: function() {
					chart.exportChart({
						type: 'image/png'
					});
				}
			}, {
				text: lang.downloadJPEG,
				onclick: function() {
					chart.exportChart({
						type: 'image/jpeg'
					});
				}
			}, {
				text: lang.downloadPDF,
				onclick: function() {
					chart.exportChart({
						type: 'application/pdf'
					});
				}
			}, {
				text: lang.downloadSVG,
				onclick: function() {
					chart.exportChart({
						type: 'image/svg+xml'
					});
				}
			}, {
				text: 'View SVG',
				onclick: function() {
					alert(chart.getSVG());
				}
			}]
			
		},
		printButton: {
			symbol: 'printIcon',
			offsetX: 36,
			onclick: function(e) {
				e.stopPropagation();
				chart.print();
			}
		}
	}
};



extend (Chart.prototype, {
	/**
 	 * Return an SVG representation of the chart
 	 * 
 	 * @param additionalOptions {Object} Additional chart options for the generated SVG representation
 	 */	
	 getSVG: function(additionalOptions) {
		var chart = this,
			chartCopy,
			sandbox,
			svg,
			options = merge(chart.options, additionalOptions); // copy the options and add extra options
		
		// IE compatibility hack for generating SVG content that it doesn't really understand
		if (!doc.createElementNS) {
			doc.createElementNS = function(ns, tagName) {
				return doc.createElement(tagName);
			}
		}
		
		// create a sandbox where a new chart will be generated
		sandbox = createElement(DIV, null, {
			position: ABSOLUTE,
			top: '-9999em',
			width: chart.chartWidth + PX,
			height: chart.chartHeight + PX
		}, doc.body);
		
		// override some options
		extend(options.chart, {
			renderTo: sandbox,
			renderer: 'SVG'
		})
		
		// turn off animation
		each (options.series, function(serie) {
			serie.animation = false;
		});
		
		// generate the chart copy
		chartCopy = new Highcharts.Chart(options);
		
		// get the SVG from the container's innerHTML
		svg = sandbox.getElementsByTagName(DIV)[0].innerHTML;
		
		// free up memory
		options = null;
		chartCopy.destroy();
		discardElement(sandbox);
		
		// sanitize
		svg = svg.
			replace(/zIndex="[^"]+"/g, ''). 
			replace(/isShadow="[^"]+"/g, '').
			replace(/symbolName="[^"]+"/g, '').
			replace(/jQuery[0-9]+="[^"]+"/g, '').
			replace(/isTracker="[^"]+"/g, '').
			
			// IE specific
			replace(/id=([^" ]+)/g, 'id="$1"'). 
			replace(/class=([^" ]+)/g, 'class="$1"').
			replace(/ transform /g, ' ').
			replace(/:path/g, 'path').
			replace(/:rect/g, 'rect').
			replace(/style="([^"]+)"/g, function(s) {
				return s.toLowerCase();
			});
			
		return svg;
	},
	
	/**
	 * Submit the SVG representation of the chart to the server
	 * @param {Object} options
	 * @param {Object} chartOptions Additional chart options for the SVG representation of the chart
	 */
	exportChart: function(options, chartOptions) {
		var form,
			svg = this.getSVG(chartOptions);
			
		// merge the options
		options = merge(defaultOptions.exporting, options);
		
		// create the form
		form = createElement('form', {
			method: 'post',
			action: options.url
		}, {
			display: NONE
		}, doc.body);
		
		
		// add the values
		each(['type', 'width', 'svg'], function(name) {
			createElement('input', {
				type: HIDDEN,
				name: name,
				value: { type: options.type, width: options.width, svg: svg }[name]
			}, null, form);
		});
		
		// submit
		form.submit();
		
		// clean up
		discardElement(form);
	},
	
	/**
	 * Print the chart
	 */
	print: function() {
		var chart = this,
			container = chart.container,
			i,
			origDisplay = [],
			origParent = container.parentNode,
			body = doc.body,
			childNodes = body.childNodes,
			node;
		
		// hide all body content	
		each(childNodes, function(node) {
			if (node.nodeType == 1) {
				origDisplay[i] = node.style.display;
				node.style.display = NONE;
			}
		});
			
		// pull out the chart
		body.appendChild(container);
		 
		// print
		win.print();
		
		// allow the browser to prepare
		setTimeout(function() {

			// put the chart back in
			origParent.appendChild(container);
			
			// restore all body content
			each (childNodes, function(node) {
				if (node.nodeType == 1) {
					node.style.display = origDisplay[i];
				}
			});
		}, 1000);

	},
	
	/**
	 * Display a popup menu for choosing the export type 
	 * 
	 * @param {String} name An identifier for the menu
	 * @param {Array} items A collection with text and onclicks for the items
	 * @param {Number} x The x position of the opener button
	 * @param {Number} y The y position of the opener button
	 * @param {Number} width The width of the opener button
	 * @param {Number} height The height of the opener button
	 */
	contextMenu: function(name, items, x, y, width, height) {
		var chart = this,
			exportingOptions = chart.options.exporting,
			menuItemStyle = exportingOptions.menuItemStyle,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			cacheName = 'cache-'+ name,
			menu = chart[cacheName],
			menuPadding = mathMax(width, height), // for mouse leave detection
			boxShadow = '3px 3px 5px #888'; 
		
		// create the menu only the first time
		if (!menu) {
			
			// create a HTML element above the SVG		
			chart[cacheName] = menu = createElement(DIV, {
				className: PREFIX + name
			}, {
				position: ABSOLUTE,
				zIndex: 1000,
				padding: menuPadding + PX
			}, chart.container);
			
			var innerMenu = createElement(DIV, null, 
				extend({
					MozBoxShadow: boxShadow,
					WebkitBoxShadow: boxShadow
				}, exportingOptions.menuStyle) , menu);
			
			function hide() {
				css(menu, { display: NONE });
			};
			addEvent(menu, 'mouseleave', hide);
			
			// create the items
			each(items, function(item) {
				createElement(DIV, {
					onclick: function() {
						hide();
						item.onclick();
					},
					onmouseover: function() {
						css(this, exportingOptions.menuItemHoverStyle);
					},
					onmouseout: function() {
						css(this, menuItemStyle);
					},
					innerHTML: item.text
				}, extend({
					cursor: 'pointer'
				}, menuItemStyle), innerMenu);
			});
			
			chart.exportMenuWidth = menu.offsetWidth;
			chart.exportMenuHeigh = menu.offsetHeight;
		}
		
		var menuStyle = { display: 'block' };
		
		// if outside right, right align it
		if (x + chart.exportMenuWidth > chartWidth) {
			menuStyle.right = (chartWidth - x - width - menuPadding) + PX
		} else {
			menuStyle.left = (x - menuPadding) + PX
		}
		// if outside bottom, bottom align it
		if (y + height + chart.exportMenuWidth > chartHeight) {
			menuStyle.bottom = (chartHeight - y - menuPadding)  + PX
		} else {
			menuStyle.top = (y + height - menuPadding) + PX
		}
		
		css(menu, menuStyle);
	},
	
	/**
	 * Add the export button to the chart
	 * 
	 * @todo
	 * - Merge addExportButton and addPrintButton
	 * - Add options for coloring
	 * - Add logic for the icon placement in the button
	 */
	addButton: function(options) {
		var chart = this,
			renderer = chart.renderer,
			exportingOptions = chart.options.exporting,
			options = merge(exportingOptions.buttonOptions, options),
			onclick = options.onclick,
			menuItems = options.menuItems,
			position = chart.getAlignment(options),
			buttonLeft = position.x,
			buttonTop = position.y,
			buttonWidth = options.width,
			buttonHeight = options.height;
		
		var borderWidth = options.borderWidth;
		
		var boxAttr = {
				stroke: options.borderColor,
				fill: options.backgroundColor
			},
			symbolAttr = {
				stroke: '#A0A0A0',
				fill: '#E0E0E0'
			};
			
		// element to capture the click
		var button = renderer.rect( 
			buttonLeft,
			buttonTop,
			buttonWidth,
			buttonHeight,
			0
		).attr({
			fill: 'rgba(255, 255, 255, 0.001)',
			title: lang.exportButtonTitle
		}).css({
			cursor: 'pointer'
		}).add(null, 21);
		
		// add the click event
		if (menuItems) {
			onclick = function(e) {
				e.stopPropagation();
				chart.contextMenu('export-menu', menuItems, buttonLeft, buttonTop, buttonWidth, buttonHeight);
			}
		}
		addEvent(button.element, 'click', onclick);
		
		// the icon
		var symbol = renderer.symbol(options.symbol, buttonLeft + 11.5, buttonTop + 10.5, 6).
			attr(extend(symbolAttr, {
				'stroke-width': 1				
			})).add(null, 20);
		
		// the box border
		var box = renderer.rect(
			buttonLeft,
			buttonTop,
			buttonWidth, 
			buttonHeight,
			options.borderRadius,
			borderWidth
		).attr(extend(boxAttr, {
			'stroke-width': borderWidth
		})).add(null, 19);
		
		button.element.onmouseover = function() {
			symbol.attr({ 
				fill: options.hoverSymbolFill,
				stroke: options.hoverSymbolStroke
			});
			box.attr({
				fill: options.hoverBackgroundColor,
				stroke: options.hoverBorderColor
			});
		}
		button.element.onmouseout = function() {
			symbol.attr(symbolAttr);
			box.attr(boxAttr);
		}
	}
});

// Create the export icon
symbols.exportIcon = function(x, y, radius) {
	return [
		M, // the disk
		x - radius, y + radius,
		L,
		x + radius, y + radius,
		x + radius, y + radius * 0.5,
		x - radius, y + radius * 0.5,
		'Z',
		M, // the arrow
		x, y + radius * 0.5,
		L,
		x - radius * 0.5, y - radius / 3,
		x - radius / 6, y - radius / 3,
		x - radius / 6, y - radius,
		x + radius / 6, y - radius,
		x + radius / 6, y - radius / 3,
		x + radius * 0.5, y - radius / 3,
		'Z'
	];
};
// Create the print icon
symbols.printIcon = function(x, y, radius) {
	return [
		M, // the printer
		x - radius, y + radius * 0.5,
		L,
		x + radius, y + radius * 0.5,
		x + radius, y - radius / 3,
		x - radius, y - radius / 3,
		'Z',
		M, // the upper sheet
		x - radius * 0.5, y - radius / 3,
		L,
		x - radius * 0.5, y - radius,
		x + radius * 0.5, y - radius,
		x + radius * 0.5, y - radius / 3,
		'Z',
		M, // the lower sheet
		x - radius * 0.5, y + radius / 3,
		x - radius * 0.75, y + radius,
		x + radius * 0.75, y + radius,
		x + radius * 0.5, y + radius / 3,
		'Z'
	];
};

// Add the buttons on chart load
addEvent(Chart.prototype, 'load', function(e) {
	var chart = e.target,
		n,
		buttons = chart.options.exporting.buttons;
	
	for (n in buttons) {
		chart.addButton(buttons[n]);
	};
	
});