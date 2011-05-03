
/**
 * The Point object and prototype. Inheritable and used as base for PiePoint
 */
var Point = function() {};
Point.prototype = {

	/**
	 * Initialize the point
	 * @param {Object} series The series object containing this point
	 * @param {Object} options The data in either number, array or object format
	 */
	init: function(series, options) {
		var point = this,
			defaultColors;
		point.series = series;
		point.applyOptions(options);
		point.pointAttr = {};
		
		if (series.options.colorByPoint) {
			defaultColors = series.chart.options.colors;
			if (!point.options) {
				point.options = {};
			}
			point.color = point.options.color = point.color || defaultColors[colorCounter++];
			
			// loop back to zero
			if (colorCounter >= defaultColors.length) {
				colorCounter = 0;
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
	applyOptions: function(options) {
		var point = this,
			series = point.series;
	
		point.config = options;
		
		// onedimensional array input
		if (isNumber(options) || options === null) {
			point.y = options;	
		}
		
		// object input
		else if (isObject(options) && !isNumber(options.length)) {
			
			// copy options directly to point
			extend(point, options);
			point.options = options;
		}
		
		// categorized data with name in first position
		else if (isString(options[0])) {
			point.name = options[0];
			point.y = options[1];
		}
		
		// two-dimentional array
		else if (isNumber(options[0])) {
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
	destroy: function() {
		var point = this,
			series = point.series,
			prop;
			
		series.chart.pointCount--;
			
		if (point == series.chart.hoverPoint) {
			point.onMouseOut();
		}
		series.chart.hoverPoints = null; // remove reference
		
		// remove all events
		removeEvent(point);
		
		each(['graphic', 'tracker', 'group', 'dataLabel', 'connector'], function(prop) {
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
	getLabelConfig: function() {
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
	select: function(selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;
			
		point.selected = selected = pick(selected, !point.selected);
		
		//series.isDirty = true;
		point.firePointEvent(selected ? 'select' : 'unselect');
		point.setState(selected && SELECT_STATE);
		
		// unselect all other points unless Ctrl or Cmd + click
		if (!accumulate) {
			each(chart.getSelectedPoints(), function (loopPoint) {
				if (loopPoint.selected && loopPoint != point) {
					loopPoint.selected = false;
					loopPoint.setState(NORMAL_STATE);
					loopPoint.firePointEvent('unselect');
				}
			});
		}
		
	},
	
	onMouseOver: function() {
		var point = this,
			chart = point.series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;
			
		// set normal state to previous series
		if (hoverPoint && hoverPoint != point) {
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
	
	onMouseOut: function() {
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
	tooltipFormatter: function(useHeader) {
		var point = this,
			series = point.series;
				
		return ['<span style="color:'+ series.color +'">', (point.name || series.name), '</span>: ',
			(!useHeader ? ('<b>x = '+ (point.name || point.x) + ',</b> ') : ''), 
			'<b>', (!useHeader ? 'y = ' : '' ), point.y, '</b>'].join('');
		
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
	update: function(options, redraw, animation) {
		var point = this,
			series = point.series,
			dataLabel = point.dataLabel,
			graphic = point.graphic,
			chart = series.chart;
		
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function() {

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
	remove: function(redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			data = series.data;
		
		setAnimation(animation, chart);
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of removing the point			
		point.firePointEvent('remove', null, function() {

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
	firePointEvent: function(eventType, eventArgs, defaultFunction) {
		var point = this,
			series = this.series,
			seriesOptions = series.options;
		
		// load event handlers on demand to save time on mouseover/out
		if (seriesOptions.point.events[eventType] || (
				point.options && point.options.events && point.options.events[eventType])) {
			this.importEvents();
		}
			
		// add default handler if in selection mode
		if (eventType == 'click' && seriesOptions.allowPointSelect) {
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
	importEvents: function() {
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
	setState: function(state) {
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
			
		if (!state) {
			state = NORMAL_STATE; // empty string
		}
		
		if (
				// already has this state
				state == point.state ||
				// selected points don't respond to hover
				(point.selected && state != SELECT_STATE) ||
				// series' state options is disabled
				(stateOptions[state] && stateOptions[state].enabled === false) ||
				// point marker's state options is disabled
				(state && (stateDisabled || normalDisabled && !markerStateOptions.enabled))

			) {
			return;
		}
		
		// apply hover styles to the existing point
		if (point.graphic) {
			point.graphic.attr(pointAttr[state]);
		}
		// if a graphic is not applied to each point in the normal state, create a shared
		// graphic for the hover state
		else {
			if (state) {
				if (!stateMarkerGraphic) {
					series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.circle(
						0, 0, pointAttr[state].r
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
