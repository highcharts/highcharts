/**
 * @license Highcharts JS (work in progress)
 * Stock module
 *
 * (c) 2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*jslint confusion: true, sloppy: true, forin: true, vars: true, plusplus: true */
/*global Highcharts, document, setTimeout, window */

(function() { // encapsulate

// create shortcuts
var UNDEFINED,
	HC = Highcharts,
	addEvent = HC.addEvent,
	createElement = HC.createElement,
	dateFormat = HC.dateFormat,
	defaultOptions = HC.getOptions(),
	defaultPlotOptions = defaultOptions.plotOptions,
	seriesTypes = HC.seriesTypes,
	extend = HC.extend,
	each = HC.each,
	map = HC.map,
	merge = HC.merge,
	pick = HC.pick,
	splat = HC.splat,
	math = Math,
	mathMin = math.min,
	mathMax = math.max,
	mathRound = math.round,
	hasTouch = document.documentElement.ontouchstart !== UNDEFINED,


	// constants
	MOUSEDOWN = hasTouch ? 'touchstart' : 'mousedown',
	MOUSEMOVE = hasTouch ? 'touchmove' : 'mousemove',
	MOUSEUP = hasTouch ? 'touchend' : 'mouseup';

/* ****************************************************************************
 * Start data grouping module												 *
 ******************************************************************************/
var DATA_GROUPING = 'dataGrouping',
	seriesProto = HC.Series.prototype,
	baseProcessData = seriesProto.processData,
	baseGeneratePoints = seriesProto.generatePoints,
	baseDestroy = seriesProto.destroy;

/**
 * Extend the basic processData method, that crops the data to the current zoom
 * range, with data grouping logic.
 */
seriesProto.processData = function() {
	var series = this,
		options = series.options,
		dataGroupingOptions = options[DATA_GROUPING];

	baseProcessData.apply(this);

	// disabled?
	if (!dataGroupingOptions || dataGroupingOptions.enabled === false) {
		return;
	}

	var i,
		processedXData = series.processedXData,
		processedYData = series.processedYData,
		data = series.data,
		dataOptions = options.data,
		plotSizeX = series.chart.plotSizeX,
		groupPixelWidth = dataGroupingOptions.groupPixelWidth,
		maxPoints = plotSizeX / groupPixelWidth,
		approximation = dataGroupingOptions.approximation,
		summarize = approximation === 'average' || approximation === 'sum',
		dataLength = processedXData.length,
		ohlcData = series.valueCount === 4,
		groupedData = series.groupedData,
		groupedXData = [],
		groupedYData = [];

	// clear previous groups
	each (groupedData || [], function(point, i) {
		if (point) {
			groupedData[i] = point.destroy();
		}
	});

	series.hasGroupedData = false;
	if (dataLength > maxPoints) {
		series.hasGroupedData = true;

		series.points = null; // force recreation of point instances in series.translate

		var xMin = processedXData[0],
			xMax = processedXData[dataLength - 1],
			interval = groupPixelWidth * (xMax - xMin) / plotSizeX,
			groupPositions = HC.getTimeTicks(interval, xMin, xMax, null, dataGroupingOptions.units),
			pointX,
			pointY,
			value = UNDEFINED,
			open = null,
			high = null,
			low = null,
			close = null,
			count = 0;

		for (i = 0; i < dataLength; i++) {

			// when a new group is entered, summarize and initiate the previous group
			while (groupPositions[1] !== UNDEFINED && processedXData[i] >= groupPositions[1]) {

				if (approximation === 'average' && value !== UNDEFINED && value !== null) {
					value /= count;
				}

				pointX = groupPositions.shift();
				if (value !== UNDEFINED || ohlcData) {
					groupedXData.push(pointX); // todo: just use groupPositions as xData?

					if (ohlcData) {
						groupedYData.push([open, high, low, close]);
						open = high = low = close = null;
					} else {
						groupedYData.push(value);
					}
				}

				value = UNDEFINED;
				count = 0;
			}

			// increase the counters
			pointY = processedYData[i];
			if (summarize && !ohlcData) { // approximation = 'sum' or 'average', the most frequent
				value = value === UNDEFINED || value === null ? pointY : value + pointY;
			} else if (ohlcData) {
				var index = series.cropStart + i,
					point = data[index] || series.pointClass.prototype.applyOptions.apply({}, [dataOptions[index]]);
				if (open === null) { // first point
					open = point.open;
				}
				high = high === null? point.high : mathMax(high, point.high);
				low = low === null ? point.low : mathMin(low, point.low);
				close = point.close; // last point
			} else if (approximation === 'open' && value === UNDEFINED) {
				value = pointY;
			} else if (approximation === 'high') {
				value = value === UNDEFINED ? pointY : mathMax(value, pointY);
			} else if (approximation === 'low') {
				value = value === UNDEFINED ? pointY : mathMin(value, pointY);
			} else if (approximation === 'close') { // last point
				value = pointY;
			}

			count++;
		}

		// prevent the smoothed data to spill out left and right, and make
		// sure data is not shifted to the left
		if (dataGroupingOptions.smoothed) {
			i = groupedXData.length - 1;
			groupedXData[i] = xMax;
			while (i-- && i) {
				groupedXData[i] += interval / 2;
			}
			groupedXData[0] = xMin;
		}

		series.tooltipHeaderFormat = dataGroupingOptions.dateTimeLabelFormats[groupPositions.unit[0]];

	} else {
		groupedXData = processedXData;
		groupedYData = processedYData;
		series.tooltipHeaderFormat = null;
	}

	series.processedXData = groupedXData;
	series.processedYData = groupedYData;

};

seriesProto.generatePoints = function() {
	var series = this;

	baseGeneratePoints.apply(series);

	// record grouped data in order to let it be destroyed the next time processData runs
	series.groupedData = series.hasGroupedData ? series.points : null;
};

seriesProto.destroy = function() {
	var series = this,
		groupedData = series.groupedData || [],
		i = groupedData.length;

	while(i--) {
		if (groupedData[i]) {
			groupedData[i].destroy();
		}
	}
	baseDestroy.apply(series);
};


// Extend the plot options
var dateTimeLabelFormats = {
	second: '%A, %b %e, %H:%M:%S',
	minute: '%A, %b %e, %H:%M',
	hour: '%A, %b %e, %H:%M',
	day: '%A, %b %e, %Y',
	week: 'Week from %A, %b %e, %Y',
	month: '%B %Y',
	year: '%Y'
};

// line types
defaultPlotOptions.line[DATA_GROUPING] =
	defaultPlotOptions.spline[DATA_GROUPING] =
	defaultPlotOptions.area[DATA_GROUPING] =
	defaultPlotOptions.areaspline[DATA_GROUPING] = {
		approximation: 'average', // average, open, high, low, close, sum
		groupPixelWidth: 2,
		dateTimeLabelFormats: dateTimeLabelFormats, // todo: move to tooltip options?
		// smoothed = false, // enable this for navigator series only
		units: [[
			'millisecond',					// unit name
			[1, 2, 5, 10, 20, 25, 50, 100, 200, 500]
		], [
			'second',						// unit name
			[1, 2, 5, 10, 15, 30]			// allowed multiples
		], [
			'minute',						// unit name
			[1, 2, 5, 10, 15, 30]			// allowed multiples
		], [
			'hour',							// unit name
			[1, 2, 3, 4, 6, 8, 12]			// allowed multiples
		], [
			'day',							// unit name
			[1]								// allowed multiples
		], [
			'week',							// unit name
			[1]								// allowed multiples
		], [
			'month',
			[1, 3, 6]
		], [
			'year',
			null
		]]
};
// bar-like types (OHLC and candleticks inherit this as the classes are not yet built)
defaultPlotOptions.column[DATA_GROUPING] = {
		approximation: 'sum',
		groupPixelWidth: 10,
		dateTimeLabelFormats: dateTimeLabelFormats
};
/* ****************************************************************************
 * End data grouping module												   *
 ******************************************************************************/


/* ****************************************************************************
 * Start OHLC series code													 *
 *****************************************************************************/

// 1 - Set default options
defaultPlotOptions.ohlc = merge(defaultPlotOptions.column, {
	lineWidth: 1,
	dataGrouping: {
		groupPixelWidth: 5 // allows to be packed tighter than candlesticks
	},
	states: {
		hover: {
			lineWidth: 3
		}
	}
});

// 2- Create the OHLCPoint object
var OHLCPoint = Highcharts.extendClass(Highcharts.Point, {
	/**
	 * Apply the options containing the x and OHLC data and possible some extra properties.
	 * This is called on point init or from point.update. Extends base Point by adding
	 * multiple y-like values.
	 *
	 * @param {Object} options
	 */
	applyOptions: function(options) {
		var point = this,
			series = point.series,
			i = 0;


		// object input for example:
		// { x: Date(2010, 0, 1), open: 7.88, high: 7.99, low: 7.02, close: 7.65 }
		if (typeof options === 'object' && typeof options.length !== 'number') {

			// copy options directly to point
			extend(point, options);

			point.options = options;
		}

		// array
		else if (options.length) {
			// with leading x value
			if (options.length === 5) {
				if (typeof options[0] === 'string') {
					point.name = options[0];
				} else if (typeof options[0] === 'number') {
					point.x = options[0];
				}
				i++;
			}
			point.open = options[i++];
			point.high = options[i++];
			point.low = options[i++];
			point.close = options[i++];
		}

		/*
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		point.y = point.high;
		if (point.x === UNDEFINED && series) {
			point.x = series.autoIncrement();
		}
		return point;
	},

	/**
	 * A specific OHLC tooltip formatter
	 */
	tooltipFormatter: function() {
		var point = this,
			series = point.series;

		return ['<span style="color:'+ series.color +';font-weight:bold">', (point.name || series.name), '</span><br/> ',
			'Open: ', point.open, '<br/>',
			'High: ', point.high, '<br/>',
			'Low: ', point.low, '<br/>',
			'Close: ', point.close, '<br/>'].join('');

	}

});

// 3 - Create the OHLCSeries object
var OHLCSeries = Highcharts.extendClass(seriesTypes.column, {
	type: 'ohlc',
	valueCount: 4, // four values per point
	pointClass: OHLCPoint,
	useThreshold: false,

	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'color',
		'stroke-width': 'lineWidth'
	},


	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function() {
		var series = this,
			yAxis = series.yAxis;

		seriesTypes.column.prototype.translate.apply(series);

		// do the translation
		each(series.points, function(point) {
			// the graphics
			point.plotOpen = yAxis.translate(point.open, 0, 1);
			point.plotClose = yAxis.translate(point.close, 0, 1);

		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function() {
		var series = this,
			points = series.points,
			chart = series.chart,
			pointAttr,
			plotOpen,
			plotClose,
			crispCorr,
			halfWidth,
			path,
			graphic,
			crispX;


		each(points, function(point) {
			if (point.plotY !== UNDEFINED) {

				graphic = point.graphic;
				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				plotOpen = mathRound(point.plotOpen) + crispCorr;
				plotClose = mathRound(point.plotClose) + crispCorr;
				halfWidth = mathRound(point.barW / 2);


				path = [
					'M',
					crispX, mathRound(point.yBottom),
					'L',
					crispX, mathRound(point.plotY),
					'M',
					crispX, plotOpen,
					'L',
					crispX - halfWidth, plotOpen,
					'M',
					crispX, plotClose,
					'L',
					crispX + halfWidth, plotClose,
					'Z'
				];


				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}


		});

	}


});
seriesTypes.ohlc = OHLCSeries;
/* ****************************************************************************
 * End OHLC series code													   *
 *****************************************************************************/


/* ****************************************************************************
 * Start Candlestick series code											  *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.candlestick = merge(defaultPlotOptions.column, {
	lineColor: 'black',
	lineWidth: 1,
	upColor: 'white',
	states: {
		hover: {
			lineWidth: 2
		}
	}
});

// 2 - Create the CandlestickSeries object
var CandlestickSeries = Highcharts.extendClass(OHLCSeries, {
	type: 'candlestick',

	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'color',
		stroke: 'lineColor',
		'stroke-width': 'lineWidth'
	},

	/**
	 * Postprocess mapping between options and SVG attributes
	 */
	getAttribs: function() {
		OHLCSeries.prototype.getAttribs.apply(this, arguments);
		var series = this,
			options = series.options,
			stateOptions = options.states,
			upColor = options.upColor,
			seriesDownPointAttr = merge(series.pointAttr);

		seriesDownPointAttr[''].fill = upColor;
		seriesDownPointAttr.hover.fill = stateOptions.hover.upColor || upColor;
		seriesDownPointAttr.select.fill = stateOptions.select.upColor || upColor;

		each(series.points, function(point) {
			if (point.open < point.close) {
				point.pointAttr = seriesDownPointAttr;
			}
		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function() {
		var series = this,  //state = series.state,
			points = series.points,
			chart = series.chart,
			pointAttr,
			plotOpen,
			plotClose,
			topBox,
			bottomBox,
			crispCorr,
			crispX,
			graphic,
			path,
			halfWidth;


		each(points, function(point) {

			graphic = point.graphic;
			if (point.plotY !== UNDEFINED) {

				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				plotOpen = mathRound(point.plotOpen) + crispCorr;
				plotClose = mathRound(point.plotClose) + crispCorr;
				topBox = math.min(plotOpen, plotClose);
				bottomBox = math.max(plotOpen, plotClose);
				halfWidth = mathRound(point.barW / 2);

				// create the path
				path = [
					'M',
					crispX - halfWidth, bottomBox,
					'L',
					crispX - halfWidth, topBox,
					'L',
					crispX + halfWidth, topBox,
					'L',
					crispX + halfWidth, bottomBox,
					'L',
					crispX - halfWidth, bottomBox,
					'M',
					crispX, bottomBox,
					'L',
					crispX, mathRound(point.yBottom),
					'M',
					crispX, topBox,
					'L',
					crispX, mathRound(point.plotY),
					'Z'
				];

				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}
		});

	}


});

seriesTypes.candlestick = CandlestickSeries;

/* ****************************************************************************
 * End Candlestick series code												*
 *****************************************************************************/


/* ****************************************************************************
 * Start Flags series code													*
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.flags = merge(defaultPlotOptions.column, {
	fillColor: 'white',
	lineWidth: 1,
	//radius: 2,
	shape: 'flag',
	stackDistance: 7,
	states: {
		hover: {
			lineColor: 'black',
			fillColor: '#FCFFC5'
		}
	},
	style: {
		fontSize: '11px',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	y: -30
});

// 2 - Create the CandlestickSeries object
seriesTypes.flags = Highcharts.extendClass(seriesTypes.column, {
	type: 'flags',
	noSharedTooltip: true,
	useThreshold: false,
	/**
	 * Inherit the initialization from base Series
	 */
	init: HC.Series.prototype.init,

	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'fillColor',
		stroke: 'color',
		'stroke-width': 'lineWidth',
		r: 'radius'
	},

	/**
	 * Extend the translate method by placing the point on the related series
	 */
	translate: function() {

		seriesTypes.column.prototype.translate.apply(this);

		var series = this,
			options = series.options,
			chart = series.chart,
			points = series.points,
			cursor = points.length - 1,
			i,
			point,
			lastPoint,
			optionsOnSeries = options.onSeries,
			onSeries = optionsOnSeries && chart.get(optionsOnSeries),
			onData,
			onPoint;


		// relate to a master series
		if (onSeries) {
			onData = onSeries.points;
			i = onData.length;

			// sort the data points
			points.sort(function(a, b){
				return (a.x - b.x);
			});

			while (i-- && points[cursor]) {
				point = points[cursor];
				onPoint = onData[i];
				if (onPoint.x <= point.x) {
					point.plotY = onPoint.plotY;
					cursor--;
					i++; // check again for points in the same x position
					if (cursor < 0) {
						break;
					}
				}
			}
		}

		each(points, function(point, i) {
			// place on y axis
			if (!onSeries) {
				point.plotY = chart.plotHeight;
			}
			// if multiple flags appear at the same x, order them into a stack
			lastPoint = points[i - 1];
			if (lastPoint && lastPoint.plotX === point.plotX) {
				if (lastPoint.stackIndex === UNDEFINED) {
					lastPoint.stackIndex = 0;
				}
				point.stackIndex = lastPoint.stackIndex + 1;
			}

		});


	},

	/**
	 * Draw the markers
	 */
	drawPoints: function(){
		var series = this,
			pointAttr,
			points = series.points,
			chart = series.chart,
			renderer = chart.renderer,
			plotX,
			plotY,
			options = series.options,
			optionsY = options.y,
			shape = options.shape,
			box,
			bBox,
			i,
			point,
			graphic,
			connector,
			stackIndex,
			crisp = (options.lineWidth % 2 / 2),
			anchorX,
			anchorY;

		i = points.length;
		while (i--) {
			point = points[i];
			plotX = point.plotX + crisp;
			stackIndex = point.stackIndex;
			plotY = point.plotY + optionsY + crisp - (stackIndex !== UNDEFINED && stackIndex * options.stackDistance);
			// outside to the left, on series but series is clipped
			if (isNaN(plotY)) {
				plotY = 0;
			}
			anchorX = stackIndex ? UNDEFINED : point.plotX + crisp; // skip connectors for higher level stacked points
			anchorY = stackIndex ? UNDEFINED : point.plotY;

			graphic = point.graphic;
			connector = point.connector;

			// only draw the point if y is defined
			if (plotY !== UNDEFINED) {
				// shortcuts
				pointAttr = point.pointAttr[point.selected ? 'select' : ''];
				if (graphic) { // update
					graphic.attr({
						x: plotX,
						y: plotY,
						r: pointAttr.r
					});
				} else {
					graphic = point.graphic = renderer.label(
						point.options.title || options.title || 'A',
						plotX,
						plotY,
						shape,
						anchorX,
						anchorY
					)
					.css(merge(options.style, point.style))
					.attr(pointAttr)
					.attr({
						align: shape === 'flag' ? 'left' : 'center',
						width: options.width,
						height: options.height
					})
					.add(series.group);

				}

				// get the bounding box
				box = graphic.box;
				bBox = box.getBBox();

				// set the shape arguments for the tracker element
				point.shapeArgs = extend(
					bBox, {
						x: plotX - (shape === 'flag' ? 0 : box.attr('width') / 2), // flags align left, else align center
						y: plotY
					}
				);

			}

		}

	},

	/**
	 * Extend the column trackers with listeners to expand and contract stacks
	 */
	drawTracker: function() {
		var series = this;

		seriesTypes.column.prototype.drawTracker.apply(series);

		// put each point in front on mouse over, this allows readability of vertically
		// stacked elements as well as tight points on the x axis
		each(series.points, function(point) {
			addEvent(point.tracker.element, 'mouseover', function() {
				point.graphic.toFront();
			});
		});
	},

	/**
	 * Override the regular tooltip formatter by returning the point text given
	 * in the options
	 */
	tooltipFormatter: function(item) {
		return item.point.text;
	},

	/**
	 * Disable animation
	 */
	animate: function() {}

});

/* ****************************************************************************
 * End Flags series code													  *
 *****************************************************************************/

/* ****************************************************************************
 * Start Scroller code														*
 *****************************************************************************/

var buttonGradient = {
		linearGradient: [0, 0, 0, 14],
		stops: [
			[0, '#FFF'],
			[1, '#CCC']
		]
	};

extend(defaultOptions, {
	navigator: {
		//enabled: true,
		handles: {
			backgroundColor: '#FFF',
			borderColor: '#666'
		},
		height: 40,
		margin: 10,
		maskFill: 'rgba(255, 255, 255, 0.75)',
		outlineColor: '#444',
		outlineWidth: 1,
		series: {
			type: 'areaspline',
			color: '#4572A7',
			fillOpacity: 0.4,
			dataGrouping: {
				smoothed: true
			},
			lineWidth: 1,
			marker: {
				enabled: false
			},
			shadow: false
		},
		//top: undefined, // docs
		xAxis: {
			tickWidth: 0,
			lineWidth: 0,
			gridLineWidth: 1,
			tickPixelInterval: 200,
			labels: {
				align: 'left',
				x: 3,
				y: -4
			}
		},
		yAxis: {
			gridLineWidth: 0,
			startOnTick: false,
			endOnTick: false,
			minPadding: 0.1,
			maxPadding: 0.1,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickWidth: 0
		}
	},
	scrollbar: {
		//enabled: true
		height: hasTouch ? 20 : 14,
		barBackgroundColor: buttonGradient,
		barBorderRadius: 2,
		barBorderWidth: 1,
		barBorderColor: '#666',
		buttonArrowColor: '#666',
		buttonBackgroundColor: buttonGradient,
		buttonBorderColor: '#666',
		buttonBorderRadius: 2,
		buttonBorderWidth: 1,
		rifleColor: '#666',
		trackBackgroundColor: {
			linearGradient: [0, 0, 0, 10],
			stops: [
				[0, '#EEE'],
				[1, '#FFF']
			]
		},
		trackBorderColor: '#CCC',
		trackBorderWidth: 1
		// trackBorderRadius: 0
	}
});

/**
 * The Scroller class
 * @param {Object} chart
 */
function Scroller(chart) {

	var renderer = chart.renderer,
		chartOptions = chart.options,
		navigatorOptions = chartOptions.navigator,
		navigatorEnabled = navigatorOptions.enabled,
		navigatorLeft,
		navigatorSeries,
		scrollbarOptions = chartOptions.scrollbar,
		scrollbarEnabled = scrollbarOptions.enabled,
		grabbedLeft,
		grabbedRight,
		grabbedCenter,
		otherHandlePos,
		dragOffset,
		hasDragged,
		xAxis,
		yAxis,
		zoomedMin,
		zoomedMax,
		range,

		bodyStyle = document.body.style,
		defaultBodyCursor,

		handlesOptions = navigatorOptions.handles,
		height = navigatorEnabled ? navigatorOptions.height : 0,
		outlineWidth = navigatorOptions.outlineWidth,
		scrollbarHeight = scrollbarEnabled ? scrollbarOptions.height : 0,
		outlineHeight = height + scrollbarHeight,
		barBorderRadius = scrollbarOptions.barBorderRadius,
		top = navigatorOptions.top || chart.chartHeight - height - scrollbarHeight - chartOptions.chart.spacingBottom,
		halfOutline = outlineWidth / 2,
		outlineTop,
		plotLeft,
		plotWidth,
		rendered,
		baseSeriesOption = navigatorOptions.baseSeries,
		baseSeries = chart.series[baseSeriesOption] ||
			(typeof baseSeriesOption === 'string' && chart.get(baseSeriesOption)) ||
			chart.series[0],

		// element wrappers
		leftShade,
		rightShade,
		outline,
		handles = [],
		scrollbarGroup,
		scrollbarTrack,
		scrollbar,
		scrollbarRifles,
		scrollbarButtons = [];

	chart.resetZoomEnabled = false;

	/**
	 * Draw one of the handles on the side of the zoomed range in the navigator
	 * @param {Number} x The x center for the handle
	 * @param {Number} index 0 for left and 1 for right
	 */
	function drawHandle(x, index) {

		var attr = {
				fill: handlesOptions.backgroundColor,
				stroke: handlesOptions.borderColor,
				'stroke-width': 1
			};

		// create the elements
		if (!rendered) {

			// the group
			handles[index] = renderer.g()
				.css({ cursor: 'e-resize' })
				.attr({ zIndex: 3 })
				.add();

			// the rectangle
			renderer.rect(-4.5, 0, 9, 16, 3, 1)
				.attr(attr)
				.add(handles[index]);

			// the rifles
			renderer.path([
					'M',
					-1.5, 4,
					'L',
					-1.5,	12,
					'M',
					0.5, 4,
					'L',
					0.5, 12
				]).attr(attr)
				.add(handles[index]);
		}

		handles[index].translate(plotLeft + scrollbarHeight + parseInt(x, 10), top + height / 2 - 8);
	}

	/**
	 * Draw the scrollbar buttons with arrows
	 * @param {Number} index 0 is left, 1 is right
	 */
	function drawScrollbarButton(index) {

		if (!rendered) {

			var crisp = scrollbarOptions.buttonBorderWidth % 2 / 2;
			scrollbarButtons[index] = renderer.g().add(scrollbarGroup);

			renderer.rect(
				crisp,
				crisp,
				scrollbarHeight,
				scrollbarHeight,
				scrollbarOptions.buttonBorderRadius
			).attr({
				stroke: scrollbarOptions.buttonBorderColor,
				'stroke-width': scrollbarOptions.buttonBorderWidth,
				fill: scrollbarOptions.buttonBackgroundColor
			}).add(scrollbarButtons[index]);

			renderer.path([
				'M',
				scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 - 3,
				'L',
				scrollbarHeight / 2 + (index ? -1 : 1), scrollbarHeight / 2 + 3,
				scrollbarHeight / 2 + (index ? 2 : -2), scrollbarHeight / 2
			]).attr({
				fill: scrollbarOptions.buttonArrowColor
			}).add(scrollbarButtons[index]);
		}

		// adjust the right side button to the varying length of the scroll track
		if (index) {
			scrollbarButtons[index].attr({
				translateX: plotWidth - scrollbarHeight
			});
		}
	}

	/**
	 * Render the navigator and scroll bar
	 * @param {Number} min X axis value minimum
	 * @param {Number} max X axis value maximum
	 * @param {Number} pxMin Pixel value minimum
	 * @param {Number} pxMax Pixel value maximum
	 */
	function render(min, max, pxMin, pxMax) {

		outlineTop = top + halfOutline;
		plotLeft = chart.plotLeft;
		plotWidth = chart.plotWidth;
		navigatorLeft = plotLeft + scrollbarHeight;

		pxMin = pick(pxMin,	xAxis.translate(min));
		pxMax = pick(pxMax, xAxis.translate(max));

		// set the scroller x axis extremes to reflect the total
		if (rendered && xAxis.getExtremes) {
			var newExtremes = chart.xAxis[0].getExtremes(),
				oldExtremes = xAxis.getExtremes();

			if (newExtremes.dataMin !== oldExtremes.min ||
					newExtremes.dataMax !== oldExtremes.max) {
				xAxis.setExtremes(newExtremes.dataMin, newExtremes.dataMax);
			}
		}

		//logTime && console.log(Highcharts.dateFormat('%Y-%m-%d', newExtremes.max))

		// handles are allowed to cross
		zoomedMin = parseInt(mathMin(pxMin, pxMax), 10);
		zoomedMax = parseInt(mathMax(pxMin, pxMax), 10);
		range = zoomedMax - zoomedMin;

		// on first render, create all elements
		if (!rendered) {

			if (navigatorEnabled) {

				leftShade = renderer.rect()
					.attr({
						fill: navigatorOptions.maskFill,
						zIndex: 3
					}).add();
				rightShade = renderer.rect()
					.attr({
						fill: navigatorOptions.maskFill,
						zIndex: 3
					}).add();
				outline = renderer.path()
					.attr({
						'stroke-width': outlineWidth,
						stroke: navigatorOptions.outlineColor,
						zIndex: 3
					})
					.add();
			}

			if (scrollbarEnabled) {
				scrollbarGroup = renderer.g().add();

				scrollbarTrack = renderer.rect().attr({
					fill: scrollbarOptions.trackBackgroundColor,
					stroke: scrollbarOptions.trackBorderColor,
					'stroke-width': scrollbarOptions.trackBorderWidth,
					r: scrollbarOptions.trackBorderRadius || 0,
					height: scrollbarHeight
				}).add(scrollbarGroup);

				scrollbar = renderer.rect()
					.attr({
						height: scrollbarHeight,
						fill: scrollbarOptions.barBackgroundColor,
						stroke: scrollbarOptions.barBorderColor,
						'stroke-width': scrollbarOptions.barBorderWidth,
						rx: barBorderRadius,
						ry: barBorderRadius
					})
					.add(scrollbarGroup);

				scrollbarRifles = renderer.path()
					.attr({
						stroke: scrollbarOptions.rifleColor,
						'stroke-width': 1
					})
					.add(scrollbarGroup);
			}
		}

		// place elements
		if (navigatorEnabled) {
			leftShade.attr({
				x: navigatorLeft,
				y: top,
				width: zoomedMin,
				height: height
			});
			rightShade.attr({
				x: navigatorLeft + zoomedMax,
				y: top,
				width: plotWidth - zoomedMax - 2 * scrollbarHeight,
				height: height
			});
			outline.attr({ d: [
				'M',
				plotLeft, outlineTop, // left
				'L',
				navigatorLeft + zoomedMin - halfOutline,	outlineTop, // upper left of zoomed range
				navigatorLeft + zoomedMin - halfOutline,	outlineTop + outlineHeight, // lower left of z.r.
				navigatorLeft + zoomedMax + halfOutline,	outlineTop + outlineHeight, // lower right of z.r.
				navigatorLeft + zoomedMax + halfOutline,	outlineTop, // upper right of z.r.
				plotLeft + plotWidth, outlineTop // right
			]});
			// draw handles
			drawHandle(zoomedMin - halfOutline, 0);
			drawHandle(zoomedMax + halfOutline, 1);
		}

		// draw the scrollbar
		if (scrollbarEnabled) {

			// draw the buttons
			drawScrollbarButton(0);
			drawScrollbarButton(1);

			scrollbarGroup.translate(plotLeft, outlineTop + height);

			scrollbarTrack.attr({
				width: plotWidth
			});

			scrollbar.attr({
				x: scrollbarHeight + zoomedMin,
				width: range
			});

			var centerBarX = scrollbarHeight + zoomedMin + range / 2 - 0.5;

			scrollbarRifles.attr({ d: [
					'M',
					centerBarX - 3, scrollbarHeight / 4,
					'L',
					centerBarX - 3, 2 * scrollbarHeight / 3,
					'M',
					centerBarX, scrollbarHeight / 4,
					'L',
					centerBarX, 2 * scrollbarHeight / 3,
					'M',
					centerBarX + 3, scrollbarHeight / 4,
					'L',
					centerBarX + 3, 2 * scrollbarHeight / 3
				],
				visibility: range > 12 ? 'visible' : 'hidden'
			});
		}

		rendered = true;
	}

	/**
	 * Set up the mouse and touch events for the navigator and scrollbar
	 */
	function addEvents() {
		addEvent(chart.container, MOUSEDOWN, function(e) {
			e = chart.tracker.normalizeMouseEvent(e);
			var chartX = e.chartX,
				chartY = e.chartY,
				handleSensitivity = hasTouch ? 10 : 7,
				left,
				isOnNavigator;

			if (chartY > top && chartY < top + height + scrollbarHeight) { // we're vertically inside the navigator
				isOnNavigator = !scrollbarEnabled || chartY < top + height;

				// grab the left handle
				if (isOnNavigator && math.abs(chartX - zoomedMin - navigatorLeft) < handleSensitivity) {
					grabbedLeft = true;
					otherHandlePos = zoomedMax;
				}

				// grab the right handle
				else if (isOnNavigator && math.abs(chartX - zoomedMax - navigatorLeft) < handleSensitivity) {
					grabbedRight = true;
					otherHandlePos = zoomedMin;
				}

				// grab the zoomed range
				else if (chartX > navigatorLeft + zoomedMin && chartX < navigatorLeft + zoomedMax) {
					grabbedCenter = chartX;
					defaultBodyCursor = bodyStyle.cursor;
					bodyStyle.cursor = 'ew-resize';

					dragOffset = chartX - zoomedMin;
				}

				// click on the shaded areas
				else if (chartX > plotLeft && chartX < plotLeft + plotWidth) {

					if (isOnNavigator) { // center around the clicked point
						left = chartX - navigatorLeft - range / 2;
					} else { // click on scrollbar
						if (chartX < navigatorLeft) { // click left scrollbar button
							left = zoomedMin - mathMin(10, range);
						} else if (chartX > plotLeft + plotWidth - scrollbarHeight)  {
							left = zoomedMin + mathMin(10, range);
						} else {
							// shift the scrollbar by one range
							left = chartX < navigatorLeft + zoomedMin ? // on the left
								zoomedMin - range :
								zoomedMax;
						}
					}
					if (left < 0) {
						left = 0;
					} else if (left + range > plotWidth - 2 * scrollbarHeight) {
						left = plotWidth - range - 2 * scrollbarHeight;
					}
					chart.xAxis[0].setExtremes(
						xAxis.translate(left, true),
						xAxis.translate(left + range, true),
						true,
						false
					);
				}
			}
			if (e.preventDefault) { // tries to drag object when clicking on the shades
				e.preventDefault();
			}
		});

		addEvent(chart.container, MOUSEMOVE, function(e) {
			e = chart.tracker.normalizeMouseEvent(e);
			var chartX = e.chartX;

			// validation for handle dragging
			if (chartX < navigatorLeft) {
				chartX = navigatorLeft;
			} else if (chartX > plotLeft + plotWidth - scrollbarHeight) {
				chartX = plotLeft + plotWidth - scrollbarHeight;
			}

			// drag left handle
			if (grabbedLeft) {
				hasDragged = true;
				render(0, 0, chartX - navigatorLeft, otherHandlePos);

			// drag right handle
			} else if (grabbedRight) {
				hasDragged = true;
				render(0, 0, otherHandlePos, chartX - navigatorLeft);

			// drag scrollbar or open area in navigator
			} else if (grabbedCenter) {
				hasDragged = true;
				if (chartX < dragOffset) { // outside left
					chartX = dragOffset;
				} else if (chartX > plotWidth + dragOffset - range - 2 * scrollbarHeight) { // outside right
					chartX = plotWidth + dragOffset - range - 2 * scrollbarHeight;
				}

				render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
			}
		});

		addEvent(document, MOUSEUP, function() {
			if (hasDragged) {
				chart.xAxis[0].setExtremes(
					xAxis.translate(zoomedMin, true),
					xAxis.translate(zoomedMax, true),
					true,
					false
				);
			}
			grabbedLeft = grabbedRight = grabbedCenter = hasDragged = dragOffset = null;
			bodyStyle.cursor = defaultBodyCursor;
		});
	}

	/**
	 * Initiate the Scroller object
	 */
	function init() {
		var xAxisIndex = chart.xAxis.length,
			yAxisIndex = chart.yAxis.length;

		// make room below the chart
		chart.extraBottomMargin = outlineHeight + navigatorOptions.margin;

		if (navigatorEnabled) {
			var baseOptions = baseSeries.options,
				navigatorSeriesOptions,
				data = baseOptions.data;

			baseOptions.data = null; // remove it to prevent merging one by one

			navigatorSeriesOptions = merge(baseSeries.options, navigatorOptions.series, {
				threshold: null, // docs
				clip: false, // docs
				enableMouseTracking: false,
				group: 'nav', // for columns
				padXAxis: false,
				xAxis: xAxisIndex,
				yAxis: yAxisIndex,
				name: 'Navigator',
				showInLegend: false
			});

			baseOptions.data = navigatorSeriesOptions.data = data;

			// add the series
			navigatorSeries = chart.initSeries(navigatorSeriesOptions);

			// respond to updated data in the base series
			// todo: use similiar hook when base series is not yet initialized
			addEvent(baseSeries, 'updatedData', function() {
				var baseExtremes = baseSeries.xAxis.getExtremes(),
					range = baseExtremes.max - baseExtremes.min,
					stickToMax = baseExtremes.max >=
						navigatorSeries.xData[navigatorSeries.xData.length - 1],
					stickToMin = baseExtremes.min - range <=
						navigatorSeries.xData[0],
					newMax,
					newMin;

				// set the navigator series data to the new data of the base series
				navigatorSeries.options.pointStart = baseSeries.xData[0];
				navigatorSeries.setData(baseSeries.options.data);

				// if the selection is already at the max, move it to the right as new data
				// comes in
				if (stickToMax) {
					newMax = baseExtremes.dataMax;
					baseSeries.xAxis.setExtremes(newMax - range, newMax);
				} else if (stickToMin) {
					newMin = baseExtremes.dataMin;
					baseSeries.xAxis.setExtremes(newMin, newMin + range);
				// if not, just move the scroller window to reflect the new series data
				} else {
					render(
						mathMax(baseExtremes.min, baseExtremes.dataMin),
						mathMin(baseExtremes.max, baseExtremes.dataMax)
					);

				}
			});

			// an x axis is required for scrollbar also
			xAxis = new chart.Axis(merge(navigatorOptions.xAxis, {
				isX: true,
				type: 'datetime',
				index: xAxisIndex,
				height: height, // docs + width
				top: top, // docs + left
				offset: 0,
				offsetLeft: scrollbarHeight, // docs
				offsetRight: -scrollbarHeight, // docs
				startOnTick: false,
				endOnTick: false,
				minPadding: 0,
				maxPadding: 0,
				zoomEnabled: false
			}));

			yAxis = new chart.Axis(merge(navigatorOptions.yAxis, {
				alignTicks: false, // docs
				height: height,
				top: top,
				offset: 0,
				index: yAxisIndex,
				zoomEnabled: false
			}));

		// in case of scrollbar only, fake an x axis to get translation
		} else {
			xAxis = {
				translate: function(value, reverse) {
					var ext = baseSeries.xAxis.getExtremes(),
						scrollTrackWidth = chart.plotWidth - 2 * scrollbarHeight,
						dataMin = ext.dataMin,
						valueRange = ext.dataMax - dataMin;

					return reverse ?
						// from pixel to value
						(value * valueRange / scrollTrackWidth) + dataMin :
						// from value to pixel
						scrollTrackWidth * (value - dataMin) / valueRange;
				}
			};
		}

		addEvents();
	}


	// Run scroller
	init();

	// Expose
	return {
		render: render
	};

}

/* ****************************************************************************
 * End Scroller code														  *
 *****************************************************************************/

/* ****************************************************************************
 * Start Range Selector code												  *
 *****************************************************************************/
extend(defaultOptions, {
	rangeSelector: {
		// enabled: true,
		// buttons: {Object}
		// buttonTheme: {
		//	states: {
		//		hover: {},
		//		select: {}
		//	}
		// },
		// inputEnabled: true,
		// inputStyle: {}
		// labelStyle: {}
		// selected: undefined
		// todo:
		// - button styles for normal, hover and select state
		// - CSS text styles
		// - styles for the inputs and labels
	}
});
defaultOptions.lang = merge(defaultOptions.lang, {
	rangeSelectorZoom: 'Zoom',
	rangeSelectorFrom: 'From:',
	rangeSelectorTo: 'To:'
});

/**
 * The object constructor for the range selector
 * @param {Object} chart
 */
function RangeSelector(chart) {
	var renderer = chart.renderer,
		rendered,
		container = chart.container,
		lang = defaultOptions.lang,
		div,
		leftBox,
		rightBox,
		selected,
		buttons = [],
		buttonOptions,
		options,
		defaultButtons = [{
			type: 'month',
			count: 1,
			text: '1m'
		}, {
			type: 'month',
			count: 3,
			text: '3m'
		}, {
			type: 'month',
			count: 6,
			text: '6m'
		}, {
			type: 'ytd',
			text: 'YTD'
		}, {
			type: 'year',
			count: 1,
			text: '1y'
		}, {
			type: 'all',
			text: 'All'
		}];
		chart.resetZoomEnabled = false;

	/**
	 * The method to run when one of the buttons in the range selectors is clicked
	 * @param {Number} i The index of the button
	 * @param {Object} rangeOptions
	 * @param {Boolean} redraw
	 */
	function clickButton(i, rangeOptions, redraw) {

		var baseAxis = chart.xAxis[0],
			extremes = baseAxis && baseAxis.getExtremes(),
			now,
			dataMin = extremes && extremes.dataMin,
			dataMax = extremes && extremes.dataMax,
			newMin,
			newMax = baseAxis && mathMin(extremes.max, dataMax),
			date = new Date(newMax),
			type = rangeOptions.type,
			count = rangeOptions.count,
			range,
			rangeMin,
			// these time intervals have a fixed number of milliseconds, as opposed
			// to month, ytd and year
			fixedTimes = {
				millisecond: 1,
				second: 1000,
				minute: 60 * 1000,
				hour: 3600 * 1000,
				day: 24 * 3600 * 1000,
				week: 7 * 24 * 3600 * 1000
			};

		// chart has no data, base series is removed
		if (dataMin === null || dataMax === null) {
			return;
		}

		if (fixedTimes[type]) {
			range = fixedTimes[type] * count;
			newMin = mathMax(newMax - range, dataMin);
		}
		else if (type === 'month') {
			date.setMonth(date.getMonth() - count);
			newMin = mathMax(date.getTime(), dataMin);
			range = 30 * 24 * 3600 * 1000 * count;
		}
		else if (type === 'ytd') {
			date = new Date(0);
			now = new Date();
			date.setFullYear(now.getFullYear());
			newMin = rangeMin = mathMax(dataMin || 0, date.getTime());
			now = now.getTime();
			newMax = mathMin(dataMax || now, now);
		}
		else if (type === 'year') {
			date.setFullYear(date.getFullYear() - count);
			newMin = mathMax(dataMin, date.getTime());
			range = 365 * 24 * 3600 * 1000 * count;
		}
		else if (type === 'all' && baseAxis) {
			newMin = dataMin;
			newMax = dataMax;
		}

		// mark the button pressed
		if (buttons[i]) {
			buttons[i].setState(2);
		}

		// update the chart
		if (!baseAxis) { // axis not yet instanciated
			chart.options.xAxis = merge(
				chart.options.xAxis, {
					//zoomedRange: {
						range: range,
						min: rangeMin
					//}
				}
			);
			selected = i;

		} else { // existing axis object; after render time
			setTimeout(function() { // make sure the visual state is set before the heavy process begins
				baseAxis.setExtremes(
					newMin,
					newMax,
					pick(redraw, 1),
					0
				);
				selected = i;
			}, 1);
		}

	}

	/**
	 * Initialize the range selector
	 */
	function init() {
		chart.extraTopMargin = 25;
		options = chart.options.rangeSelector;
		buttonOptions = options.buttons || defaultButtons;
		selected = options.selected;

		addEvent(container, MOUSEDOWN, function() {

			if (leftBox) {
				leftBox.blur();
			}
			if (rightBox) {
				rightBox.blur();
			}
		});

		// zoomed range based on a pre-selected button index
		if (selected !== UNDEFINED && buttonOptions[selected]) {
			clickButton(selected, buttonOptions[selected], false);
		}

		// normalize the pressed button whenever a new range is selected
		addEvent(chart, 'beforeRender', function() {
			addEvent(chart.xAxis[0], 'setExtremes', function() {
				if (buttons[selected]) {
					buttons[selected].setState(0);
				}
			});
		});
	}


	/**
	 * Set the internal and displayed value of a HTML input for the dates
	 * @param {Object} input
	 * @param {Number} time
	 */
	function setInputValue(input, time) {
		var format = input.hasFocus ? '%Y-%m-%d' : '%b %e, %Y';
		if (time) {
			input.HCTime = time;
		}
		input.value = dateFormat(format, input.HCTime);
	}

	/**
	 * Draw either the 'from' or the 'to' HTML input box of the range selector
	 * @param {Object} name
	 */
	function drawInput(name) {
		var isMin = name === 'min',
			input;

		// create the text label
		createElement('span', {
			innerHTML: lang[isMin ? 'rangeSelectorFrom' : 'rangeSelectorTo']
		}, options.labelStyle, div);

		// create the input element
		input = createElement('input', {
			name: name,
			className: 'highcharts-range-selector',
			type: 'text'
		}, extend({
			width: '80px',
			height: '16px',
			border: '1px solid silver',
			marginLeft: '5px',
			marginRight: isMin ? '5px' : '0',
			textAlign: 'center'
		}, options.inputStyle), div);


		input.onfocus = input.onblur = function(e) {
			e = e || window.event;
			input.hasFocus = e.type === 'focus';
			setInputValue(input);
		};

		input.onchange = function() {
			var value = Date.parse(input.value),
				extremes = chart.xAxis[0].getExtremes();

			if (!isNaN(value) &&
				((isMin && (value > extremes.dataMin && value < rightBox.HCTime)) ||
				(!isMin && (value < extremes.dataMax && value > leftBox.HCTime)))
			) {
				chart.xAxis[0].setExtremes(
					isMin ? value : extremes.min,
					isMin ? extremes.max : value
				);
			}
		};

		return input;
	}

	/**
	 * Render the range selector including the buttons and the inputs. The first time render
	 * is called, the elements are created and positioned. On subsequent calls, they are
	 * moved and updated.
	 * @param {Number} min X axis minimum
	 * @param {Number} max X axis maximum
	 */
	function render(min, max) {
		var chartStyle = chart.options.chart.style,
			buttonTheme = options.buttonTheme,
			inputEnabled = options.inputEnabled !== false,
			states = buttonTheme && buttonTheme.states;

		// create the elements
		if (!rendered) {
			renderer.text(lang.rangeSelectorZoom, chart.plotLeft, chart.plotTop - 10)
				.css(options.labelStyle)
				.add();

			each(buttonOptions, function(rangeOptions, i) {
				buttons[i] = renderer.button(
					rangeOptions.text,
					chart.plotLeft + 50 +  i * 30,
					chart.plotTop - 25,
					function() {
						clickButton(i, rangeOptions);
						this.isActive = true;
					},
					extend(buttonTheme, {
						padding: 1,
						r: 0
					}),
					states && states.hover,
					states && states.select
				)
				.attr({
					width: 28
				})
				.css(extend ({
					textAlign: 'center'
				}, options.buttonStyle))
				.add();

				if (selected === i) {
					buttons[i].setState(2);
				}

			});

			// first create a wrapper outside the container in order to make
			// the inputs work and make export correct
			if (inputEnabled) {
				div = createElement('div', null, {
					position: 'relative',
					height: 0,
					fontFamily: chartStyle.fontFamily,
					fontSize: chartStyle.fontSize
				}, container.parentNode);

				// create an absolutely positionied div to keep the inputs
				div = createElement('div', null, extend({
					position: 'absolute',
					top: (-chart.chartHeight + chart.plotTop - 25) +'px',
					right: (chart.chartWidth - chart.plotLeft - chart.plotWidth) + 'px'
				}, options.inputBoxStyle), div);

				leftBox = drawInput('min');

				rightBox = drawInput('max');
			}
		}

		if (inputEnabled) {
			setInputValue(leftBox, min);
			setInputValue(rightBox, max);
		}


		rendered = true;
	}



	// Run RangeSelector
	init();

	// Expose
	return {
		render: render
	};
}

/* ****************************************************************************
 * End Range Selector code													*
 *****************************************************************************/

HC.addEvent(HC.Chart.prototype, 'init', function(e) {
	var chart = e.target,
		chartOptions = chart.options;

	// initiate the range selector
	if (chartOptions.rangeSelector.enabled) {
		chart.rangeSelector = new RangeSelector(chart);
	}
});
HC.addEvent(HC.Chart.prototype, 'beforeRender', function(e) {
	var chart = e.target,
		chartOptions = chart.options;

	// initiate the scroller
	if (chartOptions.navigator.enabled || chartOptions.scrollbar.enabled) {
		chart.scroller = new Scroller(chart);
	}
});

HC.Chart.prototype.callbacks.push(function(chart) {
	var extremes,
		scroller = chart.scroller,
		rangeSelector = chart.rangeSelector;

	function renderScroller() {
		extremes = chart.xAxis[0].getExtremes();
		scroller.render(
			mathMax(extremes.min, extremes.dataMin),
			mathMin(extremes.max, extremes.dataMax)
		);
	}

	function renderRangeSelector() {
		extremes = chart.xAxis[0].getExtremes();
		rangeSelector.render(extremes.min, extremes.max);
	}

	// initiate the scroller
	if (scroller) {

		// redraw the scroller on setExtremes
		addEvent(chart.xAxis[0], 'setExtremes', function(e) {
			scroller.render(e.min, e.max);
		});

		// redraw the scroller chart resize
		addEvent(chart, 'resize', renderScroller);


		// do it now
		renderScroller();

	}
	if (rangeSelector) {



		// redraw the scroller on setExtremes
		addEvent(chart.xAxis[0], 'setExtremes', function(e) {
			rangeSelector.render(e.min, e.max);
		});

		// redraw the scroller chart resize
		addEvent(chart, 'resize', renderRangeSelector);


		// do it now
		renderRangeSelector();

	}
});



var symbols = HC.Renderer.prototype.symbols;

// create the flag icon with anchor
symbols.flag = function(x, y, w, h, options) {
	var anchorX = (options && options.anchorX) || x,
		anchorY = (options &&  options.anchorY) || y;

	return [
		'M', anchorX, anchorY,
		'L', x, y + h,
		x, y,
		x + w, y,
		x + w, y + h,
		x, y + h,
		'M', anchorX, anchorY,
		'Z'
	];
};

// create the circlepin and squarepin icons with anchor
each(['circle', 'square'], function(shape) {
	symbols[shape +'pin'] = function(x, y, w, h, options) {
		var anchorX = options && options.anchorX,
			anchorY = options &&  options.anchorY,
			path = symbols[shape](x, y, w, h);

		if (anchorX && anchorY) {
			path.push('M', x + w / 2, y + h, 'L', anchorX, anchorY);
		}

		//console.trace(x, y, );
		return path;
	};
});



/**
 * A wrapper for Chart with all the default values for a Stock chart
 */
HC.StockChart = function(options, callback) {
	var seriesOptions = options.series, // to increase performance, don't merge the data
		lineOptions = {

			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: true,
						radius: 5
					}
				}
			},
			shadow: false,
			states: {
				hover: {
					lineWidth: 2
				}
			}
		};

	// apply Y axis options to both single and multi y axes
	options.yAxis = map (splat(options.yAxis || {}), function(yAxisOptions) {
		return merge({
			labels: {
				align: 'left',
				x: 2,
				y: -2
			},
			showLastLabel: false,
			title: {
				text: null
			}
		}, yAxisOptions);
	});

	options.series = null;

	options = merge({
		chart: {
			panning: true // docs
		},
		navigator: {
			enabled: true
		},
		scrollbar: {
			enabled: true
		},
		rangeSelector: {
			enabled: true
		},
		title: {
			text: null
		},
		tooltip: {
			shared: true,
			crosshairs: true
		},
		legend: {
			enabled: false
		},
		xAxis: {
			title: {
				text: null
			},
			showLastLabel: true
		},

		plotOptions: {
			line: lineOptions,
			spline: lineOptions,
			area: lineOptions,
			areaspline: lineOptions,
			column: {
				shadow: false,
				borderWidth: 0
			}
		}

	},
	options, // user's options

	{ // forced options
		chart: {
			inverted: false
		},
		xAxis: {
			type: 'datetime',
			categories: null
		}
	});

	options.series = seriesOptions;


	return new HC.Chart(options, callback);
};

}());
