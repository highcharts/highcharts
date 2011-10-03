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
	init: function (series, options) {
		var point = this,
			counters = series.chart.counters,
			defaultColors;
		point.series = series;
		point.applyOptions(options);
		point.pointAttr = {};

		if (series.options.colorByPoint) {
			defaultColors = series.chart.options.colors;
			if (!point.options) {
				point.options = {};
			}
			point.color = point.options.color = point.color || defaultColors[counters.color++];

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
	applyOptions: function (options) {
		var point = this,
			series = point.series;

		point.config = options;

		// onedimensional array input
		if (isNumber(options) || options === null) {
			point.y = options;
		} else if (isObject(options) && !isNumber(options.length)) { // object input
			// copy options directly to point
			extend(point, options);
			point.options = options;
		} else if (isString(options[0])) { // categorized data with name in first position
			point.name = options[0];
			point.y = options[1];
		} else if (isNumber(options[0])) { // two-dimentional array
			point.x = options[0];
			point.y = options[1];
		}

		/*
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		if (point.x === UNDEFINED) {
			point.x = series.autoIncrement();
		}

	},

	/**
	 * Destroy a point to clear memory. Its reference still stays in series.data.
	 */
	destroy: function () {
		var point = this,
			series = point.series,
			hoverPoints = series.chart.hoverPoints,
			prop;

		series.chart.pointCount--;

		if (hoverPoints) {
			point.setState();
			erase(hoverPoints, point);
		}
		if (point === series.chart.hoverPoint) {
			point.onMouseOut();
		}


		// remove all events
		removeEvent(point);

		each(['graphic', 'tracker', 'group', 'dataLabel', 'connector', 'shadowGroup'], function (prop) {
			if (point[prop]) {
				point[prop].destroy();
			}
		});

		if (point.legendItem) { // pies have legend items
			point.series.chart.legend.destroyItem(point);
		}

		for (prop in point) {
			point[prop] = null;
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
			chart = point.series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// set normal state to previous series
		if (hoverPoint && hoverPoint !== point) {
			hoverPoint.onMouseOut();
		}

		// trigger the event
		point.firePointEvent('mouseOver');

		// update the tooltip
		if (tooltip && !tooltip.shared) {
			tooltip.refresh(point);
		}

		// hover this
		point.setState(HOVER_STATE);
		chart.hoverPoint = point;
	},

	onMouseOut: function () {
		var point = this;
		point.firePointEvent('mouseOut');

		point.setState();
		point.series.chart.hoverPoint = null;
	},

	/**
	 * Extendable method for formatting each point's tooltip line
	 *
	 * @param {Boolean} useHeader Whether a common header is used for multiple series in the tooltip
	 *
	 * @return {String} A string to be concatenated in to the common tooltip text
	 */
	tooltipFormatter: function (useHeader) {
		var point = this,
			series = point.series;

		return ['<span style="color:' + series.color + '">', (point.name || series.name), '</span>: ',
			(!useHeader ? ('<b>x = ' + (point.name || point.x) + ',</b> ') : ''),
			'<b>', (!useHeader ? 'y = ' : ''), point.y, '</b>'].join('');

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

			// redraw
			series.isDirty = true;
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
			data = series.data;

		setAnimation(animation, chart);
		redraw = pick(redraw, true);

		// fire the event with a default handler of removing the point
		point.firePointEvent('remove', null, function () {

			erase(data, point);

			point.destroy();


			// redraw
			series.isDirty = true;
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
		if (seriesOptions.point.events[eventType] ||
			(point.options && point.options.events && point.options.events[eventType])) {
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
			series = point.series,
			stateOptions = series.options.states,
			markerOptions = defaultPlotOptions[series.type].marker && series.options.marker,
			normalDisabled = markerOptions && !markerOptions.enabled,
			markerStateOptions = markerOptions && markerOptions.states[state],
			stateDisabled = markerStateOptions && markerStateOptions.enabled === false,
			stateMarkerGraphic = series.stateMarkerGraphic,
			chart = series.chart,
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
			point.graphic.attr(pointAttr[state]);
		} else {
			// if a graphic is not applied to each point in the normal state, create a shared
			// graphic for the hover state
			if (state) {
				if (!stateMarkerGraphic) {
					series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.circle(
						0,
						0,
						pointAttr[state].r
					)
					.attr(pointAttr[state])
					.add(series.group);
				}

				stateMarkerGraphic.translate(
					point.plotX,
					point.plotY
				);
			}

			if (stateMarkerGraphic) {
				stateMarkerGraphic[state ? 'show' : 'hide']();
			}
		}

		point.state = state;
	}
};

/**
 * The base function which all other series types inherit from
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function () {};

Series.prototype = {

	isCartesian: true,
	type: 'line',
	pointClass: Point,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		r: 'radius'
	},
	init: function (chart, options) {
		var series = this,
			eventType,
			events,
			//pointEvent,
			index = chart.series.length;

		series.chart = chart;
		options = series.setOptions(options); // merge with plotOptions

		// set some variables
		extend(series, {
			index: index,
			options: options,
			name: options.name || 'Series ' + (index + 1),
			state: NORMAL_STATE,
			pointAttr: {},
			visible: options.visible !== false, // true by default
			selected: options.selected === true // false by default
		});

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
	 * Sort the data and remove duplicates
	 */
	cleanData: function () {
		var series = this,
			chart = series.chart,
			data = series.data,
			closestPoints,
			smallestInterval,
			chartSmallestInterval = chart.smallestInterval,
			interval,
			i;

		// sort the data points
		stableSort(data, function (a, b) {
			return (a.x - b.x);
		});

		// remove points with equal x values
		// record the closest distance for calculation of column widths
		/*for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				if (data[i - 1].x == data[i].x)	{
					data[i - 1].destroy();
					data.splice(i - 1, 1); // remove the duplicate
				}
			}
		}*/

		// connect nulls
		if (series.options.connectNulls) {
			for (i = data.length - 1; i >= 0; i--) {
				if (data[i].y === null && data[i - 1] && data[i + 1]) {
					data.splice(i, 1);
				}
			}
		}

		// find the closes pair of points
		for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				interval = data[i].x - data[i - 1].x;
				if (interval > 0 && (smallestInterval === UNDEFINED || interval < smallestInterval)) {
					smallestInterval = interval;
					closestPoints = i;
				}
			}
		}

		if (chartSmallestInterval === UNDEFINED || smallestInterval < chartSmallestInterval) {
			chart.smallestInterval = smallestInterval;
		}
		series.closestPoints = closestPoints;
	},

	/**
	 * Divide the series data into segments divided by null values. Also sort
	 * the data points and delete duplicate values.
	 */
	getSegments: function () {
		var lastNull = -1,
			segments = [],
			data = this.data;

		// create the segments
		each(data, function (point, i) {
			if (point.y === null) {
				if (i > lastNull + 1) {
					segments.push(data.slice(lastNull + 1, i));
				}
				lastNull = i;
			} else if (i === data.length - 1) { // last value
				segments.push(data.slice(lastNull + 1, i + 1));
			}
		});
		this.segments = segments;


	},
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} itemOptions
	 */
	setOptions: function (itemOptions) {
		var plotOptions = this.chart.options.plotOptions,
			options = merge(
				plotOptions[this.type],
				plotOptions.series,
				itemOptions
			);

		return options;

	},
	/**
	 * Get the series' color
	 */
	getColor: function () {
		var defaultColors = this.chart.options.colors,
			counters = this.chart.counters;
		this.color = this.options.color || defaultColors[counters.color++] || '#0000ff';
		counters.wrapColor(defaultColors.length);
	},
	/**
	 * Get the series' symbol
	 */
	getSymbol: function () {
		var defaultSymbols = this.chart.options.symbols,
			counters = this.chart.counters;
		this.symbol = this.options.marker.symbol || defaultSymbols[counters.symbol++];
		counters.wrapSymbol(defaultSymbols.length);
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
			point = (new series.pointClass()).init(series, options);

		setAnimation(animation, chart);

		if (graph && shift) { // make graph animate sideways
			graph.shift = shift;
		}
		if (area) {
			area.shift = shift;
			area.isArea = true;
		}

		redraw = pick(redraw, true);

		data.push(point);
		if (shift) {
			data[0].remove(false);
		}
		series.getAttribs();


		// redraw
		series.isDirty = true;
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
			oldData = series.data,
			initialColor = series.initialColor,
			chart = series.chart,
			i = (oldData && oldData.length) || 0;

		series.xIncrement = null; // reset for new data
		if (defined(initialColor)) { // reset colors for pie
			chart.counters.color = initialColor;
		}

		data = map(splat(data || []), function (pointOptions) {
			return (new series.pointClass()).init(series, pointOptions);
		});

		// destroy old points
		while (i--) {
			oldData[i].destroy();
		}

		// set the data
		series.data = data;

		series.cleanData();
		series.getSegments();


		// cache attributes for shapes
		series.getAttribs();

		// redraw
		series.isDirty = true;
		chart.isDirtyBox = true;
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
	 * Translate data points from raw data values to chart specific positioning data
	 * needed later in drawPoints, drawGraph and drawTracker.
	 */
	translate: function () {
		var series = this,
			chart = series.chart,
			stacking = series.options.stacking,
			categories = series.xAxis.categories,
			yAxis = series.yAxis,
			data = series.data,
			i = data.length;

		// do the translation
		while (i--) {
			var point = data[i],
				xValue = point.x,
				yValue = point.y,
				yBottom = point.low,
				stack = yAxis.stacks[(yValue < 0 ? '-' : '') + series.stackKey],
				pointStack,
				pointStackTotal;
			point.plotX = series.xAxis.translate(xValue);

			// calculate the bottom y value for stacked series
			if (stacking && series.visible && stack && stack[xValue]) {
				pointStack = stack[xValue];
				pointStackTotal = pointStack.total;
				pointStack.cum = yBottom = pointStack.cum - yValue; // start from top
				yValue = yBottom + yValue;

				if (stacking === 'percent') {
					yBottom = pointStackTotal ? yBottom * 100 / pointStackTotal : 0;
					yValue = pointStackTotal ? yValue * 100 / pointStackTotal : 0;
				}

				point.percentage = pointStackTotal ? point.y * 100 / pointStackTotal : 0;
				point.stackTotal = pointStackTotal;
			}

			if (defined(yBottom)) {
				point.yBottom = yAxis.translate(yBottom, 0, 1, 0, 1);
			}

			// set the y value
			if (yValue !== null) {
				point.plotY = yAxis.translate(yValue, 0, 1, 0, 1);
			}

			// set client related positions for mouse tracking
			point.clientX = chart.inverted ?
				chart.plotHeight - point.plotX :
				point.plotX; // for mouse tracking

			// some API data
			point.category = categories && categories[point.x] !== UNDEFINED ?
				categories[point.x] : point.x;

		}
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			data = [],
			plotSize = mathRound((inverted ? chart.plotTop : chart.plotLeft) + chart.plotSizeX),
			low,
			high,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension

		// renew
		if (renew) {
			series.tooltipPoints = null;
		}

		// concat segments to overcome null values
		each(series.segments, function (segment) {
			data = data.concat(segment);
		});

		// loop the concatenated data and apply each point to all the closest
		// pixel positions
		if (series.xAxis && series.xAxis.reversed) {
			data = data.reverse();//reverseArray(data);
		}

		each(data, function (point, i) {

			low = data[i - 1] ? data[i - 1]._high + 1 : 0;
			high = point._high = data[i + 1] ?
				(mathFloor((point.plotX + (data[i + 1] ? data[i + 1].plotX : plotSize)) / 2)) :
				plotSize;

			while (low <= high) {
				tooltipPoints[inverted ? plotSize - low++ : low++] = point;
			}
		});
		series.tooltipPoints = tooltipPoints;
	},




	/**
	 * Series mouse over handler
	 */
	onMouseOver: function () {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries;

		if (!hasTouch && chart.mouseIsDown) {
			return;
		}

		// set normal state to previous series
		if (hoverSeries && hoverSeries !== series) {
			hoverSeries.onMouseOut();
		}

		// trigger the event, but to save processing time,
		// only if defined
		if (series.options.events.mouseOver) {
			fireEvent(series, 'mouseOver');
		}


		// bring to front
		// Todo: optimize. This is one of two operations slowing down the tooltip in Firefox.
		// Can the tracking be done otherwise?
		if (series.tracker) {
			series.tracker.toFront();
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
		if (tooltip && !options.stickyTracking) {
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
			clipRect = series.clipRect,
			animation = series.options.animation;

		if (animation && !isObject(animation)) {
			animation = {};
		}

		if (init) { // initialize the animation
			if (!clipRect.isAnimating) { // apply it only for one of the series
				clipRect.attr('width', 0);
				clipRect.isAnimating = true;
			}

		} else { // run the animation
			clipRect.animate({
				width: chart.plotSizeX
			}, animation);

			// delete this function to allow it only once
			this.animate = null;
		}
	},


	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			pointAttr,
			data = series.data,
			chart = series.chart,
			plotX,
			plotY,
			i,
			point,
			radius,
			graphic;

		if (series.options.marker.enabled) {
			i = data.length;
			while (i--) {
				point = data[i];
				plotX = point.plotX;
				plotY = point.plotY;
				graphic = point.graphic;

				// only draw the point if y is defined
				if (plotY !== UNDEFINED && !isNaN(plotY)) {

					/* && removed this code because points stayed after zoom
						point.plotX >= 0 && point.plotX <= chart.plotSizeX &&
						point.plotY >= 0 && point.plotY <= chart.plotSizeY*/

					// shortcuts
					pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
					radius = pointAttr.r;

					if (graphic) { // update
						graphic.animate({
							x: plotX,
							y: plotY,
							r: radius
						});
					} else {
						point.graphic = chart.renderer.symbol(
							pick(point.marker && point.marker.symbol, series.symbol),
							plotX,
							plotY,
							radius
						)
						.attr(pointAttr)
						.add(series.group);
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
			data = series.data,
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
		i = data.length;
		while (i--) {
			point = data[i];
			normalOptions = (point.options && point.options.marker) || point.options;
			if (normalOptions && normalOptions.enabled === false) {
				normalOptions.radius = 0;
			}
			hasPointSpecificOptions = false;

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

				pointAttr = [];
				stateOptions = normalOptions.states || {}; // reassign for individual point
				pointStateOptionsHover = stateOptions[HOVER_STATE] = stateOptions[HOVER_STATE] || {};

				// if no hover color is given, brighten the normal color
				if (!series.options.marker) { // column, bar, point
					pointStateOptionsHover.color =
						Color(pointStateOptionsHover.color || point.options.color)
							.brighten(pointStateOptionsHover.brightness ||
								stateOptionsHover.brightness).get();

				}

				// normal point state inherits series wide normal state
				pointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, seriesPointAttr[NORMAL_STATE]);

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
			seriesClipRect = series.clipRect,
			//chartSeries = series.chart.series,
			issue134 = /\/5[0-9\.]+ (Safari|Mobile)\//.test(userAgent), // todo: update when Safari bug is fixed
			destroy,
			prop;

		// add event hook
		fireEvent(series, 'destroy');

		// remove all events
		removeEvent(series);

		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}

		// destroy all points with their elements
		each(series.data, function (point) {
			point.destroy();
		});

		// If this series clipRect is not the global one (which is removed on chart.destroy) we
		// destroy it here.
		if (seriesClipRect && seriesClipRect !== chart.clipRect) {
			series.clipRect = seriesClipRect.destroy();
		}

		// destroy all SVGElements associated to the series
		each(['area', 'graph', 'dataLabelsGroup', 'group', 'tracker'], function (prop) {
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
		if (this.options.dataLabels.enabled) {
			var series = this,
				x,
				y,
				data = series.data,
				seriesOptions = series.options,
				options = seriesOptions.dataLabels,
				str,
				dataLabelsGroup = series.dataLabelsGroup,
				chart = series.chart,
				renderer = chart.renderer,
				inverted = chart.inverted,
				seriesType = series.type,
				color,
				stacking = seriesOptions.stacking,
				isBarLike = seriesType === 'column' || seriesType === 'bar',
				vAlignIsNull = options.verticalAlign === null,
				yIsNull = options.y === null;

			if (isBarLike) {
				if (stacking) {
					// In stacked series the default label placement is inside the bars
					if (vAlignIsNull) {
						options = merge(options, {verticalAlign: 'middle'});
					}

					// If no y delta is specified, try to create a good default
					if (yIsNull) {
						options = merge(options, {y: {top: 14, middle: 4, bottom: -6}[options.verticalAlign]});
					}
				} else {
					// In non stacked series the default label placement is on top of the bars
					if (vAlignIsNull) {
						options = merge(options, {verticalAlign: 'top'});
					}
				}
			}

			// create a separate group for the data labels to avoid rotation
			if (!dataLabelsGroup) {
				dataLabelsGroup = series.dataLabelsGroup =
					renderer.g('data-labels')
						.attr({
							visibility: series.visible ? VISIBLE : HIDDEN,
							zIndex: 6
						})
						.translate(chart.plotLeft, chart.plotTop)
						.add();
			} else {
				dataLabelsGroup.translate(chart.plotLeft, chart.plotTop);
			}

			// determine the color
			color = options.color;
			if (color === 'auto') { // 1.0 backwards compatibility
				color = null;
			}
			options.style.color = pick(color, series.color, 'black');

			// make the labels for each point
			each(data, function (point) {
				var barX = point.barX,
					plotX = (barX && barX + point.barW / 2) || point.plotX || -999,
					plotY = pick(point.plotY, -999),
					dataLabel = point.dataLabel,
					align = options.align,
					individualYDelta = yIsNull ? (point.y >= 0 ? -6 : 12) : options.y;

				// get the string
				str = options.formatter.call(point.getLabelConfig());
				x = (inverted ? chart.plotWidth - plotY : plotX) + options.x;
				y = (inverted ? chart.plotHeight - plotX : plotY) + individualYDelta;

				// in columns, align the string to the column
				if (seriesType === 'column') {
					x += { left: -1, right: 1 }[align] * point.barW / 2 || 0;
				}

				if (inverted && point.y < 0) {
					align = 'right';
					x -= 10;
				}

				// update existing label
				if (dataLabel) {
					// vertically centered
					if (inverted && !options.y) {
						y = y + pInt(dataLabel.styles.lineHeight) * 0.9 - dataLabel.getBBox().height / 2;
					}
					dataLabel
						.attr({
							text: str
						}).animate({
							x: x,
							y: y
						});
				// create new label
				} else if (defined(str)) {
					dataLabel = point.dataLabel = renderer.text(
						str,
						x,
						y
					)
					.attr({
						align: align,
						rotation: options.rotation,
						zIndex: 1
					})
					.css(options.style)
					.add(dataLabelsGroup);
					// vertically centered
					if (inverted && !options.y) {
						dataLabel.attr({
							y: y + pInt(dataLabel.styles.lineHeight) * 0.9 - dataLabel.getBBox().height / 2
						});
					}
				}


				/*if (series.isCartesian) {
					dataLabel[chart.isInsidePlot(plotX, plotY) ? 'show' : 'hide']();
				}*/

				if (isBarLike && seriesOptions.stacking && dataLabel) {
					var barY = point.barY,
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
			});
		}
	},

	/**
	 * Draw the actual graph
	 */
	drawGraph: function () {
		var series = this,
			options = series.options,
			chart = series.chart,
			graph = series.graph,
			graphPath = [],
			fillColor,
			area = series.area,
			group = series.group,
			color = options.lineColor || series.color,
			lineWidth = options.lineWidth,
			dashStyle =  options.dashStyle,
			segmentPath,
			renderer = chart.renderer,
			translatedThreshold = series.yAxis.getThreshold(options.threshold || 0),
			useArea = /^area/.test(series.type),
			singlePoints = [], // used in drawTracker
			areaPath = [],
			attribs;


		// divide into segments and build graph and area paths
		each(series.segments, function (segment) {
			segmentPath = [];

			// build the segment line
			each(segment, function (point, i) {

				if (series.getPointSpline) { // generate the spline as defined in the SplineSeries object
					segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i));

				} else {

					// moveTo or lineTo
					segmentPath.push(i ? L : M);

					// step line?
					if (i && options.step) {
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

			// add the segment to the graph, or a single point for tracking
			if (segment.length > 1) {
				graphPath = graphPath.concat(segmentPath);
			} else {
				singlePoints.push(segment[0]);
			}

			// build the area
			if (useArea) {
				var areaSegmentPath = [],
					i,
					segLength = segmentPath.length;
				for (i = 0; i < segLength; i++) {
					areaSegmentPath.push(segmentPath[i]);
				}
				if (segLength === 3) { // for animation from 1 to two points
					areaSegmentPath.push(L, segmentPath[1], segmentPath[2]);
				}
				if (options.stacking && series.type !== 'areaspline') {
					// follow stack back. Todo: implement areaspline
					for (i = segment.length - 1; i >= 0; i--) {
						areaSegmentPath.push(segment[i].plotX, segment[i].yBottom);
					}

				} else { // follow zero line back
					areaSegmentPath.push(
						L,
						segment[segment.length - 1].plotX,
						translatedThreshold,
						L,
						segment[0].plotX,
						translatedThreshold
					);
				}
				areaPath = areaPath.concat(areaSegmentPath);
			}
		});

		// used in drawTracker:
		series.graphPath = graphPath;
		series.singlePoints = singlePoints;

		// draw the area if area series or areaspline
		if (useArea) {
			fillColor = pick(
				options.fillColor,
				Color(series.color).setOpacity(options.fillOpacity || 0.75).get()
			);
			if (area) {
				area.animate({ d: areaPath });

			} else {
				// draw the area
				series.area = series.chart.renderer.path(areaPath)
					.attr({
						fill: fillColor
					}).add(group);
			}
		}

		// draw the graph
		if (graph) {
			stop(graph); // cancel running animations, #459
			graph.animate({ d: graphPath });

		} else {
			if (lineWidth) {
				attribs = {
					'stroke': color,
					'stroke-width': lineWidth
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}

				series.graph = renderer.path(graphPath)
					.attr(attribs).add(group).shadow(options.shadow);
			}
		}
	},


	/**
	 * Render the graph and markers
	 */
	render: function () {
		var series = this,
			chart = series.chart,
			group,
			setInvert,
			options = series.options,
			animation = options.animation,
			doAnimation = animation && series.animate,
			duration = doAnimation ? (animation && animation.duration) || 500 : 0,
			clipRect = series.clipRect,
			renderer = chart.renderer;


		// Add plot area clipping rectangle. If this is before chart.hasRendered,
		// create one shared clipRect.
		if (!clipRect) {
			clipRect = series.clipRect = !chart.hasRendered && chart.clipRect ?
				chart.clipRect :
				renderer.clipRect(0, 0, chart.plotSizeX, chart.plotSizeY);
			if (!chart.clipRect) {
				chart.clipRect = clipRect;
			}
		}


		// the group
		if (!series.group) {
			group = series.group = renderer.g('series');

			if (chart.inverted) {
				setInvert = function () {
					group.attr({
						width: chart.plotWidth,
						height: chart.plotHeight
					}).invert();
				};

				setInvert(); // do it now
				addEvent(chart, 'resize', setInvert); // do it on resize
				addEvent(series, 'destroy', function () {
					removeEvent(chart, 'resize', setInvert);
				});
			}
			group.clip(series.clipRect)
				.attr({
					visibility: series.visible ? VISIBLE : HIDDEN,
					zIndex: options.zIndex
				})
				.translate(chart.plotLeft, chart.plotTop)
				.add(chart.seriesGroup);
		}

		series.drawDataLabels();

		// initiate the animation
		if (doAnimation) {
			series.animate(true);
		}

		// cache attributes for shapes
		//series.getAttribs();

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

		// run the animation
		if (doAnimation) {
			series.animate();
		}

		// finish the individual clipRect
		setTimeout(function () {
			clipRect.isAnimating = false;
			group = series.group; // can be destroyed during the timeout
			if (group && clipRect !== chart.clipRect && clipRect.renderer) {
				group.clip((series.clipRect = chart.clipRect));
				clipRect.destroy();
			}
		}, duration);


		series.isDirty = false; // means data is in accordance with what you see

	},

	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function () {
		var series = this,
			chart = series.chart,
			group = series.group;

		/*if (clipRect) {
			stop(clipRect);
			clipRect.animate({ // for chart resize
				width: chart.plotSizeX,
				height: chart.plotSizeY
			});
		}*/

		// reposition on resize
		if (group) {
			if (chart.inverted) {
				group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				});
			}

			group.animate({
				translateX: chart.plotLeft,
				translateY: chart.plotTop
			});
		}

		series.translate();
		series.setTooltipPoints(true);
		series.render();
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
			showOrHide,
			i,
			data = series.data,
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

		// show or hide trackers
		if (seriesTracker) {
			seriesTracker[showOrHide]();
		} else {
			i = data.length;
			while (i--) {
				point = data[i];
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
			trackerPath = [].concat(series.graphPath),
			trackerPathLength = trackerPath.length,
			chart = series.chart,
			snap = chart.options.tooltip.snap,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			singlePoints = series.singlePoints,
			singlePoint,
			i;

		// Extend end points. A better way would be to use round linecaps,
		// but those are not clickable in VML.
		if (trackerPathLength) {
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
			series.tracker = chart.renderer.path(trackerPath)
				.attr({
					isTracker: true,
					stroke: TRACKER_FILL,
					fill: NONE,
					'stroke-width' : options.lineWidth + 2 * snap,
					visibility: series.visible ? VISIBLE : HIDDEN,
					zIndex: options.zIndex || 1
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
				.add(chart.trackerGroup);
		}

	}

}; // end Series prototype

