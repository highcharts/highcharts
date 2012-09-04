/**
 * The Point object and prototype. Inheritable and used as base for PiePoint
 */
var Point = function () {};
Point.prototype = {

	/**
	 * Initialize the point
	 * @param {Object} series The series object containing this point
	 * @param {Object} options The data in either number, array or object format
	 */
	init: function (series, options, x) {
		var point = this,
			counters = series.chart.counters,
			defaultColors;
		point.series = series;
		point.applyOptions(options, x);
		point.pointAttr = {};

		if (series.options.colorByPoint) {
			defaultColors = series.chart.options.colors;
			point.color = point.color || defaultColors[counters.color++];

			// loop back to zero
			counters.wrapColor(defaultColors.length);
		}

		series.chart.pointCount++;
		return point;
	},
	/**
	 * Apply the options containing the x and y data and possible some extra properties.
	 * This is called on point init or from point.update.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options, x) {
		var point = this,
			series = point.series,
			optionsType = typeof options;

		point.config = options;

		// onedimensional array input
		if (optionsType === 'number' || options === null) {
			point.y = options;
		} else if (typeof options[0] === 'number') { // two-dimentional array
			point.x = options[0];
			point.y = options[1];
		} else if (optionsType === 'object' && typeof options.length !== 'number') { // object input
			// copy options directly to point
			extend(point, options);
			point.options = options;
			
			// This is the fastest way to detect if there are individual point dataLabels that need 
			// to be considered in drawDataLabels. These can only occur in object configs.
			if (options.dataLabels) {
				series._hasPointLabels = true;
			}
			
			// Same approach as above for markers
			if (options.marker) {
				series._hasPointMarkers = true;
			}
		} else if (typeof options[0] === 'string') { // categorized data with name in first position
			point.name = options[0];
			point.y = options[1];
		}
		
		/*
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		// todo: skip this? It is only used in applyOptions, in translate it should not be used
		if (point.x === UNDEFINED) {
			point.x = x === UNDEFINED ? series.autoIncrement() : x;
		}
		
	},

	/**
	 * Destroy a point to clear memory. Its reference still stays in series.data.
	 */
	destroy: function () {
		var point = this,
			series = point.series,
			chart = series.chart,
			hoverPoints = chart.hoverPoints,
			prop;

		chart.pointCount--;

		if (hoverPoints) {
			point.setState();
			erase(hoverPoints, point);
			if (!hoverPoints.length) {
				chart.hoverPoints = null;
			}

		}
		if (point === chart.hoverPoint) {
			point.onMouseOut();
		}
		
		// remove all events
		if (point.graphic || point.dataLabel) { // removeEvent and destroyElements are performance expensive
			removeEvent(point);
			point.destroyElements();
		}

		if (point.legendItem) { // pies have legend items
			chart.legend.destroyItem(point);
		}

		for (prop in point) {
			point[prop] = null;
		}


	},

	/**
	 * Destroy SVG elements associated with the point
	 */
	destroyElements: function () {
		var point = this,
			props = ['graphic', 'tracker', 'dataLabel', 'group', 'connector', 'shadowGroup'],
			prop,
			i = 6;
		while (i--) {
			prop = props[i];
			if (point[prop]) {
				point[prop] = point[prop].destroy();
			}
		}
	},

	/**
	 * Return the configuration hash needed for the data label and tooltip formatters
	 */
	getLabelConfig: function () {
		var point = this;
		return {
			x: point.category,
			y: point.y,
			key: point.name || point.category,
			series: point.series,
			point: point,
			percentage: point.percentage,
			total: point.total || point.stackTotal
		};
	},

	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 *     this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function (selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;

		selected = pick(selected, !point.selected);

		// fire the event with the defalut handler
		point.firePointEvent(selected ? 'select' : 'unselect', { accumulate: accumulate }, function () {
			point.selected = selected;
			point.setState(selected && SELECT_STATE);

			// unselect all other points unless Ctrl or Cmd + click
			if (!accumulate) {
				each(chart.getSelectedPoints(), function (loopPoint) {
					if (loopPoint.selected && loopPoint !== point) {
						loopPoint.selected = false;
						loopPoint.setState(NORMAL_STATE);
						loopPoint.firePointEvent('unselect');
					}
				});
			}
		});
	},

	onMouseOver: function () {
		var point = this,
			series = point.series,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// set normal state to previous series
		if (hoverPoint && hoverPoint !== point) {
			hoverPoint.onMouseOut();
		}

		// trigger the event
		point.firePointEvent('mouseOver');

		// update the tooltip
		if (tooltip && (!tooltip.shared || series.noSharedTooltip)) {
			tooltip.refresh(point);
		}

		// hover this
		point.setState(HOVER_STATE);
		chart.hoverPoint = point;
	},

	onMouseOut: function () {
		var chart = this.series.chart,
			hoverPoints = chart.hoverPoints;
		
		if (!hoverPoints || inArray(this, hoverPoints) === -1) { // #887
			this.firePointEvent('mouseOut');
	
			this.setState();
			chart.hoverPoint = null;
		}
	},

	/**
	 * Extendable method for formatting each point's tooltip line
	 *
	 * @return {String} A string to be concatenated in to the common tooltip text
	 */
	tooltipFormatter: function (pointFormat) {
		var point = this,
			series = point.series,
			seriesTooltipOptions = series.tooltipOptions,
			match = pointFormat.match(/\{(series|point)\.[a-zA-Z]+\}/g),
			splitter = /[{\.}]/,
			obj,
			key,
			replacement,
			repOptionKey,
			parts,
			prop,
			i,
			cfg = { // docs: percentageDecimals, percentagePrefix, percentageSuffix, totalDecimals, totalPrefix, totalSuffix
				y: 0, // 0: use 'value' for repOptionKey
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				percentage: 1, // 1: use the self name for repOptionKey
				total: 1
			};
		
		// Backwards compatibility to y naming in early Highstock
		seriesTooltipOptions.valuePrefix = seriesTooltipOptions.valuePrefix || seriesTooltipOptions.yPrefix;
		seriesTooltipOptions.valueDecimals = seriesTooltipOptions.valueDecimals || seriesTooltipOptions.yDecimals;
		seriesTooltipOptions.valueSuffix = seriesTooltipOptions.valueSuffix || seriesTooltipOptions.ySuffix;

		// loop over the variables defined on the form {series.name}, {point.y} etc
		for (i in match) {
			key = match[i];
			if (isString(key) && key !== pointFormat) { // IE matches more than just the variables
				
				// Split it further into parts
				parts = (' ' + key).split(splitter); // add empty string because IE and the rest handles it differently
				obj = { 'point': point, 'series': series }[parts[1]];
				prop = parts[2];
				
				// Add some preformatting
				if (obj === point && cfg.hasOwnProperty(prop)) {
					repOptionKey = cfg[prop] ? prop : 'value';
					replacement = (seriesTooltipOptions[repOptionKey + 'Prefix'] || '') + 
						numberFormat(point[prop], pick(seriesTooltipOptions[repOptionKey + 'Decimals'], -1)) +
						(seriesTooltipOptions[repOptionKey + 'Suffix'] || '');
				
				// Automatic replacement
				} else {
					replacement = obj[prop];
				}
				
				pointFormat = pointFormat.replace(key, replacement);
			}
		}
		
		return pointFormat;
	},

	/**
	 * Update the point with new options (typically x/y data) and optionally redraw the series.
	 *
	 * @param {Object} options Point options as defined in the series.data array
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 */
	update: function (options, redraw, animation) {
		var point = this,
			series = point.series,
			graphic = point.graphic,
			i,
			data = series.data,
			dataLength = data.length,
			chart = series.chart;

		redraw = pick(redraw, true);

		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function () {

			point.applyOptions(options);

			// update visuals
			if (isObject(options)) {
				series.getAttribs();
				if (graphic) {
					graphic.attr(point.pointAttr[series.state]);
				}
			}

			// record changes in the parallel arrays
			for (i = 0; i < dataLength; i++) {
				if (data[i] === point) {
					series.xData[i] = point.x;
					series.yData[i] = point.y;
					series.options.data[i] = options;
					break;
				}
			}

			// redraw
			series.isDirty = true;
			series.isDirtyData = true;
			if (redraw) {
				chart.redraw(animation);
			}
		});
	},

	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	remove: function (redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			i,
			data = series.data,
			dataLength = data.length;

		setAnimation(animation, chart);
		redraw = pick(redraw, true);

		// fire the event with a default handler of removing the point
		point.firePointEvent('remove', null, function () {

			//erase(series.data, point);

			for (i = 0; i < dataLength; i++) {
				if (data[i] === point) {

					// splice all the parallel arrays
					data.splice(i, 1);
					series.options.data.splice(i, 1);
					series.xData.splice(i, 1);
					series.yData.splice(i, 1);
					break;
				}
			}

			point.destroy();


			// redraw
			series.isDirty = true;
			series.isDirtyData = true;
			if (redraw) {
				chart.redraw();
			}
		});


	},

	/**
	 * Fire an event on the Point object. Must not be renamed to fireEvent, as this
	 * causes a name clash in MooTools
	 * @param {String} eventType
	 * @param {Object} eventArgs Additional event arguments
	 * @param {Function} defaultFunction Default event handler
	 */
	firePointEvent: function (eventType, eventArgs, defaultFunction) {
		var point = this,
			series = this.series,
			seriesOptions = series.options;

		// load event handlers on demand to save time on mouseover/out
		if (seriesOptions.point.events[eventType] || (point.options && point.options.events && point.options.events[eventType])) {
			this.importEvents();
		}

		// add default handler if in selection mode
		if (eventType === 'click' && seriesOptions.allowPointSelect) {
			defaultFunction = function (event) {
				// Control key is for Windows, meta (= Cmd key) for Mac, Shift for Opera
				point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
			};
		}

		fireEvent(this, eventType, eventArgs, defaultFunction);
	},
	/**
	 * Import events from the series' and point's options. Only do it on
	 * demand, to save processing time on hovering.
	 */
	importEvents: function () {
		if (!this.hasImportedEvents) {
			var point = this,
				options = merge(point.series.options.point, point.options),
				events = options.events,
				eventType;

			point.events = events;

			for (eventType in events) {
				addEvent(point, eventType, events[eventType]);
			}
			this.hasImportedEvents = true;

		}
	},

	/**
	 * Set the point's state
	 * @param {String} state
	 */
	setState: function (state) {
		var point = this,
			plotX = point.plotX,
			plotY = point.plotY,
			series = point.series,
			stateOptions = series.options.states,
			markerOptions = defaultPlotOptions[series.type].marker && series.options.marker,
			normalDisabled = markerOptions && !markerOptions.enabled,
			markerStateOptions = markerOptions && markerOptions.states[state],
			stateDisabled = markerStateOptions && markerStateOptions.enabled === false,
			stateMarkerGraphic = series.stateMarkerGraphic,
			chart = series.chart,
			radius,
			pointAttr = point.pointAttr;

		state = state || NORMAL_STATE; // empty string

		if (
				// already has this state
				state === point.state ||
				// selected points don't respond to hover
				(point.selected && state !== SELECT_STATE) ||
				// series' state options is disabled
				(stateOptions[state] && stateOptions[state].enabled === false) ||
				// point marker's state options is disabled
				(state && (stateDisabled || (normalDisabled && !markerStateOptions.enabled)))

			) {
			return;
		}

		// apply hover styles to the existing point
		if (point.graphic) {
			radius = markerOptions && point.graphic.symbolName && pointAttr[state].r;
			point.graphic.attr(merge(
				pointAttr[state],
				radius ? { // new symbol attributes (#507, #612)
					x: plotX - radius,
					y: plotY - radius,
					width: 2 * radius,
					height: 2 * radius
				} : {}
			));
		} else {
			// if a graphic is not applied to each point in the normal state, create a shared
			// graphic for the hover state
			if (state && markerStateOptions) {
				radius = markerStateOptions.radius;
				if (!stateMarkerGraphic) { // add
					series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.symbol(
						series.symbol,
						plotX - radius,
						plotY - radius,
						2 * radius,
						2 * radius
					)
					.attr(pointAttr[state])
					.add(series.markerGroup);
				
				} else { // update
					stateMarkerGraphic.attr({ // #1054
						x: plotX - radius,
						y: plotY - radius
					});
				}
			}

			if (stateMarkerGraphic) {
				stateMarkerGraphic[state && chart.isInsidePlot(plotX, plotY) ? 'show' : 'hide']();
			}
		}

		point.state = state;
	}
};

/**
 * @classDescription The base function which all other series types inherit from. The data in the series is stored
 * in various arrays.
 *
 * - First, series.options.data contains all the original config options for
 * each point whether added by options or methods like series.addPoint.
 * - Next, series.data contains those values converted to points, but in case the series data length
 * exceeds the cropThreshold, or if the data is grouped, series.data doesn't contain all the points. It
 * only contains the points that have been created on demand.
 * - Then there's series.points that contains all currently visible point objects. In case of cropping,
 * the cropped-away points are not part of this array. The series.points array starts at series.cropStart
 * compared to series.data and series.options.data. If however the series data is grouped, these can't
 * be correlated one to one.
 * - series.xData and series.processedXData contain clean x values, equivalent to series.data and series.points.
 * - series.yData and series.processedYData contain clean x values, equivalent to series.data and series.points.
 *
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function () {};

Series.prototype = {

	isCartesian: true,
	type: 'line',
	pointClass: Point,
	sorted: true, // requires the data to be sorted
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		r: 'radius'
	},
	init: function (chart, options) {
		var series = this,
			eventType,
			events;

		series.chart = chart;
		series.options = options = series.setOptions(options); // merge with plotOptions
		
		// bind the axes
		series.bindAxes();

		// set some variables
		extend(series, {
			name: options.name,
			state: NORMAL_STATE,
			pointAttr: {},
			visible: options.visible !== false, // true by default
			selected: options.selected === true // false by default
		});
		
		// special
		if (useCanVG) {
			options.animation = false;
		}

		// register event listeners
		events = options.events;
		for (eventType in events) {
			addEvent(series, eventType, events[eventType]);
		}
		if (
			(events && events.click) ||
			(options.point && options.point.events && options.point.events.click) ||
			options.allowPointSelect
		) {
			chart.runTrackerClick = true;
		}

		series.getColor();
		series.getSymbol();

		// set the data
		series.setData(options.data, false);
		
		// Mark cartesian
		if (series.isCartesian) {
			chart.hasCartesianSeries = true;
		}

		// Register it in the chart
		chart.series.push(series);
		
		// Sort series according to index option (#248, #1123)
		stableSort(chart.series, function (a, b) {
			return (a.options.index || 0) - (b.options.index || 0);
		});
		each(chart.series, function (series, i) {
			series.index = i;
			series.name = series.name || 'Series ' + (i + 1);
		});
	},
	
	/**
	 * Set the xAxis and yAxis properties of cartesian series, and register the series
	 * in the axis.series array
	 */
	bindAxes: function () {
		var series = this,
			seriesOptions = series.options,
			chart = series.chart,
			axisOptions;
			
		if (series.isCartesian) {
			
			each(['xAxis', 'yAxis'], function (AXIS) { // repeat for xAxis and yAxis
				
				each(chart[AXIS], function (axis) { // loop through the chart's axis objects
					
					axisOptions = axis.options;
					
					// apply if the series xAxis or yAxis option mathches the number of the 
					// axis, or if undefined, use the first axis
					if ((seriesOptions[AXIS] === axisOptions.index) ||
							(seriesOptions[AXIS] === UNDEFINED && axisOptions.index === 0)) {
						
						// register this series in the axis.series lookup
						axis.series.push(series);
						
						// set this series.xAxis or series.yAxis reference
						series[AXIS] = axis;
						
						// mark dirty for redraw
						axis.isDirty = true;
					}
				});
				
			});
		}
	},


	/**
	 * Return an auto incremented x value based on the pointStart and pointInterval options.
	 * This is only used if an x value is not given for the point that calls autoIncrement.
	 */
	autoIncrement: function () {
		var series = this,
			options = series.options,
			xIncrement = series.xIncrement;

		xIncrement = pick(xIncrement, options.pointStart, 0);

		series.pointInterval = pick(series.pointInterval, options.pointInterval, 1);

		series.xIncrement = xIncrement + series.pointInterval;
		return xIncrement;
	},

	/**
	 * Divide the series data into segments divided by null values.
	 */
	getSegments: function () {
		var series = this,
			lastNull = -1,
			segments = [],
			i,
			points = series.points,
			pointsLength = points.length;

		if (pointsLength) { // no action required for []
			
			// if connect nulls, just remove null points
			if (series.options.connectNulls) {
				i = pointsLength;
				while (i--) {
					if (points[i].y === null) {
						points.splice(i, 1);
					}
				}
				if (points.length) {
					segments = [points];
				}
				
			// else, split on null points
			} else {
				each(points, function (point, i) {
					if (point.y === null) {
						if (i > lastNull + 1) {
							segments.push(points.slice(lastNull + 1, i));
						}
						lastNull = i;
					} else if (i === pointsLength - 1) { // last value
						segments.push(points.slice(lastNull + 1, i + 1));
					}
				});
			}
		}
		
		// register it
		series.segments = segments;
	},
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} itemOptions
	 */
	setOptions: function (itemOptions) {
		var chart = this.chart,
			chartOptions = chart.options,
			plotOptions = chartOptions.plotOptions,
			typeOptions = plotOptions[this.type],
			data = itemOptions.data,
			options;

		itemOptions.data = null; // remove from merge to prevent looping over the data set

		options = merge(
			typeOptions,
			plotOptions.series,
			itemOptions
		);
		
		// Re-insert the data array to the options and the original config (#717)
		options.data = itemOptions.data = data;
		
		// the tooltip options are merged between global and series specific options
		this.tooltipOptions = merge(chartOptions.tooltip, options.tooltip);
		
		// Delte marker object if not allowed (#1125)
		if (typeOptions.marker === null) {
			delete options.marker;
		}
		
		return options;

	},
	/**
	 * Get the series' color
	 */
	getColor: function () {
		var options = this.options,
			defaultColors = this.chart.options.colors,
			counters = this.chart.counters;
		this.color = options.color ||
			(!options.colorByPoint && defaultColors[counters.color++]) || 'gray';
		counters.wrapColor(defaultColors.length);
	},
	/**
	 * Get the series' symbol
	 */
	getSymbol: function () {
		var series = this,
			seriesMarkerOption = series.options.marker,
			chart = series.chart,
			defaultSymbols = chart.options.symbols,
			counters = chart.counters;
		series.symbol = seriesMarkerOption.symbol || defaultSymbols[counters.symbol++];
		
		// don't substract radius in image symbols (#604)
		if (/^url/.test(series.symbol)) {
			seriesMarkerOption.radius = 0;
		}
		counters.wrapSymbol(defaultSymbols.length);
	},

	/**
	 * Get the series' symbol in the legend. This method should be overridable to create custom 
	 * symbols through Highcharts.seriesTypes[type].prototype.drawLegendSymbols.
	 * 
	 * @param {Object} legend The legend object
	 */
	drawLegendSymbol: function (legend) {
		
		var options = this.options,
			markerOptions = options.marker,
			radius,
			legendOptions = legend.options,
			legendSymbol,
			symbolWidth = legendOptions.symbolWidth,
			renderer = this.chart.renderer,
			legendItemGroup = this.legendGroup,
			baseline = legend.baseline,
			attr;
			
		// Draw the line
		if (options.lineWidth) {
			attr = {
				'stroke-width': options.lineWidth
			};
			if (options.dashStyle) {
				attr.dashstyle = options.dashStyle;
			}
			this.legendLine = renderer.path([
				M,
				0,
				baseline - 4,
				L,
				symbolWidth,
				baseline - 4
			])
			.attr(attr)
			.add(legendItemGroup);
		}
		
		// Draw the marker
		if (markerOptions && markerOptions.enabled) {
			radius = markerOptions.radius;
			this.legendSymbol = legendSymbol = renderer.symbol(
				this.symbol,
				(symbolWidth / 2) - radius,
				baseline - 4 - radius,
				2 * radius,
				2 * radius
			)
			.add(legendItemGroup);
		}
	},

	/**
	 * Add a point dynamically after chart load time
	 * @param {Object} options Point options as given in series.data
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean} shift If shift is true, a point is shifted off the start
	 *    of the series as one is appended to the end.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	addPoint: function (options, redraw, shift, animation) {
		var series = this,
			data = series.data,
			graph = series.graph,
			area = series.area,
			chart = series.chart,
			xData = series.xData,
			yData = series.yData,
			currentShift = (graph && graph.shift) || 0,
			dataOptions = series.options.data,
			point,
			proto = series.pointClass.prototype;

		setAnimation(animation, chart);

		// Make graph animate sideways
		if (graph && shift) { 
			graph.shift = currentShift + 1;
		}
		if (area) {
			if (shift) { // #780
				area.shift = currentShift + 1;
			}
			area.isArea = true; // needed in animation, both with and without shift
		}
		
		// Optional redraw, defaults to true
		redraw = pick(redraw, true);

		// Get options and push the point to xData, yData and series.options. In series.generatePoints
		// the Point instance will be created on demand and pushed to the series.data array.
		point = { series: series };
		proto.applyOptions.apply(point, [options]);
		xData.push(point.x);
		yData.push(proto.toYData ? proto.toYData.call(point) : point.y);
		dataOptions.push(options);


		// Shift the first point off the parallel arrays
		// todo: consider series.removePoint(i) method
		if (shift) {
			if (data[0] && data[0].remove) {
				data[0].remove(false);
			} else {
				data.shift();
				xData.shift();
				yData.shift();
				dataOptions.shift();
			}
		}
		series.getAttribs();

		// redraw
		series.isDirty = true;
		series.isDirtyData = true;
		if (redraw) {
			chart.redraw();
		}
	},

	/**
	 * Replace the series data with a new set of data
	 * @param {Object} data
	 * @param {Object} redraw
	 */
	setData: function (data, redraw) {
		var series = this,
			oldData = series.points,
			options = series.options,
			initialColor = series.initialColor,
			chart = series.chart,
			firstPoint = null,
			xAxis = series.xAxis,
			i,
			pointProto = series.pointClass.prototype;

		// reset properties
		series.xIncrement = null;
		series.pointRange = xAxis && xAxis.categories ? 1 : options.pointRange;

		if (defined(initialColor)) { // reset colors for pie
			chart.counters.color = initialColor;
		}
		
		// parallel arrays
		var xData = [],
			yData = [],
			dataLength = data ? data.length : [],
			turboThreshold = options.turboThreshold || 1000,
			pt,
			pointArrayMap = series.pointArrayMap,
			valueCount = pointArrayMap && pointArrayMap.length;

		// In turbo mode, only one- or twodimensional arrays of numbers are allowed. The
		// first value is tested, and we assume that all the rest are defined the same
		// way. Although the 'for' loops are similar, they are repeated inside each
		// if-else conditional for max performance.
		if (dataLength > turboThreshold) {
			
			// find the first non-null point
			i = 0;
			while (firstPoint === null && i < dataLength) {
				firstPoint = data[i];
				i++;
			}
		
		
			if (isNumber(firstPoint)) { // assume all points are numbers
				var x = pick(options.pointStart, 0),
					pointInterval = pick(options.pointInterval, 1);

				for (i = 0; i < dataLength; i++) {
					xData[i] = x;
					yData[i] = data[i];
					x += pointInterval;
				}
				series.xIncrement = x;
			} else if (isArray(firstPoint)) { // assume all points are arrays
				if (valueCount) { // [x, low, high] or [x, o, h, l, c]
					for (i = 0; i < dataLength; i++) {
						pt = data[i];
						xData[i] = pt[0];
						yData[i] = pt.slice(1, valueCount + 1);
					}
				} else { // [x, y]
					for (i = 0; i < dataLength; i++) {
						pt = data[i];
						xData[i] = pt[0];
						yData[i] = pt[1];
					}
				}
			} /* else {
				error(12); // Highcharts expects configs to be numbers or arrays in turbo mode
			}*/
		} else {
			for (i = 0; i < dataLength; i++) {
				pt = { series: series };
				pointProto.applyOptions.apply(pt, [data[i]]);
				xData[i] = pt.x;
				yData[i] = pointProto.toYData ? pointProto.toYData.call(pt) : pt.y;
			}
		}

		// Forgetting to cast strings to numbers is a common caveat when handling CSV or JSON		
		if (isString(yData[0])) {
			error(14, true);
		} 

		series.data = [];
		series.options.data = data;
		series.xData = xData;
		series.yData = yData;

		// destroy old points
		i = (oldData && oldData.length) || 0;
		while (i--) {
			if (oldData[i] && oldData[i].destroy) {
				oldData[i].destroy();
			}
		}

		// reset minRange (#878)
		if (xAxis) {
			xAxis.minRange = xAxis.userMinRange;
		}

		// redraw
		series.isDirty = series.isDirtyData = chart.isDirtyBox = true;
		if (pick(redraw, true)) {
			chart.redraw(false);
		}
	},

	/**
	 * Remove a series and optionally redraw the chart
	 *
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */

	remove: function (redraw, animation) {
		var series = this,
			chart = series.chart;
		redraw = pick(redraw, true);

		if (!series.isRemoving) {  /* prevent triggering native event in jQuery
				(calling the remove function from the remove event) */
			series.isRemoving = true;

			// fire the event with a default handler of removing the point
			fireEvent(series, 'remove', null, function () {


				// destroy elements
				series.destroy();


				// redraw
				chart.isDirtyLegend = chart.isDirtyBox = true;
				if (redraw) {
					chart.redraw(animation);
				}
			});

		}
		series.isRemoving = false;
	},

	/**
	 * Process the data by cropping away unused data points if the series is longer
	 * than the crop threshold. This saves computing time for lage series.
	 */
	processData: function (force) {
		var series = this,
			processedXData = series.xData, // copied during slice operation below
			processedYData = series.yData,
			dataLength = processedXData.length,
			cropStart = 0,
			cropEnd = dataLength,
			cropped,
			distance,
			closestPointRange,
			xAxis = series.xAxis,
			i, // loop variable
			options = series.options,
			cropThreshold = options.cropThreshold,
			isCartesian = series.isCartesian;

		// If the series data or axes haven't changed, don't go through this. Return false to pass
		// the message on to override methods like in data grouping. 
		if (isCartesian && !series.isDirty && !xAxis.isDirty && !series.yAxis.isDirty && !force) {
			return false;
		}

		// optionally filter out points outside the plot area
		if (isCartesian && series.sorted && (!cropThreshold || dataLength > cropThreshold || series.forceCrop)) {
			var extremes = xAxis.getExtremes(),
				min = extremes.min,
				max = extremes.max;

			// it's outside current extremes
			if (processedXData[dataLength - 1] < min || processedXData[0] > max) {
				processedXData = [];
				processedYData = [];
			
			// only crop if it's actually spilling out
			} else if (processedXData[0] < min || processedXData[dataLength - 1] > max) {

				// iterate up to find slice start
				for (i = 0; i < dataLength; i++) {
					if (processedXData[i] >= min) {
						cropStart = mathMax(0, i - 1);
						break;
					}
				}
				// proceed to find slice end
				for (; i < dataLength; i++) {
					if (processedXData[i] > max) {
						cropEnd = i + 1;
						break;
					}
					
				}
				processedXData = processedXData.slice(cropStart, cropEnd);
				processedYData = processedYData.slice(cropStart, cropEnd);
				cropped = true;
			}
		}
		
		
		// Find the closest distance between processed points
		for (i = processedXData.length - 1; i > 0; i--) {
			distance = processedXData[i] - processedXData[i - 1];
			if (distance > 0 && (closestPointRange === UNDEFINED || distance < closestPointRange)) {
				closestPointRange = distance;
			}
		}
		
		// Record the properties
		series.cropped = cropped; // undefined or true
		series.cropStart = cropStart;
		series.processedXData = processedXData;
		series.processedYData = processedYData;
		
		if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
			series.pointRange = closestPointRange || 1;
		}
		series.closestPointRange = closestPointRange;
		
	},

	/**
	 * Generate the data point after the data has been processed by cropping away
	 * unused points and optionally grouped in Highcharts Stock.
	 */
	generatePoints: function () {
		var series = this,
			options = series.options,
			dataOptions = options.data,
			data = series.data,
			dataLength,
			processedXData = series.processedXData,
			processedYData = series.processedYData,
			pointClass = series.pointClass,
			processedDataLength = processedXData.length,
			cropStart = series.cropStart || 0,
			cursor,
			hasGroupedData = series.hasGroupedData,
			point,
			points = [],
			i;

		if (!data && !hasGroupedData) {
			var arr = [];
			arr.length = dataOptions.length;
			data = series.data = arr;
		}

		for (i = 0; i < processedDataLength; i++) {
			cursor = cropStart + i;
			if (!hasGroupedData) {
				if (data[cursor]) {
					point = data[cursor];
				} else if (dataOptions[cursor] !== UNDEFINED) { // #970
					data[cursor] = point = (new pointClass()).init(series, dataOptions[cursor], processedXData[i]);
				}
				points[i] = point;
			} else {
				// splat the y data in case of ohlc data array
				points[i] = (new pointClass()).init(series, [processedXData[i]].concat(splat(processedYData[i])));
			}
		}

		// Hide cropped-away points - this only runs when the number of points is above cropThreshold, or when
		// swithching view from non-grouped data to grouped data (#637)	
		if (data && (processedDataLength !== (dataLength = data.length) || hasGroupedData)) {
			for (i = 0; i < dataLength; i++) {
				if (i === cropStart && !hasGroupedData) { // when has grouped data, clear all points
					i += processedDataLength;
				}
				if (data[i]) {
					data[i].destroyElements();
					data[i].plotX = UNDEFINED; // #1003
				}
			}
		}

		series.data = data;
		series.points = points;
	},

	/**
	 * Translate data points from raw data values to chart specific positioning data
	 * needed later in drawPoints, drawGraph and drawTracker.
	 */
	translate: function () {
		if (!this.processedXData) { // hidden series
			this.processData();
		}
		this.generatePoints();
		var series = this,
			chart = series.chart,
			options = series.options,
			stacking = options.stacking,
			xAxis = series.xAxis,
			categories = xAxis.categories,
			yAxis = series.yAxis,
			points = series.points,
			dataLength = points.length,
			hasModifyValue = !!series.modifyValue,
			isBottomSeries,
			allStackSeries = yAxis.series,
			i = allStackSeries.length,
			placeBetween = options.pointPlacement === 'between';
			//nextSeriesDown;
			
		// Is it the last visible series?
		while (i--) {
			if (allStackSeries[i].visible) {
				if (allStackSeries[i] === series) { // #809
					isBottomSeries = true;
				}
				break;
			}
		}
		
		// Translate each point
		for (i = 0; i < dataLength; i++) {
			var point = points[i],
				xValue = point.x,
				yValue = point.y,
				yBottom = point.low,
				stack = yAxis.stacks[(yValue < options.threshold ? '-' : '') + series.stackKey],
				pointStack,
				pointStackTotal;
				
			// get the plotX translation
			//point.plotX = mathRound(xAxis.translate(xValue, 0, 0, 0, 1) * 10) / 10; // Math.round fixes #591
			point.plotX = xAxis.translate(xValue, 0, 0, 0, 1, placeBetween); // Math.round fixes #591

			// calculate the bottom y value for stacked series
			if (stacking && series.visible && stack && stack[xValue]) {
				pointStack = stack[xValue];
				pointStackTotal = pointStack.total;
				pointStack.cum = yBottom = pointStack.cum - yValue; // start from top
				yValue = yBottom + yValue;
				
				if (isBottomSeries) {
					yBottom = pick(options.threshold, yAxis.isLog ? null : yAxis.min); // #1200
				}
				
				if (stacking === 'percent') {
					yBottom = pointStackTotal ? yBottom * 100 / pointStackTotal : 0;
					yValue = pointStackTotal ? yValue * 100 / pointStackTotal : 0;
				}

				point.percentage = pointStackTotal ? point.y * 100 / pointStackTotal : 0;
				point.total = point.stackTotal = pointStackTotal;
				point.stackY = yValue;
			}

			// Set translated yBottom or remove it
			point.yBottom = defined(yBottom) ? 
				yAxis.translate(yBottom, 0, 1, 0, 1) :
				null;
			
			// general hook, used for Highstock compare mode
			if (hasModifyValue) {
				yValue = series.modifyValue(yValue, point);
			}

			// Set the the plotY value, reset it for redraws
			point.plotY = (typeof yValue === 'number') ? 
				mathRound(yAxis.translate(yValue, 0, 1, 0, 1) * 10) / 10 : // Math.round fixes #591
				UNDEFINED;
			
			// set client related positions for mouse tracking
			point.clientX = chart.inverted ?
				chart.plotHeight - point.plotX :
				point.plotX; // for mouse tracking

			// some API data
			point.category = categories && categories[point.x] !== UNDEFINED ?
				categories[point.x] : point.x;


		}

		// now that we have the cropped data, build the segments
		series.getSegments();
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			points = [],
			pointsLength,
			low,
			high,
			xAxis = series.xAxis,
			axisLength = xAxis ? (xAxis.tooltipLen || xAxis.len) : series.chart.plotSizeX, // tooltipLen and tooltipPosName used in polar
			plotX = (xAxis && xAxis.tooltipPosName) || 'plotX',
			point,
			i,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension

		// don't waste resources if tracker is disabled
		if (series.options.enableMouseTracking === false) {
			return;
		}

		// renew
		if (renew) {
			series.tooltipPoints = null;
		}

		// concat segments to overcome null values
		each(series.segments || series.points, function (segment) {
			points = points.concat(segment);
		});

		// Reverse the points in case the X axis is reversed
		if (xAxis && xAxis.reversed) {
			points = points.reverse();
		}

		// Assign each pixel position to the nearest point
		pointsLength = points.length;
		for (i = 0; i < pointsLength; i++) {
			point = points[i];
			// Set this range's low to the last range's high plus one
			low = points[i - 1] ? high + 1 : 0;
			// Now find the new high
			high = points[i + 1] ?
				mathMax(0, mathFloor((point[plotX] + (points[i + 1] ? points[i + 1][plotX] : axisLength)) / 2)) :
				axisLength;

			while (low >= 0 && low <= high) {
				tooltipPoints[low++] = point;
			}
		}
		series.tooltipPoints = tooltipPoints;
	},

	/**
	 * Format the header of the tooltip
	 */
	tooltipHeaderFormatter: function (key) {
		var series = this,
			tooltipOptions = series.tooltipOptions,
			xDateFormat = tooltipOptions.xDateFormat,
			xAxis = series.xAxis,
			isDateTime = xAxis && xAxis.options.type === 'datetime',
			n;
			
		// Guess the best date format based on the closest point distance (#568)
		if (isDateTime && !xDateFormat) {
			for (n in timeUnits) {
				if (timeUnits[n] >= xAxis.closestPointRange) {
					xDateFormat = tooltipOptions.dateTimeLabelFormats[n];
					break;
				}	
			}		
		}
		
		return tooltipOptions.headerFormat
			.replace('{point.key}', isDateTime ? dateFormat(xDateFormat, key) :  key)
			.replace('{series.name}', series.name)
			.replace('{series.color}', series.color);
	},

	/**
	 * Series mouse over handler
	 */
	onMouseOver: function () {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries;

		/*if (!hasTouch && chart.mouseIsDown) {
			return;
		}*/

		// set normal state to previous series
		if (hoverSeries && hoverSeries !== series) {
			hoverSeries.onMouseOut();
		}

		// trigger the event, but to save processing time,
		// only if defined
		if (series.options.events.mouseOver) {
			fireEvent(series, 'mouseOver');
		}

		// hover this
		series.setState(HOVER_STATE);
		chart.hoverSeries = series;
	},

	/**
	 * Series mouse out handler
	 */
	onMouseOut: function () {
		// trigger the event only if listeners exist
		var series = this,
			options = series.options,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// trigger mouse out on the point, which must be in this series
		if (hoverPoint) {
			hoverPoint.onMouseOut();
		}

		// fire the mouse out event
		if (series && options.events.mouseOut) {
			fireEvent(series, 'mouseOut');
		}


		// hide the tooltip
		if (tooltip && !options.stickyTracking && !tooltip.shared) {
			tooltip.hide();
		}

		// set normal state
		series.setState();
		chart.hoverSeries = null;
	},

	/**
	 * Animate in the series
	 */
	animate: function (init) {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			clipRect,
			markerClipRect,
			animation = series.options.animation,
			clipBox = chart.clipBox,
			inverted = chart.inverted,
			sharedClipKey;

		// Animation option is set to true
		if (animation && !isObject(animation)) {
			animation = defaultPlotOptions[series.type].animation;
		}
		sharedClipKey = '_sharedClip' + animation.duration + animation.easing;

		// Initialize the animation. Set up the clipping rectangle.
		if (init) { 
			
			// If a clipping rectangle with the same properties is currently present in the chart, use that. 
			clipRect = chart[sharedClipKey];
			markerClipRect = chart[sharedClipKey + 'm'];
			if (!clipRect) {
				chart[sharedClipKey] = clipRect = renderer.clipRect(
					extend(clipBox, { width: 0 })
				);
				
				chart[sharedClipKey + 'm'] = markerClipRect = renderer.clipRect(
					-99, // include the width of the first marker
					inverted ? -chart.plotLeft : -chart.plotTop, 
					99,
					inverted ? chart.chartWidth : chart.chartHeight
				);
			}
			series.group.clip(clipRect);
			series.markerGroup.clip(markerClipRect);
			series.sharedClipKey = sharedClipKey;

		// Run the animation
		} else { 
			clipRect = chart[sharedClipKey];
			if (clipRect) {
				clipRect.animate({
					width: chart.plotSizeX
				}, animation);
				chart[sharedClipKey + 'm'].animate({
					width: chart.plotSizeX + 99
				}, animation);
			}

			// Delete this function to allow it only once
			series.animate = null;
			
			// Call the afterAnimate function on animation complete (but don't overwrite the animation.complete option
			// which should be available to the user).
			series.animationTimeout = setTimeout(function () {
				series.afterAnimate();
			}, animation.duration);
		}
	},
	
	/**
	 * This runs after animation to land on the final plot clipping
	 */
	afterAnimate: function () {
		var chart = this.chart,
			sharedClipKey = this.sharedClipKey,
			group = this.group;
			
		if (group && this.options.clip !== false) {
			group.clip(chart.clipRect);
			this.markerGroup.clip(); // no clip
		}
		
		// Remove the shared clipping rectancgle when all series are shown		
		setTimeout(function () {
			if (sharedClipKey && chart[sharedClipKey]) {
				chart[sharedClipKey] = chart[sharedClipKey].destroy();
				chart[sharedClipKey + 'm'] = chart[sharedClipKey + 'm'].destroy();
			}
		}, 100);
	},

	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			pointAttr,
			points = series.points,
			chart = series.chart,
			plotX,
			plotY,
			i,
			point,
			radius,
			symbol,
			isImage,
			graphic,
			options = series.options,
			seriesMarkerOptions = options.marker,
			pointMarkerOptions,
			enabled,
			isInside,
			markerGroup = series.markerGroup;

		if (seriesMarkerOptions.enabled || series._hasPointMarkers) {
			
			i = points.length;
			while (i--) {
				point = points[i];
				plotX = point.plotX;
				plotY = point.plotY;
				graphic = point.graphic;
				pointMarkerOptions = point.marker || {};
				enabled = (seriesMarkerOptions.enabled && pointMarkerOptions.enabled === UNDEFINED) || pointMarkerOptions.enabled;
				isInside = chart.isInsidePlot(plotX, plotY, chart.inverted);
				
				// only draw the point if y is defined
				if (enabled && plotY !== UNDEFINED && !isNaN(plotY)) {

					// shortcuts
					pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
					radius = pointAttr.r;
					symbol = pick(pointMarkerOptions.symbol, series.symbol);
					isImage = symbol.indexOf('url') === 0;

					if (graphic) { // update
						graphic
							.attr({ // Since the marker group isn't clipped, each individual marker must be toggled
								visibility: isInside ? (hasSVG ? 'inherit' : VISIBLE) : HIDDEN
							})
							.animate(extend({
								x: plotX - radius,
								y: plotY - radius
							}, graphic.symbolName ? { // don't apply to image symbols #507
								width: 2 * radius,
								height: 2 * radius
							} : {}));
					} else if (isInside && (radius > 0 || isImage)) {
						point.graphic = graphic = chart.renderer.symbol(
							symbol,
							plotX - radius,
							plotY - radius,
							2 * radius,
							2 * radius
						)
						.attr(pointAttr)
						.add(markerGroup);
					}
				}
			}
		}

	},

	/**
	 * Convert state properties from API naming conventions to SVG attributes
	 *
	 * @param {Object} options API options object
	 * @param {Object} base1 SVG attribute object to inherit from
	 * @param {Object} base2 Second level SVG attribute object to inherit from
	 */
	convertAttribs: function (options, base1, base2, base3) {
		var conversion = this.pointAttrToOptions,
			attr,
			option,
			obj = {};

		options = options || {};
		base1 = base1 || {};
		base2 = base2 || {};
		base3 = base3 || {};

		for (attr in conversion) {
			option = conversion[attr];
			obj[attr] = pick(options[option], base1[attr], base2[attr], base3[attr]);
		}
		return obj;
	},

	/**
	 * Get the state attributes. Each series type has its own set of attributes
	 * that are allowed to change on a point's state change. Series wide attributes are stored for
	 * all series, and additionally point specific attributes are stored for all
	 * points with individual marker options. If such options are not defined for the point,
	 * a reference to the series wide attributes is stored in point.pointAttr.
	 */
	getAttribs: function () {
		var series = this,
			normalOptions = defaultPlotOptions[series.type].marker ? series.options.marker : series.options,
			stateOptions = normalOptions.states,
			stateOptionsHover = stateOptions[HOVER_STATE],
			pointStateOptionsHover,
			seriesColor = series.color,
			normalDefaults = {
				stroke: seriesColor,
				fill: seriesColor
			},
			points = series.points || [], // #927
			i,
			point,
			seriesPointAttr = [],
			pointAttr,
			pointAttrToOptions = series.pointAttrToOptions,
			hasPointSpecificOptions,
			key;

		// series type specific modifications
		if (series.options.marker) { // line, spline, area, areaspline, scatter

			// if no hover radius is given, default to normal radius + 2
			stateOptionsHover.radius = stateOptionsHover.radius || normalOptions.radius + 2;
			stateOptionsHover.lineWidth = stateOptionsHover.lineWidth || normalOptions.lineWidth + 1;

		} else { // column, bar, pie

			// if no hover color is given, brighten the normal color
			stateOptionsHover.color = stateOptionsHover.color ||
				Color(stateOptionsHover.color || seriesColor)
					.brighten(stateOptionsHover.brightness).get();
		}

		// general point attributes for the series normal state
		seriesPointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, normalDefaults);

		// HOVER_STATE and SELECT_STATE states inherit from normal state except the default radius
		each([HOVER_STATE, SELECT_STATE], function (state) {
			seriesPointAttr[state] =
					series.convertAttribs(stateOptions[state], seriesPointAttr[NORMAL_STATE]);
		});

		// set it
		series.pointAttr = seriesPointAttr;


		// Generate the point-specific attribute collections if specific point
		// options are given. If not, create a referance to the series wide point
		// attributes
		i = points.length;
		while (i--) {
			point = points[i];
			normalOptions = (point.options && point.options.marker) || point.options;
			if (normalOptions && normalOptions.enabled === false) {
				normalOptions.radius = 0;
			}
			hasPointSpecificOptions = series.options.colorByPoint; // #868
			
			// check if the point has specific visual options
			if (point.options) {
				for (key in pointAttrToOptions) {
					if (defined(normalOptions[pointAttrToOptions[key]])) {
						hasPointSpecificOptions = true;
					}
				}
			}



			// a specific marker config object is defined for the individual point:
			// create it's own attribute collection
			if (hasPointSpecificOptions) {
				normalOptions = normalOptions || {};
				pointAttr = [];
				stateOptions = normalOptions.states || {}; // reassign for individual point
				pointStateOptionsHover = stateOptions[HOVER_STATE] = stateOptions[HOVER_STATE] || {};

				// Handle colors for column and pies
				if (!series.options.marker) { // column, bar, point
					// if no hover color is given, brighten the normal color
					pointStateOptionsHover.color =
						Color(pointStateOptionsHover.color || point.color)
							.brighten(pointStateOptionsHover.brightness ||
								stateOptionsHover.brightness).get();

				}

				// normal point state inherits series wide normal state
				pointAttr[NORMAL_STATE] = series.convertAttribs(extend({
					color: point.color // #868
				}, normalOptions), seriesPointAttr[NORMAL_STATE]);

				// inherit from point normal and series hover
				pointAttr[HOVER_STATE] = series.convertAttribs(
					stateOptions[HOVER_STATE],
					seriesPointAttr[HOVER_STATE],
					pointAttr[NORMAL_STATE]
				);
				// inherit from point normal and series hover
				pointAttr[SELECT_STATE] = series.convertAttribs(
					stateOptions[SELECT_STATE],
					seriesPointAttr[SELECT_STATE],
					pointAttr[NORMAL_STATE]
				);



			// no marker config object is created: copy a reference to the series-wide
			// attribute collection
			} else {
				pointAttr = seriesPointAttr;
			}

			point.pointAttr = pointAttr;

		}

	},


	/**
	 * Clear DOM objects and free up memory
	 */
	destroy: function () {
		var series = this,
			chart = series.chart,
			issue134 = /AppleWebKit\/533/.test(userAgent),
			destroy,
			i,
			data = series.data || [],
			point,
			prop,
			axis;

		// add event hook
		fireEvent(series, 'destroy');

		// remove all events
		removeEvent(series);
		
		// erase from axes
		each(['xAxis', 'yAxis'], function (AXIS) {
			axis = series[AXIS];
			if (axis) {
				erase(axis.series, series);
				axis.isDirty = true;
			}
		});

		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}

		// destroy all points with their elements
		i = data.length;
		while (i--) {
			point = data[i];
			if (point && point.destroy) {
				point.destroy();
			}
		}
		series.points = null;

		// Clear the animation timeout if we are destroying the series during initial animation
		clearTimeout(series.animationTimeout);

		// destroy all SVGElements associated to the series
		each(['area', 'graph', 'dataLabelsGroup', 'group', 'markerGroup', 'tracker', 'trackerGroup'], function (prop) {
			if (series[prop]) {

				// issue 134 workaround
				destroy = issue134 && prop === 'group' ?
					'hide' :
					'destroy';

				series[prop][destroy]();
			}
		});

		// remove from hoverSeries
		if (chart.hoverSeries === series) {
			chart.hoverSeries = null;
		}
		erase(chart.series, series);

		// clear all members
		for (prop in series) {
			delete series[prop];
		}
	},

	/**
	 * Draw the data labels
	 */
	drawDataLabels: function () {
		
		var series = this,
			seriesOptions = series.options,
			options = seriesOptions.dataLabels;
		
		if (options.enabled || series._hasPointLabels) {
			var x,
				y,
				points = series.points,
				pointOptions,
				generalOptions,
				str,
				dataLabelsGroup,
				chart = series.chart,
				renderer = chart.renderer,
				inverted = chart.inverted,
				seriesType = series.type,
				stacking = seriesOptions.stacking,
				isBarLike = seriesType === 'column' || seriesType === 'bar',
				vAlignIsNull = options.verticalAlign === null,
				yIsNull = options.y === null,
				fontMetrics = renderer.fontMetrics(options.style.fontSize), // height and baseline
				fontLineHeight = fontMetrics.h,
				fontBaseline = fontMetrics.b;

			if (isBarLike) {
				var defaultYs = {
					top: fontBaseline, 
					middle: fontBaseline - fontLineHeight / 2, 
					bottom: -fontLineHeight + fontBaseline
				};
				if (stacking) {
					// In stacked series the default label placement is inside the bars
					if (vAlignIsNull) {
						options = merge(options, {verticalAlign: 'middle'});
					}

					// If no y delta is specified, try to create a good default
					if (yIsNull) {
						options = merge(options, { y: defaultYs[options.verticalAlign]});
					}
				} else {
					// In non stacked series the default label placement is on top of the bars
					if (vAlignIsNull) {
						options = merge(options, {verticalAlign: 'top'});
					
					// If no y delta is specified, try to create a good default (like default bar)
					} else if (yIsNull) {
						options = merge(options, { y: defaultYs[options.verticalAlign]});
					}
					
				}
			}


			// create a separate group for the data labels to avoid rotation
			dataLabelsGroup = series.plotGroup(
				'dataLabelsGroup', 
				'data-labels', 
				series.visible ? VISIBLE : HIDDEN, 
				6
			);
			
			// make the labels for each point
			generalOptions = options;
			each(points, function (point) {
				
				var plotX,
					plotY,
					individualYDelta,
					enabled,
					dataLabel = point.dataLabel;
				
				// Merge in individual options from point
				options = generalOptions; // reset changes from previous points
				pointOptions = point.options;
				if (pointOptions && pointOptions.dataLabels) {
					options = merge(options, pointOptions.dataLabels);
				}
				enabled = options.enabled;
				
				// Get the positions
				if (enabled) {
					plotX = (point.barX && point.barX + point.barW / 2) || pick(point.plotX, -999);
					plotY = pick(point.plotY, -999);
						
					// if options.y is null, which happens by default on column charts, set the position
					// above or below the column depending on the threshold
					individualYDelta = options.y === null ? 
						(point.y >= seriesOptions.threshold ? 
							-fontLineHeight + fontBaseline : // below the threshold 
							fontBaseline) : // above the threshold
						options.y;
					
					x = (inverted ? chart.plotWidth - plotY : plotX) + options.x;
					y = mathRound((inverted ? chart.plotHeight - plotX : plotY) + individualYDelta);
					
				}
				
				// Check if the individual label must be disabled due to either falling
				// ouside the plot area, or the enabled option being switched off
				if (series.isCartesian && !chart.isInsidePlot(x - options.x, y)) {
					enabled = false;
				}
				
				// If the point is outside the plot area, destroy it. #678, #820
				if (dataLabel && !enabled) {
					point.dataLabel = dataLabel.destroy();
				
				// Individual labels are disabled if the are explicitly disabled 
				// in the point options, or if they fall outside the plot area.
				} else if (enabled) {
					
					var align = options.align,
						attr,
						name;
				
					// Get the string
					str = options.formatter.call(point.getLabelConfig(), options);
					
					// in columns, align the string to the column
					if (seriesType === 'column') {
						x += { left: -1, right: 1 }[align] * point.barW / 2 || 0;
					}
	
					if (!stacking && inverted && point.y < 0) {
						align = 'right';
						x -= 10;
					}
					
					// Determine the color
					options.style.color = pick(options.color, options.style.color, series.color, 'black');
	
					
					// update existing label
					if (dataLabel) {
						// vertically centered
						dataLabel
							.attr({
								text: str
							}).animate({
								x: x,
								y: y
							});
					// create new label
					} else if (defined(str)) {
						attr = {
							align: align,
							fill: options.backgroundColor,
							stroke: options.borderColor,
							'stroke-width': options.borderWidth,
							r: options.borderRadius || 0,
							rotation: options.rotation,
							padding: options.padding,
							zIndex: 1
						};
						// Remove unused attributes (#947)
						for (name in attr) {
							if (attr[name] === UNDEFINED) {
								delete attr[name];
							}
						}
						
						dataLabel = point.dataLabel = renderer[options.rotation ? 'text' : 'label']( // labels don't support rotation
							str,
							x,
							y,
							null,
							null,
							null,
							options.useHTML,
							true // baseline for backwards compat
						)
						.attr(attr)
						.css(options.style)
						.add(dataLabelsGroup)
						.shadow(options.shadow);
					}
	
					if (isBarLike && seriesOptions.stacking && dataLabel) {
						var barX = point.barX,
							barY = point.barY,
							barW = point.barW,
							barH = point.barH;
	
						dataLabel.align(options, null,
							{
								x: inverted ? chart.plotWidth - barY - barH : barX,
								y: inverted ? chart.plotHeight - barX - barW : barY,
								width: inverted ? barH : barW,
								height: inverted ? barW : barH
							});
					}
					
					
				}
			});
		}
	},
	
	/**
	 * Return the graph path of a segment
	 */
	getSegmentPath: function (segment) {		
		var series = this,
			segmentPath = [];
		
		// build the segment line
		each(segment, function (point, i) {

			if (series.getPointSpline) { // generate the spline as defined in the SplineSeries object
				segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i));

			} else {

				// moveTo or lineTo
				segmentPath.push(i ? L : M);

				// step line?
				if (i && series.options.step) {
					var lastPoint = segment[i - 1];
					segmentPath.push(
						point.plotX,
						lastPoint.plotY
					);
				}

				// normal line to next point
				segmentPath.push(
					point.plotX,
					point.plotY
				);
			}
		});
		
		return segmentPath;
	},

	/**
	 * Get the graph path
	 */
	getGraphPath: function () {
		var series = this,
			graphPath = [],
			segmentPath,
			singlePoints = []; // used in drawTracker

		// Divide into segments and build graph and area paths
		each(series.segments, function (segment) {
			
			segmentPath = series.getSegmentPath(segment);
			
			// add the segment to the graph, or a single point for tracking
			if (segment.length > 1) {
				graphPath = graphPath.concat(segmentPath);
			} else {
				singlePoints.push(segment[0]);
			}
		});

		// Record it for use in drawGraph and drawTracker, and return graphPath
		series.singlePoints = singlePoints;
		series.graphPath = graphPath;
		
		return graphPath;
		
	},
	
	/**
	 * Draw the actual graph
	 */
	drawGraph: function () {		
		var options = this.options,
			graph = this.graph,
			group = this.group,
			color = options.lineColor || this.color,
			lineWidth = options.lineWidth,
			dashStyle =  options.dashStyle,
			attribs,
			graphPath = this.getGraphPath();
			

		// draw the graph
		if (graph) {
			stop(graph); // cancel running animations, #459
			graph.animate({ d: graphPath });

		} else {
			if (lineWidth) {
				attribs = {
					stroke: color,
					'stroke-width': lineWidth,
					zIndex: 1 // #1069
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}

				this.graph = this.chart.renderer.path(graphPath)
					.attr(attribs).add(group).shadow(options.shadow);
			}
		}
	},

	/**
	 * Initialize and perform group inversion on series.group and series.trackerGroup
	 */
	invertGroups: function () {
		var series = this,
			chart = series.chart;
		
		// A fixed size is needed for inversion to work
		function setInvert() {			
			var size = {
				width: series.yAxis.len,
				height: series.xAxis.len
			};
			
			each(['group', 'trackerGroup', 'markerGroup'], function (groupName) {
				if (series[groupName]) {
					series[groupName].attr(size).invert();
				}
			});
		}

		addEvent(chart, 'resize', setInvert); // do it on resize
		addEvent(series, 'destroy', function () {
			removeEvent(chart, 'resize', setInvert);
		});

		// Do it now
		setInvert(); // do it now
		
		// On subsequent render and redraw, just do setInvert without setting up events again
		series.invertGroups = setInvert;
	},
	
	/**
	 * General abstraction for creating plot groups like series.group, series.trackerGroup, series.dataLabelsGroup and 
	 * series.markerGroup. On subsequent calls, the group will only be adjusted to the updated plot size.
	 */
	plotGroup: function (prop, name, visibility, zIndex, parent) {
		var group = this[prop],
			chart = this.chart,
			xAxis = this.xAxis,
			yAxis = this.yAxis;
		
		// Generate it on first call
		if (!group) {	
			this[prop] = group = chart.renderer.g(name)
				.attr({
					visibility: visibility,
					zIndex: zIndex || 0.1 // IE8 needs this
				})
				.add(parent);
		}
		// Place it on first and subsequent (redraw) calls
		group.translate(
			xAxis ? xAxis.left : chart.plotLeft, 
			yAxis ? yAxis.top : chart.plotTop
		);
		
		return group;
		
	},
	
	/**
	 * Render the graph and markers
	 */
	render: function () {
		var series = this,
			chart = series.chart,
			group,
			options = series.options,
			animation = options.animation,
			doAnimation = animation && !!series.animate,
			visibility = series.visible ? VISIBLE : HIDDEN,
			zIndex = options.zIndex,
			hasRendered = series.hasRendered,
			chartSeriesGroup = chart.seriesGroup;
		
		// the group
		group = series.plotGroup(
			'group', 
			'series', 
			visibility, 
			zIndex, 
			chartSeriesGroup
		);
		
		series.markerGroup = series.plotGroup(
			'markerGroup', 
			'markers', 
			visibility, 
			zIndex, 
			chartSeriesGroup
		);
		
		series.drawDataLabels();

		// initiate the animation
		if (doAnimation) {
			series.animate(true);
		}

		// cache attributes for shapes
		series.getAttribs();

		// SVGRenderer needs to know this before drawing elements (#1089)
		group.inverted = chart.inverted;
		
		// draw the graph if any
		if (series.drawGraph) {
			series.drawGraph();
		}

		// draw the points
		series.drawPoints();

		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}
		
		// Handle inverted series and tracker groups
		if (chart.inverted) {
			series.invertGroups();
		}
		
		// Initial clipping, must be defined after inverting groups for VML
		if (options.clip !== false && !series.sharedClipKey && !hasRendered) {
			group.clip(chart.clipRect);
			if (this.trackerGroup) {
				this.trackerGroup.clip(chart.clipRect);
			}
		}

		// Run the animation
		if (doAnimation) {
			series.animate();
		} else if (!hasRendered) {
			series.afterAnimate();
		}

		series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		// (See #322) series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		series.hasRendered = true;
	},
	
	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function () {
		var series = this,
			chart = series.chart,
			wasDirtyData = series.isDirtyData, // cache it here as it is set to false in render, but used after
			group = series.group;

		// reposition on resize
		if (group) {
			if (chart.inverted) {
				group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				});
			}

			group.animate({
				translateX: series.xAxis.left,
				translateY: series.yAxis.top
			});
		}

		series.translate();
		series.setTooltipPoints(true);

		series.render();
		if (wasDirtyData) {
			fireEvent(series, 'updatedData');
		}
	},

	/**
	 * Set the state of the graph
	 */
	setState: function (state) {
		var series = this,
			options = series.options,
			graph = series.graph,
			stateOptions = options.states,
			lineWidth = options.lineWidth;

		state = state || NORMAL_STATE;

		if (series.state !== state) {
			series.state = state;

			if (stateOptions[state] && stateOptions[state].enabled === false) {
				return;
			}

			if (state) {
				lineWidth = stateOptions[state].lineWidth || lineWidth + 1;
			}

			if (graph && !graph.dashstyle) { // hover is turned off for dashed lines in VML
				graph.attr({ // use attr because animate will cause any other animation on the graph to stop
					'stroke-width': lineWidth
				}, state ? 0 : 500);
			}
		}
	},

	/**
	 * Set the visibility of the graph
	 *
	 * @param vis {Boolean} True to show the series, false to hide. If UNDEFINED,
	 *        the visibility is toggled.
	 */
	setVisible: function (vis, redraw) {
		var series = this,
			chart = series.chart,
			legendItem = series.legendItem,
			seriesGroup = series.group,
			seriesTracker = series.tracker,
			dataLabelsGroup = series.dataLabelsGroup,
			markerGroup = series.markerGroup,
			showOrHide,
			i,
			points = series.points,
			point,
			ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
			oldVisibility = series.visible;

		// if called without an argument, toggle visibility
		series.visible = vis = vis === UNDEFINED ? !oldVisibility : vis;
		showOrHide = vis ? 'show' : 'hide';

		// show or hide series
		if (seriesGroup) { // pies don't have one
			seriesGroup[showOrHide]();
		}
		if (markerGroup) {
			markerGroup[showOrHide]();
		}

		// show or hide trackers
		if (seriesTracker) {
			seriesTracker[showOrHide]();
		} else if (points) {
			i = points.length;
			while (i--) {
				point = points[i];
				if (point.tracker) {
					point.tracker[showOrHide]();
				}
			}
		}


		if (dataLabelsGroup) {
			dataLabelsGroup[showOrHide]();
		}

		if (legendItem) {
			chart.legend.colorizeItem(series, vis);
		}


		// rescale or adapt to resized chart
		series.isDirty = true;
		// in a stack, all other series are affected
		if (series.options.stacking) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.options.stacking && otherSeries.visible) {
					otherSeries.isDirty = true;
				}
			});
		}

		if (ignoreHiddenSeries) {
			chart.isDirtyBox = true;
		}
		if (redraw !== false) {
			chart.redraw();
		}

		fireEvent(series, showOrHide);
	},

	/**
	 * Show the graph
	 */
	show: function () {
		this.setVisible(true);
	},

	/**
	 * Hide the graph
	 */
	hide: function () {
		this.setVisible(false);
	},


	/**
	 * Set the selected state of the graph
	 *
	 * @param selected {Boolean} True to select the series, false to unselect. If
	 *        UNDEFINED, the selection state is toggled.
	 */
	select: function (selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === UNDEFINED) ? !series.selected : selected;

		if (series.checkbox) {
			series.checkbox.checked = selected;
		}

		fireEvent(series, selected ? 'select' : 'unselect');
	},

	/**
	 * Draw the tracker object that sits above all data labels and markers to
	 * track mouse events on the graph or points. For the line type charts
	 * the tracker uses the same graphPath, but with a greater stroke width
	 * for better control.
	 */
	drawTracker: function () {
		var series = this,
			options = series.options,
			trackByArea = options.trackByArea,
			trackerPath = [].concat(trackByArea ? series.areaPath : series.graphPath),
			trackerPathLength = trackerPath.length,
			chart = series.chart,
			renderer = chart.renderer,
			snap = chart.options.tooltip.snap,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			singlePoints = series.singlePoints,
			trackerGroup = this.isCartesian && this.plotGroup('trackerGroup', null, VISIBLE, options.zIndex || 1, chart.trackerGroup),
			singlePoint,
			i;

		// Extend end points. A better way would be to use round linecaps,
		// but those are not clickable in VML.
		if (trackerPathLength && !trackByArea) {
			i = trackerPathLength + 1;
			while (i--) {
				if (trackerPath[i] === M) { // extend left side
					trackerPath.splice(i + 1, 0, trackerPath[i + 1] - snap, trackerPath[i + 2], L);
				}
				if ((i && trackerPath[i] === M) || i === trackerPathLength) { // extend right side
					trackerPath.splice(i, 0, L, trackerPath[i - 2] + snap, trackerPath[i - 1]);
				}
			}
		}

		// handle single points
		for (i = 0; i < singlePoints.length; i++) {
			singlePoint = singlePoints[i];
			trackerPath.push(M, singlePoint.plotX - snap, singlePoint.plotY,
				L, singlePoint.plotX + snap, singlePoint.plotY);
		}
		
		

		// draw the tracker
		if (tracker) {
			tracker.attr({ d: trackerPath });

		} else { // create
				
			series.tracker = renderer.path(trackerPath)
				.attr({
					isTracker: true,
					'stroke-linejoin': 'bevel',
					visibility: series.visible ? VISIBLE : HIDDEN,
					stroke: TRACKER_FILL,
					fill: trackByArea ? TRACKER_FILL : NONE,
					'stroke-width' : options.lineWidth + (trackByArea ? 0 : 2 * snap)
				})
				.on(hasTouch ? 'touchstart' : 'mouseover', function () {
					if (chart.hoverSeries !== series) {
						series.onMouseOver();
					}
				})
				.on('mouseout', function () {
					if (!options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css)
				.add(trackerGroup);
		}

	}

}; // end Series prototype

