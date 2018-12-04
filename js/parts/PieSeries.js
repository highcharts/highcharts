/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from './Globals.js';
import './Utilities.js';
import './ColumnSeries.js';
import '../mixins/centered-series.js';
import './Legend.js';
import './Options.js';
import './Point.js';
import './Series.js';

var addEvent = H.addEvent,
    CenteredSeriesMixin = H.CenteredSeriesMixin,
    defined = H.defined,
    extend = H.extend,
    getStartAndEndRadians = CenteredSeriesMixin.getStartAndEndRadians,
    LegendSymbolMixin = H.LegendSymbolMixin,
    noop = H.noop,
    pick = H.pick,
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    setAnimation = H.setAnimation;

/**
 * Pie series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pie
 *
 * @augments Highcharts.Series
 */
seriesType('pie', 'line'

/**
 * A pie chart is a circular graphic which is divided into slices to illustrate
 * numerical proportion.
 *
 * @sample highcharts/demo/pie-basic/
 *         Pie chart
 *
 * @extends      plotOptions.line
 * @excluding    animationLimit, boostThreshold, connectEnds, connectNulls,
 *               cropThreshold, dashStyle, findNearestPointBy,
 *               getExtremesFromAll, lineWidth, marker, negativeColor,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointStart, softThreshold, stacking, step, threshold,
 *               turboThreshold, zoneAxis, zones
 * @product      highcharts
 * @optionparent plotOptions.pie
 */
, {

    /**
     * The center of the pie chart relative to the plot area. Can be percentages
     * or pixel values. The default behaviour (as of 3.0) is to center
     * the pie so that all slices and data labels are within the plot area.
     * As a consequence, the pie may actually jump around in a chart with
     * dynamic values, as the data labels move. In that case, the center
     * should be explicitly set, for example to `["50%", "50%"]`.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-center/
     *         Centered at 100, 100
     *
     * @type    {Array<number|string|null>}
     * @default [null, null]
     * @product highcharts
     */
    center: [null, null],

    /**
     * @product highcharts
     */
    clip: false,

    /**
     * @ignore
     */
    colorByPoint: true, // always true for pies

    /**
     * A series specific or series type specific color set to use instead
     * of the global [colors](#colors).
     *
     * @sample {highcharts} highcharts/demo/pie-monochrome/
     *         Set default colors for all pies
     *
     * @type      {Array<Highcharts.ColorString>}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.pie.colors
     */

    /**
     * @extends   plotOptions.series.dataLabels
     * @excluding align, allowOverlap, staggerLines, step
     * @product   highcharts
     */
    dataLabels: {

        allowOverlap: true,

        /**
         * The color of the line connecting the data label to the pie slice.
         * The default color is the same as the point's color.
         *
         * In styled mode, the connector stroke is given in the
         * `.highcharts-data-label-connector` class.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorcolor/
         *         Blue connectors
         * @sample {highcharts} highcharts/css/pie-point/
         *         Styled connectors
         *
         * @type      {Highcharts.ColorString}
         * @since     2.1
         * @product   highcharts
         * @apioption plotOptions.pie.dataLabels.connectorColor
         */

        /**
         * The distance from the data label to the connector.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorpadding/
         *         No padding
         *
         * @since     2.1
         * @product   highcharts
         * @apioption plotOptions.pie.dataLabels.connectorPadding
         */
        connectorPadding: 5,

        /**
         * The width of the line connecting the data label to the pie slice.
         *
         *
         * In styled mode, the connector stroke width is given in the
         * `.highcharts-data-label-connector` class.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorwidth-disabled/
         *         Disable the connector
         * @sample {highcharts} highcharts/css/pie-point/
         *         Styled connectors
         *
         * @type      {number}
         * @default   1
         * @since     2.1
         * @product   highcharts
         * @apioption plotOptions.pie.dataLabels.connectorWidth
         */

        /**
         * @sample {highcharts} highcharts/plotOptions/pie-datalabels-overflow
         *         Long labels truncated with an ellipsis
         * @sample {highcharts} highcharts/plotOptions/pie-datalabels-overflow-wrap
         *         Long labels are wrapped
         *
         * @type      {Highcharts.CSSObject}
         * @apioption plotOptions.pie.dataLabels.style
         */

        /**
         * The distance of the data label from the pie's edge. Negative numbers
         * put the data label on top of the pie slices. Connectors are only
         * shown for data labels outside the pie.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-distance/
         *         Data labels on top of the pie
         *
         * @since   2.1
         * @product highcharts
         */
        distance: 30,

        /**
         * Enable or disable the data labels.
         *
         * @since   2.1
         * @product highcharts
         */
        enabled: true,

        /**
         * @type      {Highcharts.FormatterCallbackFunction<Highcharts.SeriesDataLabelsFormatterContextObject>}
         * @default   function () { return this.point.name; }
         * @apioption plotOptions.pie.dataLabels.formatter
         */
        formatter: function () { // #2945
            return this.point.isNull ? undefined : this.point.name;
        },

        /**
         * Whether to render the connector as a soft arc or a line with sharp
         * break. Works only if `connectorShape` equals to `fixedOffset`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-true/
         *         Soft
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-false/
         *         Non soft
         *
         * @type      {number}
         * @since     2.1.7
         * @product   highcharts
         * @apioption plotOptions.pie.dataLabels.softConnector
         */
        softConnector: true,

         /**
          * Alignment method for data labels. Possible values are:
          * `'toPlotEdges'` (each label touches the nearest vertical edge of
          * the plot area) or `'connectors'` (connectors have the same x
          * position and the widest label of each half (left & right) touches
          * the nearest vertical edge of the plot area).
          *
          * @type {String}
          * @sample {highcharts} highcharts/plotoptions/pie-datalabels-alignto-connectors/ alignTo: connectors
          * @sample {highcharts} highcharts/plotoptions/pie-datalabels-alignto-plotedges/ alignTo: plotEdges
          * @since 7.0.0
          * @default undefined
          * @product highcharts
          * @apioption plotOptions.pie.dataLabels.alignTo
          */

        x: 0,

        /**
         * Specifies the method that is used to generate the connector path.
         * Highcharts provides 3 built-in connector shapes: `'fixedOffset'`
         * (default), `'straight'` and `'crookedLine'`. Using `'crookedLine'`
         * has the most sense (in most of the cases) when `'alignTo'` is set.
         *
         * Users can provide their own method by passing a function instead of
         * a String. 3 arguments are passed to the callback:
         *
         * <ol>
         *  <li>
         *   Object that holds the information about the coordinates of the
         *   label (`x` & `y` properties) and how the label is located in
         *   relation to the pie (`alignment` property). `alignment` can by one
         *   of the following:
         *   `'left'` (pie on the left side of the data label),
         *   `'right'` (pie on the right side of the data label) or
         *   `'center'` (data label overlaps the pie).
         *  </li>
         *  <li>
         *   Object that holds the information about the position of the
         *   connector. Its `touchingSliceAt`  porperty tells the position of
         *   the place where the connector touches the slice.
         *  </li>
         *  <li>
         *   Data label options
         *  </li>
         * </ol>
         *
         * The function has to return an SVG path definition in array form
         * (see the example).
         *
         * @type {String|Function}
         * @since 7.0.0
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorshape-string/ connectorShape is a String
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorshape-function/ connectorShape is a function
         * @product highcharts
         * @apioption plotOptions.pie.dataLabels.connectorShape
         */
        connectorShape: 'fixedOffset',

        /**
         * Works only if `connectorShape` is `'crookedLine'`. It defines how far
         * from the vertical plot edge the coonnector path should be crooked.
         *
         * @type {String}
         * @since 7.0.0
         * @sample {highcharts} highcharts/plotoptions/pie-datalabels-crookdistance/ crookDistance set to 90%
         * @product highcharts
         * @apioption plotOptions.pie.dataLabels.crookDistance
         */
        crookDistance: '70%'
    },

    /**
     * The end angle of the pie in degrees where 0 is top and 90 is right.
     * Defaults to `startAngle` plus 360.
     *
     * @sample {highcharts} highcharts/demo/pie-semi-circle/
     *         Semi-circle donut
     *
     * @type      {number}
     * @since     1.3.6
     * @product   highcharts
     * @apioption plotOptions.pie.endAngle
     */

    /**
     * Equivalent to [chart.ignoreHiddenSeries](#chart.ignoreHiddenSeries),
     * this option tells whether the series shall be redrawn as if the
     * hidden point were `null`.
     *
     * The default value changed from `false` to `true` with Highcharts
     * 3.0.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-ignorehiddenpoint/
     *         True, the hiddden point is ignored
     *
     * @since   2.3.0
     * @product highcharts
     */
    ignoreHiddenPoint: true,

    /**
     * The size of the inner diameter for the pie. A size greater than 0
     * renders a donut chart. Can be a percentage or pixel value. Percentages
     * are relative to the pie size. Pixel values are given as integers.
     *
     *
     * Note: in Highcharts < 4.1.2, the percentage was relative to the plot
     * area, not the pie size.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-innersize-80px/
     *         80px inner size
     * @sample {highcharts} highcharts/plotoptions/pie-innersize-50percent/
     *         50% of the plot area
     * @sample {highcharts} highcharts/demo/3d-pie-donut/
     *         3D donut
     *
     * @type      {number|string}
     * @default   0
     * @since     2.0
     * @product   highcharts
     * @apioption plotOptions.pie.innerSize
     */

    /**
     * @ignore
     */
    legendType: 'point',

    /**
     * @ignore
     */
    marker: null, // point options are specified in the base options

    /**
     * The minimum size for a pie in response to auto margins. The pie will
     * try to shrink to make room for data labels in side the plot area,
     *  but only to this size.
     *
     * @type      {number}
     * @default   80
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.pie.minSize
     */

    /**
     * The diameter of the pie relative to the plot area. Can be a percentage
     * or pixel value. Pixel values are given as integers. The default
     * behaviour (as of 3.0) is to scale to the plot area and give room
     * for data labels within the plot area.
     * [slicedOffset](#plotOptions.pie.slicedOffset) is also included
     * in the default size calculation. As a consequence, the size
     * of the pie may vary when points are updated and data labels more
     * around. In that case it is best to set a fixed value, for example
     * `"75%"`.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-size/
     *         Smaller pie
     *
     * @type    {number|string|null}
     * @product highcharts
     */
    size: null,

    /**
     * Whether to display this particular series or series type in the
     * legend. Since 2.1, pies are not shown in the legend by default.
     *
     * @sample {highcharts} highcharts/plotoptions/series-showinlegend/
     *         One series in the legend, one hidden
     *
     * @product highcharts
     */
    showInLegend: false,

    /**
     * If a point is sliced, moved out from the center, how many pixels
     * should it be moved?.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-slicedoffset-20/
     *         20px offset
     *
     * @product highcharts
     */
    slicedOffset: 10,

    /**
     * The start angle of the pie slices in degrees where 0 is top and 90
     * right.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-startangle-90/
     *         Start from right
     *
     * @type      {number}
     * @default   0
     * @since     2.3.4
     * @product   highcharts
     * @apioption plotOptions.pie.startAngle
     */

    /**
     * Sticky tracking of mouse events. When true, the `mouseOut` event
     * on a series isn't triggered until the mouse moves over another series,
     * or out of the plot area. When false, the `mouseOut` event on a
     * series is triggered when the mouse leaves the area around the series'
     * graph or markers. This also implies the tooltip. When `stickyTracking`
     * is false and `tooltip.shared` is false, the tooltip will be hidden
     * when moving the mouse between series.
     *
     * @product highcharts
     */
    stickyTracking: false,

    tooltip: {
        followPointer: true
    },

    /**
     * The color of the border surrounding each slice. When `null`, the
     * border takes the same color as the slice fill. This can be used
     * together with a `borderWidth` to fill drawing gaps created by
     * antialiazing artefacts in borderless pies.
     *
     * In styled mode, the border stroke is given in the `.highcharts-point`
     * class.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-bordercolor-black/
     *         Black border
     *
     * @type    {Highcharts.ColorString}
     * @default #ffffff
     * @product highcharts
     */
    borderColor: '${palette.backgroundColor}',

    /**
     * The width of the border surrounding each slice.
     *
     * When setting the border width to 0, there may be small gaps between
     * the slices due to SVG antialiasing artefacts. To work around this,
     * keep the border width at 0.5 or 1, but set the `borderColor` to
     * `null` instead.
     *
     * In styled mode, the border stroke width is given in the
     * `.highcharts-point` class.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-borderwidth/
     *         3px border
     *
     * @product highcharts
     */
    borderWidth: 1,

    states: {

        /**
         * @extends   plotOptions.series.states.hover
         * @excluding marker, lineWidth, lineWidthPlus
         * @product   highcharts
         */
        hover: {

            /**
             * How much to brighten the point on interaction. Requires the main
             * color to be defined in hex or rgb(a) format.
             *
             * In styled mode, the hover brightness is by default replaced
             * by a fill-opacity given in the `.highcharts-point-hover` class.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-states-hover-brightness/
             *         Brightened by 0.5
             *
             * @product highcharts
             */
            brightness: 0.1
        }
    }

}, /** @lends seriesTypes.pie.prototype */ {

    isCartesian: false,
    requireSorting: false,
    directTouch: true,
    noSharedTooltip: true,
    trackerGroups: ['group', 'dataLabelsGroup'],
    axisTypes: [],
    pointAttribs: seriesTypes.column.prototype.pointAttribs,

    /**
     * Animate the pies in
     *
     * @private
     * @function Highcharts.seriesTypes.pie#animate
     *
     * @param {boolean} [init=false]
     */
    animate: function (init) {
        var series = this,
            points = series.points,
            startAngleRad = series.startAngleRad;

        if (!init) {
            points.forEach(function (point) {
                var graphic = point.graphic,
                    args = point.shapeArgs;

                if (graphic) {
                    // start values
                    graphic.attr({
                        // animate from inner radius (#779)
                        r: point.startR || (series.center[3] / 2),
                        start: startAngleRad,
                        end: startAngleRad
                    });

                    // animate
                    graphic.animate({
                        r: args.r,
                        start: args.start,
                        end: args.end
                    }, series.options.animation);
                }
            });

            // delete this function to allow it only once
            series.animate = null;
        }
    },

    /**
     * Recompute total chart sum and update percentages of points.
     *
     * @private
     * @function Highcharts.seriesTypes.pie#updateTotals
     */
    updateTotals: function () {
        var i,
            total = 0,
            points = this.points,
            len = points.length,
            point,
            ignoreHiddenPoint = this.options.ignoreHiddenPoint;

        // Get the total sum
        for (i = 0; i < len; i++) {
            point = points[i];
            total += (ignoreHiddenPoint && !point.visible) ?
                0 :
                point.isNull ? 0 : point.y;
        }
        this.total = total;

        // Set each point's properties
        for (i = 0; i < len; i++) {
            point = points[i];
            point.percentage =
                (total > 0 && (point.visible || !ignoreHiddenPoint)) ?
                    point.y / total * 100 :
                    0;
            point.total = total;
        }
    },

    /**
     * Extend the generatePoints method by adding total and percentage
     * properties to each point
     *
     * @private
     * @function Highcharts.seriesTypes.pie#generatePoints
     */
    generatePoints: function () {
        Series.prototype.generatePoints.call(this);
        this.updateTotals();
    },

    /**
     * Do translation for pie slices
     *
     * @private
     * @function Highcharts.seriesTypes.pie#translate
     *
     * @param {Array<number>} positions
     */
    translate: function (positions) {
        this.generatePoints();

        var series = this,
            cumulative = 0,
            precision = 1000, // issue #172
            options = series.options,
            slicedOffset = options.slicedOffset,
            connectorOffset = slicedOffset + (options.borderWidth || 0),
            finalConnectorOffset,
            start,
            end,
            angle,
            radians = getStartAndEndRadians(
                options.startAngle,
                options.endAngle
            ),
            startAngleRad = series.startAngleRad = radians.start,
            endAngleRad = series.endAngleRad = radians.end,
            circ = endAngleRad - startAngleRad, // 2 * Math.PI,
            points = series.points,
            radiusX, // the x component of the radius vector for a given point
            radiusY,
            labelDistance = options.dataLabels.distance,
            ignoreHiddenPoint = options.ignoreHiddenPoint,
            i,
            len = points.length,
            point;

        // Get positions - either an integer or a percentage string must be
        // given. If positions are passed as a parameter, we're in a recursive
        // loop for adjusting space for data labels.
        if (!positions) {
            series.center = positions = series.getCenter();
        }

        // Utility for getting the x value from a given y, used for
        // anticollision logic in data labels. Added point for using specific
        // points' label distance.
        series.getX = function (y, left, point) {
            angle = Math.asin(
                Math.min(
                    (
                        (y - positions[1]) /
                        (positions[2] / 2 + point.labelDistance)
                    ),
                    1
                )
            );
            return positions[0] +
                (left ? -1 : 1) *
                (Math.cos(angle) * (positions[2] / 2 + point.labelDistance));
        };

        // Calculate the geometry for each point
        for (i = 0; i < len; i++) {

            point = points[i];

            // Used for distance calculation for specific point.
            point.labelDistance = pick(
                point.options.dataLabels && point.options.dataLabels.distance,
                labelDistance
            );

            // Saved for later dataLabels distance calculation.
            series.maxLabelDistance = Math.max(
                series.maxLabelDistance || 0,
                point.labelDistance
            );

            // set start and end angle
            start = startAngleRad + (cumulative * circ);
            if (!ignoreHiddenPoint || point.visible) {
                cumulative += point.percentage / 100;
            }
            end = startAngleRad + (cumulative * circ);

            // set the shape
            point.shapeType = 'arc';
            point.shapeArgs = {
                x: positions[0],
                y: positions[1],
                r: positions[2] / 2,
                innerR: positions[3] / 2,
                start: Math.round(start * precision) / precision,
                end: Math.round(end * precision) / precision
            };

            // The angle must stay within -90 and 270 (#2645)
            angle = (end + start) / 2;
            if (angle > 1.5 * Math.PI) {
                angle -= 2 * Math.PI;
            } else if (angle < -Math.PI / 2) {
                angle += 2 * Math.PI;
            }

            // Center for the sliced out slice
            point.slicedTranslation = {
                translateX: Math.round(Math.cos(angle) * slicedOffset),
                translateY: Math.round(Math.sin(angle) * slicedOffset)
            };

            // set the anchor point for tooltips
            radiusX = Math.cos(angle) * positions[2] / 2;
            radiusY = Math.sin(angle) * positions[2] / 2;
            point.tooltipPos = [
                positions[0] + radiusX * 0.7,
                positions[1] + radiusY * 0.7
            ];

            point.half = angle < -Math.PI / 2 || angle > Math.PI / 2 ? 1 : 0;
            point.angle = angle;

            // Set the anchor point for data labels. Use point.labelDistance
            // instead of labelDistance // #1174
            // finalConnectorOffset - not override connectorOffset value.

            finalConnectorOffset = Math.min(
                connectorOffset,
                point.labelDistance / 5
            ); // #1678

            point.labelPosition = {
                natural: {
                    // initial position of the data label - it's utilized for
                    // finding the final position for the label
                    x: positions[0] + radiusX + Math.cos(angle) *
                      point.labelDistance,
                    y: positions[1] + radiusY + Math.sin(angle) *
                      point.labelDistance
                },
                final: {
                    // used for generating connector path -
                    // initialized later in drawDataLabels function
                    // x: undefined,
                    // y: undefined
                },
                // left - pie on the left side of the data label
                // right - pie on the right side of the data label
                // center - data label overlaps the pie
                alignment: point.labelDistance < 0 ?
                    'center' : point.half ? 'right' : 'left',
                connectorPosition: {
                    breakAt: { // used in connectorShapes.fixedOffset
                        x: positions[0] + radiusX + Math.cos(angle) *
                          finalConnectorOffset,
                        y: positions[1] + radiusY + Math.sin(angle) *
                          finalConnectorOffset
                    },
                    touchingSliceAt: { // middle of the arc
                        x: positions[0] + radiusX,
                        y: positions[1] + radiusY
                    }
                }
            };
        }
    },

    /**
     * @private
     * @deprecated
     * @name Highcharts.seriesTypes.pie#drawGraph
     * @type {null}
     */
    drawGraph: null,

    /**
     * Draw the data points
     *
     * @private
     * @function Highcharts.seriesTypes.pie#drawPoints
     */
    drawPoints: function () {
        var series = this,
            chart = series.chart,
            renderer = chart.renderer,
            groupTranslation,
            graphic,
            pointAttr,
            shapeArgs,
            shadow = series.options.shadow;

        if (shadow && !series.shadowGroup && !chart.styledMode) {
            series.shadowGroup = renderer.g('shadow')
                .add(series.group);
        }

        // draw the slices
        series.points.forEach(function (point) {
            graphic = point.graphic;
            if (!point.isNull) {
                shapeArgs = point.shapeArgs;


                // If the point is sliced, use special translation, else use
                // plot area traslation
                groupTranslation = point.getTranslate();

                if (!chart.styledMode) {
                    // Put the shadow behind all points
                    var shadowGroup = point.shadowGroup;
                    if (shadow && !shadowGroup) {
                        shadowGroup = point.shadowGroup = renderer.g('shadow')
                            .add(series.shadowGroup);
                    }

                    if (shadowGroup) {
                        shadowGroup.attr(groupTranslation);
                    }
                    pointAttr = series.pointAttribs(
                        point,
                        point.selected && 'select'
                    );
                }

                // Draw the slice
                if (graphic) {
                    graphic
                        .setRadialReference(series.center);

                    if (!chart.styledMode) {
                        graphic.attr(pointAttr);
                    }
                    graphic.animate(extend(shapeArgs, groupTranslation));
                } else {

                    point.graphic = graphic = renderer[point.shapeType](
                            shapeArgs
                        )
                        .setRadialReference(series.center)
                        .attr(groupTranslation)
                        .add(series.group);

                    if (!chart.styledMode) {
                        graphic
                            .attr(pointAttr)
                            .attr({ 'stroke-linejoin': 'round' })
                            .shadow(shadow, shadowGroup);
                    }
                }

                graphic.attr({
                    visibility: point.visible ? 'inherit' : 'hidden'
                });

                graphic.addClass(point.getClassName());

            } else if (graphic) {
                point.graphic = graphic.destroy();
            }
        });

    },

    /**
     * @private
     * @deprecated
     * @function Highcharts.seriesTypes.pie#searchPoint
     */
    searchPoint: noop,

    /**
     * Utility for sorting data labels
     *
     * @private
     * @function Highcharts.seriesTypes.pie#sortByAngle
     *
     * @param {Array<Highcharts.Point>} points
     *
     * @param {number} sign
     */
    sortByAngle: function (points, sign) {
        points.sort(function (a, b) {
            return a.angle !== undefined && (b.angle - a.angle) * sign;
        });
    },

    /**
     * Use a simple symbol from LegendSymbolMixin.
     *
     * @private
     * @borrows Highcharts.LegendSymbolMixin.drawRectangle as Highcharts.seriesTypes.pie#drawLegendSymbol
     */
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,

    /**
     * Use the getCenter method from drawLegendSymbol.
     *
     * @private
     * @borrows Highcharts.CenteredSeriesMixin.getCenter as Highcharts.seriesTypes.pie#getCenter
     */
    getCenter: CenteredSeriesMixin.getCenter,

    /**
     * Pies don't have point marker symbols.
     *
     * @deprecated
     * @private
     * @function Highcharts.seriesTypes.pie#getSymbol
     */
    getSymbol: noop


}, /** @lends seriesTypes.pie.prototype.pointClass.prototype */ {

    /**
     * Initiate the pie slice
     *
     * @private
     * @function Highcharts.seriesTypes.pie#pointClass#init
     *
     * @return {Highcharts.Point}
     */
    init: function () {

        Point.prototype.init.apply(this, arguments);

        var point = this,
            toggleSlice;

        point.name = pick(point.name, 'Slice');

        // add event listener for select
        toggleSlice = function (e) {
            point.slice(e.type === 'select');
        };
        addEvent(point, 'select', toggleSlice);
        addEvent(point, 'unselect', toggleSlice);

        return point;
    },

    /**
     * Negative points are not valid (#1530, #3623, #5322)
     *
     * @private
     * @function Highcharts.seriesTypes.pie#pointClass#isValid
     *
     * @return {boolean}
     */
    isValid: function () {
        return H.isNumber(this.y, true) && this.y >= 0;
    },

    /**
     * Toggle the visibility of the pie slice
     *
     * @private
     * @function Highcharts.seriesTypes.pie#pointClass#setVisible
     *
     * @param {boolean} vis
     *        Whether to show the slice or not. If undefined, the visibility is
     *        toggled.
     *
     * @param {boolean} [redraw=false]
     */
    setVisible: function (vis, redraw) {
        var point = this,
            series = point.series,
            chart = series.chart,
            ignoreHiddenPoint = series.options.ignoreHiddenPoint;

        redraw = pick(redraw, ignoreHiddenPoint);

        if (vis !== point.visible) {

            // If called without an argument, toggle visibility
            point.visible = point.options.visible = vis =
                vis === undefined ? !point.visible : vis;
            // update userOptions.data
            series.options.data[series.data.indexOf(point)] = point.options;

            // Show and hide associated elements. This is performed regardless
            // of redraw or not, because chart.redraw only handles full series.
            ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(
                function (key) {
                    if (point[key]) {
                        point[key][vis ? 'show' : 'hide'](true);
                    }
                }
            );

            if (point.legendItem) {
                chart.legend.colorizeItem(point, vis);
            }

            // #4170, hide halo after hiding point
            if (!vis && point.state === 'hover') {
                point.setState('');
            }

            // Handle ignore hidden slices
            if (ignoreHiddenPoint) {
                series.isDirty = true;
            }

            if (redraw) {
                chart.redraw();
            }
        }
    },

    /**
     * Set or toggle whether the slice is cut out from the pie
     *
     * @private
     * @function Highcharts.seriesTypes.pie#pointClass#slice
     *
     * @param {boolean} sliced
     *        When undefined, the slice state is toggled.
     *
     * @param {boolean} redraw
     *        Whether to redraw the chart. True by default.
     */
    slice: function (sliced, redraw, animation) {
        var point = this,
            series = point.series,
            chart = series.chart;

        setAnimation(animation, chart);

        // redraw is true by default
        redraw = pick(redraw, true);

        // if called without an argument, toggle
        point.sliced = point.options.sliced = sliced =
            defined(sliced) ? sliced : !point.sliced;
        // update userOptions.data
        series.options.data[series.data.indexOf(point)] = point.options;

        point.graphic.animate(this.getTranslate());

        if (point.shadowGroup) {
            point.shadowGroup.animate(this.getTranslate());
        }
    },

    /**
     * @private
     * @function Highcharts.seriesTypes.pie#pointClass#getTranslate
     *
     * @return {*}
     */
    getTranslate: function () {
        return this.sliced ? this.slicedTranslation : {
            translateX: 0,
            translateY: 0
        };
    },

    /**
     * @private
     * @function Highcharts.seriesTypes.pie#pointClass#haloPath
     *
     * @param {number} size
     *
     * @return {Highcharts.SVGPathArray}
     */
    haloPath: function (size) {
        var shapeArgs = this.shapeArgs;

        return this.sliced || !this.visible ?
            [] :
            this.series.chart.renderer.symbols.arc(
                shapeArgs.x,
                shapeArgs.y,
                shapeArgs.r + size,
                shapeArgs.r + size, {
                    // Substract 1px to ensure the background is not bleeding
                    // through between the halo and the slice (#7495).
                    innerR: this.shapeArgs.r - 1,
                    start: shapeArgs.start,
                    end: shapeArgs.end
                }
            );
    },

    connectorShapes: {
        // only one available before v7.0.0
        fixedOffset: function (labelPosition, connectorPosition, options) {
            var connectorPadding = options.connectorPadding,
                breakAt = connectorPosition.breakAt,
                touchingSliceAt = connectorPosition.touchingSliceAt,
                linePath = options.softConnector ? [
                    'C', // soft break
                    labelPosition.x, // 1st control point (of the curve)
                    labelPosition.y, //
                    2 * breakAt.x - touchingSliceAt.x, // 2nd control point
                    2 * breakAt.y - touchingSliceAt.y, //
                    breakAt.x, // end of the curve
                    breakAt.y //
                ] : [
                    'L', // pointy break
                    breakAt.x,
                    breakAt.y
                ];

            // assemble the path
            return [
                'M',
                labelPosition.x +
                    (labelPosition.alignment === 'left' ? 1 : -1) *
                    connectorPadding,
                labelPosition.y].concat(linePath).concat([
                    'L',
                    touchingSliceAt.x,
                    touchingSliceAt.y
                ]);
        },

        straight: function (labelPosition, connectorPosition, options) {
            var connectorPadding = options.connectorPadding,
                touchingSliceAt = connectorPosition.touchingSliceAt;

            // direct line to the slice
            return ['M',
                labelPosition.x +
                    (labelPosition.alignment === 'left' ? 1 : -1) *
                    connectorPadding,
                labelPosition.y,
                'L',
                touchingSliceAt.x,
                touchingSliceAt.y
            ];
        },

        crookedLine: function (labelPosition, connectorPosition,
            options) {

            var connectorPadding = options.connectorPadding,
                touchingSliceAt = connectorPosition.touchingSliceAt,
                series = this.series,
                pieCenterX = series.center[0],
                plotWidth = series.chart.plotWidth,
                plotLeft = series.chart.plotLeft,
                alignment = labelPosition.alignment,
                radius = this.shapeArgs.r,
                crookDistance =
                    H.relativeLength(options.crookDistance, 1), // % to fraction
                crookX = alignment === 'left' ?
                    pieCenterX + radius + (plotWidth + plotLeft - pieCenterX -
                        radius) * (1 - crookDistance) :
                    plotLeft + (pieCenterX - radius) * crookDistance,
                segmentWithCrook = ['L',
                    crookX,
                    labelPosition.y];

            // crookedLine formula doesn't make sense if the path overlaps
            // the label - use straight line instead in that case
            if (alignment === 'left' ?
                (crookX > labelPosition.x || crookX < touchingSliceAt.x) :
                (crookX < labelPosition.x || crookX > touchingSliceAt.x)) {
                segmentWithCrook = []; // remove the crook
            }

            // assemble the path
            return ['M',
                labelPosition.x + (alignment === 'left' ? 1 : -1) *
                    connectorPadding,
                labelPosition.y].concat(segmentWithCrook).concat(['L',
                    touchingSliceAt.x,
                    touchingSliceAt.y
                ]);

        }
    },

    /**
     * Extendable method for getting the path of the connector between the data
     * label and the pie slice.
     */
    getConnectorPath: function () {
        var labelPosition = this.labelPosition,
            options = this.series.options.dataLabels,
            connectorShape = options.connectorShape,
            predefinedShapes = this.connectorShapes;

        // find out whether to use the predefined shape
        if (predefinedShapes[connectorShape]) {
            connectorShape = predefinedShapes[connectorShape];
        }

        return connectorShape.call(this, {
            // pass simplified label position object for user's convenience
            x: labelPosition.final.x,
            y: labelPosition.final.y,
            alignment: labelPosition.alignment
        }, labelPosition.connectorPosition, options);
    }
});

/**
 * A `pie` series. If the [type](#series.pie.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pie
 * @excluding dataParser, dataURL, stack, xAxis, yAxis
 * @product   highcharts
 * @apioption series.pie
 */

/**
 * An array of data points for the series. For the `pie` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.pie.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *     y: 1,
 *     name: "Point2",
 *     color: "#00FF00"
 * }, {
 *     y: 7,
 *     name: "Point1",
 *     color: "#FF00FF"
 * }]</pre>
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|*>}
 * @extends   series.line.data
 * @excluding marker, x
 * @product   highcharts
 * @apioption series.pie.data
 */

/**
 * Fires when the checkbox next to the point name in the legend is clicked.
 * One parameter, event, is passed to the function. The state of the
 * checkbox is found by event.checked. The checked item is found by
 * event.item. Return false to prevent the default action which is to
 * toggle the select state of the series.
 *
 * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/
 *         Alert checkbox status
 *
 * @type      {Function}
 * @since     1.2.0
 * @product   highcharts
 * @context   Highcharts.Point
 * @apioption plotOptions.pie.events.checkboxClick
 */

/**
 * Not applicable to pies, as the legend item is per point. See point.
 * events.
 *
 * @type      {Function}
 * @since     1.2.0
 * @product   highcharts
 * @apioption plotOptions.pie.events.legendItemClick
 */

/**
 * The sequential index of the data point in the legend.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.pie.data.legendIndex
 */

/**
 * Fires when the legend item belonging to the pie point (slice) is
 * clicked. The `this` keyword refers to the point itself. One parameter,
 * `event`, is passed to the function, containing common event information. The
 * default action is to toggle the visibility of the point. This can be
 * prevented by calling `event.preventDefault()`.
 *
 * @sample {highcharts} highcharts/plotoptions/pie-point-events-legenditemclick/
 *         Confirm toggle visibility
 *
 * @type      {Function}
 * @since     1.2.0
 * @product   highcharts
 * @apioption plotOptions.pie.point.events.legendItemClick
 */

/**
 * Whether to display a slice offset from the center.
 *
 * @sample {highcharts} highcharts/point/sliced/
 *         One sliced point
 *
 * @type      {boolean}
 * @product   highcharts
 * @apioption series.pie.data.sliced
 */
