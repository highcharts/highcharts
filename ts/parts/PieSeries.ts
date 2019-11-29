/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class PiePoint extends LinePoint {
            public angle?: number;
            public connectorShapes?: Dictionary<PiePointConnectorShapeFunction>;
            public delayedRendering?: boolean;
            public half?: number;
            public labelDistance: number;
            public labelPosition?: PiePointLabelPositionObject;
            public name: string;
            public options: PiePointOptions;
            public series: PieSeries;
            public shadowGroup?: SVGElement;
            public sliced?: boolean;
            public slicedTranslation?: TranslationAttributes;
            public getConnectorPath(): void;
            public getTranslate(): TranslationAttributes;
            public isValid(): boolean;
            public setVisible(vis: boolean, redraw?: boolean): void;
            public slice(
                sliced: boolean,
                redraw?: boolean,
                animation?: (boolean|AnimationOptionsObject)
            ): void;
        }
        class PieSeries extends LineSeries {
            public center: Array<number>;
            public endAngleRad?: number;
            public data: Array<PiePoint>;
            public getCenter: CenteredSeriesMixin['getCenter'];
            public maxLabelDistance: number;
            public options: PieSeriesOptions;
            public pointClass: typeof PiePoint;
            public points: Array<PiePoint>;
            public shadowGroup?: SVGElement;
            public startAngleRad?: number;
            public total?: number;
            public drawEmpty(): void;
            public getX(y: number, left: boolean, point: PiePoint): number;
            public redrawPoints(): void;
            public sortByAngle(points: Array<PiePoint>, sign: number): void;
            public translate(positions?: Array<number>): void;
            public updateTotals(): void;
        }
        interface PiePointConnectorShapeFunction {
            (...args: Array<any>): SVGPathArray;
        }
        interface PiePointLabelConnectorPositionObject {
            breakAt: PositionObject;
            touchingSliceAt: PositionObject;
        }
        interface PiePointLabelPositionObject {
            alignment: AlignValue;
            connectorPosition: PiePointLabelConnectorPositionObject;
            'final': Dictionary<undefined>;
            natural: PositionObject;
        }
        interface PiePointOptions extends LinePointOptions {
            dataLabels?: PieSeriesDataLabelsOptionsObject;
            sliced?: boolean;
            visible?: boolean;
        }
        interface PiePositionObject extends PositionObject {
            alignment: AlignValue;
        }
        interface PieSeriesDataLabelsOptionsObject
            extends DataLabelsOptionsObject
        {
            alignTo?: string;
            connectorColor?: (ColorString|GradientColorObject|PatternObject);
            connectorPadding?: number;
            connectorShape?: (string|Function);
            connectorWidth?: number;
            crookDistance?: string;
            distance?: number;
            softConnector?: boolean;
        }
        interface PieSeriesOptions extends LineSeriesOptions {
            endAngle?: number;
            center?: [(number|string|null), (number|string|null)];
            colorByPoint?: boolean;
            dataLabels?: PieSeriesDataLabelsOptionsObject;
            fillColor?: (ColorString|GradientColorObject|PatternObject);
            ignoreHiddenPoint?: boolean;
            inactiveOtherPoints?: boolean;
            innerSize?: (number|string);
            minSize?: (number|string);
            size?: (number|string|null);
            slicedOffset?: number;
            startAngle?: number;
            states?: SeriesStatesOptionsObject<PieSeries>;
        }
        interface PieSeriesPositionObject extends PositionObject {
            alignment: AlignValue;
        }
        interface SeriesStatesHoverOptionsObject {
            brightness?: number;
        }
        interface SeriesTypesDictionary {
            pie: typeof PieSeries;
        }
    }
}

import U from './Utilities.js';
const {
    clamp,
    defined,
    isNumber,
    pick,
    relativeLength,
    setAnimation
} = U;

import './ColumnSeries.js';
import '../mixins/centered-series.js';
import './Legend.js';
import './Options.js';
import './Point.js';
import './Series.js';

var addEvent = H.addEvent,
    CenteredSeriesMixin = H.CenteredSeriesMixin,
    getStartAndEndRadians = CenteredSeriesMixin.getStartAndEndRadians,
    LegendSymbolMixin = H.LegendSymbolMixin,
    merge = H.merge,
    noop = H.noop,
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    fireEvent = H.fireEvent;

/**
 * Pie series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pie
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.PieSeries>(
    'pie',
    'line',

    /**
     * A pie chart is a circular graphic which is divided into slices to
     * illustrate numerical proportion.
     *
     * @sample highcharts/demo/pie-basic/
     *         Pie chart
     *
     * @extends      plotOptions.line
     * @excluding    animationLimit, boostThreshold, connectEnds, connectNulls,
     *               cropThreshold, dashStyle, dataSorting, dragDrop,
     *               findNearestPointBy, getExtremesFromAll, label, lineWidth,
     *               marker, negativeColor, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointStart, softThreshold, stacking, step,
     *               threshold, turboThreshold, zoneAxis, zones
     * @product      highcharts
     * @optionparent plotOptions.pie
     */
    {

        /**
         * @excluding legendItemClick
         * @apioption plotOptions.pie.events
         */

        /**
         * Fires when the checkbox next to the point name in the legend is
         * clicked. One parameter, event, is passed to the function. The state
         * of the checkbox is found by event.checked. The checked item is found
         * by event.item. Return false to prevent the default action which is to
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
         * Fires when the legend item belonging to the pie point (slice) is
         * clicked. The `this` keyword refers to the point itself. One
         * parameter, `event`, is passed to the function, containing common
         * event information. The default action is to toggle the visibility of
         * the point. This can be prevented by calling `event.preventDefault()`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-point-events-legenditemclick/
         *         Confirm toggle visibility
         *
         * @type      {Highcharts.PointLegendItemClickCallbackFunction}
         * @since     1.2.0
         * @product   highcharts
         * @apioption plotOptions.pie.point.events.legendItemClick
         */

        /**
         * The center of the pie chart relative to the plot area. Can be
         * percentages or pixel values. The default behaviour (as of 3.0) is to
         * center the pie so that all slices and data labels are within the plot
         * area. As a consequence, the pie may actually jump around in a chart
         * with dynamic values, as the data labels move. In that case, the
         * center should be explicitly set, for example to `["50%", "50%"]`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-center/
         *         Centered at 100, 100
         *
         * @type    {Array<(number|string|null),(number|string|null)>}
         * @default [null, null]
         * @product highcharts
         *
         * @private
         */
        center: [null, null],

        /**
         * The color of the pie series. A pie series is represented as an empty
         * circle if the total sum of its values is 0. Use this property to
         * define the color of its border.
         *
         * In styled mode, the color can be defined by the
         * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
         * color can be set with the `.highcharts-series`,
         * `.highcharts-color-{n}`, `.highcharts-{type}-series` or
         * `.highcharts-series-{n}` class, or individual classes given by the
         * `className` option.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-emptyseries/
         *         Empty pie series
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   ${palette.neutralColor20}
         * @apioption plotOptions.pie.color
         */

        /**
         * @product highcharts
         *
         * @private
         */
        clip: false,

        /**
         * @ignore-option
         *
         * @private
         */
        colorByPoint: true, // always true for pies

        /**
         * A series specific or series type specific color set to use instead
         * of the global [colors](#colors).
         *
         * @sample {highcharts} highcharts/demo/pie-monochrome/
         *         Set default colors for all pies
         *
         * @type      {Array<Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject>}
         * @since     3.0
         * @product   highcharts
         * @apioption plotOptions.pie.colors
         */

        /**
         * @declare   Highcharts.SeriesPieDataLabelsOptionsObject
         * @extends   plotOptions.series.dataLabels
         * @excluding align, allowOverlap, staggerLines, step
         * @private
         */
        dataLabels: {

            /**
             * Alignment method for data labels. Possible values are:
             *
             * - `toPlotEdges`: Each label touches the nearest vertical edge of
             *   the plot area.
             *
             * - `connectors`: Connectors have the same x position and the
             *   widest label of each half (left & right) touches the nearest
             *   vertical edge of the plot area.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-alignto-connectors/
             *         alignTo: connectors
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-alignto-plotedges/
             *         alignTo: plotEdges
             *
             * @type      {string}
             * @since     7.0.0
             * @product   highcharts
             * @apioption plotOptions.pie.dataLabels.alignTo
             */

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
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     2.1
             * @product   highcharts
             * @apioption plotOptions.pie.dataLabels.connectorColor
             */

            /**
             * The distance from the data label to the connector. Note that
             * data labels also have a default `padding`, so in order for the
             * connector to touch the text, the `padding` must also be 0.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorpadding/
             *         No padding
             *
             * @since   2.1
             * @product highcharts
             */
            connectorPadding: 5,

            /**
             * Specifies the method that is used to generate the connector path.
             * Highcharts provides 3 built-in connector shapes: `'fixedOffset'`
             * (default), `'straight'` and `'crookedLine'`. Using
             * `'crookedLine'` has the most sense (in most of the cases) when
             * `'alignTo'` is set.
             *
             * Users can provide their own method by passing a function instead
             * of a String. 3 arguments are passed to the callback:
             *
             * - Object that holds the information about the coordinates of the
             *   label (`x` & `y` properties) and how the label is located in
             *   relation to the pie (`alignment` property). `alignment` can by
             *   one of the following:
             *   `'left'` (pie on the left side of the data label),
             *   `'right'` (pie on the right side of the data label) or
             *   `'center'` (data label overlaps the pie).
             *
             * - Object that holds the information about the position of the
             *   connector. Its `touchingSliceAt`  porperty tells the position
             *   of the place where the connector touches the slice.
             *
             * - Data label options
             *
             * The function has to return an SVG path definition in array form
             * (see the example).
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorshape-string/
             *         connectorShape is a String
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorshape-function/
             *         connectorShape is a function
             *
             * @type    {string|Function}
             * @since   7.0.0
             * @product highcharts
             */
            connectorShape: 'fixedOffset',

            /**
             * The width of the line connecting the data label to the pie slice.
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
             * Works only if `connectorShape` is `'crookedLine'`. It defines how
             * far from the vertical plot edge the coonnector path should be
             * crooked.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-crookdistance/
             *         crookDistance set to 90%
             *
             * @since   7.0.0
             * @product highcharts
             */
            crookDistance: '70%',

            /**
             * The distance of the data label from the pie's edge. Negative
             * numbers put the data label on top of the pie slices. Can also be
             * defined as a percentage of pie's radius. Connectors are only
             * shown for data labels outside the pie.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-distance/
             *         Data labels on top of the pie
             *
             * @since   2.1
             * @product highcharts
             */
            distance: 30,

            enabled: true,

            formatter: function (
                this: Highcharts.DataLabelsFormatterContextObject
            ): (string|undefined) { // #2945
                return this.point.isNull ? void 0 : this.point.name;
            },

            /**
             * Whether to render the connector as a soft arc or a line with
             * sharp break. Works only if `connectorShape` equals to
             * `fixedOffset`.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-true/
             *         Soft
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-false/
             *         Non soft
             *
             * @since   2.1.7
             * @product highcharts
             */
            softConnector: true,

            /**
             * @sample {highcharts} highcharts/plotOptions/pie-datalabels-overflow
             *         Long labels truncated with an ellipsis
             * @sample {highcharts} highcharts/plotOptions/pie-datalabels-overflow-wrap
             *         Long labels are wrapped
             *
             * @type      {Highcharts.CSSObject}
             * @apioption plotOptions.pie.dataLabels.style
             */

            x: 0

        },

        /**
         * If the total sum of the pie's values is 0, the series is represented
         * as an empty circle . The `fillColor` option defines the color of that
         * circle. Use [pie.borderWidth](#plotOptions.pie.borderWidth) to set
         * the border thickness.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-emptyseries/
         *         Empty pie series
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @private
         */
        fillColor: void 0,

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
         *
         * @private
         */
        ignoreHiddenPoint: true,

        /**
         * @ignore-option
         *
         * @private
         */
        inactiveOtherPoints: true,

        /**
         * The size of the inner diameter for the pie. A size greater than 0
         * renders a donut chart. Can be a percentage or pixel value.
         * Percentages are relative to the pie size. Pixel values are given as
         * integers.
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
         * @ignore-option
         *
         * @private
         */
        legendType: 'point',

        /**
         * @ignore-option
         *
         * @private
         */
        marker: null as any, // point options are specified in the base options

        /**
         * The minimum size for a pie in response to auto margins. The pie will
         * try to shrink to make room for data labels in side the plot area,
         *  but only to this size.
         *
         * @type      {number|string}
         * @default   80
         * @since     3.0
         * @product   highcharts
         * @apioption plotOptions.pie.minSize
         */

        /**
         * The diameter of the pie relative to the plot area. Can be a
         * percentage or pixel value. Pixel values are given as integers. The
         * default behaviour (as of 3.0) is to scale to the plot area and give
         * room for data labels within the plot area.
         * [slicedOffset](#plotOptions.pie.slicedOffset) is also included in the
         * default size calculation. As a consequence, the size of the pie may
         * vary when points are updated and data labels more around. In that
         * case it is best to set a fixed value, for example `"75%"`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-size/
         *         Smaller pie
         *
         * @type    {number|string|null}
         * @product highcharts
         *
         * @private
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
         *
         * @private
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
         *
         * @private
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
         * on a series isn't triggered until the mouse moves over another
         * series, or out of the plot area. When false, the `mouseOut` event on
         * a series is triggered when the mouse leaves the area around the
         * series'  graph or markers. This also implies the tooltip. When
         * `stickyTracking` is false and `tooltip.shared` is false, the tooltip
         * will be hidden when moving the mouse between series.
         *
         * @product highcharts
         *
         * @private
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
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default #ffffff
         * @product highcharts
         *
         * @private
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
         *
         * @private
         */
        borderWidth: 1,

        /**
         * @ignore-options
         * @private
         */
        lineWidth: void 0, // #12222

        states: {

            /**
             * @extends   plotOptions.series.states.hover
             * @excluding marker, lineWidth, lineWidthPlus
             * @product   highcharts
             */
            hover: {

                /**
                 * How much to brighten the point on interaction. Requires the
                 * main color to be defined in hex or rgb(a) format.
                 *
                 * In styled mode, the hover brightness is by default replaced
                 * by a fill-opacity given in the `.highcharts-point-hover`
                 * class.
                 *
                 * @sample {highcharts} highcharts/plotoptions/pie-states-hover-brightness/
                 *         Brightened by 0.5
                 *
                 * @product highcharts
                 */
                brightness: 0.1
            }
        }

    },

    /* eslint-disable valid-jsdoc */

    /**
     * @lends seriesTypes.pie.prototype
     */
    {

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
        animate: function (this: Highcharts.PieSeries, init?: boolean): void {
            var series = this,
                points = series.points,
                startAngleRad = series.startAngleRad;

            if (!init) {
                points.forEach(function (point: Highcharts.PiePoint): void {
                    var graphic = point.graphic,
                        args = point.shapeArgs;

                    if (graphic && args) {
                    // start values
                        graphic.attr({
                        // animate from inner radius (#779)
                            r: pick(point.startR,
                                (series.center && series.center[3] / 2)),
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
                series.animate = null as any;
            }
        },

        // Define hasData function for non-cartesian series.
        // Returns true if the series has points at all.
        hasData: function (this: Highcharts.PieSeries): boolean {
            return !!(this.processedXData as any).length; // != 0
        },

        /**
         * Recompute total chart sum and update percentages of points.
         *
         * @private
         * @function Highcharts.seriesTypes.pie#updateTotals
         * @return {void}
         */
        updateTotals: function (this: Highcharts.PieSeries): void {
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
                    point.isNull ?
                        0 :
                        (point.y as any);
            }
            this.total = total;

            // Set each point's properties
            for (i = 0; i < len; i++) {
                point = points[i];
                point.percentage =
                    (total > 0 && (point.visible || !ignoreHiddenPoint)) ?
                        (point.y as any) / total * 100 :
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
         * @return {void}
         */
        generatePoints: function (this: Highcharts.PieSeries): void {
            Series.prototype.generatePoints.call(this);
            this.updateTotals();
        },

        /**
         * Utility for getting the x value from a given y, used for
         * anticollision logic in data labels. Added point for using specific
         * points' label distance.
         * @private
         */
        getX: function (
            this: Highcharts.PieSeries,
            y: number,
            left: boolean,
            point: Highcharts.PiePoint
        ): number {
            var center = this.center,
                // Variable pie has individual radius
                radius = (this as Highcharts.VariablePieSeries).radii ?
                    (this as Highcharts.VariablePieSeries).radii[
                        point.index as any
                    ] :
                    center[2] / 2,
                angle,
                x;

            angle = Math.asin(
                clamp((y - center[1]) / (radius + point.labelDistance), -1, 1)
            );
            x = center[0] +
            (left ? -1 : 1) *
            (Math.cos(angle) * (radius + point.labelDistance)) +
            (
                (point.labelDistance as any) > 0 ?
                    (left ? -1 : 1) * (this.options.dataLabels as any).padding :
                    0
            );

            return x;
        },

        /**
         * Do translation for pie slices
         *
         * @private
         * @function Highcharts.seriesTypes.pie#translate
         * @param {Array<number>} [positions]
         * @return {void}
         */
        translate: function (
            this: Highcharts.PieSeries,
            positions?: Array<number>
        ): void {
            this.generatePoints();

            var series = this,
                cumulative = 0,
                precision = 1000, // issue #172
                options = series.options,
                slicedOffset = options.slicedOffset,
                connectorOffset =
                    (slicedOffset as any) + (options.borderWidth || 0),
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
                // the x component of the radius vector for a given point
                radiusX,
                radiusY,
                labelDistance = (options.dataLabels as any).distance,
                ignoreHiddenPoint = options.ignoreHiddenPoint,
                i,
                len = points.length,
                point;

            // Get positions - either an integer or a percentage string must be
            // given. If positions are passed as a parameter, we're in a
            // recursive loop for adjusting space for data labels.
            if (!positions) {
                series.center = positions = series.getCenter();
            }

            // Calculate the geometry for each point
            for (i = 0; i < len; i++) {

                point = points[i];

                // set start and end angle
                start = startAngleRad + (cumulative * circ);
                if (!ignoreHiddenPoint || point.visible) {
                    cumulative += (point.percentage as any) / 100;
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

                // Used for distance calculation for specific point.
                point.labelDistance = pick(
                    (
                        point.options.dataLabels &&
                        point.options.dataLabels.distance
                    ),
                    labelDistance
                );

                // Compute point.labelDistance if it's defined as percentage
                // of slice radius (#8854)
                point.labelDistance = relativeLength(
                    point.labelDistance as any,
                    point.shapeArgs.r
                );

                // Saved for later dataLabels distance calculation.
                series.maxLabelDistance = Math.max(
                    series.maxLabelDistance || 0,
                    point.labelDistance
                );

                // The angle must stay within -90 and 270 (#2645)
                angle = (end + start) / 2;
                if (angle > 1.5 * Math.PI) {
                    angle -= 2 * Math.PI;
                } else if (angle < -Math.PI / 2) {
                    angle += 2 * Math.PI;
                }

                // Center for the sliced out slice
                point.slicedTranslation = {
                    translateX: Math.round(
                        Math.cos(angle) * (slicedOffset as any)
                    ),
                    translateY: Math.round(
                        Math.sin(angle) * (slicedOffset as any)
                    )
                };

                // set the anchor point for tooltips
                radiusX = Math.cos(angle) * positions[2] / 2;
                radiusY = Math.sin(angle) * positions[2] / 2;
                point.tooltipPos = [
                    positions[0] + radiusX * 0.7,
                    positions[1] + radiusY * 0.7
                ];

                point.half = angle < -Math.PI / 2 || angle > Math.PI / 2 ?
                    1 :
                    0;
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
                    'final': {
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
            fireEvent(series, 'afterTranslate');
        },

        /**
         * Called internally to draw auxiliary graph in pie-like series in
         * situtation when the default graph is not sufficient enough to present
         * the data well. Auxiliary graph is saved in the same object as
         * regular graph.
         *
         * @private
         * @function Highcharts.seriesTypes.pie#drawEmpty
         */
        drawEmpty: function (this: Highcharts.PieSeries): void {
            var centerX,
                centerY,
                options = this.options;

            // Draw auxiliary graph if there're no visible points.
            if (this.total === 0) {
                centerX = this.center[0];
                centerY = this.center[1];

                if (!this.graph) { // Auxiliary graph doesn't exist yet.
                    this.graph = this.chart.renderer.circle(centerX,
                        centerY, 0)
                        .addClass('highcharts-graph')
                        .add(this.group);
                }

                this.graph.animate({
                    'stroke-width': options.borderWidth,
                    cx: centerX,
                    cy: centerY,
                    r: this.center[2] / 2,
                    fill: (options.fillColor as any) || 'none',
                    stroke: (options.color as any) ||
                        '${palette.neutralColor20}'
                });

            } else if (this.graph) { // Destroy the graph object.
                this.graph = this.graph.destroy();
            }
        },

        /**
         * Draw the data points
         *
         * @private
         * @function Highcharts.seriesTypes.pie#drawPoints
         * @return {void}
         */
        redrawPoints: function (this: Highcharts.PieSeries): void {
            var series = this,
                chart = series.chart,
                renderer = chart.renderer,
                groupTranslation,
                graphic,
                pointAttr: Highcharts.SVGAttributes,
                shapeArgs,
                shadow = series.options.shadow;

            this.drawEmpty();

            if (shadow && !series.shadowGroup && !chart.styledMode) {
                series.shadowGroup = renderer.g('shadow')
                    .attr({ zIndex: -1 })
                    .add(series.group);
            }

            // draw the slices
            series.points.forEach(function (point: Highcharts.PiePoint): void {
                var animateTo = {};
                graphic = point.graphic;
                if (!point.isNull && graphic) {
                    shapeArgs = point.shapeArgs;


                    // If the point is sliced, use special translation, else use
                    // plot area translation
                    groupTranslation = point.getTranslate();

                    if (!chart.styledMode) {
                    // Put the shadow behind all points
                        var shadowGroup = point.shadowGroup;

                        if (shadow && !shadowGroup) {
                            shadowGroup = point.shadowGroup = renderer
                                .g('shadow')
                                .add(series.shadowGroup);
                        }

                        if (shadowGroup) {
                            shadowGroup.attr(groupTranslation);
                        }
                        pointAttr = series.pointAttribs(
                            point,
                            (point.selected && 'select') as any
                        );
                    }

                    // Draw the slice
                    if (!point.delayedRendering) {
                        graphic
                            .setRadialReference(series.center);

                        if (!chart.styledMode) {
                            merge(true, animateTo, pointAttr);
                        }
                        merge(true, animateTo, shapeArgs, groupTranslation);
                        graphic.animate(animateTo);
                    } else {

                        graphic
                            .setRadialReference(series.center)
                            .attr(shapeArgs)
                            .attr(groupTranslation);

                        if (!chart.styledMode) {
                            graphic
                                .attr(pointAttr)
                                .attr({ 'stroke-linejoin': 'round' })
                                .shadow(shadow, shadowGroup);
                        }

                        point.delayedRendering = false;
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
         * Slices in pie chart are initialized in DOM, but it's shapes and
         * animations are normally run in `drawPoints()`.
         * @private
         */
        drawPoints: function (this: Highcharts.PieSeries): void {
            var renderer = this.chart.renderer;

            this.points.forEach(function (point: Highcharts.PiePoint): void {
                if (!point.graphic) {
                    point.graphic = (renderer as any)[point.shapeType as any](
                        point.shapeArgs
                    )
                        .add(point.series.group);
                    point.delayedRendering = true;
                }
            });
        },
        /**
         * @private
         * @deprecated
         * @function Highcharts.seriesTypes.pie#searchPoint
         */
        searchPoint: noop as any,

        /**
         * Utility for sorting data labels
         *
         * @private
         * @function Highcharts.seriesTypes.pie#sortByAngle
         * @param {Array<Highcharts.Point>} points
         * @param {number} sign
         * @return {void}
         */
        sortByAngle: function (
            this: Highcharts.PieSeries,
            points: Array<Highcharts.PiePoint>,
            sign: number
        ): void {
            points.sort(function (
                a: Highcharts.PiePoint,
                b: Highcharts.PiePoint
            ): number {
                return (
                    ((typeof a.angle !== 'undefined') as any) &&
                    ((b.angle as any) - (a.angle as any)) * sign
                );
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
        getSymbol: noop as any,

        /**
         * @private
         * @type {null}
         */
        drawGraph: null as any

    },
    /**
     * @lends seriesTypes.pie.prototype.pointClass.prototype
     */
    {

        /**
         * Initialize the pie slice
         *
         * @private
         * @function Highcharts.seriesTypes.pie#pointClass#init
         * @return {Highcharts.Point}
         */
        init: function (this: Highcharts.PiePoint): Highcharts.PiePoint {

            Point.prototype.init.apply(this, arguments as any);

            var point = this,
                toggleSlice;

            point.name = pick(point.name, 'Slice');

            // add event listener for select
            toggleSlice = function (
                e: (Highcharts.Dictionary<any>|Event)
            ): void {
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
         * @return {boolean}
         */
        isValid: function (this: Highcharts.PiePoint): boolean {
            return isNumber(this.y) && this.y >= 0;
        },

        /**
         * Toggle the visibility of the pie slice
         *
         * @private
         * @function Highcharts.seriesTypes.pie#pointClass#setVisible
         * @param {boolean} vis
         *        Whether to show the slice or not. If undefined, the visibility
         *        is toggled.
         * @param {boolean} [redraw=false]
         * @return {void}
         */
        setVisible: function (
            this: Highcharts.PiePoint,
            vis: boolean,
            redraw?: boolean
        ): void {
            var point = this,
                series = point.series,
                chart = series.chart,
                ignoreHiddenPoint = series.options.ignoreHiddenPoint;

            redraw = pick(redraw, ignoreHiddenPoint);

            if (vis !== point.visible) {

                // If called without an argument, toggle visibility
                point.visible = point.options.visible = vis =
                    typeof vis === 'undefined' ? !point.visible : vis;
                // update userOptions.data
                (series.options.data as any)[series.data.indexOf(point)] =
                    point.options;

                // Show and hide associated elements. This is performed
                // regardless of redraw or not, because chart.redraw only
                // handles full series.
                ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(
                    function (key: string): void {
                        if ((point as any)[key]) {
                            (point as any)[key][vis ? 'show' : 'hide'](true);
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
         * @param {boolean} sliced
         *        When undefined, the slice state is toggled.
         * @param {boolean} redraw
         *        Whether to redraw the chart. True by default.
         * @param {boolean|Highcharts.AnimationOptionsObject}
         *        Animation options.
         * @return {void}
         */
        slice: function (
            this: Highcharts.PiePoint,
            sliced: boolean,
            redraw?: boolean,
            animation?: (boolean|Highcharts.AnimationOptionsObject)
        ): void {
            var point = this,
                series = point.series,
                chart = series.chart;

            setAnimation(animation, chart);

            // redraw is true by default
            redraw = pick(redraw, true);

            /**
             * Pie series only. Whether to display a slice offset from the
             * center.
             * @name Highcharts.Point#sliced
             * @type {boolean|undefined}
             */
            // if called without an argument, toggle
            point.sliced = point.options.sliced = sliced =
                defined(sliced) ? sliced : !point.sliced;
            // update userOptions.data
            (series.options.data as any)[series.data.indexOf(point)] =
                point.options;

            (point.graphic as any).animate(this.getTranslate());

            if (point.shadowGroup) {
                point.shadowGroup.animate(this.getTranslate());
            }
        },

        /**
         * @private
         * @function Highcharts.seriesTypes.pie#pointClass#getTranslate
         * @return {Highcharts.TranslationAttributes}
         */
        getTranslate: function (
            this: Highcharts.PiePoint
        ): Highcharts.TranslationAttributes {
            return this.sliced ? (this.slicedTranslation as any) : {
                translateX: 0,
                translateY: 0
            };
        },

        /**
         * @private
         * @function Highcharts.seriesTypes.pie#pointClass#haloPath
         * @param {number} size
         * @return {Highcharts.SVGPathArray}
         */
        haloPath: function (
            this: Highcharts.PiePoint,
            size: number
        ): Highcharts.SVGPathArray {
            var shapeArgs = this.shapeArgs;

            return this.sliced || !this.visible ?
                [] :
                this.series.chart.renderer.symbols.arc(
                    (shapeArgs as any).x,
                    (shapeArgs as any).y,
                    (shapeArgs as any).r + size,
                    (shapeArgs as any).r + size, {
                    // Substract 1px to ensure the background is not bleeding
                    // through between the halo and the slice (#7495).
                        innerR: (shapeArgs as any).r - 1,
                        start: (shapeArgs as any).start,
                        end: (shapeArgs as any).end
                    }
                );
        },

        connectorShapes: {
        // only one available before v7.0.0
            fixedOffset: function (
                labelPosition: Highcharts.PieSeriesPositionObject,
                connectorPosition: (
                    Highcharts.PiePointLabelConnectorPositionObject
                ),
                options: Highcharts.PieSeriesDataLabelsOptionsObject
            ): Highcharts.SVGPathArray {
                var breakAt = connectorPosition.breakAt,
                    touchingSliceAt = connectorPosition.touchingSliceAt,
                    linePath = options.softConnector ? ([
                        'C', // soft break
                        // 1st control point (of the curve)
                        labelPosition.x +
                        // 5 gives the connector a little horizontal bend
                        (labelPosition.alignment === 'left' ? -5 : 5),
                        labelPosition.y, //
                        2 * breakAt.x - touchingSliceAt.x, // 2nd control point
                        2 * breakAt.y - touchingSliceAt.y, //
                        breakAt.x, // end of the curve
                        breakAt.y //
                    ] as Highcharts.SVGPathArray) : ([
                        'L', // pointy break
                        breakAt.x,
                        breakAt.y
                    ] as Highcharts.SVGPathArray);

                // assemble the path
                return ([
                    'M',
                    labelPosition.x,
                    labelPosition.y
                ] as Highcharts.SVGPathArray)
                    .concat(linePath)
                    .concat([
                        'L',
                        touchingSliceAt.x,
                        touchingSliceAt.y
                    ]);
            },

            straight: function (
                labelPosition: Highcharts.PieSeriesPositionObject,
                connectorPosition: (
                    Highcharts.PiePointLabelConnectorPositionObject
                )
            ): Highcharts.SVGPathArray {
                var touchingSliceAt = connectorPosition.touchingSliceAt;

                // direct line to the slice
                return [
                    'M',
                    labelPosition.x,
                    labelPosition.y,
                    'L',
                    touchingSliceAt.x,
                    touchingSliceAt.y
                ];
            },

            crookedLine: function (
                this: Highcharts.PiePoint,
                labelPosition: Highcharts.PieSeriesPositionObject,
                connectorPosition: (
                    Highcharts.PiePointLabelConnectorPositionObject
                ),
                options: Highcharts.PieSeriesDataLabelsOptionsObject
            ): Highcharts.SVGPathArray {

                var touchingSliceAt = connectorPosition.touchingSliceAt,
                    series = this.series,
                    pieCenterX = series.center[0],
                    plotWidth = series.chart.plotWidth,
                    plotLeft = series.chart.plotLeft,
                    alignment = labelPosition.alignment,
                    radius = (this.shapeArgs as any).r,
                    crookDistance = relativeLength( // % to fraction
                        options.crookDistance as any, 1
                    ),
                    crookX = alignment === 'left' ?
                        pieCenterX + radius + (plotWidth + plotLeft -
                        pieCenterX - radius) * (1 - crookDistance) :
                        plotLeft + (pieCenterX - radius) * crookDistance,
                    segmentWithCrook = ([
                        'L',
                        crookX,
                        labelPosition.y
                    ] as Highcharts.SVGPathArray);

                // crookedLine formula doesn't make sense if the path overlaps
                // the label - use straight line instead in that case
                if (alignment === 'left' ?
                    (crookX > labelPosition.x || crookX < touchingSliceAt.x) :
                    (crookX < labelPosition.x || crookX > touchingSliceAt.x)) {
                    segmentWithCrook = []; // remove the crook
                }

                // assemble the path
                return ([
                    'M',
                    labelPosition.x,
                    labelPosition.y
                ] as Highcharts.SVGPathArray)
                    .concat(segmentWithCrook)
                    .concat([
                        'L',
                        touchingSliceAt.x,
                        touchingSliceAt.y
                    ]);
            }
        },

        /**
         * Extendable method for getting the path of the connector between the
         * data label and the pie slice.
         */
        getConnectorPath: function (this: Highcharts.PiePoint): void {
            var labelPosition = this.labelPosition,
                options = this.series.options.dataLabels,
                connectorShape = (options as any).connectorShape,
                predefinedShapes = this.connectorShapes;

            // find out whether to use the predefined shape
            if ((predefinedShapes as any)[connectorShape]) {
                connectorShape = (predefinedShapes as any)[connectorShape];
            }

            return connectorShape.call(this, {
                // pass simplified label position object for user's convenience
                x: (labelPosition as any).final.x,
                y: (labelPosition as any).final.y,
                alignment: (labelPosition as any).alignment
            }, (labelPosition as any).connectorPosition, options);
        }
    }

    /* eslint-enable valid-jsdoc */
);

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
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.pie.turboThreshold),
 *    this option is not available.
 *    ```js
 *    data: [{
 *        y: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
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
 * @type      {Array<number|Array<string,(number|null)>|null|*>}
 * @extends   series.line.data
 * @excluding marker, x
 * @product   highcharts
 * @apioption series.pie.data
 */

/**
 * @type      {Highcharts.SeriesPieDataLabelsOptionsObject}
 * @product   highcharts
 * @apioption series.pie.data.dataLabels
 */

/**
 * The sequential index of the data point in the legend.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.pie.data.legendIndex
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

/**
 * @excluding legendItemClick
 * @product   highcharts
 * @apioption series.pie.events
 */

''; // placeholder for transpiled doclets above
