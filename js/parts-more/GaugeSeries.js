/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/Interaction.js';
var each = H.each,
	isNumber = H.isNumber,
	merge = H.merge,
	noop = H.noop,		
	pick = H.pick,
	pInt = H.pInt,
	Series = H.Series,
	seriesType = H.seriesType,
	TrackerMixin = H.TrackerMixin;

seriesType('gauge', 'line', 
/** 
 * The GaugeSeries class
 * @extends {plotOptions.line}
 * @optionparent plotOptions.gauge
 */
{

	/**
	 * Data labels for the gauge. For gauges, the data labels are enabled
	 * by default and shown in a bordered box below the point.
	 * 
	 * @type {Object}
	 * @extends plotOptions.series.dataLabels
	 * @since 2.3.0
	 * @product highcharts
	 */
	dataLabels: {

		/**
		 * Enable or disable the data labels.
		 * 
		 * @type {Boolean}
		 * @since 2.3.0
		 * @product highcharts highmaps
		 */
		enabled: true,

		/**
		 */
		defer: false,

		/**
		 * The y position offset of the label relative to the center of the
		 * gauge.
		 * 
		 * @type {Number}
		 * @default {all} 15
		 * @since 2.3.0
		 * @product highcharts highmaps
		 */
		y: 15,

		/**
		 * The border radius in pixels for the gauge's data label.
		 * 
		 * @type {Number}
		 * @default {all} 3
		 * @since 2.3.0
		 * @product highcharts highmaps
		 */
		borderRadius: 3,

		/**
		 */
		crop: false,

		/**
		 * The vertical alignment of the data label.
		 * 
		 * @type {String}
		 * @default {all} top
		 * @product highcharts highmaps
		 */
		verticalAlign: 'top',

		/**
		 * The Z index of the data labels. A value of 2 display them behind
		 * the dial.
		 * 
		 * @type {Number}
		 * @default {all} 2
		 * @since 2.1.5
		 * @product highcharts highmaps
		 */
		zIndex: 2,
		/*= if (build.classic) { =*/
		// Presentational

		/**
		 * The border width in pixels for the gauge data label.
		 * 
		 * @type {Number}
		 * @default {all} 1
		 * @since 2.3.0
		 * @product highcharts highmaps
		 */
		borderWidth: 1,

		/**
		 * The border color for the data label.
		 * 
		 * @type {Color}
		 * @default {all} #cccccc
		 * @since 2.3.0
		 * @product highcharts highmaps
		 */
		borderColor: '${palette.neutralColor20}'
		/*= } =*/
	},

	/**
	 * Options for the dial or arrow pointer of the gauge.
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the dial is styled with the `.highcharts-gauge-
	 * series .highcharts-dial` rule.
	 * 
	 * @type {Object}
	 * @sample {highcharts} highcharts/css/gauge/ Styled mode
	 * @since 2.3.0
	 * @product highcharts
	 */
	dial: {
		// radius: '80%',
		// baseWidth: 3,
		// topWidth: 1,
		// baseLength: '70%' // of radius
		// rearLength: '10%'
		/*= if (build.classic) { =*/
		// backgroundColor: '${palette.neutralColor100}',
		// borderColor: '${palette.neutralColor20}',
		// borderWidth: 0,
		/*= } =*/
		
	},

	/**
	 * Options for the pivot or the center point of the gauge.
	 * 
	 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
	 * style/style-by-css), the pivot is styled with the `.highcharts-gauge-
	 * series .highcharts-pivot` rule.
	 * 
	 * @type {Object}
	 * @sample {highcharts} highcharts/css/gauge/ Styled mode
	 * @since 2.3.0
	 * @product highcharts
	 */
	pivot: {
		//radius: 5,
		/*= if (build.classic) { =*/
		//borderWidth: 0
		//borderColor: '${palette.neutralColor20}',
		//backgroundColor: '${palette.neutralColor100}'
		/*= } =*/
	},

	/**
	 */
	tooltip: {

		/**
		 */
		headerFormat: ''
	},

	/**
	 * Whether to display this particular series or series type in the
	 * legend. Defaults to false for gauge series.
	 * 
	 * @type {Boolean}
	 * @since 2.3.0
	 * @product highcharts
	 */
	showInLegend: false

// Prototype members
}, {
	// chart.angular will be set to true when a gauge series is present, and this will
	// be used on the axes
	angular: true,
	directTouch: true, // #5063
	drawGraph: noop,
	fixedBox: true,
	forceDL: true,
	noSharedTooltip: true,
	trackerGroups: ['group', 'dataLabelsGroup'],

	/**
	 * Calculate paths etc
	 */
	translate: function () {

		var series = this,
			yAxis = series.yAxis,
			options = series.options,
			center = yAxis.center;

		series.generatePoints();

		each(series.points, function (point) {

			var dialOptions = merge(options.dial, point.dial),
				radius = (pInt(pick(dialOptions.radius, 80)) * center[2]) / 200,
				baseLength = (pInt(pick(dialOptions.baseLength, 70)) * radius) / 100,
				rearLength = (pInt(pick(dialOptions.rearLength, 10)) * radius) / 100,
				baseWidth = dialOptions.baseWidth || 3,
				topWidth = dialOptions.topWidth || 1,
				overshoot = options.overshoot,
				rotation = yAxis.startAngleRad + yAxis.translate(point.y, null, null, null, true);

			// Handle the wrap and overshoot options
			if (isNumber(overshoot)) {
				overshoot = overshoot / 180 * Math.PI;
				rotation = Math.max(yAxis.startAngleRad - overshoot, Math.min(yAxis.endAngleRad + overshoot, rotation));

			} else if (options.wrap === false) {
				rotation = Math.max(yAxis.startAngleRad, Math.min(yAxis.endAngleRad, rotation));
			}

			rotation = rotation * 180 / Math.PI;

			point.shapeType = 'path';
			point.shapeArgs = {
				d: dialOptions.path || [
					'M',
					-rearLength, -baseWidth / 2,
					'L',
					baseLength, -baseWidth / 2,
					radius, -topWidth / 2,
					radius, topWidth / 2,
					baseLength, baseWidth / 2,
					-rearLength, baseWidth / 2,
					'z'
				],
				translateX: center[0],
				translateY: center[1],
				rotation: rotation
			};

			// Positions for data label
			point.plotX = center[0];
			point.plotY = center[1];
		});
	},

	/**
	 * Draw the points where each point is one needle
	 */
	drawPoints: function () {

		var series = this,
			center = series.yAxis.center,
			pivot = series.pivot,
			options = series.options,
			pivotOptions = options.pivot,
			renderer = series.chart.renderer;

		each(series.points, function (point) {

			var graphic = point.graphic,
				shapeArgs = point.shapeArgs,
				d = shapeArgs.d,
				dialOptions = merge(options.dial, point.dial); // #1233

			if (graphic) {
				graphic.animate(shapeArgs);
				shapeArgs.d = d; // animate alters it
			} else {
				point.graphic = renderer[point.shapeType](shapeArgs)
					.attr({
						rotation: shapeArgs.rotation, // required by VML when animation is false
						zIndex: 1
					})
					.addClass('highcharts-dial')
					.add(series.group);

				/*= if (build.classic) { =*/
				// Presentational attributes
				point.graphic.attr({
					stroke: dialOptions.borderColor || 'none',
					'stroke-width': dialOptions.borderWidth || 0,
					fill: dialOptions.backgroundColor || '${palette.neutralColor100}'
				});
				/*= } =*/
			}
		});

		// Add or move the pivot
		if (pivot) {
			pivot.animate({ // #1235
				translateX: center[0],
				translateY: center[1]
			});
		} else {
			series.pivot = renderer.circle(0, 0, pick(pivotOptions.radius, 5))
				.attr({
					zIndex: 2
				})
				.addClass('highcharts-pivot')
				.translate(center[0], center[1])
				.add(series.group);

			/*= if (build.classic) { =*/
			// Presentational attributes
			series.pivot.attr({
				'stroke-width': pivotOptions.borderWidth || 0,
				stroke: pivotOptions.borderColor || '${palette.neutralColor20}',
				fill: pivotOptions.backgroundColor || '${palette.neutralColor100}'
			});
			/*= } =*/
		}
	},

	/**
	 * Animate the arrow up from startAngle
	 */
	animate: function (init) {
		var series = this;

		if (!init) {
			each(series.points, function (point) {
				var graphic = point.graphic;

				if (graphic) {
					// start value
					graphic.attr({
						rotation: series.yAxis.startAngleRad * 180 / Math.PI
					});

					// animate
					graphic.animate({
						rotation: point.shapeArgs.rotation
					}, series.options.animation);
				}
			});

			// delete this function to allow it only once
			series.animate = null;
		}
	},

	render: function () {
		this.group = this.plotGroup(
			'group',
			'series',
			this.visible ? 'visible' : 'hidden',
			this.options.zIndex,
			this.chart.seriesGroup
		);
		Series.prototype.render.call(this);
		this.group.clip(this.chart.clipRect);
	},

	/**
	 * Extend the basic setData method by running processData and generatePoints immediately,
	 * in order to access the points from the legend.
	 */
	setData: function (data, redraw) {
		Series.prototype.setData.call(this, data, false);
		this.processData();
		this.generatePoints();
		if (pick(redraw, true)) {
			this.chart.redraw();
		}
	},

	/**
	 * If the tracking module is loaded, add the point tracker
	 */
	drawTracker: TrackerMixin && TrackerMixin.drawTrackerPoint

// Point members
}, {
	/**
	 * Don't do any hover colors or anything
	 */
	setState: function (state) {
		this.state = state;
	}
});
