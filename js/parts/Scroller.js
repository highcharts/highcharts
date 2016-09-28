/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Color.js';
import './Axis.js';
import './Chart.js';
import './Series.js';
import './Options.js';
import './Scrollbar.js';
/* ****************************************************************************
 * Start Navigator code														*
 *****************************************************************************/
var addEvent = H.addEvent,
	Axis = H.Axis,
	Chart = H.Chart,
	color = H.color,
	defaultDataGroupingUnits = H.defaultDataGroupingUnits,
	defaultOptions = H.defaultOptions,
	defined = H.defined,
	destroyObjectProperties = H.destroyObjectProperties,
	doc = H.doc,
	each = H.each,
	erase = H.erase,
	error = H.error,
	extend = H.extend,
	grep = H.grep,
	hasTouch = H.hasTouch,
	isNumber = H.isNumber,
	isObject = H.isObject,
	isTouchDevice = H.isTouchDevice,
	merge = H.merge,
	pick = H.pick,
	removeEvent = H.removeEvent,
	Scrollbar = H.Scrollbar,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	wrap = H.wrap,

	units = [].concat(defaultDataGroupingUnits), // copy
	defaultSeriesType,

	// Finding the min or max of a set of variables where we don't know if they are defined,
	// is a pattern that is repeated several places in Highcharts. Consider making this
	// a global utility method.
	numExt = function (extreme) {
		var numbers = grep(arguments, isNumber);
		if (numbers.length) {
			return Math[extreme].apply(0, numbers);
		}
	};

// add more resolution to units
units[4] = ['day', [1, 2, 3, 4]]; // allow more days
units[5] = ['week', [1, 2, 3]]; // allow more weeks

defaultSeriesType = seriesTypes.areaspline === undefined ? 'line' : 'areaspline';

extend(defaultOptions, {
	navigator: {
		//enabled: true,
		height: 40,
		margin: 25,
		maskInside: true,
		/*= if (build.classic) { =*/
		handles: {
			backgroundColor: '${palette.neutralColor5}',
			borderColor: '${palette.neutralColor40}'
		},
		maskFill: color('${palette.highlightColor60}').setOpacity(0.3).get(),
		outlineColor: '${palette.neutralColor20}',
		outlineWidth: 1,
		/*= } =*/
		series: {
			type: defaultSeriesType,
			/*= if (build.classic) { =*/
			color: '${palette.highlightColor80}',
			fillOpacity: 0.05,
			lineWidth: 1,
			/*= } =*/
			compare: null,
			dataGrouping: {
				approximation: 'average',
				enabled: true,
				groupPixelWidth: 2,
				smoothed: true,
				units: units
			},
			dataLabels: {
				enabled: false,
				zIndex: 2 // #1839
			},
			id: 'highcharts-navigator-series',
			className: 'highcharts-navigator-series',
			lineColor: null, // Allow color setting while disallowing default candlestick setting (#4602)
			marker: {
				enabled: false
			},
			pointRange: 0,
			shadow: false,
			threshold: null
		},
		//top: undefined,
		xAxis: {
			className: 'highcharts-navigator-xaxis',
			tickLength: 0,
			/*= if (build.classic) { =*/
			lineWidth: 0,
			gridLineColor: '${palette.neutralColor10}',
			gridLineWidth: 1,
			/*= } =*/
			tickPixelInterval: 200,
			labels: {
				align: 'left',
				/*= if (build.classic) { =*/
				style: {
					color: '${palette.neutralColor40}'
				},
				/*= } =*/
				x: 3,
				y: -4
			},
			crosshair: false
		},
		yAxis: {
			className: 'highcharts-navigator-yaxis',
			/*= if (build.classic) { =*/
			gridLineWidth: 0,
			/*= } =*/
			startOnTick: false,
			endOnTick: false,
			minPadding: 0.1,
			maxPadding: 0.1,
			labels: {
				enabled: false
			},
			crosshair: false,
			title: {
				text: null
			},
			tickLength: 0,
			tickWidth: 0
		}
	}
});

/**
 * The Navigator class
 * @param {Object} chart
 */
function Navigator(chart) {
	this.init(chart);
}

Navigator.prototype = {
	/**
	 * Draw one of the handles on the side of the zoomed range in the navigator
	 * @param {Number} x The x center for the handle
	 * @param {Number} index 0 for left and 1 for right
	 */
	drawHandle: function (x, index) {
		var scroller = this,
			chart = scroller.chart,
			renderer = chart.renderer,
			handles = scroller.handles;

		// create the elements
		if (!scroller.rendered) {

			handles[index] = renderer
				.path([
					'M',
					-4.5, 0.5,
					'L',
					3.5, 0.5,
					3.5, 15.5,
					-4.5, 15.5,
					-4.5, 0.5,
					'M',
					-1.5, 4,
					'L',
					-1.5, 12,
					'M',
					0.5, 4,
					'L',
					0.5, 12
				])
				.attr({ zIndex: 10 - index }) // zIndex = 3 for right handle, 4 for left / 10 - #2908
				.addClass('highcharts-navigator-handle highcharts-navigator-handle-' + ['left', 'right'][index])
				.add();

			/*= if (build.classic) { =*/
			var handlesOptions = scroller.navigatorOptions.handles;
			handles[index].attr({
					fill: handlesOptions.backgroundColor,
					stroke: handlesOptions.borderColor,
					'stroke-width': 1
				})
				.css({ cursor: 'ew-resize' });
			/*= } =*/
		}

		// Place it
		handles[index][scroller.rendered && !scroller.hasDragged ? 'animate' : 'attr']({
			translateX: scroller.scrollerLeft + scroller.scrollbarHeight + parseInt(x, 10),
			translateY: scroller.top + scroller.height / 2 - 8
		});
	},

	/**
	 * Update navigator
	 * @param {Object} options Options to merge in when updating navigator
	 */
	update: function (options) {
		this.destroy();
		var chartOptions = this.chart.options;
		merge(true, chartOptions.navigator, this.options, options);
		this.init(this.chart);
	},

	/**
	 * Render the navigator
	 * @param {Number} min X axis value minimum
	 * @param {Number} max X axis value maximum
	 * @param {Number} pxMin Pixel value minimum
	 * @param {Number} pxMax Pixel value maximum
	 */
	render: function (min, max, pxMin, pxMax) {
		var scroller = this,
			chart = scroller.chart,
			renderer = chart.renderer,
			navigatorLeft,
			navigatorWidth,
			scrollerLeft,
			scrollerWidth,
			navigatorGroup = scroller.navigatorGroup,
			scrollbarHeight = scroller.scrollbarHeight,
			xAxis = scroller.xAxis,
			navigatorOptions = scroller.navigatorOptions,
			maskInside = navigatorOptions.maskInside,
			height = scroller.height,
			top = scroller.top,
			navigatorEnabled = scroller.navigatorEnabled,
			outlineWidth,
			halfOutline,
			zoomedMin,
			zoomedMax,
			outlineHeight = scroller.outlineHeight,
			outlineTop,
			rendered = scroller.rendered,
			verb;

		// Don't render the navigator until we have data (#486, #4202, #5172). Don't redraw while moving the handles (#4703).
		if (!isNumber(min) || !isNumber(max) ||	(scroller.hasDragged && !defined(pxMin))) {
			return;
		}

		scroller.navigatorLeft = navigatorLeft = pick(
			xAxis.left,
			chart.plotLeft + scrollbarHeight // in case of scrollbar only, without navigator
		);
		scroller.navigatorWidth = navigatorWidth = pick(xAxis.len, chart.plotWidth - 2 * scrollbarHeight);
		scroller.scrollerLeft = scrollerLeft = navigatorLeft - scrollbarHeight;
		scroller.scrollerWidth = scrollerWidth = scrollerWidth = navigatorWidth + 2 * scrollbarHeight;

		// Get the pixel position of the handles
		pxMin = pick(pxMin, xAxis.translate(min));
		pxMax = pick(pxMax, xAxis.translate(max));
		if (!isNumber(pxMin) || Math.abs(pxMin) === Infinity) { // Verify (#1851, #2238)
			pxMin = 0;
			pxMax = scrollerWidth;
		}

		// Are we below the minRange? (#2618)
		if (xAxis.translate(pxMax, true) - xAxis.translate(pxMin, true) < chart.xAxis[0].minRange) {
			return;
		}


		// handles are allowed to cross, but never exceed the plot area
		scroller.zoomedMax = Math.min(Math.max(pxMin, pxMax, 0), navigatorWidth);
		scroller.zoomedMin = Math.min(Math.max(scroller.fixedWidth ? scroller.zoomedMax - scroller.fixedWidth : Math.min(pxMin, pxMax), 0), navigatorWidth);
		scroller.range = scroller.zoomedMax - scroller.zoomedMin;
		zoomedMax = Math.round(scroller.zoomedMax);
		zoomedMin = Math.round(scroller.zoomedMin);

		if (!rendered) {

			if (navigatorEnabled) {

				// draw the navigator group
				scroller.navigatorGroup = navigatorGroup = renderer.g('navigator')
					.attr({
						zIndex: 3
					})
					.add();

				scroller.leftShade = renderer.rect()
					.addClass('highcharts-navigator-mask' + (maskInside ? '-inside' : ''))
					/*= if (build.classic) { =*/
					.attr({
						fill: navigatorOptions.maskFill
					})
					.css(maskInside && { cursor: 'ew-resize' })
					/*= } =*/
					.add(navigatorGroup);

				if (!maskInside) {
					scroller.rightShade = renderer.rect()
						.addClass('highcharts-navigator-mask')
						/*= if (build.classic) { =*/
						.attr({
							fill: navigatorOptions.maskFill
						})
						/*= } =*/
						.add(navigatorGroup);
				}


				scroller.outline = renderer.path()
					.addClass('highcharts-navigator-outline')
					/*= if (build.classic) { =*/
					.attr({
						'stroke-width': navigatorOptions.outlineWidth,
						stroke: navigatorOptions.outlineColor
					})
					/*= } =*/
					.add(navigatorGroup);
			}
		}

		// place elements
		if (navigatorEnabled) {
			verb = rendered && !scroller.hasDragged ? 'animate' : 'attr';
			outlineWidth = scroller.outline.strokeWidth();
			halfOutline = outlineWidth / 2;
			outlineTop = top + halfOutline;
			
			scroller.leftShade[verb](navigatorOptions.maskInside ? {
				x: navigatorLeft + zoomedMin,
				y: top,
				width: zoomedMax - zoomedMin,
				height: height
			} : {
				x: navigatorLeft,
				y: top,
				width: zoomedMin,
				height: height
			});
			if (scroller.rightShade) {
				scroller.rightShade[verb]({
					x: navigatorLeft + zoomedMax,
					y: top,
					width: navigatorWidth - zoomedMax,
					height: height
				});
			}

			scroller.outline[verb]({ d: [
				'M',
				scrollerLeft, outlineTop, // left
				'L',
				navigatorLeft + zoomedMin - halfOutline, outlineTop, // upper left of zoomed range
				navigatorLeft + zoomedMin - halfOutline, outlineTop + outlineHeight, // lower left of z.r.
				'L',
				navigatorLeft + zoomedMax - halfOutline, outlineTop + outlineHeight, // lower right of z.r.
				'L',
				navigatorLeft + zoomedMax - halfOutline, outlineTop, // upper right of z.r.
				scrollerLeft + scrollerWidth, outlineTop // right
			].concat(navigatorOptions.maskInside ? [
				'M',
				navigatorLeft + zoomedMin + halfOutline, outlineTop, // upper left of zoomed range
				'L',
				navigatorLeft + zoomedMax - halfOutline, outlineTop // upper right of z.r.
			] : []) });
			// draw handles
			scroller.drawHandle(zoomedMin + halfOutline, 0);
			scroller.drawHandle(zoomedMax + halfOutline, 1);
		}

		if (scroller.scrollbar) {

			scroller.scrollbar.hasDragged = scroller.hasDragged;
				
			// Keep scale 0-1
			scroller.scrollbar.position(
				scroller.scrollerLeft,
				scroller.top + (navigatorEnabled ? scroller.height : -scroller.scrollbarHeight),
				scroller.scrollerWidth,
				scroller.scrollbarHeight
			);
			scroller.scrollbar.setRange(
				zoomedMin / navigatorWidth,
				zoomedMax / navigatorWidth
			);
		}
		scroller.rendered = true;
	},

	/**
	 * Set up the mouse and touch events for the navigator
	 */
	addEvents: function () {
		var chart = this.chart,
			container = chart.container,
			mouseDownHandler = this.mouseDownHandler,
			mouseMoveHandler = this.mouseMoveHandler,
			mouseUpHandler = this.mouseUpHandler,
			_events;

		// Mouse events
		_events = [
			[container, 'mousedown', mouseDownHandler],
			[container, 'mousemove', mouseMoveHandler],
			[doc, 'mouseup', mouseUpHandler]
		];

		// Touch events
		if (hasTouch) {
			_events.push(
				[container, 'touchstart', mouseDownHandler],
				[container, 'touchmove', mouseMoveHandler],
				[doc, 'touchend', mouseUpHandler]
			);
		}

		// Add them all
		each(_events, function (args) {
			addEvent.apply(null, args);
		});
		this._events = _events;

		// Data events
		if (this.series && this.series[0]) {
			addEvent(this.series[0].xAxis, 'foundExtremes', function () {
				chart.scroller.modifyNavigatorAxisExtremes();
			});
		}

		addEvent(chart, 'redraw', function () {
			// Move the scrollbar after redraw, like after data updata even if axes don't redraw
			var scroller = this.scroller,
				xAxis = scroller && scroller.baseSeries && scroller.baseSeries[0] && scroller.baseSeries[0].xAxis;
			
			if (xAxis) {
				scroller.render(xAxis.min, xAxis.max);
			}
		});
	},

	/**
	 * Removes the event handlers attached previously with addEvents.
	 */
	removeEvents: function () {
		if (this._events) {
			each(this._events, function (args) {
				removeEvent.apply(null, args);
			});
			this._events = undefined;
		}
		this.removeBaseSeriesEvents();
	},

	removeBaseSeriesEvents: function () {
		var baseSeries = this.baseSeries || [];
		if (this.navigatorEnabled && baseSeries[0] && this.navigatorOptions.adaptToUpdatedData !== false) {
			each(baseSeries, function (series) {
				removeEvent(series, 'updatedData', this.updatedDataHandler);	
			}, this);

			// We only listen for extremes-events on the first baseSeries
			if (baseSeries[0].xAxis) {
				removeEvent(baseSeries[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes);
			}
		}
	},

	/**
	 * Initiate the Navigator object
	 */
	init: function (chart) {
		var chartOptions = chart.options,
			navigatorOptions = chartOptions.navigator,
			navigatorEnabled = navigatorOptions.enabled,
			scrollbarOptions = chartOptions.scrollbar,
			scrollbarEnabled = scrollbarOptions.enabled,
			height = navigatorEnabled ? navigatorOptions.height : 0,
			scrollbarHeight = scrollbarEnabled ? scrollbarOptions.height : 0;

		this.handles = [];
		this.scrollbarButtons = [];
		this.elementsToDestroy = []; // Array containing the elements to destroy when Scroller is destroyed

		this.chart = chart;
		this.setBaseSeries();

		this.height = height;
		this.scrollbarHeight = scrollbarHeight;
		this.scrollbarEnabled = scrollbarEnabled;
		this.navigatorEnabled = navigatorEnabled;
		this.navigatorOptions = navigatorOptions;
		this.scrollbarOptions = scrollbarOptions;
		this.outlineHeight = height + scrollbarHeight;

		var scroller = this,
			xAxis,
			dragOffset,
			baseSeries = scroller.baseSeries;
		
		/**
		 * Event handler for the mouse down event.
		 */
		scroller.mouseDownHandler = function (e) {
			e = chart.pointer.normalize(e);

			var zoomedMin = scroller.zoomedMin,
				zoomedMax = scroller.zoomedMax,
				top = scroller.top,
				scrollerLeft = scroller.scrollerLeft,
				scrollerWidth = scroller.scrollerWidth,
				navigatorLeft = scroller.navigatorLeft,
				navigatorWidth = scroller.navigatorWidth,
				scrollbarPad = scroller.scrollbarPad || 0,
				range = scroller.range,
				chartX = e.chartX,
				chartY = e.chartY,
				baseXAxis = chart.xAxis[0],
				fixedMax,
				ext,
				handleSensitivity = isTouchDevice ? 10 : 7,
				left;

			if (chartY > top && chartY < top + height) { // we're vertically inside the navigator

				// grab the left handle
				if (Math.abs(chartX - zoomedMin - navigatorLeft) < handleSensitivity) {
					scroller.grabbedLeft = true;
					scroller.otherHandlePos = zoomedMax;
					scroller.fixedExtreme = baseXAxis.max;
					chart.fixedRange = null;

				// grab the right handle
				} else if (Math.abs(chartX - zoomedMax - navigatorLeft) < handleSensitivity) {
					scroller.grabbedRight = true;
					scroller.otherHandlePos = zoomedMin;
					scroller.fixedExtreme = baseXAxis.min;
					chart.fixedRange = null;

				// grab the zoomed range
				} else if (chartX > navigatorLeft + zoomedMin - scrollbarPad && chartX < navigatorLeft + zoomedMax + scrollbarPad) {
					scroller.grabbedCenter = chartX;
					scroller.fixedWidth = range;

					dragOffset = chartX - zoomedMin;

				// shift the range by clicking on shaded areas
				} else if (chartX > scrollerLeft && chartX < scrollerLeft + scrollerWidth) {
					left = chartX - navigatorLeft - range / 2;
					if (left < 0) {
						left = 0;
					} else if (left + range >= navigatorWidth) {
						left = navigatorWidth - range;
						fixedMax = scroller.getUnionExtremes().dataMax; // #2293, #3543
					}
					if (left !== zoomedMin) { // it has actually moved
						scroller.fixedWidth = range; // #1370

						ext = xAxis.toFixedRange(left, left + range, null, fixedMax);
						baseXAxis.setExtremes(
							ext.min,
							ext.max,
							true,
							null, // auto animation
							{ trigger: 'navigator' }
						);
					}
				}

			}
		};

		/**
		 * Event handler for the mouse move event.
		 */
		scroller.mouseMoveHandler = function (e) {
			var scrollbarHeight = scroller.scrollbarHeight,
				navigatorLeft = scroller.navigatorLeft,
				navigatorWidth = scroller.navigatorWidth,
				scrollerLeft = scroller.scrollerLeft,
				scrollerWidth = scroller.scrollerWidth,
				range = scroller.range,
				chartX;

			// In iOS, a mousemove event with e.pageX === 0 is fired when holding the finger
			// down in the center of the scrollbar. This should be ignored.
			if (!e.touches || e.touches[0].pageX !== 0) { // #4696, scrollbar failed on Android

				e = chart.pointer.normalize(e);
				chartX = e.chartX;

				// validation for handle dragging
				if (chartX < navigatorLeft) {
					chartX = navigatorLeft;
				} else if (chartX > scrollerLeft + scrollerWidth - scrollbarHeight) {
					chartX = scrollerLeft + scrollerWidth - scrollbarHeight;
				}

				// drag left handle
				if (scroller.grabbedLeft) {
					scroller.hasDragged = true;
					scroller.render(0, 0, chartX - navigatorLeft, scroller.otherHandlePos);

				// drag right handle
				} else if (scroller.grabbedRight) {
					scroller.hasDragged = true;
					scroller.render(0, 0, scroller.otherHandlePos, chartX - navigatorLeft);

				// drag scrollbar or open area in navigator
				} else if (scroller.grabbedCenter) {

					scroller.hasDragged = true;
					if (chartX < dragOffset) { // outside left
						chartX = dragOffset;
					} else if (chartX > navigatorWidth + dragOffset - range) { // outside right
						chartX = navigatorWidth + dragOffset - range;
					}

					scroller.render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
				}
				if (scroller.hasDragged && scroller.scrollbar && scroller.scrollbar.options.liveRedraw) {
					e.DOMType = e.type; // DOMType is for IE8 because it can't read type async
					setTimeout(function () {
						scroller.mouseUpHandler(e);
					}, 0);
				}
			}
		};

		/**
		 * Event handler for the mouse up event.
		 */
		scroller.mouseUpHandler = function (e) {
			var ext,
				fixedMin,
				fixedMax,
				DOMEvent = e.DOMEvent || e;

			if (scroller.hasDragged || e.trigger === 'scrollbar') {
				// When dragging one handle, make sure the other one doesn't change
				if (scroller.zoomedMin === scroller.otherHandlePos) {
					fixedMin = scroller.fixedExtreme;
				} else if (scroller.zoomedMax === scroller.otherHandlePos) {
					fixedMax = scroller.fixedExtreme;
				}

				// Snap to right edge (#4076)
				if (scroller.zoomedMax === scroller.navigatorWidth) {
					fixedMax = scroller.getUnionExtremes().dataMax;
				}

				ext = xAxis.toFixedRange(scroller.zoomedMin, scroller.zoomedMax, fixedMin, fixedMax);
				if (defined(ext.min)) {
					chart.xAxis[0].setExtremes(
						ext.min,
						ext.max,
						true,
						scroller.hasDragged ? false : null, // Run animation when clicking buttons, scrollbar track etc, but not when dragging handles or scrollbar
						{
							trigger: 'navigator',
							triggerOp: 'navigator-drag',
							DOMEvent: DOMEvent // #1838
						}
					);
				}
			}

			if (e.DOMType !== 'mousemove') {
				scroller.grabbedLeft = scroller.grabbedRight = scroller.grabbedCenter = scroller.fixedWidth =
					scroller.fixedExtreme = scroller.otherHandlePos = scroller.hasDragged = dragOffset = null;
			}

		};


		var xAxisIndex = chart.xAxis.length,
			yAxisIndex = chart.yAxis.length,
			baseXaxis = baseSeries && baseSeries[0] && baseSeries[0].xAxis || chart.xAxis[0];

		// make room below the chart
		chart.extraBottomMargin = scroller.outlineHeight + navigatorOptions.margin;
		chart.isDirtyBox = true;

		if (scroller.navigatorEnabled) {
			// an x axis is required for scrollbar also
			scroller.xAxis = xAxis = new Axis(chart, merge({
				// inherit base xAxis' break and ordinal options
				breaks: baseXaxis.options.breaks,
				ordinal: baseXaxis.options.ordinal
			}, navigatorOptions.xAxis, {
				id: 'navigator-x-axis',
				yAxis: 'navigator-y-axis',
				isX: true,
				type: 'datetime',
				index: xAxisIndex,
				height: height,
				offset: 0,
				offsetLeft: scrollbarHeight,
				offsetRight: -scrollbarHeight,
				keepOrdinalPadding: true, // #2436
				startOnTick: false,
				endOnTick: false,
				minPadding: 0,
				maxPadding: 0,
				zoomEnabled: false
			}));

			scroller.yAxis = new Axis(chart, merge(navigatorOptions.yAxis, {
				id: 'navigator-y-axis',
				alignTicks: false,
				height: height,
				offset: 0,
				index: yAxisIndex,
				zoomEnabled: false
			}));

			// If we have a base series, initialize the navigator series
			if (baseSeries || navigatorOptions.series.data) {
				scroller.addBaseSeries();

			// If not, set up an event to listen for added series
			} else if (chart.series.length === 0) {

				wrap(chart, 'redraw', function (proceed, animation) {
					// We've got one, now add it as base and reset chart.redraw
					if (chart.series.length > 0 && !scroller.series) {
						scroller.setBaseSeries();
						chart.redraw = proceed; // reset
					}
					proceed.call(chart, animation);
				});
			}

		// in case of scrollbar only, fake an x axis to get translation
		} else {
			scroller.xAxis = xAxis = {
				translate: function (value, reverse) {
					var axis = chart.xAxis[0],
						ext = axis.getExtremes(),
						scrollTrackWidth = chart.plotWidth - 2 * scrollbarHeight,
						min = numExt('min', axis.options.min, ext.dataMin),
						valueRange = numExt('max', axis.options.max, ext.dataMax) - min;

					return reverse ?
						// from pixel to value
						(value * valueRange / scrollTrackWidth) + min :
						// from value to pixel
						scrollTrackWidth * (value - min) / valueRange;
				},
				toFixedRange: Axis.prototype.toFixedRange
			};
		}


		// Initialize the scrollbar
		if (chart.options.scrollbar.enabled) {
			chart.scrollbar = scroller.scrollbar = new Scrollbar(
				chart.renderer,
				merge(chart.options.scrollbar, { margin: scroller.navigatorEnabled ? 0 : 10 }),
				chart
			);
			addEvent(scroller.scrollbar, 'changed', function (e) {
				var range = scroller.navigatorWidth,
					to = range * this.to,
					from = range * this.from;

				scroller.hasDragged = scroller.scrollbar.hasDragged;
				scroller.render(0, 0, from, to);

				if (chart.options.scrollbar.liveRedraw || e.DOMType !== 'mousemove') {
					setTimeout(function () {
						scroller.mouseUpHandler(e);
					});
				}
			});
		}

		// Add data events
		scroller.addBaseSeriesEvents();

		scroller.addEvents();
	},

	/**
	 * Get the union data extremes of the chart - the outer data extremes of the base
	 * X axis and the navigator axis.
	 */
	getUnionExtremes: function (returnFalseOnNoBaseSeries) {
		var baseAxis = this.chart.xAxis[0],
			navAxis = this.xAxis,
			navAxisOptions = navAxis.options,
			baseAxisOptions = baseAxis.options,
			ret;

		if (!returnFalseOnNoBaseSeries || baseAxis.dataMin !== null) {
			ret = {
				dataMin: pick( // #4053
					navAxisOptions && navAxisOptions.min,
					numExt(
						'min',
						baseAxisOptions.min,
						baseAxis.dataMin,
						navAxis.dataMin,
						navAxis.min
					)
				),
				dataMax: pick(
					navAxisOptions && navAxisOptions.max,
					numExt(
						'max',
						baseAxisOptions.max,
						baseAxis.dataMax,
						navAxis.dataMax,
						navAxis.max
					)
				)
			};
		}
		return ret;
	},

	/**
	 * Set the base series. With a bit of modification we should be able to make
	 * this an API method to be called from the outside
	 */
	setBaseSeries: function (baseSeriesOptions) {
		var chart = this.chart,
			baseSeries = this.baseSeries = [];

		baseSeriesOptions = baseSeriesOptions || chart.options && chart.options.navigator.baseSeries || 0;

		// If we're resetting, remove the existing series
		if (this.series) {
			this.removeBaseSeriesEvents();
			each(this.series, function (s) { 
				s.remove();
			});
		}

		// Iterate through series and add the ones that should be shown in navigator
		each(chart.series || [], function (series, i) {
			if (series.options.showInNavigator || (i === baseSeriesOptions || series.options.id === baseSeriesOptions) &&
					series.options.showInNavigator !== false) {
				baseSeries.push(series);
			}
		});

		// When run after render, this.xAxis already exists
		if (this.xAxis) {
			this.addBaseSeries();
		}
	},

	addBaseSeries: function () {
		var navigator = this,
			chart = navigator.chart,
			navigatorSeries = navigator.series = [],
			baseSeries = navigator.baseSeries,
			baseOptions,
			mergedNavSeriesOptions,
			chartNavigatorOptions = navigator.navigatorOptions.series,
			baseNavigatorOptions,
			navSeriesMixin = {
				enableMouseTracking: false,
				group: 'nav', // for columns
				padXAxis: false,
				xAxis: 'navigator-x-axis',
				yAxis: 'navigator-y-axis',
				showInLegend: false,
				stacking: false, // #4823
				isInternal: true,
				visible: true
			};

		// Go through each base series and merge the options to create new series
		if (baseSeries) {
			each(baseSeries, function (base, i) {
				navSeriesMixin.name = 'Navigator ' + (i + 1);

				baseOptions = base.options || {};
				baseNavigatorOptions = baseOptions.navigatorOptions || {};
				mergedNavSeriesOptions = merge(baseOptions, navSeriesMixin, chartNavigatorOptions, baseNavigatorOptions);

				// Merge data separately. Do a slice to avoid mutating the navigator options from base series (#4923).
				var navigatorSeriesData = baseNavigatorOptions.data || chartNavigatorOptions.data;
				navigator.hasNavigatorData = navigator.hasNavigatorData || !!navigatorSeriesData;
				mergedNavSeriesOptions.data = navigatorSeriesData || baseOptions.data && baseOptions.data.slice(0);

				// Add the series
				base.navigatorSeries = chart.initSeries(mergedNavSeriesOptions);
				navigatorSeries.push(base.navigatorSeries);
			});
		} else {
			// No base series, build from mixin and chart wide options
			mergedNavSeriesOptions = merge(chartNavigatorOptions, navSeriesMixin);
			mergedNavSeriesOptions.data = chartNavigatorOptions.data;
			navigator.hasNavigatorData = !!mergedNavSeriesOptions.data;
			navigatorSeries.push(chart.initSeries(mergedNavSeriesOptions));
		}

		this.addBaseSeriesEvents();
	},

	addBaseSeriesEvents: function () {
		var scroller = this,
			baseSeries = scroller.baseSeries || [];

		// Bind modified extremes event to first base's xAxis only. In event of > 1 base-xAxes, the navigator will ignore those.
		if (baseSeries[0] && baseSeries[0].xAxis) {
			addEvent(baseSeries[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes);
		}

		if (this.navigatorOptions.adaptToUpdatedData !== false) {
			// Respond to updated data in the base series.
			// Abort if lazy-loading data from the server.
			each(baseSeries, function (base) {
				if (base.xAxis) {
					addEvent(base, 'updatedData', this.updatedDataHandler);
					// Survive Series.update()
					base.userOptions.events = extend(base.userOptions.event, { updatedData: this.updatedDataHandler });
				}

				// Handle series removal
				addEvent(base, 'remove', function () {
					if (this.navigatorSeries) {
						erase(scroller.series, this.navigatorSeries);
						this.navigatorSeries.remove();
						delete this.navigatorSeries;
					}
				});		
			}, this);
		}
	},

	/**
	 * Set the scroller x axis extremes to reflect the total. The navigator extremes
	 * should always be the extremes of the union of all series in the chart as
	 * well as the navigator series.
	 */
	modifyNavigatorAxisExtremes: function () {
		var xAxis = this.xAxis,
			unionExtremes;

		if (xAxis.getExtremes) {
			unionExtremes = this.getUnionExtremes(true);
			if (unionExtremes && (unionExtremes.dataMin !== xAxis.min || unionExtremes.dataMax !== xAxis.max)) {
				xAxis.min = unionExtremes.dataMin;
				xAxis.max = unionExtremes.dataMax;
			}
		}
	},

	/**
	 * Hook to modify the base axis extremes with information from the Navigator
	 */
	modifyBaseAxisExtremes: function () {
		var baseXAxis = this,
			scroller = baseXAxis.chart.scroller,
			baseExtremes = baseXAxis.getExtremes(),
			baseMin = baseExtremes.min,
			baseMax = baseExtremes.max,
			baseDataMin = baseExtremes.dataMin,
			baseDataMax = baseExtremes.dataMax,
			range = baseMax - baseMin,
			stickToMin = scroller.stickToMin,
			stickToMax = scroller.stickToMax,
			newMax,
			newMin,
			navigatorSeries = scroller.series && scroller.series[0],
			hasSetExtremes = !!baseXAxis.setExtremes,

			// When the extremes have been set by range selector button, don't stick to min or max.
			// The range selector buttons will handle the extremes. (#5489)
			unmutable = baseXAxis.eventArgs && baseXAxis.eventArgs.trigger === 'rangeSelectorButton';

		if (!unmutable) {
		
			// If the zoomed range is already at the min, move it to the right as new data
			// comes in
			if (stickToMin) {
				newMin = baseDataMin;
				newMax = newMin + range;
			}

			// If the zoomed range is already at the max, move it to the right as new data
			// comes in
			if (stickToMax) {
				newMax = baseDataMax;
				if (!stickToMin) { // if stickToMin is true, the new min value is set above
					newMin = Math.max(newMax - range, navigatorSeries && navigatorSeries.xData ? navigatorSeries.xData[0] : -Number.MAX_VALUE);
				}
			}

			// Update the extremes
			if (hasSetExtremes && (stickToMin || stickToMax)) {
				if (isNumber(newMin)) {
					baseXAxis.min = baseXAxis.userMin = newMin;
					baseXAxis.max = baseXAxis.userMax = newMax;
				}
			}
		}

		// Reset
		scroller.stickToMin = scroller.stickToMax = null;
	},

	/**
	 * Handler for updated data on the base series. When data is modified, the navigator series
	 * must reflect it. This is called from the Chart.redraw function before axis and series
	 * extremes are computed.
	 */
	updatedDataHandler: function () {
		var scroller = this.chart.scroller,
			baseSeries = this,
			navigatorSeries = this.navigatorSeries;

		// Detect whether the zoomed area should stick to the minimum or maximum. If the current
		// axis minimum falls outside the new updated dataset, we must adjust.
		scroller.stickToMin = isNumber(baseSeries.xAxis.min) && (baseSeries.xAxis.min <= baseSeries.xData[0]);
		// If the scrollbar is scrolled all the way to the right, keep right as new data 
		// comes in.
		scroller.stickToMax = Math.round(scroller.zoomedMax) >= Math.round(scroller.navigatorWidth);

		// Set the navigator series data to the new data of the base series
		if (navigatorSeries && !scroller.hasNavigatorData) {
			navigatorSeries.options.pointStart = baseSeries.xData[0];
			navigatorSeries.setData(baseSeries.options.data, false, null, false); // #5414
		}
	},

	/**
	 * Destroys allocated elements.
	 */
	destroy: function () {

		// Disconnect events added in addEvents
		this.removeEvents();

		if (this.xAxis) {
			erase(this.chart.xAxis, this.xAxis);
			erase(this.chart.axes, this.xAxis);
		}
		if (this.yAxis) {
			erase(this.chart.yAxis, this.yAxis);
			erase(this.chart.axes, this.yAxis);
		}
		// Destroy series
		each(this.series || [], function (s) {
			if (s.destroy) {
				s.destroy();
			}
		});
		delete this.series;

		// Destroy properties
		each(['xAxis', 'yAxis', 'leftShade', 'rightShade', 'outline', 'scrollbarTrack',
				'scrollbarRifles', 'scrollbarGroup', 'scrollbar', 'navigatorGroup'], function (prop) {
			if (this[prop] && this[prop].destroy) {
				this[prop] = this[prop].destroy();
			}
		}, this);
		this.rendered = null;

		// Destroy elements in collection
		each([this.handles, this.elementsToDestroy], function (coll) {
			destroyObjectProperties(coll);
		}, this);
	}
};

H.Navigator = Navigator;

/**
 * For Stock charts, override selection zooming with some special features because
 * X axis zooming is already allowed by the Navigator and Range selector.
 */
wrap(Axis.prototype, 'zoom', function (proceed, newMin, newMax) {
	var chart = this.chart,
		chartOptions = chart.options,
		zoomType = chartOptions.chart.zoomType,
		previousZoom,
		navigator = chartOptions.navigator,
		rangeSelector = chartOptions.rangeSelector,
		ret;

	if (this.isXAxis && ((navigator && navigator.enabled) ||
			(rangeSelector && rangeSelector.enabled))) {

		// For x only zooming, fool the chart.zoom method not to create the zoom button
		// because the property already exists
		if (zoomType === 'x') {
			chart.resetZoomButton = 'blocked';

		// For y only zooming, ignore the X axis completely
		} else if (zoomType === 'y') {
			ret = false;

		// For xy zooming, record the state of the zoom before zoom selection, then when
		// the reset button is pressed, revert to this state
		} else if (zoomType === 'xy') {
			previousZoom = this.previousZoom;
			if (defined(newMin)) {
				this.previousZoom = [this.min, this.max];
			} else if (previousZoom) {
				newMin = previousZoom[0];
				newMax = previousZoom[1];
				delete this.previousZoom;
			}
		}

	}
	return ret !== undefined ? ret : proceed.call(this, newMin, newMax);
});

// Initialize scroller for stock charts
wrap(Chart.prototype, 'init', function (proceed, options, callback) {

	addEvent(this, 'beforeRender', function () {
		var options = this.options;
		if (options.navigator.enabled || options.scrollbar.enabled) {
			this.scroller = this.navigator = new Navigator(this);
		}
	});

	proceed.call(this, options, callback);

});

/**
 * For stock charts, extend the Chart.getMargins method so that we can set the final top position
 * of the navigator once the height of the chart, including the legend, is determined. #367.
 */
wrap(Chart.prototype, 'getMargins', function (proceed) {

	var legend = this.legend,
		legendOptions = legend.options,
		scroller = this.scroller,
		xAxis,
		yAxis;

	proceed.apply(this, [].slice.call(arguments, 1));

	if (scroller) {

		xAxis = scroller.xAxis;
		yAxis = scroller.yAxis;

		// Compute the top position
		scroller.top = scroller.navigatorOptions.top ||
			this.chartHeight - scroller.height - scroller.scrollbarHeight - this.spacing[2] -
					(legendOptions.verticalAlign === 'bottom' && legendOptions.enabled && !legendOptions.floating ?
						legend.legendHeight + pick(legendOptions.margin, 10) : 0);

		if (xAxis && yAxis) { // false if navigator is disabled (#904)

			xAxis.options.top = yAxis.options.top = scroller.top;

			xAxis.setAxisSize();
			yAxis.setAxisSize();
		}
	}
});

// Pick up badly formatted point options to addPoint
wrap(Series.prototype, 'addPoint', function (proceed, options, redraw, shift, animation) {
	var turboThreshold = this.options.turboThreshold;
	if (turboThreshold && this.xData.length > turboThreshold && isObject(options, true) && this.chart.scroller) {
		error(20, true);
	}
	proceed.call(this, options, redraw, shift, animation);
});

// Handle adding new series
wrap(Chart.prototype, 'addSeries', function (proceed, options, redraw, animation) {
	proceed.call(this, options, false, animation);
	if (this.scroller) {
		this.scroller.setBaseSeries(); // Recompute which series should be shown in navigator, and add them
	}
	if (pick(redraw, true)) {
		this.redraw();
	}
});

// Handle updating series
wrap(Series.prototype, 'update', function (proceed, newOptions, redraw) {
	proceed.call(this, newOptions, false);
	if (this.chart.scroller) {
		this.chart.scroller.setBaseSeries();
	}
	if (pick(redraw, true)) {
		this.chart.redraw();
	}
});

/* ****************************************************************************
 * End Navigator code														  *
 *****************************************************************************/
