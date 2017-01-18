/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Axis.js';
import './Legend.js';
import './Options.js';
import './Pointer.js';
var addEvent = H.addEvent,
	animate = H.animate,
	animObject = H.animObject,
	attr = H.attr,
	doc = H.doc,
	Axis = H.Axis, // @todo add as requirement
	createElement = H.createElement,
	defaultOptions = H.defaultOptions,
	discardElement = H.discardElement,
	charts = H.charts,
	css = H.css,
	defined = H.defined,
	each = H.each,
	extend = H.extend,
	find = H.find,
	fireEvent = H.fireEvent,
	getStyle = H.getStyle,
	grep = H.grep,
	isNumber = H.isNumber,
	isObject = H.isObject,
	isString = H.isString,
	Legend = H.Legend, // @todo add as requirement
	marginNames = H.marginNames,
	merge = H.merge,
	Pointer = H.Pointer, // @todo add as requirement
	pick = H.pick,
	pInt = H.pInt,
	removeEvent = H.removeEvent,
	seriesTypes = H.seriesTypes,
	splat = H.splat,
	svg = H.svg,
	syncTimeout = H.syncTimeout,
	win = H.win,
	Renderer = H.Renderer;
/**
 * The Chart class.
 * @class Highcharts.Chart
 * @memberOf Highcharts
 * @param {String|HTMLDOMElement} renderTo - The DOM element to render to, or its
 * id.
 * @param {ChartOptions} options - The chart options structure.
 * @param {Function} callback - Function to run when the chart has loaded.
 */
var Chart = H.Chart = function () {
	this.getArgs.apply(this, arguments);
};

H.chart = function (a, b, c) {
	return new Chart(a, b, c);
};

Chart.prototype = {

	/**
	 * Hook for modules
	 */
	callbacks: [],

	/**
	 * Handle the arguments passed to the constructor
	 * @returns {Array} Arguments without renderTo
	 */
	getArgs: function () {
		var args = [].slice.call(arguments);
		
		// Remove the optional first argument, renderTo, and
		// set it on this.
		if (isString(args[0]) || args[0].nodeName) {
			this.renderTo = args.shift();
		}
		this.init(args[0], args[1]);
	},

	/**
	 * Initialize the chart
	 */
	init: function (userOptions, callback) {

		// Handle regular options
		var options,
			seriesOptions = userOptions.series; // skip merging data points to increase performance

		userOptions.series = null;
		options = merge(defaultOptions, userOptions); // do the merge
		options.series = userOptions.series = seriesOptions; // set back the series data
		this.userOptions = userOptions;
		this.respRules = [];

		var optionsChart = options.chart;

		var chartEvents = optionsChart.events;

		this.margin = [];
		this.spacing = [];

		//this.runChartClick = chartEvents && !!chartEvents.click;
		this.bounds = { h: {}, v: {} }; // Pixel data bounds for touch zoom

		this.callback = callback;
		this.isResizing = 0;
		this.options = options;
		//chartTitleOptions = undefined;
		//chartSubtitleOptions = undefined;

		this.axes = [];
		this.series = [];
		this.hasCartesianSeries = optionsChart.showAxes;
		//this.axisOffset = undefined;
		//this.inverted = undefined;
		//this.loadingShown = undefined;
		//this.container = undefined;
		//this.chartWidth = undefined;
		//this.chartHeight = undefined;
		//this.marginRight = undefined;
		//this.marginBottom = undefined;
		//this.containerWidth = undefined;
		//this.containerHeight = undefined;
		//this.oldChartWidth = undefined;
		//this.oldChartHeight = undefined;

		//this.renderTo = undefined;
		//this.renderToClone = undefined;

		//this.spacingBox = undefined

		//this.legend = undefined;

		// Elements
		//this.chartBackground = undefined;
		//this.plotBackground = undefined;
		//this.plotBGImage = undefined;
		//this.plotBorder = undefined;
		//this.loadingDiv = undefined;
		//this.loadingSpan = undefined;

		var chart = this,
			eventType;

		// Add the chart to the global lookup
		chart.index = charts.length;
		charts.push(chart);
		H.chartCount++;

		// Chart event handlers
		if (chartEvents) {
			for (eventType in chartEvents) {
				addEvent(chart, eventType, chartEvents[eventType]);
			}
		}

		chart.xAxis = [];
		chart.yAxis = [];

		chart.pointCount = chart.colorCounter = chart.symbolCounter = 0;

		chart.firstRender();
	},

	/**
	 * Initialize an individual series, called internally before render time
	 */
	initSeries: function (options) {
		var chart = this,
			optionsChart = chart.options.chart,
			type = options.type || optionsChart.type || optionsChart.defaultSeriesType,
			series,
			Constr = seriesTypes[type];

		// No such series type
		if (!Constr) {
			H.error(17, true);
		}

		series = new Constr();
		series.init(this, options);
		return series;
	},

	/**
	 * Order all series above a given index. When series are added and ordered
	 * by configuration, only the last series is handled (#248, #1123, #2456,
	 * #6112). This function is called on series initialization and destroy.
	 *
	 * @param {number} fromIndex - If this is given, only the series above this
	 *    index are handled.
	 */
	orderSeries: function (fromIndex) {
		var series = this.series,
			i = fromIndex || 0;
		for (; i < series.length; i++) {
			if (series[i]) {
				series[i].index = i;
				series[i].name = series[i].name || 
					'Series ' + (series[i].index + 1);
			}
		}
	},

	/**
	 * Check whether a given point is within the plot area
	 *
	 * @param {Number} plotX Pixel x relative to the plot area
	 * @param {Number} plotY Pixel y relative to the plot area
	 * @param {Boolean} inverted Whether the chart is inverted
	 */
	isInsidePlot: function (plotX, plotY, inverted) {
		var x = inverted ? plotY : plotX,
			y = inverted ? plotX : plotY;

		return x >= 0 &&
			x <= this.plotWidth &&
			y >= 0 &&
			y <= this.plotHeight;
	},

	/**
	 * Redraw legend, axes or series based on updated data
	 *
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *	configuration
	 */
	redraw: function (animation) {
		var chart = this,
			axes = chart.axes,
			series = chart.series,
			pointer = chart.pointer,
			legend = chart.legend,
			redrawLegend = chart.isDirtyLegend,
			hasStackedSeries,
			hasDirtyStacks,
			hasCartesianSeries = chart.hasCartesianSeries,
			isDirtyBox = chart.isDirtyBox,
			seriesLength = series.length,
			i = seriesLength,
			serie,
			renderer = chart.renderer,
			isHiddenChart = renderer.isHidden(),
			afterRedraw = [];

		// Handle responsive rules, not only on resize (#6130)
		if (chart.setResponsive) {
			chart.setResponsive(false);
		}
			
		H.setAnimation(animation, chart);
		
		if (isHiddenChart) {
			chart.cloneRenderTo();
		}

		// Adjust title layout (reflow multiline text)
		chart.layOutTitles();

		// link stacked series
		while (i--) {
			serie = series[i];

			if (serie.options.stacking) {
				hasStackedSeries = true;

				if (serie.isDirty) {
					hasDirtyStacks = true;
					break;
				}
			}
		}
		if (hasDirtyStacks) { // mark others as dirty
			i = seriesLength;
			while (i--) {
				serie = series[i];
				if (serie.options.stacking) {
					serie.isDirty = true;
				}
			}
		}

		// Handle updated data in the series
		each(series, function (serie) {
			if (serie.isDirty) {
				if (serie.options.legendType === 'point') {
					if (serie.updateTotals) {
						serie.updateTotals();
					}
					redrawLegend = true;
				}
			}
			if (serie.isDirtyData) {
				fireEvent(serie, 'updatedData');
			}
		});

		// handle added or removed series
		if (redrawLegend && legend.options.enabled) { // series or pie points are added or removed
			// draw legend graphics
			legend.render();

			chart.isDirtyLegend = false;
		}

		// reset stacks
		if (hasStackedSeries) {
			chart.getStacks();
		}


		if (hasCartesianSeries) {
			// set axes scales
			each(axes, function (axis) {
				axis.updateNames();
				axis.setScale();
			});
		}

		chart.getMargins(); // #3098

		if (hasCartesianSeries) {
			// If one axis is dirty, all axes must be redrawn (#792, #2169)
			each(axes, function (axis) {
				if (axis.isDirty) {
					isDirtyBox = true;
				}
			});

			// redraw axes
			each(axes, function (axis) {

				// Fire 'afterSetExtremes' only if extremes are set
				var key = axis.min + ',' + axis.max;
				if (axis.extKey !== key) { // #821, #4452
					axis.extKey = key;
					afterRedraw.push(function () { // prevent a recursive call to chart.redraw() (#1119)
						fireEvent(axis, 'afterSetExtremes', extend(axis.eventArgs, axis.getExtremes())); // #747, #751
						delete axis.eventArgs;
					});
				}
				if (isDirtyBox || hasStackedSeries) {
					axis.redraw();
				}
			});
		}

		// the plot areas size has changed
		if (isDirtyBox) {
			chart.drawChartBox();
		}

		// Fire an event before redrawing series, used by the boost module to
		// clear previous series renderings.
		fireEvent(chart, 'predraw');

		// redraw affected series
		each(series, function (serie) {
			if ((isDirtyBox || serie.isDirty) && serie.visible) {
				serie.redraw();
			}
			// Set it here, otherwise we will have unlimited 'updatedData' calls
			// for a hidden series after setData(). Fixes #6012
			serie.isDirtyData = false;
		});

		// move tooltip or reset
		if (pointer) {
			pointer.reset(true);
		}

		// redraw if canvas
		renderer.draw();

		// Fire the events
		fireEvent(chart, 'redraw');
		fireEvent(chart, 'render');

		if (isHiddenChart) {
			chart.cloneRenderTo(true);
		}

		// Fire callbacks that are put on hold until after the redraw
		each(afterRedraw, function (callback) {
			callback.call();
		});
	},

	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	get: function (id) {

		var ret,
			series = this.series,
			i;

		function itemById(item) {
			return item.id === id || (item.options && item.options.id === id);
		}

		ret = 
			// Search axes
			find(this.axes, itemById) ||

			// Search series
			find(this.series, itemById);

		// Search points
		for (i = 0; !ret && i < series.length; i++) {
			ret = find(series[i].points || [], itemById);
		}

		return ret;
	},

	/**
	 * Create the Axis instances based on the config options
	 */
	getAxes: function () {
		var chart = this,
			options = this.options,
			xAxisOptions = options.xAxis = splat(options.xAxis || {}),
			yAxisOptions = options.yAxis = splat(options.yAxis || {}),
			optionsArray;

		// make sure the options are arrays and add some members
		each(xAxisOptions, function (axis, i) {
			axis.index = i;
			axis.isX = true;
		});

		each(yAxisOptions, function (axis, i) {
			axis.index = i;
		});

		// concatenate all axis options into one array
		optionsArray = xAxisOptions.concat(yAxisOptions);

		each(optionsArray, function (axisOptions) {
			new Axis(chart, axisOptions); // eslint-disable-line no-new
		});
	},


	/**
	 * Get the currently selected points from all series
	 */
	getSelectedPoints: function () {
		var points = [];
		each(this.series, function (serie) {
			points = points.concat(grep(serie.points || [], function (point) {
				return point.selected;
			}));
		});
		return points;
	},

	/**
	 * Get the currently selected series
	 */
	getSelectedSeries: function () {
		return grep(this.series, function (serie) {
			return serie.selected;
		});
	},

	/**
	 * Show the title and subtitle of the chart
	 *
	 * @param titleOptions {Object} New title options
	 * @param subtitleOptions {Object} New subtitle options
	 *
	 */
	setTitle: function (titleOptions, subtitleOptions, redraw) {
		var chart = this,
			options = chart.options,
			chartTitleOptions,
			chartSubtitleOptions;

		chartTitleOptions = options.title = merge(
			/*= if (build.classic) { =*/
			// Default styles
			{
				style: {
					color: '${palette.neutralColor80}',
					fontSize: options.isStock ? '16px' : '18px' // #2944
				}	
			},
			/*= } =*/
			options.title,
			titleOptions
		);
		chartSubtitleOptions = options.subtitle = merge(
			/*= if (build.classic) { =*/
			// Default styles
			{
				style: {
					color: '${palette.neutralColor60}'
				}	
			},
			/*= } =*/
			options.subtitle,
			subtitleOptions
		);

		// add title and subtitle
		each([
			['title', titleOptions, chartTitleOptions],
			['subtitle', subtitleOptions, chartSubtitleOptions]
		], function (arr, i) {
			var name = arr[0],
				title = chart[name],
				titleOptions = arr[1],
				chartTitleOptions = arr[2];

			if (title && titleOptions) {
				chart[name] = title = title.destroy(); // remove old
			}

			if (chartTitleOptions && chartTitleOptions.text && !title) {
				chart[name] = chart.renderer.text(
					chartTitleOptions.text,
					0,
					0,
					chartTitleOptions.useHTML
				)
				.attr({
					align: chartTitleOptions.align,
					'class': 'highcharts-' + name,
					zIndex: chartTitleOptions.zIndex || 4
				})
				.add();

				// Update methods, shortcut to Chart.setTitle
				chart[name].update = function (o) {
					chart.setTitle(!i && o, i && o);
				};

				/*= if (build.classic) { =*/
				// Presentational
				chart[name].css(chartTitleOptions.style);
				/*= } =*/
				
			}
		});
		chart.layOutTitles(redraw);
	},

	/**
	 * Lay out the chart titles and cache the full offset height for use in getMargins
	 */
	layOutTitles: function (redraw) {
		var titleOffset = 0,
			requiresDirtyBox,
			renderer = this.renderer,
			spacingBox = this.spacingBox;

		// Lay out the title and the subtitle respectively
		each(['title', 'subtitle'], function (key) {
			var title = this[key],
				titleOptions = this.options[key],
				titleSize;

			if (title) {
				/*= if (build.classic) { =*/
				titleSize = titleOptions.style.fontSize;
				/*= } =*/
				titleSize = renderer.fontMetrics(titleSize, title).b;
				
				title
					.css({ width: (titleOptions.width || spacingBox.width + titleOptions.widthAdjust) + 'px' })
					.align(extend({ 
						y: titleOffset + titleSize + (key === 'title' ? -3 : 2)
					}, titleOptions), false, 'spacingBox');

				if (!titleOptions.floating && !titleOptions.verticalAlign) {
					titleOffset = Math.ceil(titleOffset + title.getBBox().height);
				}
			}
		}, this);

		requiresDirtyBox = this.titleOffset !== titleOffset;
		this.titleOffset = titleOffset; // used in getMargins

		if (!this.isDirtyBox && requiresDirtyBox) {
			this.isDirtyBox = requiresDirtyBox;
			// Redraw if necessary (#2719, #2744)
			if (this.hasRendered && pick(redraw, true) && this.isDirtyBox) {
				this.redraw();
			}
		}
	},

	/**
	 * Get chart width and height according to options and container size
	 */
	getChartSize: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			widthOption = optionsChart.width,
			heightOption = optionsChart.height,
			renderTo = chart.renderToClone || chart.renderTo;

		// Get inner width and height
		if (!defined(widthOption)) {
			chart.containerWidth = getStyle(renderTo, 'width');
		}
		if (!defined(heightOption)) {
			chart.containerHeight = getStyle(renderTo, 'height');
		}
		
		chart.chartWidth = Math.max( // #1393
			0,
			widthOption || chart.containerWidth || 600 // #1460
		);
		chart.chartHeight = Math.max(
			0,
			heightOption || chart.containerHeight || 400
		);
	},

	/**
	 * Create a clone of the chart's renderTo div and place it outside the viewport to allow
	 * size computation on chart.render and chart.redraw
	 */
	cloneRenderTo: function (revert) {
		var clone = this.renderToClone,
			container = this.container;

		// Destroy the clone and bring the container back to the real renderTo div
		if (revert) {
			if (clone) {
				while (clone.childNodes.length) { // #5231
					this.renderTo.appendChild(clone.firstChild);
				}
				discardElement(clone);
				delete this.renderToClone;
			}

		// Set up the clone
		} else {
			if (container && container.parentNode === this.renderTo) {
				this.renderTo.removeChild(container); // do not clone this
			}
			this.renderToClone = clone = this.renderTo.cloneNode(0);
			css(clone, {
				position: 'absolute',
				top: '-9999px',
				display: 'block' // #833
			});
			if (clone.style.setProperty) { // #2631
				clone.style.setProperty('display', 'block', 'important');
			}
			doc.body.appendChild(clone);
			if (container) {
				clone.appendChild(container);
			}
		}
	},

	/**
	 * Setter for the chart class name
	 */
	setClassName: function (className) {
		this.container.className = 'highcharts-container ' + (className || '');
	},

	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	getContainer: function () {
		var chart = this,
			container,
			options = chart.options,
			optionsChart = options.chart,
			chartWidth,
			chartHeight,
			renderTo = chart.renderTo,
			indexAttrName = 'data-highcharts-chart',
			oldChartIndex,
			Ren,
			containerId = H.uniqueKey(),
			containerStyle,
			key;

		if (!renderTo) {
			chart.renderTo = renderTo = optionsChart.renderTo;
		}
		
		if (isString(renderTo)) {
			chart.renderTo = renderTo = doc.getElementById(renderTo);
		}

		// Display an error if the renderTo is wrong
		if (!renderTo) {
			H.error(13, true);
		}

		// If the container already holds a chart, destroy it. The check for hasRendered is there
		// because web pages that are saved to disk from the browser, will preserve the data-highcharts-chart
		// attribute and the SVG contents, but not an interactive chart. So in this case,
		// charts[oldChartIndex] will point to the wrong chart if any (#2609).
		oldChartIndex = pInt(attr(renderTo, indexAttrName));
		if (isNumber(oldChartIndex) && charts[oldChartIndex] && charts[oldChartIndex].hasRendered) {
			charts[oldChartIndex].destroy();
		}

		// Make a reference to the chart from the div
		attr(renderTo, indexAttrName, chart.index);

		// remove previous chart
		renderTo.innerHTML = '';

		// If the container doesn't have an offsetWidth, it has or is a child of
		// a node that has display:none. We need to temporarily move it out to a
		// visible state to determine the size, else the legend and tooltips
		// won't render properly. The skipClone option is used in sparklines as
		// a micro optimization, saving about 1-2 ms each chart.
		if (!optionsChart.skipClone && !renderTo.offsetWidth) {
			chart.cloneRenderTo();
		}

		// get the width and height
		chart.getChartSize();
		chartWidth = chart.chartWidth;
		chartHeight = chart.chartHeight;

		// Create the inner container
		/*= if (build.classic) { =*/
		containerStyle = extend({
			position: 'relative',
			overflow: 'hidden', // needed for context menu (avoid scrollbars) and
				// content overflow in IE
			width: chartWidth + 'px',
			height: chartHeight + 'px',
			textAlign: 'left',
			lineHeight: 'normal', // #427
			zIndex: 0, // #1072
			'-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
		}, optionsChart.style);
		/*= } =*/
		chart.container = container = createElement(
			'div',
			{
				id: containerId
			},
			containerStyle,
			chart.renderToClone || renderTo
		);

		// cache the cursor (#1650)
		chart._cursor = container.style.cursor;

		// Initialize the renderer
		Ren = H[optionsChart.renderer] || Renderer;
		chart.renderer = new Ren(
			container,
			chartWidth,
			chartHeight,
			null,
			optionsChart.forExport,
			options.exporting && options.exporting.allowHTML
		);


		chart.setClassName(optionsChart.className);
		/*= if (build.classic) { =*/
		chart.renderer.setStyle(optionsChart.style);
		/*= } else { =*/
		// Initialize definitions
		for (key in options.defs) {
			this.renderer.definition(options.defs[key]);
		}
		/*= } =*/		

		// Add a reference to the charts index
		chart.renderer.chartIndex = chart.index;
	},

	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be
	 * moved into their final positions
	 */
	getMargins: function (skipAxes) {
		var chart = this,
			spacing = chart.spacing,
			margin = chart.margin,
			titleOffset = chart.titleOffset;

		chart.resetMargins();

		// Adjust for title and subtitle
		if (titleOffset && !defined(margin[0])) {
			chart.plotTop = Math.max(chart.plotTop, titleOffset + chart.options.title.margin + spacing[0]);
		}

		// Adjust for legend
		if (chart.legend.display) {
			chart.legend.adjustMargins(margin, spacing);
		}

		// adjust for scroller
		if (chart.extraMargin) {
			chart[chart.extraMargin.type] = (chart[chart.extraMargin.type] || 0) + chart.extraMargin.value;
		}
		if (chart.extraTopMargin) {
			chart.plotTop += chart.extraTopMargin;
		}
		if (!skipAxes) {
			this.getAxisMargins();
		}
	},

	getAxisMargins: function () {

		var chart = this,
			axisOffset = chart.axisOffset = [0, 0, 0, 0], // top, right, bottom, left
			margin = chart.margin;

		// pre-render axes to get labels offset width
		if (chart.hasCartesianSeries) {
			each(chart.axes, function (axis) {
				if (axis.visible) {
					axis.getOffset();
				}
			});
		}

		// Add the axis offsets
		each(marginNames, function (m, side) {
			if (!defined(margin[side])) {
				chart[m] += axisOffset[side];
			}
		});

		chart.setChartSize();

	},

	/**
	 * Resize the chart to its container if size is not explicitly set
	 */
	reflow: function (e) {
		var chart = this,
			optionsChart = chart.options.chart,
			renderTo = chart.renderTo,
			hasUserWidth = defined(optionsChart.width),
			width = optionsChart.width || getStyle(renderTo, 'width'),
			height = optionsChart.height || getStyle(renderTo, 'height'),
			target = e ? e.target : win;

		// Width and height checks for display:none. Target is doc in IE8 and Opera,
		// win in Firefox, Chrome and IE9.
		if (!hasUserWidth && !chart.isPrinting && width && height && (target === win || target === doc)) { // #1093
			if (width !== chart.containerWidth || height !== chart.containerHeight) {
				clearTimeout(chart.reflowTimeout);
				// When called from window.resize, e is set, else it's called directly (#2224)
				chart.reflowTimeout = syncTimeout(function () {
					if (chart.container) { // It may have been destroyed in the meantime (#1257)
						chart.setSize(undefined, undefined, false);
					}
				}, e ? 100 : 0);
			}
			chart.containerWidth = width;
			chart.containerHeight = height;
		}
	},

	/**
	 * Add the event handlers necessary for auto resizing
	 */
	initReflow: function () {
		var chart = this,
			unbind;
		
		unbind = addEvent(win, 'resize', function (e) {
			chart.reflow(e);
		});
		addEvent(chart, 'destroy', unbind);

		// The following will add listeners to re-fit the chart before and after
		// printing (#2284). However it only works in WebKit. Should have worked
		// in Firefox, but not supported in IE.
		/*
		if (win.matchMedia) {
			win.matchMedia('print').addListener(function reflow() {
				chart.reflow();
			});
		}
		*/
	},

	/**
	 * Resize the chart to a given width and height
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object|Boolean} animation
	 */
	setSize: function (width, height, animation) {
		var chart = this,
			renderer = chart.renderer,
			globalAnimation;

		// Handle the isResizing counter
		chart.isResizing += 1;
		
		// set the animation for the current process
		H.setAnimation(animation, chart);

		chart.oldChartHeight = chart.chartHeight;
		chart.oldChartWidth = chart.chartWidth;
		if (width !== undefined) {
			chart.options.chart.width = width;
		}
		if (height !== undefined) {
			chart.options.chart.height = height;
		}
		chart.getChartSize();

		// Resize the container with the global animation applied if enabled (#2503)
		/*= if (build.classic) { =*/
		globalAnimation = renderer.globalAnimation;
		(globalAnimation ? animate : css)(chart.container, {
			width: chart.chartWidth + 'px',
			height: chart.chartHeight + 'px'
		}, globalAnimation);
		/*= } =*/

		chart.setChartSize(true);
		renderer.setSize(chart.chartWidth, chart.chartHeight, animation);

		// handle axes
		each(chart.axes, function (axis) {
			axis.isDirty = true;
			axis.setScale();
		});

		chart.isDirtyLegend = true; // force legend redraw
		chart.isDirtyBox = true; // force redraw of plot and chart border

		chart.layOutTitles(); // #2857
		chart.getMargins();

		chart.redraw(animation);


		chart.oldChartHeight = null;
		fireEvent(chart, 'resize');

		// Fire endResize and set isResizing back. If animation is disabled, fire without delay
		syncTimeout(function () {
			if (chart) {
				fireEvent(chart, 'endResize', null, function () {
					chart.isResizing -= 1;
				});
			}
		}, animObject(globalAnimation).duration);
	},

	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	setChartSize: function (skipAxes) {
		var chart = this,
			inverted = chart.inverted,
			renderer = chart.renderer,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			optionsChart = chart.options.chart,
			spacing = chart.spacing,
			clipOffset = chart.clipOffset,
			clipX,
			clipY,
			plotLeft,
			plotTop,
			plotWidth,
			plotHeight,
			plotBorderWidth;

		chart.plotLeft = plotLeft = Math.round(chart.plotLeft);
		chart.plotTop = plotTop = Math.round(chart.plotTop);
		chart.plotWidth = plotWidth = Math.max(0, Math.round(chartWidth - plotLeft - chart.marginRight));
		chart.plotHeight = plotHeight = Math.max(0, Math.round(chartHeight - plotTop - chart.marginBottom));

		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;

		chart.plotBorderWidth = optionsChart.plotBorderWidth || 0;

		// Set boxes used for alignment
		chart.spacingBox = renderer.spacingBox = {
			x: spacing[3],
			y: spacing[0],
			width: chartWidth - spacing[3] - spacing[1],
			height: chartHeight - spacing[0] - spacing[2]
		};
		chart.plotBox = renderer.plotBox = {
			x: plotLeft,
			y: plotTop,
			width: plotWidth,
			height: plotHeight
		};

		plotBorderWidth = 2 * Math.floor(chart.plotBorderWidth / 2);
		clipX = Math.ceil(Math.max(plotBorderWidth, clipOffset[3]) / 2);
		clipY = Math.ceil(Math.max(plotBorderWidth, clipOffset[0]) / 2);
		chart.clipBox = {
			x: clipX, 
			y: clipY, 
			width: Math.floor(chart.plotSizeX - Math.max(plotBorderWidth, clipOffset[1]) / 2 - clipX), 
			height: Math.max(0, Math.floor(chart.plotSizeY - Math.max(plotBorderWidth, clipOffset[2]) / 2 - clipY))
		};

		if (!skipAxes) {
			each(chart.axes, function (axis) {
				axis.setAxisSize();
				axis.setAxisTranslation();
			});
		}
	},

	/**
	 * Initial margins before auto size margins are applied
	 */
	resetMargins: function () {
		var chart = this,
			chartOptions = chart.options.chart;

		// Create margin and spacing array
		each(['margin', 'spacing'], function splashArrays(target) {
			var value = chartOptions[target],
				values = isObject(value) ? value : [value, value, value, value];

			each(['Top', 'Right', 'Bottom', 'Left'], function (sideName, side) {
				chart[target][side] = pick(chartOptions[target + sideName], values[side]);	
			});
		});

		// Set margin names like chart.plotTop, chart.plotLeft, chart.marginRight, chart.marginBottom.
		each(marginNames, function (m, side) {
			chart[m] = pick(chart.margin[side], chart.spacing[side]);
		});
		chart.axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
		chart.clipOffset = [0, 0, 0, 0];
	},

	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	drawChartBox: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			renderer = chart.renderer,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			chartBackground = chart.chartBackground,
			plotBackground = chart.plotBackground,
			plotBorder = chart.plotBorder,
			chartBorderWidth,
			/*= if (build.classic) { =*/
			plotBGImage = chart.plotBGImage,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			/*= } =*/
			mgn,
			bgAttr,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			plotBox = chart.plotBox,
			clipRect = chart.clipRect,
			clipBox = chart.clipBox,
			verb = 'animate';

		// Chart area
		if (!chartBackground) {
			chart.chartBackground = chartBackground = renderer.rect()
				.addClass('highcharts-background')
				.add();
			verb = 'attr';
		}

		/*= if (build.classic) { =*/
		// Presentational
		chartBorderWidth = optionsChart.borderWidth || 0;
		mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

		bgAttr = {
			fill: chartBackgroundColor || 'none'
		};

		if (chartBorderWidth || chartBackground['stroke-width']) { // #980
			bgAttr.stroke = optionsChart.borderColor;
			bgAttr['stroke-width'] = chartBorderWidth;
		}
		chartBackground
			.attr(bgAttr)
			.shadow(optionsChart.shadow);
		/*= } else { =*/
		chartBorderWidth = mgn = chartBackground.strokeWidth();
		/*= } =*/
		chartBackground[verb]({
			x: mgn / 2,
			y: mgn / 2,
			width: chartWidth - mgn - chartBorderWidth % 2,
			height: chartHeight - mgn - chartBorderWidth % 2,
			r: optionsChart.borderRadius
		});

		// Plot background
		verb = 'animate';
		if (!plotBackground) {
			verb = 'attr';
			chart.plotBackground = plotBackground = renderer.rect()
				.addClass('highcharts-plot-background')
				.add();
		}
		plotBackground[verb](plotBox);

		/*= if (build.classic) { =*/
		// Presentational attributes for the background
		plotBackground
			.attr({
				fill: plotBackgroundColor || 'none'
			})
			.shadow(optionsChart.plotShadow);
		
		// Create the background image
		if (plotBackgroundImage) {
			if (!plotBGImage) {
				chart.plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
					.add();
			} else {
				plotBGImage.animate(plotBox);
			}
		}
		/*= } =*/
		
		// Plot clip
		if (!clipRect) {
			chart.clipRect = renderer.clipRect(clipBox);
		} else {
			clipRect.animate({
				width: clipBox.width,
				height: clipBox.height
			});
		}

		// Plot area border
		verb = 'animate';
		if (!plotBorder) {
			verb = 'attr';
			chart.plotBorder = plotBorder = renderer.rect()
				.addClass('highcharts-plot-border')
				.attr({
					zIndex: 1 // Above the grid
				})
				.add();
		}

		/*= if (build.classic) { =*/
		// Presentational
		plotBorder.attr({
			stroke: optionsChart.plotBorderColor,
			'stroke-width': optionsChart.plotBorderWidth || 0,
			fill: 'none'
		});
		/*= } =*/

		plotBorder[verb](plotBorder.crisp({
			x: plotLeft,
			y: plotTop,
			width: plotWidth,
			height: plotHeight
		}, -plotBorder.strokeWidth())); //#3282 plotBorder should be negative;

		// reset
		chart.isDirtyBox = false;
	},

	/**
	 * Detect whether a certain chart property is needed based on inspecting its options
	 * and series. This mainly applies to the chart.inverted property, and in extensions to
	 * the chart.angular and chart.polar properties.
	 */
	propFromSeries: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			klass,
			seriesOptions = chart.options.series,
			i,
			value;


		each(['inverted', 'angular', 'polar'], function (key) {

			// The default series type's class
			klass = seriesTypes[optionsChart.type || optionsChart.defaultSeriesType];

			// Get the value from available chart-wide properties
			value = 
				optionsChart[key] || // It is set in the options
				(klass && klass.prototype[key]); // The default series class requires it

			// 4. Check if any the chart's series require it
			i = seriesOptions && seriesOptions.length;
			while (!value && i--) {
				klass = seriesTypes[seriesOptions[i].type];
				if (klass && klass.prototype[key]) {
					value = true;
				}
			}

			// Set the chart property
			chart[key] = value;
		});

	},

	/**
	 * Link two or more series together. This is done initially from Chart.render,
	 * and after Chart.addSeries and Series.remove.
	 */
	linkSeries: function () {
		var chart = this,
			chartSeries = chart.series;

		// Reset links
		each(chartSeries, function (series) {
			series.linkedSeries.length = 0;
		});

		// Apply new links
		each(chartSeries, function (series) {
			var linkedTo = series.options.linkedTo;
			if (isString(linkedTo)) {
				if (linkedTo === ':previous') {
					linkedTo = chart.series[series.index - 1];
				} else {
					linkedTo = chart.get(linkedTo);
				}
				if (linkedTo && linkedTo.linkedParent !== series) { // #3341 avoid mutual linking
					linkedTo.linkedSeries.push(series);
					series.linkedParent = linkedTo;
					series.visible = pick(series.options.visible, linkedTo.options.visible, series.visible); // #3879
				}
			}
		});
	},

	/**
	 * Render series for the chart
	 */
	renderSeries: function () {
		each(this.series, function (serie) {
			serie.translate();
			serie.render();
		});
	},

	/**
	 * Render labels for the chart
	 */
	renderLabels: function () {
		var chart = this,
			labels = chart.options.labels;
		if (labels.items) {
			each(labels.items, function (label) {
				var style = extend(labels.style, label.style),
					x = pInt(style.left) + chart.plotLeft,
					y = pInt(style.top) + chart.plotTop + 12;

				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;

				chart.renderer.text(
					label.html,
					x,
					y
				)
				.attr({ zIndex: 2 })
				.css(style)
				.add();

			});
		}
	},

	/**
	 * Render all graphics for the chart
	 */
	render: function () {
		var chart = this,
			axes = chart.axes,
			renderer = chart.renderer,
			options = chart.options,
			tempWidth,
			tempHeight,
			redoHorizontal,
			redoVertical;

		// Title
		chart.setTitle();


		// Legend
		chart.legend = new Legend(chart, options.legend);

		// Get stacks
		if (chart.getStacks) {
			chart.getStacks();
		}

		// Get chart margins
		chart.getMargins(true);
		chart.setChartSize();

		// Record preliminary dimensions for later comparison
		tempWidth = chart.plotWidth;
		tempHeight = chart.plotHeight = chart.plotHeight - 21; // 21 is the most common correction for X axis labels

		// Get margins by pre-rendering axes
		each(axes, function (axis) {
			axis.setScale();
		});
		chart.getAxisMargins();

		// If the plot area size has changed significantly, calculate tick positions again
		redoHorizontal = tempWidth / chart.plotWidth > 1.1;
		redoVertical = tempHeight / chart.plotHeight > 1.05; // Height is more sensitive

		if (redoHorizontal || redoVertical) {

			each(axes, function (axis) {
				if ((axis.horiz && redoHorizontal) || (!axis.horiz && redoVertical)) {
					axis.setTickInterval(true); // update to reflect the new margins
				}
			});
			chart.getMargins(); // second pass to check for new labels
		}

		// Draw the borders and backgrounds
		chart.drawChartBox();


		// Axes
		if (chart.hasCartesianSeries) {
			each(axes, function (axis) {
				if (axis.visible) {
					axis.render();
				}
			});
		}

		// The series
		if (!chart.seriesGroup) {
			chart.seriesGroup = renderer.g('series-group')
				.attr({ zIndex: 3 })
				.add();
		}
		chart.renderSeries();

		// Labels
		chart.renderLabels();

		// Credits
		chart.addCredits();

		// Handle responsiveness
		if (chart.setResponsive) {
			chart.setResponsive();
		}

		// Set flag
		chart.hasRendered = true;

	},

	/**
	 * Show chart credits based on config options
	 */
	addCredits: function (credits) {
		var chart = this;

		credits = merge(true, this.options.credits, credits);
		if (credits.enabled && !this.credits) {
			this.credits = this.renderer.text(
				credits.text + (this.mapCredits || ''),
				0,
				0
			)
			.addClass('highcharts-credits')
			.on('click', function () {
				if (credits.href) {
					win.location.href = credits.href;
				}
			})
			.attr({
				align: credits.position.align,
				zIndex: 8
			})
			/*= if (build.classic) { =*/
			.css(credits.style)
			/*= } =*/
			.add()
			.align(credits.position);

			// Dynamically update
			this.credits.update = function (options) {
				chart.credits = chart.credits.destroy();
				chart.addCredits(options);
			};
		}
	},

	/**
	 * Clean up memory usage
	 */
	destroy: function () {
		var chart = this,
			axes = chart.axes,
			series = chart.series,
			container = chart.container,
			i,
			parentNode = container && container.parentNode;

		// fire the chart.destoy event
		fireEvent(chart, 'destroy');

		// Delete the chart from charts lookup array
		charts[chart.index] = undefined;
		H.chartCount--;
		chart.renderTo.removeAttribute('data-highcharts-chart');

		// remove events
		removeEvent(chart);

		// ==== Destroy collections:
		// Destroy axes
		i = axes.length;
		while (i--) {
			axes[i] = axes[i].destroy();
		}
		
		// Destroy scroller & scroller series before destroying base series
		if (this.scroller && this.scroller.destroy) {
			this.scroller.destroy();
		}

		// Destroy each series
		i = series.length;
		while (i--) {
			series[i] = series[i].destroy();
		}

		// ==== Destroy chart properties:
		each([
			'title', 'subtitle', 'chartBackground', 'plotBackground',
			'plotBGImage', 'plotBorder', 'seriesGroup', 'clipRect', 'credits',
			'pointer', 'rangeSelector', 'legend', 'resetZoomButton', 'tooltip',
			'renderer'
		], function (name) {
			var prop = chart[name];

			if (prop && prop.destroy) {
				chart[name] = prop.destroy();
			}
		});

		// remove container and all SVG
		if (container) { // can break in IE when destroyed before finished loading
			container.innerHTML = '';
			removeEvent(container);
			if (parentNode) {
				discardElement(container);
			}

		}

		// clean it all up
		for (i in chart) {
			delete chart[i];
		}

	},


	/**
	 * VML namespaces can't be added until after complete. Listening
	 * for Perini's doScroll hack is not enough.
	 */
	isReadyToRender: function () {
		var chart = this;

		// Note: win == win.top is required
		if ((!svg && (win == win.top && doc.readyState !== 'complete'))) { // eslint-disable-line eqeqeq
			doc.attachEvent('onreadystatechange', function () {
				doc.detachEvent('onreadystatechange', chart.firstRender);
				if (doc.readyState === 'complete') {
					chart.firstRender();
				}
			});
			return false;
		}
		return true;
	},

	/**
	 * Prepare for first rendering after all data are loaded
	 */
	firstRender: function () {
		var chart = this,
			options = chart.options;

		// Check whether the chart is ready to render
		if (!chart.isReadyToRender()) {
			return;
		}

		// Create the container
		chart.getContainer();

		// Run an early event after the container and renderer are established
		fireEvent(chart, 'init');


		chart.resetMargins();
		chart.setChartSize();

		// Set the common chart properties (mainly invert) from the given series
		chart.propFromSeries();

		// get axes
		chart.getAxes();

		// Initialize the series
		each(options.series || [], function (serieOptions) {
			chart.initSeries(serieOptions);
		});

		chart.linkSeries();

		// Run an event after axes and series are initialized, but before render. At this stage,
		// the series data is indexed and cached in the xData and yData arrays, so we can access
		// those before rendering. Used in Highstock.
		fireEvent(chart, 'beforeRender');

		// depends on inverted and on margins being set
		if (Pointer) {
			chart.pointer = new Pointer(chart, options);
		}

		chart.render();

		// Fire the load event if there are no external images
		if (!chart.renderer.imgCount && chart.onload) {
			chart.onload();
		}

		// If the chart was rendered outside the top container, put it back in (#3679)
		chart.cloneRenderTo(true);

	},

	/** 
	 * On chart load
	 */
	onload: function () {

		// Run callbacks
		each([this.callback].concat(this.callbacks), function (fn) {
			if (fn && this.index !== undefined) { // Chart destroyed in its own callback (#3600)
				fn.apply(this, [this]);
			}
		}, this);

		fireEvent(this, 'load');
		fireEvent(this, 'render');
		

		// Set up auto resize, check for not destroyed (#6068)
		if (defined(this.index) && this.options.chart.reflow !== false) {
			this.initReflow();
		}

		// Don't run again
		this.onload = null;
	}

}; // end Chart
