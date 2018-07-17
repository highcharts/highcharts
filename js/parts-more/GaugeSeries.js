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


/**
 * Gauges are circular plots displaying one or more values with a dial pointing
 * to values along the perimeter.
 *
 * @sample       highcharts/demo/gauge-speedometer/ Gauge chart
 * @extends      {plotOptions.line}
 * @excluding    animationLimit,boostThreshold,connectEnds,connectNulls,
 *               cropThreshold,dashStyle,findNearestPointBy,getExtremesFromAll,
 *               marker,negativeColor,pointPlacement,shadow,softThreshold,
 *               stacking,states,step,threshold,turboThreshold,xAxis,zoneAxis,
 *               zones
 * @product      highcharts
 * @optionparent plotOptions.gauge
 */
seriesType('gauge', 'line', {

    /**
     * When this option is `true`, the dial will wrap around the axes. For
     * instance, in a full-range gauge going from 0 to 360, a value of 400
     * will point to 40\. When `wrap` is `false`, the dial stops at 360.
     *
     * @type      {Boolean}
     * @see       [overshoot](#plotOptions.gauge.overshoot)
     * @default   true
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.wrap
     */

    /**
     * Data labels for the gauge. For gauges, the data labels are enabled
     * by default and shown in a bordered box below the point.
     *
     * @type    {Object}
     * @extends plotOptions.series.dataLabels
     * @since   2.3.0
     * @product highcharts
     */
    dataLabels: {

        /**
         * Enable or disable the data labels.
         *
         * @since   2.3.0
         * @product highcharts highmaps
         */
        enabled: true,

        defer: false,

        /**
         * The y position offset of the label relative to the center of the
         * gauge.
         *
         * @since   2.3.0
         * @product highcharts highmaps
         */
        y: 15,

        /**
         * The border radius in pixels for the gauge's data label.
         *
         * @since   2.3.0
         * @product highcharts highmaps
         */
        borderRadius: 3,

        crop: false,

        /**
         * The vertical alignment of the data label.
         *
         * @product highcharts highmaps
         */
        verticalAlign: 'top',

        /**
         * The Z index of the data labels. A value of 2 display them behind
         * the dial.
         *
         * @since   2.1.5
         * @product highcharts highmaps
         */
        zIndex: 2,
        /*= if (build.classic) { =*/
        // Presentational

        /**
         * The border width in pixels for the gauge data label.
         *
         * @since   2.3.0
         * @product highcharts highmaps
         */
        borderWidth: 1,

        /**
         * The border color for the data label.
         *
         * @type    {Color}
         * @default #cccccc
         * @since   2.3.0
         * @product highcharts highmaps
         */
        borderColor: '${palette.neutralColor20}'
        /*= } =*/
    },

    /**
     * Options for the dial or arrow pointer of the gauge.
     *
     * In styled mode, the dial is styled with the
     * `.highcharts-gauge-series .highcharts-dial` rule.
     *
     * @type    {Object}
     * @sample  {highcharts} highcharts/css/gauge/ Styled mode
     * @since   2.3.0
     * @product highcharts
     */
    dial: {},

    /**
     * The length of the dial's base part, relative to the total radius
     * or length of the dial.
     *
     * @type      {String}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   70%
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.baseLength
     */

    /**
     * The pixel width of the base of the gauge dial. The base is the part
     * closest to the pivot, defined by baseLength.
     *
     * @type      {Number}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   3
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.baseWidth
     */

    /**
     * The radius or length of the dial, in percentages relative to the
     * radius of the gauge itself.
     *
     * @type      {String}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   80%
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.radius
     */

    /**
     * The length of the dial's rear end, the part that extends out on the
     * other side of the pivot. Relative to the dial's length.
     *
     * @type      {String}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   10%
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.rearLength
     */

    /**
     * The width of the top of the dial, closest to the perimeter. The pivot
     * narrows in from the base to the top.
     *
     * @type      {Number}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   1
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.topWidth
     */

    /*= if (build.classic) { =*/

    /**
     * The background or fill color of the gauge's dial.
     *
     * @type      {Color}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   #000000
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.backgroundColor
     */

    /**
     * The border color or stroke of the gauge's dial. By default, the
     * borderWidth is 0, so this must be set in addition to a custom border
     * color.
     *
     * @type      {Color}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   #cccccc
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.borderColor
     */

    /**
     * The width of the gauge dial border in pixels.
     *
     * @type      {Number}
     * @sample    {highcharts} highcharts/plotoptions/gauge-dial/
     *            Dial options demonstrated
     * @default   0
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.dial.borderWidth
     */

    /*= } =*/

    /**
     * Allow the dial to overshoot the end of the perimeter axis by this
     * many degrees. Say if the gauge axis goes from 0 to 60, a value of
     * 100, or 1000, will show 5 degrees beyond the end of the axis when this
     * option is set to 5.
     *
     * @type      {Number}
     * @see       [wrap](#plotOptions.gauge.wrap)
     * @sample    {highcharts} highcharts/plotoptions/gauge-overshoot/
     *            Allow 5 degrees overshoot
     * @default   0
     * @since     3.0.10
     * @product   highcharts
     * @apioption plotOptions.gauge.overshoot
     */

    /**
     * Options for the pivot or the center point of the gauge.
     *
     * In styled mode, the pivot is styled with the
     * `.highcharts-gauge-series .highcharts-pivot` rule.
     *
     * @type    {Object}
     * @sample  {highcharts} highcharts/css/gauge/ Styled mode
     * @since   2.3.0
     * @product highcharts
     */
    pivot: {},

    /**
     * The pixel radius of the pivot.
     *
     * @type      {Number}
     * @sample    {highcharts} highcharts/plotoptions/gauge-pivot/
     *            Pivot options demonstrated
     * @default   5
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.pivot.radius
     */

    /*= if (build.classic) { =*/

    /**
     * The border or stroke width of the pivot.
     *
     * @type      {Number}
     * @sample    {highcharts} highcharts/plotoptions/gauge-pivot/
     *            Pivot options demonstrated
     * @default   0
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.pivot.borderWidth
     */

    /**
     * The border or stroke color of the pivot. In able to change this,
     * the borderWidth must also be set to something other than the default
     * 0.
     *
     * @type      {Color}
     * @sample    {highcharts} highcharts/plotoptions/gauge-pivot/
     *            Pivot options demonstrated
     * @default   #cccccc
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.pivot.borderColor
        */

    /**
     * The background color or fill of the pivot.
     *
     * @type      {Color}
     * @sample    {highcharts} highcharts/plotoptions/gauge-pivot/
     *            Pivot options demonstrated
     * @default   #000000
     * @since     2.3.0
     * @product   highcharts
     * @apioption plotOptions.gauge.pivot.backgroundColor
     */
    /*= } =*/


    tooltip: {
        headerFormat: ''
    },

    /**
     * Whether to display this particular series or series type in the
     * legend. Defaults to false for gauge series.
     *
     * @since   2.3.0
     * @product highcharts
     */
    showInLegend: false



// Prototype members
}, {
    // chart.angular will be set to true when a gauge series is present,
    // and this will be used on the axes
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
                radius = (pInt(pick(dialOptions.radius, 80)) * center[2]) /
                    200,
                baseLength = (pInt(pick(dialOptions.baseLength, 70)) * radius) /
                    100,
                rearLength = (pInt(pick(dialOptions.rearLength, 10)) * radius) /
                    100,
                baseWidth = dialOptions.baseWidth || 3,
                topWidth = dialOptions.topWidth || 1,
                overshoot = options.overshoot,
                rotation = yAxis.startAngleRad +
                    yAxis.translate(point.y, null, null, null, true);

            // Handle the wrap and overshoot options
            if (isNumber(overshoot)) {
                overshoot = overshoot / 180 * Math.PI;
                rotation = Math.max(
                    yAxis.startAngleRad - overshoot,
                    Math.min(yAxis.endAngleRad + overshoot, rotation)
                );

            } else if (options.wrap === false) {
                rotation = Math.max(
                    yAxis.startAngleRad,
                    Math.min(yAxis.endAngleRad, rotation)
                );
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
                        // required by VML when animation is false
                        rotation: shapeArgs.rotation,
                        zIndex: 1
                    })
                    .addClass('highcharts-dial')
                    .add(series.group);

                /*= if (build.classic) { =*/
                // Presentational attributes
                point.graphic.attr({
                    stroke: dialOptions.borderColor || 'none',
                    'stroke-width': dialOptions.borderWidth || 0,
                    fill: dialOptions.backgroundColor ||
                        '${palette.neutralColor100}'
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
                stroke: pivotOptions.borderColor ||
                    '${palette.neutralColor20}',
                fill: pivotOptions.backgroundColor ||
                    '${palette.neutralColor100}'
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
     * Extend the basic setData method by running processData and generatePoints
     * immediately, in order to access the points from the legend.
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

/**
 * A `gauge` series. If the [type](#series.gauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.gauge
 * @excluding animationLimit,boostThreshold,connectEnds,connectNulls,
 *            cropThreshold,dashStyle,dataParser,dataURL,findNearestPointBy,
 *            getExtremesFromAll,marker,negativeColor,pointPlacement,shadow,
 *            softThreshold,stack,stacking,states,step,threshold,
 *            turboThreshold,zoneAxis,zones
 * @product   highcharts
 * @apioption series.gauge
 */

/**
 * An array of data points for the series. For the `gauge` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.gauge.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *     y: 6,
 *     name: "Point2",
 *     color: "#00FF00"
 * }, {
 *     y: 8,
 *     name: "Point1",
 *     color: "#FF00FF"
 * }]</pre>
 *
 * The typical gauge only contains a single data value.
 *
 * @type      {Array<Object|Number>}
 * @extends   series.line.data
 * @excluding drilldown,marker,x
 * @sample    {highcharts} highcharts/chart/reflow-true/
 *            Numerical values
 * @sample    {highcharts} highcharts/series/data-array-of-arrays/
 *            Arrays of numeric x and y
 * @sample    {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *            Arrays of datetime x and y
 * @sample    {highcharts} highcharts/series/data-array-of-name-value/
 *            Arrays of point.name and y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts
 * @apioption series.gauge.data
 */
