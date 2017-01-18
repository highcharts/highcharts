/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var Point,

	each = H.each,
	extend = H.extend,
	erase = H.erase,
	fireEvent = H.fireEvent,
	format = H.format,
	isArray = H.isArray,
	isNumber = H.isNumber,
	pick = H.pick,
	removeEvent = H.removeEvent;

/**
 * The Point object. The point objects are generated from the series.data 
 * configuration objects or raw numbers. They can be accessed from the
 * Series.points array.
 * @constructor Point
 */
Point = H.Point = function () {};
Point.prototype = {

	/**
	 * Initialize the point. Called internally based on the series.data option.
	 * @function #init
	 * @memberOf Point
	 * @param {Object} series The series object containing this point.
	 * @param {Object} options The data in either number, array or object
	 *        format.
	 * @param {Number} x Optionally, the X value of the.
	 * @returns {Object} The Point instance.
	 */
	init: function (series, options, x) {

		var point = this,
			colors,
			colorCount = series.chart.options.chart.colorCount,
			colorIndex;

		point.series = series;
		/*= if (build.classic) { =*/
		point.color = series.color; // #3445
		/*= } =*/
		point.applyOptions(options, x);

		if (series.options.colorByPoint) {
			/*= if (build.classic) { =*/
			colors = series.options.colors || series.chart.options.colors;
			point.color = point.color || colors[series.colorCounter];
			colorCount = colors.length;
			/*= } =*/
			colorIndex = series.colorCounter;
			series.colorCounter++;
			// loop back to zero
			if (series.colorCounter === colorCount) {
				series.colorCounter = 0;
			}
		} else {
			colorIndex = series.colorIndex;
		}
		point.colorIndex = pick(point.colorIndex, colorIndex);

		series.chart.pointCount++;
		return point;
	},
	/**
	 * Apply the options containing the x and y data and possible some extra
	 * properties. Called on point init or from point.update.
	 *
	 * @function #applyOptions
	 * @memberOf Point
	 * @param {Object} options The point options as defined in series.data.
	 * @param {Number} x Optionally, the X value.
	 * @returns {Object} The Point instance.
	 */
	applyOptions: function (options, x) {
		var point = this,
			series = point.series,
			pointValKey = series.options.pointValKey || series.pointValKey;

		options = Point.prototype.optionsToObject.call(this, options);

		// copy options directly to point
		extend(point, options);
		point.options = point.options ? extend(point.options, options) : options;

		// Since options are copied into the Point instance, some accidental options must be shielded (#5681)
		if (options.group) {
			delete point.group;
		}

		// For higher dimension series types. For instance, for ranges, point.y is mapped to point.low.
		if (pointValKey) {
			point.y = point[pointValKey];
		}
		point.isNull = pick(
			point.isValid && !point.isValid(),
			point.x === null || !isNumber(point.y, true)
		); // #3571, check for NaN

		// The point is initially selected by options (#5777)
		if (point.selected) {
			point.state = 'select';
		}

		// If no x is set by now, get auto incremented value. All points must have an
		// x value, however the y value can be null to create a gap in the series
		if ('name' in point && x === undefined && series.xAxis && series.xAxis.hasNames) {
			point.x = series.xAxis.nameToX(point);
		}
		if (point.x === undefined && series) {
			if (x === undefined) {
				point.x = series.autoIncrement(point);
			} else {
				point.x = x;
			}
		}
		
		return point;
	},

	/**
	 * Transform number or array configs into objects
	 */
	optionsToObject: function (options) {
		var ret = {},
			series = this.series,
			keys = series.options.keys,
			pointArrayMap = keys || series.pointArrayMap || ['y'],
			valueCount = pointArrayMap.length,
			firstItemType,
			i = 0,
			j = 0;

		if (isNumber(options) || options === null) {
			ret[pointArrayMap[0]] = options;

		} else if (isArray(options)) {
			// with leading x value
			if (!keys && options.length > valueCount) {
				firstItemType = typeof options[0];
				if (firstItemType === 'string') {
					ret.name = options[0];
				} else if (firstItemType === 'number') {
					ret.x = options[0];
				}
				i++;
			}
			while (j < valueCount) {
				if (!keys || options[i] !== undefined) { // Skip undefined positions for keys
					ret[pointArrayMap[j]] = options[i];
				}
				i++;
				j++;
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
	 * Get the CSS class names for individual points
	 * @returns {String} The class name
	 */
	getClassName: function () {
		return 'highcharts-point' + 
			(this.selected ? ' highcharts-point-select' : '') + 
			(this.negative ? ' highcharts-negative' : '') + 
			(this.isNull ? ' highcharts-null-point' : '') + 
			(this.colorIndex !== undefined ? ' highcharts-color-' +
				this.colorIndex : '') +
			(this.options.className ? ' ' + this.options.className : '') +
			(this.zone && this.zone.className ? ' ' +
				this.zone.className.replace('highcharts-negative', '') : '');
	},

	/**
	 * Return the zone that the point belongs to
	 */
	getZone: function () {
		var series = this.series,
			zones = series.zones,
			zoneAxis = series.zoneAxis || 'y',
			i = 0,
			zone;

		zone = zones[i];
		while (this[zoneAxis] >= zone.value) {				
			zone = zones[++i];
		}

		if (zone && zone.color && !this.options.color) {
			this.color = zone.color;
		}

		return zone;
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
			props = ['graphic', 'dataLabel', 'dataLabelUpper', 'connector', 'shadowGroup'],
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
		return {
			x: this.category,
			y: this.y,
			color: this.color,
			colorIndex: this.colorIndex,
			key: this.name || this.category,
			series: this.series,
			point: this,
			percentage: this.percentage,
			total: this.total || this.stackTotal
		};
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
	 * Fire an event on the Point object.
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
				if (point.select) { // Could be destroyed by prior event handlers (#2911)
					point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
				}
			};
		}

		fireEvent(this, eventType, eventArgs, defaultFunction);
	},
	visible: true
};
