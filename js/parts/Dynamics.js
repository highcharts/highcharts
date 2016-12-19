/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Axis.js';
import './Chart.js';
import './Point.js';
import './Series.js';
var addEvent = H.addEvent,
	animate = H.animate,
	Axis = H.Axis,
	Chart = H.Chart,
	createElement = H.createElement,
	css = H.css,
	defined = H.defined,
	each = H.each,
	erase = H.erase,
	extend = H.extend,
	fireEvent = H.fireEvent,
	inArray = H.inArray,
	isNumber = H.isNumber,
	isObject = H.isObject,
	merge = H.merge,
	pick = H.pick,
	Point = H.Point,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	setAnimation = H.setAnimation,
	splat = H.splat;
		
// Extend the Chart prototype for dynamic methods
extend(Chart.prototype, /** @lends Highcharts.Chart.prototype */ {

	/**
	 * Add a series dynamically after  time
	 *
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 * @return {Object} series The newly created series object
	 */
	addSeries: function (options, redraw, animation) {
		var series,
			chart = this;

		if (options) {
			redraw = pick(redraw, true); // defaults to true

			fireEvent(chart, 'addSeries', { options: options }, function () {
				series = chart.initSeries(options);

				chart.isDirtyLegend = true; // the series array is out of sync with the display
				chart.linkSeries();
				if (redraw) {
					chart.redraw(animation);
				}
			});
		}

		return series;
	},

	/**
     * Add an axis to the chart
     * @param {Object} options The axis option
     * @param {Boolean} isX Whether it is an X axis or a value axis
     */
	addAxis: function (options, isX, redraw, animation) {
		var key = isX ? 'xAxis' : 'yAxis',
			chartOptions = this.options,
			userOptions = merge(options, {
				index: this[key].length,
				isX: isX
			});

		new Axis(this, userOptions); // eslint-disable-line no-new

		// Push the new axis options to the chart options
		chartOptions[key] = splat(chartOptions[key] || {});
		chartOptions[key].push(userOptions);

		if (pick(redraw, true)) {
			this.redraw(animation);
		}
	},

	/**
	 * Dim the chart and show a loading text or symbol
	 * @param {String} str An optional text to show in the loading label instead of the default one
	 */
	showLoading: function (str) {
		var chart = this,
			options = chart.options,
			loadingDiv = chart.loadingDiv,
			loadingOptions = options.loading,
			setLoadingSize = function () {
				if (loadingDiv) {
					css(loadingDiv, {
						left: chart.plotLeft + 'px',
						top: chart.plotTop + 'px',
						width: chart.plotWidth + 'px',
						height: chart.plotHeight + 'px'
					});
				}
			};

		// create the layer at the first call
		if (!loadingDiv) {
			chart.loadingDiv = loadingDiv = createElement('div', {
				className: 'highcharts-loading highcharts-loading-hidden'
			}, null, chart.container);

			chart.loadingSpan = createElement(
				'span',
				{ className: 'highcharts-loading-inner' },
				null,
				loadingDiv
			);
			addEvent(chart, 'redraw', setLoadingSize); // #1080
		}
		
		loadingDiv.className = 'highcharts-loading';

		// Update text
		chart.loadingSpan.innerHTML = str || options.lang.loading;

		/*= if (build.classic) { =*/
		// Update visuals
		css(loadingDiv, extend(loadingOptions.style, {
			zIndex: 10
		}));
		css(chart.loadingSpan, loadingOptions.labelStyle);

		// Show it
		if (!chart.loadingShown) {
			css(loadingDiv, {
				opacity: 0,
				display: ''
			});
			animate(loadingDiv, {
				opacity: loadingOptions.style.opacity || 0.5
			}, {
				duration: loadingOptions.showDuration || 0
			});
		}
		/*= } =*/

		chart.loadingShown = true;
		setLoadingSize();
	},

	/**
	 * Hide the loading layer
	 */
	hideLoading: function () {
		var options = this.options,
			loadingDiv = this.loadingDiv;

		if (loadingDiv) {
			loadingDiv.className = 'highcharts-loading highcharts-loading-hidden';
			/*= if (build.classic) { =*/
			animate(loadingDiv, {
				opacity: 0
			}, {
				duration: options.loading.hideDuration || 100,
				complete: function () {
					css(loadingDiv, { display: 'none' });
				}
			});
			/*= } =*/
		}
		this.loadingShown = false;
	},

	/** 
	 * These properties cause isDirtyBox to be set to true when updating. Can be extended from plugins.
	 */
	propsRequireDirtyBox: ['backgroundColor', 'borderColor', 'borderWidth', 'margin', 'marginTop', 'marginRight',
		'marginBottom', 'marginLeft', 'spacing', 'spacingTop', 'spacingRight', 'spacingBottom', 'spacingLeft',
		'borderRadius', 'plotBackgroundColor', 'plotBackgroundImage', 'plotBorderColor', 'plotBorderWidth', 
		'plotShadow', 'shadow'],

	/** 
	 * These properties cause all series to be updated when updating. Can be
	 * extended from plugins.
	 */
	propsRequireUpdateSeries: ['chart.inverted', 'chart.polar',
		'chart.ignoreHiddenSeries', 'chart.type', 'colors', 'plotOptions'],

	/**
	 * Chart.update function that takes the whole options stucture.
	 */
	update: function (options, redraw) {
		var key,
			adders = {
				credits: 'addCredits',
				title: 'setTitle',
				subtitle: 'setSubtitle'
			},
			optionsChart = options.chart,
			updateAllAxes,
			updateAllSeries,
			newWidth,
			newHeight;

		// If the top-level chart option is present, some special updates are required		
		if (optionsChart) {
			merge(true, this.options.chart, optionsChart);

			// Setter function
			if ('className' in optionsChart) {
				this.setClassName(optionsChart.className);
			}

			if ('inverted' in optionsChart || 'polar' in optionsChart) {
				this.propFromSeries(); // Parses options.chart.inverted and options.chart.polar together with the available series
				updateAllAxes = true;
			}

			for (key in optionsChart) {
				if (optionsChart.hasOwnProperty(key)) {
					if (inArray('chart.' + key, this.propsRequireUpdateSeries) !== -1) {
						updateAllSeries = true;
					}
					// Only dirty box
					if (inArray(key, this.propsRequireDirtyBox) !== -1) {
						this.isDirtyBox = true;
					}
					
				}
			}

			/*= if (build.classic) { =*/
			if ('style' in optionsChart) {
				this.renderer.setStyle(optionsChart.style);
			}
			/*= } =*/
		}
		
		// Some option stuctures correspond one-to-one to chart objects that have
		// update methods, for example
		// options.credits => chart.credits
		// options.legend => chart.legend
		// options.title => chart.title
		// options.tooltip => chart.tooltip
		// options.subtitle => chart.subtitle
		// options.navigator => chart.navigator
		// options.scrollbar => chart.scrollbar
		for (key in options) {
			if (this[key] && typeof this[key].update === 'function') {
				this[key].update(options[key], false);

			// If a one-to-one object does not exist, look for an adder function
			} else if (typeof this[adders[key]] === 'function') {
				this[adders[key]](options[key]);
			}

			if (key !== 'chart' && inArray(key, this.propsRequireUpdateSeries) !== -1) {
				updateAllSeries = true;
			}
		}

		/*= if (build.classic) { =*/
		if (options.colors) {
			this.options.colors = options.colors;
		}
		/*= } =*/

		if (options.plotOptions) {
			merge(true, this.options.plotOptions, options.plotOptions);
		}

		// Setters for collections. For axes and series, each item is referred
		// by an id. If the id is not found, it defaults to the corresponding
		// item in the collection, so setting one series without an id, will
		// update the first series in the chart. Setting two series without
		// an id will update the first and the second respectively (#6019)
		// // docs: New behaviour for unidentified items, add it to docs for 
		// chart.update and responsive.
		each(['xAxis', 'yAxis', 'series'], function (coll) {
			if (options[coll]) {
				each(splat(options[coll]), function (newOptions, i) {
					var item = (
						defined(newOptions.id) &&
						this.get(newOptions.id)
					) || this[coll][i];
					if (item && item.coll === coll) {
						item.update(newOptions, false);
					}
				}, this);
			}
		}, this);

		if (updateAllAxes) {
			each(this.axes, function (axis) {
				axis.update({}, false);
			});
		}

		// Certain options require the whole series structure to be thrown away
		// and rebuilt
		if (updateAllSeries) {
			each(this.series, function (series) {
				series.update({}, false);
			});
		}

		// For loading, just update the options, do not redraw
		if (options.loading) {
			merge(true, this.options.loading, options.loading);
		}

		// Update size. Redraw is forced.
		newWidth = optionsChart && optionsChart.width;
		newHeight = optionsChart && optionsChart.height;
		if ((isNumber(newWidth) && newWidth !== this.chartWidth) ||
				(isNumber(newHeight) && newHeight !== this.chartHeight)) {
			this.setSize(newWidth, newHeight);
		} else if (pick(redraw, true)) {
			this.redraw();
		}
	},

	/**
	 * Setter function to allow use from chart.update
	 */
	setSubtitle: function (options) {
		this.setTitle(undefined, options);
	}

	
});

// extend the Point prototype for dynamic methods
extend(Point.prototype, /** @lends Point.prototype */ {
	/**
	 * Point.update with new options (typically x/y data) and optionally redraw the series.
	 *
	 * @param {Object} options Point options as defined in the series.data array
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	update: function (options, redraw, animation, runEvent) {
		var point = this,
			series = point.series,
			graphic = point.graphic,
			i,
			chart = series.chart,
			seriesOptions = series.options;

		redraw = pick(redraw, true);

		function update() {

			point.applyOptions(options);

			// Update visuals
			if (point.y === null && graphic) { // #4146
				point.graphic = graphic.destroy();
			}
			if (isObject(options, true)) {
				// Destroy so we can get new elements
				if (graphic && graphic.element) {
					if (options && options.marker && options.marker.symbol) {
						point.graphic = graphic.destroy();
					}
				}
				if (options && options.dataLabels && point.dataLabel) { // #2468
					point.dataLabel = point.dataLabel.destroy();
				}
			}

			// record changes in the parallel arrays
			i = point.index;
			series.updateParallelArrays(point, i);
			
			// Record the options to options.data. If there is an object from before,
			// use point options, otherwise use raw options. (#4701)
			seriesOptions.data[i] = isObject(seriesOptions.data[i], true) ? point.options : options;

			// redraw
			series.isDirty = series.isDirtyData = true;
			if (!series.fixedBox && series.hasCartesianSeries) { // #1906, #2320
				chart.isDirtyBox = true;
			}

			if (seriesOptions.legendType === 'point') { // #1831, #1885
				chart.isDirtyLegend = true;
			}
			if (redraw) {
				chart.redraw(animation);
			}
		}

		// Fire the event with a default handler of doing the update
		if (runEvent === false) { // When called from setData
			update();
		} else {
			point.firePointEvent('update', { options: options }, update);
		}
	},

	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	remove: function (redraw, animation) {
		this.series.removePoint(inArray(this, this.series.data), redraw, animation);
	}
});

// Extend the series prototype for dynamic methods
extend(Series.prototype, /** @lends Series.prototype */ {
	/**
	 * Add a point dynamically after chart load time
	 * @param {Object} options Point options as given in series.data
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean} shift If shift is true, a point is shifted off the start
	 *    of the series as one is appended to the end.
	 * @param {Boolean|AnimationOptions} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	addPoint: function (options, redraw, shift, animation) {
		var series = this,
			seriesOptions = series.options,
			data = series.data,
			chart = series.chart,
			xAxis = series.xAxis,
			names = xAxis && xAxis.hasNames && xAxis.names,
			dataOptions = seriesOptions.data,
			point,
			isInTheMiddle,
			xData = series.xData,
			i,
			x;

		// Optional redraw, defaults to true
		redraw = pick(redraw, true);

		// Get options and push the point to xData, yData and series.options. In series.generatePoints
		// the Point instance will be created on demand and pushed to the series.data array.
		point = { series: series };
		series.pointClass.prototype.applyOptions.apply(point, [options]);
		x = point.x;

		// Get the insertion point
		i = xData.length;
		if (series.requireSorting && x < xData[i - 1]) {
			isInTheMiddle = true;
			while (i && xData[i - 1] > x) {
				i--;
			}
		}

		series.updateParallelArrays(point, 'splice', i, 0, 0); // insert undefined item
		series.updateParallelArrays(point, i); // update it

		if (names && point.name) {
			names[x] = point.name;
		}
		dataOptions.splice(i, 0, options);

		if (isInTheMiddle) {
			series.data.splice(i, 0, null);
			series.processData();
		}

		// Generate points to be added to the legend (#1329)
		if (seriesOptions.legendType === 'point') {
			series.generatePoints();
		}

		// Shift the first point off the parallel arrays
		if (shift) {
			if (data[0] && data[0].remove) {
				data[0].remove(false);
			} else {
				data.shift();
				series.updateParallelArrays(point, 'shift');

				dataOptions.shift();
			}
		}

		// redraw
		series.isDirty = true;
		series.isDirtyData = true;

		if (redraw) {
			chart.redraw(animation); // Animation is set anyway on redraw, #5665
		}
	},

	/**
	 * Remove a point (rendered or not), by index
	 */
	removePoint: function (i, redraw, animation) {

		var series = this,
			data = series.data,
			point = data[i],
			points = series.points,
			chart = series.chart,
			remove = function () {

				if (points && points.length === data.length) { // #4935
					points.splice(i, 1);
				}
				data.splice(i, 1);
				series.options.data.splice(i, 1);
				series.updateParallelArrays(point || { series: series }, 'splice', i, 1);

				if (point) {
					point.destroy();
				}

				// redraw
				series.isDirty = true;
				series.isDirtyData = true;
				if (redraw) {
					chart.redraw();
				}
			};

		setAnimation(animation, chart);
		redraw = pick(redraw, true);

		// Fire the event with a default handler of removing the point
		if (point) {
			point.firePointEvent('remove', null, remove);
		} else {
			remove();
		}
	},

	/**
	 * Remove a series and optionally redraw the chart
	 *
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	remove: function (redraw, animation, withEvent) {
		var series = this,
			chart = series.chart;

		function remove() {

			// Destroy elements
			series.destroy();

			// Redraw
			chart.isDirtyLegend = chart.isDirtyBox = true;
			chart.linkSeries();

			if (pick(redraw, true)) {
				chart.redraw(animation);
			}
		}

		// Fire the event with a default handler of removing the point
		if (withEvent !== false) {
			fireEvent(series, 'remove', null, remove);
		} else {
			remove();
		}
	},

	/**
	 * Series.update with a new set of options
	 */
	update: function (newOptions, redraw) {
		var series = this,
			chart = this.chart,
			// must use user options when changing type because this.options is merged
			// in with type specific plotOptions
			oldOptions = this.userOptions,
			oldType = this.type,
			newType = newOptions.type || oldOptions.type || chart.options.chart.type,
			proto = seriesTypes[oldType].prototype,
			preserve = ['group', 'markerGroup', 'dataLabelsGroup'],
			n;

		// If we're changing type or zIndex, create new groups (#3380, #3404)
		if ((newType && newType !== oldType) || newOptions.zIndex !== undefined) {
			preserve.length = 0;
		}

		// Make sure groups are not destroyed (#3094)
		each(preserve, function (prop) {
			preserve[prop] = series[prop];
			delete series[prop];
		});

		// Do the merge, with some forced options
		newOptions = merge(oldOptions, {
			animation: false,
			index: this.index,
			pointStart: this.xData[0] // when updating after addPoint
		}, { data: this.options.data }, newOptions);

		// Destroy the series and delete all properties. Reinsert all methods
		// and properties from the new type prototype (#2270, #3719)
		this.remove(false, null, false);
		for (n in proto) {
			this[n] = undefined;
		}
		extend(this, seriesTypes[newType || oldType].prototype);

		// Re-register groups (#3094)
		each(preserve, function (prop) {
			series[prop] = preserve[prop];
		});

		this.init(chart, newOptions);
		chart.linkSeries(); // Links are lost in this.remove (#3028)
		if (pick(redraw, true)) {
			chart.redraw(false);
		}
	}
});

// Extend the Axis.prototype for dynamic methods
extend(Axis.prototype, /** @lends Axis.prototype */ {

	/**
	 * Axis.update with a new options structure
	 */
	update: function (newOptions, redraw) {
		var chart = this.chart;

		newOptions = chart.options[this.coll][this.options.index] = merge(this.userOptions, newOptions);

		this.destroy(true);

		this.init(chart, extend(newOptions, { events: undefined }));

		chart.isDirtyBox = true;
		if (pick(redraw, true)) {
			chart.redraw();
		}
	},

	/**
     * Remove the axis from the chart
     */
	remove: function (redraw) {
		var chart = this.chart,
			key = this.coll, // xAxis or yAxis
			axisSeries = this.series,
			i = axisSeries.length;

		// Remove associated series (#2687)
		while (i--) {
			if (axisSeries[i]) {
				axisSeries[i].remove(false);
			}
		}

		// Remove the axis
		erase(chart.axes, this);
		erase(chart[key], this);
		chart.options[key].splice(this.options.index, 1);
		each(chart[key], function (axis, i) { // Re-index, #1706
			axis.options.index = i;
		});
		this.destroy();
		chart.isDirtyBox = true;

		if (pick(redraw, true)) {
			chart.redraw();
		}
	},

	/**
	 * Update the axis title by options
	 */
	setTitle: function (newTitleOptions, redraw) {
		this.update({ title: newTitleOptions }, redraw);
	},

	/**
	 * Set new axis categories and optionally redraw
	 * @param {Array} categories
	 * @param {Boolean} redraw
	 */
	setCategories: function (categories, redraw) {
		this.update({ categories: categories }, redraw);
	}

});
