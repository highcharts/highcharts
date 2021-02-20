/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ColumnRangeSeriesOptions from './ColumnRangeSeriesOptions';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type ColumnMetricsObject from '../Column/ColumnMetricsObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import ColumnRangePoint from './ColumnRangePoint.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        arearange: AreaRangeSeries,
        column: ColumnSeries
    }
} = SeriesRegistry;
const { prototype: columnProto } = ColumnSeries;
const { prototype: arearangeProto } = AreaRangeSeries;
import U from '../../Core/Utilities.js';
const {
    clamp,
    merge,
    pick,
    extend
} = U;

/**
 * The column range is a cartesian series type with higher and lower
 * Y values along an X axis. To display horizontal bars, set
 * [chart.inverted](#chart.inverted) to `true`.
 *
 * @sample {highcharts|highstock} highcharts/demo/columnrange/
 *         Inverted column range
 *
 * @extends      plotOptions.column
 * @since        2.3.0
 * @excluding    negativeColor, stacking, softThreshold, threshold
 * @product      highcharts highstock
 * @requires     highcharts-more
 * @optionparent plotOptions.columnrange
 */
var columnRangeOptions: ColumnRangeSeriesOptions = {

    /**
     * Extended data labels for range series types. Range series data labels
     * have no `x` and `y` options. Instead, they have `xLow`, `xHigh`,
     * `yLow` and `yHigh` options to allow the higher and lower data label
     * sets individually.
     *
     * @declare   Highcharts.SeriesAreaRangeDataLabelsOptionsObject
     * @extends   plotOptions.arearange.dataLabels
     * @since     2.3.0
     * @product   highcharts highstock
     * @apioption plotOptions.columnrange.dataLabels
     */

    pointRange: null,

    /** @ignore-option */
    marker: null as any,

    states: {
        hover: {
            /** @ignore-option */
            halo: false
        }
    }
};

/* *
 *
 *  Class
 *
 * */

/**
 * The ColumnRangeSeries class
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.columnrange
 *
 * @augments Highcharts.Series
 */

class ColumnRangeSeries extends AreaRangeSeries {

    /* *
     *
     *  Static properties
     *
     * */

    public static defaultOptions: ColumnRangeSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        AreaRangeSeries.defaultOptions,
        columnRangeOptions as ColumnRangeSeriesOptions
    )

    /* *
     *
     *  Properties
     *
     * */

    public data = void 0 as any;
    public points = void 0 as any;
    public options = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public setOptions(): ColumnRangeSeriesOptions {
        merge(true, arguments[0], { stacking: void 0 }); // #14359 Prevent side-effect from stacking.
        return arearangeProto.setOptions.apply(this, arguments);
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Translate data points from raw values x and y to plotX and plotY
     * @private
     */
    public translate(): void {
        var series = this,
            yAxis = series.yAxis,
            xAxis = series.xAxis,
            startAngleRad = xAxis.startAngleRad,
            start,
            chart = series.chart,
            isRadial = series.xAxis.isRadial,
            safeDistance = Math.max(chart.chartWidth, chart.chartHeight) + 999,
            plotHigh;

        // eslint-disable-next-line valid-jsdoc
        /**
         * Don't draw too far outside plot area (#6835)
         * @private
         */
        function safeBounds(pixelPos: number): number {
            return clamp(pixelPos, -safeDistance, safeDistance);
        }


        columnProto.translate.apply(series);

        // Set plotLow and plotHigh
        series.points.forEach(function (
            point: ColumnRangePoint
        ): void {
            var shapeArgs = point.shapeArgs || {},
                minPointLength = series.options.minPointLength,
                heightDifference,
                height,
                y;

            point.plotHigh = plotHigh = safeBounds(
                yAxis.translate(
                    point.high, 0 as any, 1 as any, 0 as any, 1 as any
                ) as any
            );
            point.plotLow = safeBounds(point.plotY as any);

            // adjust shape
            y = plotHigh;
            height = pick((point as any).rectPlotY, point.plotY) - plotHigh;

            // Adjust for minPointLength
            if (Math.abs(height) < (minPointLength as any)) {
                heightDifference = ((minPointLength as any) - height);
                height += heightDifference;
                y -= heightDifference / 2;

            // Adjust for negative ranges or reversed Y axis (#1457)
            } else if (height < 0) {
                height *= -1;
                y -= height;
            }

            if (isRadial) {

                start = (point.barX as any) + startAngleRad;
                point.shapeType = 'arc';
                point.shapeArgs = series.polarArc(
                    y + height,
                    y,
                    start,
                    start + point.pointWidth
                );
            } else {

                shapeArgs.height = height;
                shapeArgs.y = y;
                const { x = 0, width = 0 } = shapeArgs;

                point.tooltipPos = chart.inverted ?
                    [
                        yAxis.len + (yAxis.pos as any) - chart.plotLeft - y -
                        height / 2,
                        xAxis.len + (xAxis.pos as any) - chart.plotTop -
                        x - width / 2,
                        height
                    ] : [
                        xAxis.left - chart.plotLeft + x +
                        width / 2,
                        (yAxis.pos as any) - chart.plotTop + y + height / 2,
                        height
                    ]; // don't inherit from column tooltip position - #3372
            }
        });
    }

    // Overrides from modules that may be loaded after this module
    public crispCol(): BBoxObject {
        return columnProto.crispCol.apply(this, arguments as any);
    }
    public drawPoints(): void {
        return columnProto.drawPoints.apply(this, arguments as any);
    }
    public drawTracker(): void {
        return columnProto.drawTracker.apply(this, arguments as any);
    }
    public getColumnMetrics(): ColumnMetricsObject {
        return columnProto.getColumnMetrics.apply(this, arguments as any);
    }
    public pointAttribs(): SVGAttributes {
        return columnProto.pointAttribs.apply(this, arguments as any);
    }
    public adjustForMissingColumns(): number {
        return columnProto.adjustForMissingColumns.apply(this, arguments);
    }
    public animate(): void {
        return columnProto.animate.apply(this, arguments as any);
    }
    public translate3dPoints(): void {
        return columnProto.translate3dPoints.apply(this, arguments as any);
    }
    public translate3dShapes(): void {
        return columnProto.translate3dShapes.apply(this, arguments as any);
    }
}

/* *
 *
 *  Prototype properties
 *
 * */

interface ColumnRangeSeries {
    pointClass: typeof ColumnRangePoint;
    polarArc: typeof AreaRangeSeries.prototype['polarArc'];
}
extend(ColumnRangeSeries.prototype, {
    directTouch: true,
    trackerGroups: ['group', 'dataLabelsGroup'],
    drawGraph: noop as any,
    getSymbol: noop as any,
    polarArc: function (this: ColumnRangeSeries): void {
        return (columnProto as any).polarArc.apply(this, arguments);
    },
    pointClass: ColumnRangePoint
});

/* *
 *
 *  Registry
 *
 * */

/**
 * @private
 */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        columnrange: typeof ColumnRangeSeries;
    }
}

SeriesRegistry.registerSeriesType('columnrange', ColumnRangeSeries);

/* *
 *
 *  Default export
 *
 * */

export default ColumnRangeSeries;

/* *
 *
 *  API options
 *
 * */

/**
 * A `columnrange` series. If the [type](#series.columnrange.type)
 * option is not specified, it is inherited from
 * [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.columnrange
 * @excluding dataParser, dataURL, stack, stacking
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @apioption series.columnrange
 */

/**
 * An array of data points for the series. For the `columnrange` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,low,high`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 4, 2],
 *        [1, 2, 1],
 *        [2, 9, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.columnrange.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 0,
 *        high: 4,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        high: 3,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
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
 * @extends   series.arearange.data
 * @excluding marker
 * @product   highcharts highstock
 * @apioption series.columnrange.data
 */

/**
 * @extends   series.columnrange.dataLabels
 * @product   highcharts highstock
 * @apioption series.columnrange.data.dataLabels
 */

/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.columnrange.states.hover
 */

/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.columnrange.states.select
 */

''; // adds doclets above into transpiled
