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

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface AreaRangeDataLabelsOptionsObject
            extends DataLabelsOptionsObject
        {
            xHigh?: number;
            xLow?: number;
            yHigh?: number;
            yLow?: number;
        }
        interface AreaRangePointOptions extends AreaPointOptions {
            high?: number;
            low?: number;
        }
        interface AreaRangeSeriesOptions extends AreaSeriesOptions {
            dataLabels?: (
                AreaRangeDataLabelsOptionsObject|
                Array<AreaRangeDataLabelsOptionsObject>
            );
            states?: SeriesStatesOptionsObject<AreaRangeSeries>;
            trackByArea?: boolean;
        }
        interface Point {
            plotHigh?: AreaRangePoint['plotHigh'];
            plotLow?: AreaRangePoint['plotLow'];
        }
        interface SeriesTypesDictionary {
            arearange: typeof AreaRangeSeries;
        }
        class AreaRangePoint extends AreaPoint {
            public _plotY?: number;
            public below?: boolean;
            public dataLabelUpper?: SVGElement;
            public high: number;
            public isInside?: boolean;
            public isTopInside?: boolean;
            public low: number;
            public lowerGraphic?: SVGElement;
            public options: AreaRangePointOptions;
            public origProps?: object;
            public plotHigh: number;
            public plotLow: number;
            public plotHighX: number;
            public plotLowX: number;
            public plotX: number;
            public series: AreaRangeSeries;
            public upperGraphic?: SVGElement;
            public setState(): void;
        }
        class AreaRangeSeries extends AreaSeries {
            public data: Array<AreaRangePoint>;
            public deferTranslatePolar: boolean;
            public lowerStateMarkerGraphic?: SVGElement;
            public options: AreaRangeSeriesOptions;
            public pointClass: typeof AreaRangePoint;
            public points: Array<AreaRangePoint>;
            public upperStateMarkerGraphic?: SVGElement;
            public xAxis: RadialAxis;
            public alignDataLabel(): void;
            public drawDataLabels(): void;
            public drawPoints(): void;
            public getGraphPath(points: Array<AreaRangePoint>): SVGPathArray;
            public highToXY(point: (AreaRangePoint & PolarPoint)): void;
            public translate(): void;
            public toYData(point: AreaRangePoint): [number, number];
        }
    }
}

import U from '../parts/Utilities.js';
const {
    defined,
    extend,
    isArray,
    isNumber,
    pick
} = U;

import '../parts/Options.js';
import '../parts/Series.js';

var noop = H.noop,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    seriesProto = Series.prototype,
    pointProto = H.Point.prototype;

/**
 * The area range series is a carteseian series with higher and lower values for
 * each point along an X axis, where the area between the values is shaded.
 *
 * @sample {highcharts} highcharts/demo/arearange/
 *         Area range chart
 * @sample {highstock} stock/demo/arearange/
 *         Area range chart
 *
 * @extends      plotOptions.area
 * @product      highcharts highstock
 * @excluding    stack, stacking
 * @requires     highcharts-more
 * @optionparent plotOptions.arearange
 */
seriesType<Highcharts.AreaRangeSeries>('arearange', 'area', {

    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the shadow
     * can be an object configuration containing `color`, `offsetX`, `offsetY`,
     * `opacity` and `width`.
     *
     * @type      {boolean|Highcharts.ShadowOptionsObject}
     * @product   highcharts
     * @apioption plotOptions.arearange.shadow
     */

    /**
     * @default   low
     * @apioption plotOptions.arearange.colorKey
     */

    /**
     * Pixel width of the arearange graph line.
     *
     * @since 2.3.0
     *
     * @private
     */
    lineWidth: 1,

    threshold: null as any,

    tooltip: {
        pointFormat: '<span style="color:{series.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
    },

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @since 2.3.0
     *
     * @private
     */
    trackByArea: true,

    /**
     * Extended data labels for range series types. Range series data labels use
     * no `x` and `y` options. Instead, they have `xLow`, `xHigh`, `yLow` and
     * `yHigh` options to allow the higher and lower data label sets
     * individually.
     *
     * @declare Highcharts.SeriesAreaRangeDataLabelsOptionsObject
     * @exclude x, y
     * @since   2.3.0
     * @product highcharts highstock
     *
     * @private
     */
    dataLabels: {

        align: null,

        verticalAlign: null,

        /**
         * X offset of the lower data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        xLow: 0,

        /**
         * X offset of the higher data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        xHigh: 0,

        /**
         * Y offset of the lower data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        yLow: 0,

        /**
         * Y offset of the higher data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        yHigh: 0

    }

// Prototype members
}, {
    pointArrayMap: ['low', 'high'],
    pointValKey: 'low',
    deferTranslatePolar: true,

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    toYData: function (point: Highcharts.AreaRangePoint): [number, number] {
        return [point.low, point.high];
    },

    /**
     * Translate a point's plotHigh from the internal angle and radius measures
     * to true plotHigh coordinates. This is an addition of the toXY method
     * found in Polar.js, because it runs too early for arearanges to be
     * considered (#3419).
     * @private
     */
    highToXY: function (
        this: Highcharts.AreaRangeSeries,
        point: Highcharts.AreaRangePoint
    ): void {
        // Find the polar plotX and plotY
        var chart = this.chart,
            xy = this.xAxis.postTranslate(
                point.rectPlotX as any,
                this.yAxis.len - point.plotHigh
            );

        point.plotHighX = xy.x - chart.plotLeft;
        point.plotHigh = xy.y - chart.plotTop;
        point.plotLowX = point.plotX;
    },

    /**
     * Translate data points from raw values x and y to plotX and plotY.
     * @private
     */
    translate: function (this: Highcharts.AreaRangeSeries): void {
        var series = this,
            yAxis = series.yAxis,
            hasModifyValue = !!series.modifyValue;

        seriesTypes.area.prototype.translate.apply(series);

        // Set plotLow and plotHigh
        series.points.forEach(function (
            point: Highcharts.AreaRangePoint
        ): void {

            var high = point.high,
                plotY = point.plotY;

            if (point.isNull) {
                point.plotY = null as any;
            } else {
                point.plotLow = plotY as any;
                point.plotHigh = yAxis.translate(
                    hasModifyValue ?
                        (series.modifyValue as any)(high, point) :
                        high,
                    0 as any,
                    1 as any,
                    0 as any,
                    1 as any
                ) as any;
                if (hasModifyValue) {
                    point.yBottom = point.plotHigh;
                }
            }
        });

        // Postprocess plotHigh
        if (this.chart.polar) {
            (this as any).points.forEach(function (
                point: (Highcharts.AreaRangePoint & Highcharts.PolarPoint)
            ): void {
                series.highToXY(point);
                point.tooltipPos = [
                    (point.plotHighX + point.plotLowX) / 2,
                    (point.plotHigh + point.plotLow) / 2
                ];
            });
        }
    },

    /**
     * Extend the line series' getSegmentPath method by applying the segment
     * path to both lower and higher values of the range.
     * @private
     */
    getGraphPath: function (
        this: Highcharts.AreaRangeSeries,
        points: Array<Highcharts.AreaRangePoint>
    ): Highcharts.SVGPathArray {

        var highPoints = [],
            highAreaPoints: Array<Highcharts.AreaPoint> = [],
            i,
            getGraphPath = seriesTypes.area.prototype.getGraphPath,
            point: any,
            pointShim: any,
            linePath: Highcharts.SVGPathArray & Highcharts.Dictionary<any>,
            lowerPath: Highcharts.SVGPathArray & Highcharts.Dictionary<any>,
            options = this.options,
            connectEnds = this.chart.polar && options.connectEnds !== false,
            connectNulls = options.connectNulls,
            step = options.step,
            higherPath,
            higherAreaPath;

        points = points || this.points;
        i = points.length;

        // Create the top line and the top part of the area fill. The area fill
        // compensates for null points by drawing down to the lower graph,
        // moving across the null gap and starting again at the lower graph.
        i = points.length;
        while (i--) {
            point = points[i];

            if (
                !point.isNull &&
                !connectEnds &&
                !connectNulls &&
                (!points[i + 1] || points[i + 1].isNull)
            ) {
                highAreaPoints.push({
                    plotX: point.plotX,
                    plotY: point.plotY,
                    doCurve: false // #5186, gaps in areasplinerange fill
                } as any);
            }

            pointShim = {
                polarPlotY: point.polarPlotY,
                rectPlotX: point.rectPlotX,
                yBottom: point.yBottom,
                // plotHighX is for polar charts
                plotX: pick(point.plotHighX, point.plotX),
                plotY: point.plotHigh,
                isNull: point.isNull
            };

            highAreaPoints.push(pointShim);

            highPoints.push(pointShim);

            if (
                !point.isNull &&
                !connectEnds &&
                !connectNulls &&
                (!points[i - 1] || points[i - 1].isNull)
            ) {
                highAreaPoints.push({
                    plotX: point.plotX,
                    plotY: point.plotY,
                    doCurve: false // #5186, gaps in areasplinerange fill
                } as any);
            }
        }

        // Get the paths
        lowerPath = getGraphPath.call(this, points);
        if (step) {
            if ((step as any) === true) {
                step = 'left';
            }
            options.step = {
                left: 'right',
                center: 'center',
                right: 'left'
            }[step] as any; // swap for reading in getGraphPath
        }
        higherPath = getGraphPath.call(this, highPoints);
        higherAreaPath = getGraphPath.call(this, highAreaPoints);
        options.step = step;

        // Create a line on both top and bottom of the range
        linePath = ([] as Highcharts.SVGPathArray)
            .concat(lowerPath, higherPath);

        // For the area path, we need to change the 'move' statement
        // into 'lineTo' or 'curveTo'
        if (!this.chart.polar && higherAreaPath[0] === 'M') {
            higherAreaPath[0] = 'L'; // this probably doesn't work for spline
        }

        this.graphPath = linePath;
        this.areaPath = lowerPath.concat(higherAreaPath);

        // Prepare for sideways animation
        linePath.isArea = true;
        linePath.xMap = lowerPath.xMap;
        this.areaPath.xMap = lowerPath.xMap;

        return linePath;
    },

    /**
     * Extend the basic drawDataLabels method by running it for both lower and
     * higher values.
     * @private
     */
    drawDataLabels: function (this: Highcharts.AreaRangeSeries): void {

        var data = this.points,
            length = data.length,
            i,
            originalDataLabels = [],
            dataLabelOptions = this.options.dataLabels,
            point,
            up,
            inverted = this.chart.inverted,
            upperDataLabelOptions: Highcharts.AreaRangeDataLabelsOptionsObject,
            lowerDataLabelOptions: Highcharts.AreaRangeDataLabelsOptionsObject;

        // Split into upper and lower options. If data labels is an array, the
        // first element is the upper label, the second is the lower.
        //
        // TODO: We want to change this and allow multiple labels for both upper
        // and lower values in the future - introducing some options for which
        // point value to use as Y for the dataLabel, so that this could be
        // handled in Series.drawDataLabels. This would also improve performance
        // since we now have to loop over all the points multiple times to work
        // around the data label logic.
        if (isArray(dataLabelOptions)) {
            if (dataLabelOptions.length > 1) {
                upperDataLabelOptions = dataLabelOptions[0];
                lowerDataLabelOptions = dataLabelOptions[1];
            } else {
                upperDataLabelOptions = dataLabelOptions[0];
                lowerDataLabelOptions = { enabled: false };
            }
        } else {
            // Make copies
            upperDataLabelOptions = extend({}, dataLabelOptions as any);
            upperDataLabelOptions.x = (dataLabelOptions as any).xHigh;
            upperDataLabelOptions.y = (dataLabelOptions as any).yHigh;
            lowerDataLabelOptions = extend({}, dataLabelOptions as any);
            lowerDataLabelOptions.x = (dataLabelOptions as any).xLow;
            lowerDataLabelOptions.y = (dataLabelOptions as any).yLow;
        }

        // Draw upper labels
        if (upperDataLabelOptions.enabled || this._hasPointLabels) {
            // Set preliminary values for plotY and dataLabel
            // and draw the upper labels
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    up = upperDataLabelOptions.inside ?
                        point.plotHigh < point.plotLow :
                        point.plotHigh > point.plotLow;

                    point.y = point.high;
                    point._plotY = point.plotY;
                    point.plotY = point.plotHigh;

                    // Store original data labels and set preliminary label
                    // objects to be picked up in the uber method
                    originalDataLabels[i] = point.dataLabel;
                    point.dataLabel = point.dataLabelUpper;

                    // Set the default offset
                    point.below = up;
                    if (inverted) {
                        if (!upperDataLabelOptions.align) {
                            upperDataLabelOptions.align = up ? 'right' : 'left';
                        }
                    } else {
                        if (!upperDataLabelOptions.verticalAlign) {
                            upperDataLabelOptions.verticalAlign = up ?
                                'top' :
                                'bottom';
                        }
                    }
                }
            }

            this.options.dataLabels = upperDataLabelOptions;

            if (seriesProto.drawDataLabels) {
                // #1209:
                seriesProto.drawDataLabels.apply(this, arguments as any);
            }

            // Reset state after the upper labels were created. Move
            // it to point.dataLabelUpper and reassign the originals.
            // We do this here to support not drawing a lower label.
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    point.dataLabelUpper = point.dataLabel;
                    point.dataLabel = originalDataLabels[i];
                    delete point.dataLabels;
                    point.y = point.low;
                    point.plotY = point._plotY;
                }
            }
        }

        // Draw lower labels
        if (lowerDataLabelOptions.enabled || this._hasPointLabels) {
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    up = lowerDataLabelOptions.inside ?
                        point.plotHigh < point.plotLow :
                        point.plotHigh > point.plotLow;

                    // Set the default offset
                    point.below = !up;
                    if (inverted) {
                        if (!lowerDataLabelOptions.align) {
                            lowerDataLabelOptions.align = up ? 'left' : 'right';
                        }
                    } else {
                        if (!lowerDataLabelOptions.verticalAlign) {
                            lowerDataLabelOptions.verticalAlign = up ?
                                'bottom' :
                                'top';
                        }
                    }
                }
            }

            this.options.dataLabels = lowerDataLabelOptions;

            if (seriesProto.drawDataLabels) {
                seriesProto.drawDataLabels.apply(this, arguments as any);
            }
        }

        // Merge upper and lower into point.dataLabels for later destroying
        if (upperDataLabelOptions.enabled) {
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    point.dataLabels = [
                        point.dataLabelUpper as any,
                        point.dataLabel
                    ].filter(function (
                        label: (Highcharts.SVGElement|undefined)
                    ): boolean {
                        return !!label;
                    });
                }
            }
        }

        // Reset options
        this.options.dataLabels = dataLabelOptions;
    },

    alignDataLabel: function (this: Highcharts.AreaRangeSeries): void {
        seriesTypes.column.prototype.alignDataLabel
            .apply(this, arguments as any);
    },

    drawPoints: function (this: Highcharts.AreaRangeSeries): void {
        var series = this,
            pointLength = series.points.length,
            point,
            i;

        // Draw bottom points
        seriesProto.drawPoints
            .apply(series, arguments as any);

        // Prepare drawing top points
        i = 0;
        while (i < pointLength) {
            point = series.points[i];

            // Save original props to be overridden by temporary props for top
            // points
            point.origProps = {
                plotY: point.plotY,
                plotX: point.plotX,
                isInside: point.isInside,
                negative: point.negative,
                zone: point.zone,
                y: point.y
            };

            point.lowerGraphic = point.graphic;
            point.graphic = point.upperGraphic;
            point.plotY = point.plotHigh;
            if (defined(point.plotHighX)) {
                point.plotX = point.plotHighX;
            }
            point.y = point.high;
            point.negative = point.high < (series.options.threshold || 0);
            point.zone = (series.zones.length && point.getZone()) as any;

            if (!series.chart.polar) {
                point.isInside = point.isTopInside = (
                    typeof point.plotY !== 'undefined' &&
                    point.plotY >= 0 &&
                    point.plotY <= series.yAxis.len && // #3519
                    point.plotX >= 0 &&
                    point.plotX <= series.xAxis.len
                );
            }
            i++;
        }

        // Draw top points
        seriesProto.drawPoints.apply(series, arguments as any);

        // Reset top points preliminary modifications
        i = 0;
        while (i < pointLength) {
            point = series.points[i];
            point.upperGraphic = point.graphic;
            point.graphic = point.lowerGraphic;
            extend(point, point.origProps as any);
            delete point.origProps;
            i++;
        }
    },

    /* eslint-enable valid-jsdoc */

    setStackedPoints: noop as any
}, {
    /**
     * Range series only. The high or maximum value for each data point.
     * @name Highcharts.Point#high
     * @type {number|undefined}
     */

    /**
     * Range series only. The low or minimum value for each data point.
     * @name Highcharts.Point#low
     * @type {number|undefined}
     */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    setState: function (this: Highcharts.AreaRangePoint): void {
        var prevState = this.state,
            series = this.series,
            isPolar = series.chart.polar;


        if (!defined(this.plotHigh)) {
            // Boost doesn't calculate plotHigh
            this.plotHigh = series.yAxis.toPixels(this.high, true);
        }

        if (!defined(this.plotLow)) {
            // Boost doesn't calculate plotLow
            this.plotLow = this.plotY = series.yAxis.toPixels(this.low, true);
        }

        if (series.stateMarkerGraphic) {
            series.lowerStateMarkerGraphic = series.stateMarkerGraphic;
            series.stateMarkerGraphic = series.upperStateMarkerGraphic;
        }

        // Change state also for the top marker
        this.graphic = this.upperGraphic;
        this.plotY = this.plotHigh;

        if (isPolar) {
            this.plotX = this.plotHighX;
        }

        // Top state:
        pointProto.setState.apply(this, arguments as any);

        this.state = prevState;

        // Now restore defaults
        this.plotY = this.plotLow;
        this.graphic = this.lowerGraphic;

        if (isPolar) {
            this.plotX = this.plotLowX;
        }

        if (series.stateMarkerGraphic) {
            series.upperStateMarkerGraphic = series.stateMarkerGraphic;
            series.stateMarkerGraphic = series.lowerStateMarkerGraphic;
            // Lower marker is stored at stateMarkerGraphic
            // to avoid reference duplication (#7021)
            series.lowerStateMarkerGraphic = void 0;
        }

        pointProto.setState.apply(this, arguments as any);

    },
    haloPath: function (
        this: Highcharts.AreaRangePoint
    ): (Highcharts.SVGElement|Highcharts.SVGPathArray|
        Array<Highcharts.SVGElement>) {
        var isPolar = this.series.chart.polar,
            path: (
                Highcharts.SVGElement|
                Highcharts.SVGPathArray|
                Array<Highcharts.SVGElement>
            ) = [];

        // Bottom halo
        this.plotY = this.plotLow;
        if (isPolar) {
            this.plotX = this.plotLowX;
        }

        if (this.isInside) {
            path = pointProto.haloPath.apply(this, arguments as any);
        }

        // Top halo
        this.plotY = this.plotHigh;
        if (isPolar) {
            this.plotX = this.plotHighX;
        }
        if (this.isTopInside) {
            path = path.concat(
                pointProto.haloPath.apply(this, arguments as any)
            );
        }

        return path;
    },
    destroyElements: function (this: Highcharts.AreaRangePoint): void {
        var graphics = ['lowerGraphic', 'upperGraphic'];

        graphics.forEach(function (graphicName): void {
            if ((this as any)[graphicName]) {
                (this as any)[graphicName] =
                    (this as any)[graphicName].destroy();
            }
        }, this);

        // Clear graphic for states, removed in the above each:
        this.graphic = null as any;

        return pointProto.destroyElements.apply(this, arguments as any);
    },
    isValid: function (this: Highcharts.AreaRangePoint): boolean {
        return isNumber(this.low) && isNumber(this.high);
    }

    /* eslint-enable valid-jsdoc */

});


/**
 * A `arearange` series. If the [type](#series.arearange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.arearange
 * @excluding dataParser, dataURL, stack, stacking
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @apioption series.arearange
 */

/**
 * An array of data points for the series. For the `arearange` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 *     correspond to `x,low,high`. If the first value is a string, it is
 *     applied as the name of the point, and the `x` value is inferred.
 *     The `x` value can also be omitted, in which case the inner arrays
 *     should be of length 2\. Then the `x` value is automatically calculated,
 *     either starting at 0 and incremented by 1, or from `pointStart`
 *     and `pointInterval` given in the series options.
 *     ```js
 *     data: [
 *         [0, 8, 3],
 *         [1, 1, 1],
 *         [2, 6, 8]
 *     ]
 *     ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 *     few settings, see the complete options set below. If the total number of
 *     data points exceeds the series'
 *     [turboThreshold](#series.arearange.turboThreshold),
 *     this option is not available.
 *     ```js
 *     data: [{
 *         x: 1,
 *         low: 9,
 *         high: 0,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         low: 3,
 *         high: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *     ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.line.data
 * @excluding marker, y
 * @product   highcharts highstock
 * @apioption series.arearange.data
 */

/**
 * @extends   series.arearange.dataLabels
 * @product   highcharts highstock
 * @apioption series.arearange.data.dataLabels
 */

/**
 * The high or maximum value for each data point.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.high
 */

/**
 * The low or minimum value for each data point.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.low
 */

''; // adds doclets above to tranpiled file
