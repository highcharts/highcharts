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
			colors;
		point.series = series;
		point.applyOptions(options, x);
		point.pointAttr = {};

		if (series.options.colorByPoint) {
			colors = series.options.colors || series.chart.options.colors;
			point.color = point.color || colors[series.colorCounter++];
			// loop back to zero
			if (series.colorCounter === colors.length) {
				series.colorCounter = 0;
			}
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
			pointValKey = series.pointValKey;

		options = Point.prototype.optionsToObject.call(this, options);

		// copy options directly to point
		extend(point, options);
		point.options = point.options ? extend(point.options, options) : options;

		// For higher dimension series types. For instance, for ranges, point.y is mapped to point.low.
		if (pointValKey) {
			point.y = point[pointValKey];
		}

		// If no x is set by now, get auto incremented value. All points must have an
		// x value, however the y value can be null to create a gap in the series
		if (point.x === UNDEFINED && series) {
			point.x = x === UNDEFINED ? series.autoIncrement() : x;
		}

		return point;
	},

	/**
	 * Transform number or array configs into objects
	 */
	optionsToObject: function (options) {
		var ret = {},
			series = this.series,
			pointArrayMap = series.pointArrayMap || ['y'],
			valueCount = pointArrayMap.length,
			firstItemType,
			i = 0,
			j = 0;

		if (typeof options === 'number' || options === null) {
			ret[pointArrayMap[0]] = options;

		} else if (isArray(options)) {
			// with leading x value
			if (options.length > valueCount) {
				firstItemType = typeof options[0];
				if (firstItemType === 'string') {
					ret.name = options[0];
				} else if (firstItemType === 'number') {
					ret.x = options[0];
				}
				i++;
			}
			while (j < valueCount) {
				ret[pointArrayMap[j++]] = options[i++];
			}
		} else if (typeof options === 'object') {
			ret = options;

			// This is the fastest way to detect if there are individual point dataLabels that need
			// to be considered in drawDataLabels. These can only occur in object configs.
			if (options.dataLabels) {
				series._hasPointLabels = true;
			}

			// Same approach as above for markers
			if (options.marker) {
				series._hasPointMarkers = true;
			}
		}
		return ret;
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
			props = ['graphic', 'dataLabel', 'dataLabelUpper', 'group', 'connector', 'shadowGroup'],
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
			point.selected = point.options.selected = selected;
			series.options.data[inArray(point, series.data)] = point.options;

			point.setState(selected && SELECT_STATE);

			// unselect all other points unless Ctrl or Cmd + click
			if (!accumulate) {
				each(chart.getSelectedPoints(), function (loopPoint) {
					if (loopPoint.selected && loopPoint !== point) {
						loopPoint.selected = loopPoint.options.selected = false;
						series.options.data[inArray(loopPoint, series.data)] = loopPoint.options;
						loopPoint.setState(NORMAL_STATE);
						loopPoint.firePointEvent('unselect');
					}
				});
			}
		});
	},

	/**
	 * Runs on mouse over the point
	 */
	onMouseOver: function (e) {
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
			tooltip.refresh(point, e);
		}

		// hover this
		point.setState(HOVER_STATE);
		chart.hoverPoint = point;
	},

	/**
	 * Runs on mouse out from the point
	 */
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

		// Insert options for valueDecimals, valuePrefix, and valueSuffix
		var series = this.series,
			seriesTooltipOptions = series.tooltipOptions,
			valueDecimals = pick(seriesTooltipOptions.valueDecimals, ''),
			valuePrefix = seriesTooltipOptions.valuePrefix || '',
			valueSuffix = seriesTooltipOptions.valueSuffix || '';

		// Loop over the point array map and replace unformatted values with sprintf formatting markup
		each(series.pointArrayMap || ['y'], function (key) {
			key = '{point.' + key; // without the closing bracket
			if (valuePrefix || valueSuffix) {
				pointFormat = pointFormat.replace(key + '}', valuePrefix + key + '}' + valueSuffix);
			}
			pointFormat = pointFormat.replace(key + '}', key + ':,.' + valueDecimals + 'f}');
		});

		return format(pointFormat, {
			point: this,
			series: this.series
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
	setState: function (state, move) {
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
			pointMarker = point.marker || {},
			chart = series.chart,
			radius,
			newSymbol,
			pointAttr = point.pointAttr;

		state = state || NORMAL_STATE; // empty string
		move = move && stateMarkerGraphic;

		if (
				// already has this state
				(state === point.state && !move) ||
				// selected points don't respond to hover
				(point.selected && state !== SELECT_STATE) ||
				// series' state options is disabled
				(stateOptions[state] && stateOptions[state].enabled === false) ||
				// general point marker's state options is disabled
				(state && (stateDisabled || (normalDisabled && !markerStateOptions.enabled))) ||
				// individual point marker's state options is disabled
				(state && pointMarker.states && pointMarker.states[state] && pointMarker.states[state].enabled === false) // #1610

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
				newSymbol = pointMarker.symbol || series.symbol;

				// If the point has another symbol than the previous one, throw away the
				// state marker graphic and force a new one (#1459)
				if (stateMarkerGraphic && stateMarkerGraphic.currentSymbol !== newSymbol) {
					stateMarkerGraphic = stateMarkerGraphic.destroy();
				}

				// Add a new state marker graphic
				if (!stateMarkerGraphic) {
					series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.symbol(
						newSymbol,
						plotX - radius,
						plotY - radius,
						2 * radius,
						2 * radius
					)
					.attr(pointAttr[state])
					.add(series.markerGroup);
					stateMarkerGraphic.currentSymbol = newSymbol;

				// Move the existing graphic
				} else {
					stateMarkerGraphic[move ? 'animate' : 'attr']({ // #1054
						x: plotX - radius,
						y: plotY - radius
					});
				}
			}

			if (stateMarkerGraphic) {
				stateMarkerGraphic[state && chart.isInsidePlot(plotX, plotY, chart.inverted) ? 'show' : 'hide'](); // #2450
			}
		}

		point.state = state;
	}
};