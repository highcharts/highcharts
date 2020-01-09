/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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
        class AreaPoint extends LinePoint {
            public isCliff?: boolean;
            public leftNull?: boolean;
            public options: AreaPointOptions;
            public rightNull?: boolean;
            public series: AreaSeries;
        }
        class AreaSeries extends LineSeries {
            public areaPath?: AreaPathObject;
            public data: Array<AreaPoint>;
            public options: AreaSeriesOptions;
            public pointClass: typeof AreaPoint;
            public points: Array<AreaPoint>;
            public getStackPoints(points: Array<AreaPoint>): Array<AreaPoint>;
        }
        interface AreaPathObject extends SVGPathArray {
            xMap?: number;
        }
        interface AreaPointOptions extends LinePointOptions {
        }
        interface AreaSeriesOptions extends LineSeriesOptions {
            fillColor?: ColorType;
            fillOpacity?: number;
            negativeFillColor?: ColorType;
            states?: SeriesStatesOptionsObject<AreaSeries>;
        }
        interface SeriesTypesDictionary {
            area: typeof AreaSeries;
        }
    }
}

import U from './Utilities.js';
const {
    objectEach,
    pick
} = U;

import './Color.js';
import './Legend.js';
import './Series.js';
import './Options.js';

var color = H.color,
    LegendSymbolMixin = H.LegendSymbolMixin,
    Series = H.Series,
    seriesType = H.seriesType;

/**
 * Area series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.area
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.AreaSeries>(
    'area',
    'line',

    /**
     * The area series type.
     *
     * @sample {highcharts} highcharts/demo/area-basic/
     *         Area chart
     * @sample {highstock} stock/demo/area/
     *         Area chart
     *
     * @extends      plotOptions.line
     * @excluding    useOhlcData
     * @product      highcharts highstock
     * @optionparent plotOptions.area
     */
    {

        /**
         * Fill color or gradient for the area. When `null`, the series' `color`
         * is used with the series' `fillOpacity`.
         *
         * In styled mode, the fill color can be set with the `.highcharts-area`
         * class name.
         *
         * @sample {highcharts} highcharts/plotoptions/area-fillcolor-default/
         *         Null by default
         * @sample {highcharts} highcharts/plotoptions/area-fillcolor-gradient/
         *         Gradient
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highcharts highstock
         * @apioption plotOptions.area.fillColor
         */

        /**
         * Fill opacity for the area. When you set an explicit `fillColor`,
         * the `fillOpacity` is not applied. Instead, you should define the
         * opacity in the `fillColor` with an rgba color definition. The
         * `fillOpacity` setting, also the default setting, overrides the alpha
         * component of the `color` setting.
         *
         * In styled mode, the fill opacity can be set with the
         * `.highcharts-area` class name.
         *
         * @sample {highcharts} highcharts/plotoptions/area-fillopacity/
         *         Automatic fill color and fill opacity of 0.1
         *
         * @type      {number}
         * @default   {highcharts} 0.75
         * @default   {highstock} 0.75
         * @product   highcharts highstock
         * @apioption plotOptions.area.fillOpacity
         */

        /**
         * A separate color for the graph line. By default the line takes the
         * `color` of the series, but the lineColor setting allows setting a
         * separate color for the line without altering the `fillColor`.
         *
         * In styled mode, the line stroke can be set with the
         * `.highcharts-graph` class name.
         *
         * @sample {highcharts} highcharts/plotoptions/area-linecolor/
         *         Dark gray line
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highcharts highstock
         * @apioption plotOptions.area.lineColor
         */

        /**
         * A separate color for the negative part of the area.
         *
         * In styled mode, a negative color is set with the
         * `.highcharts-negative` class name.
         *
         * @see [negativeColor](#plotOptions.area.negativeColor)
         *
         * @sample {highcharts} highcharts/css/series-negative-color/
         *         Negative color in styled mode
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     3.0
         * @product   highcharts
         * @apioption plotOptions.area.negativeFillColor
         */

        /**
         * Whether the whole area or just the line should respond to mouseover
         * tooltips and other mouse or touch events.
         *
         * @sample {highcharts|highstock} highcharts/plotoptions/area-trackbyarea/
         *         Display the tooltip when the area is hovered
         *
         * @type      {boolean}
         * @default   false
         * @since     1.1.6
         * @product   highcharts highstock
         * @apioption plotOptions.area.trackByArea
         */

        /**
         * When this is true, the series will not cause the Y axis to cross
         * the zero plane (or [threshold](#plotOptions.series.threshold) option)
         * unless the data actually crosses the plane.
         *
         * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
         * 3 will make the Y axis show negative values according to the
         * `minPadding` option. If `softThreshold` is `true`, the Y axis starts
         * at 0.
         *
         * @since   4.1.9
         * @product highcharts highstock
         */
        softThreshold: false,

        /**
         * The Y axis value to serve as the base for the area, for
         * distinguishing between values above and below a threshold. The area
         * between the graph and the threshold is filled.
         *
         * * If a number is given, the Y axis will scale to the threshold.
         * * If `null`, the scaling behaves like a line series with fill between
         *   the graph and the Y axis minimum.
         * * If `Infinity` or `-Infinity`, the area between the graph and the
         *   corresponing Y axis extreme is filled (since v6.1.0).
         *
         * @sample {highcharts} highcharts/plotoptions/area-threshold/
         *         A threshold of 100
         * @sample {highcharts} highcharts/plotoptions/area-threshold-infinity/
         *         A threshold of Infinity
         *
         * @since   2.0
         * @product highcharts highstock
         */
        threshold: 0


    },

    /* eslint-disable valid-jsdoc */

    /**
     * @lends seriesTypes.area.prototype
     */
    {

        singleStacks: false,

        /**
         * Return an array of stacked points, where null and missing points are
         * replaced by dummy points in order for gaps to be drawn correctly in
         * stacks.
         * @private
         */
        getStackPoints: function (
            this: Highcharts.AreaSeries,
            points: Array<Highcharts.AreaPoint>
        ): Array<Highcharts.AreaPoint> {
            var series = this,
                segment = [] as Array<Highcharts.AreaPoint>,
                keys = [] as Array<string>,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
                stack = yAxis.stacks[this.stackKey as any],
                pointMap = {} as Highcharts.Dictionary<Highcharts.AreaPoint>,
                seriesIndex = series.index,
                yAxisSeries = yAxis.series,
                seriesLength = yAxisSeries.length,
                visibleSeries: (Array<boolean>|undefined),
                upOrDown = pick(yAxis.options.reversedStacks, true) ? 1 : -1,
                i: number;


            points = points || this.points;

            if (this.options.stacking) {

                for (i = 0; i < points.length; i++) {
                    // Reset after point update (#7326)
                    points[i].leftNull = points[i].rightNull = void 0;

                    // Create a map where we can quickly look up the points by
                    // their X values.
                    pointMap[points[i].x as any] = points[i];
                }

                // Sort the keys (#1651)
                objectEach(stack, function (
                    stackX: Highcharts.StackItem,
                    x: string
                ): void {
                    // nulled after switching between
                    // grouping and not (#1651, #2336)
                    if (stackX.total !== null) {
                        keys.push(x);
                    }
                });
                keys.sort(function (a: string, b: string): number {
                    return (a as any) - (b as any);
                });

                visibleSeries = yAxisSeries.map(function (
                    s: Highcharts.Series
                ): boolean {
                    return s.visible;
                });

                keys.forEach(function (x: string, idx: number): void {
                    var y = 0,
                        stackPoint,
                        stackedValues;

                    if (pointMap[x] && !pointMap[x].isNull) {
                        segment.push(pointMap[x]);

                        // Find left and right cliff. -1 goes left, 1 goes
                        // right.
                        [-1, 1].forEach(function (direction: number): void {
                            var nullName = direction === 1 ?
                                    'rightNull' :
                                    'leftNull',
                                cliffName = direction === 1 ?
                                    'rightCliff' :
                                    'leftCliff',
                                cliff = 0,
                                otherStack = stack[keys[idx + direction]];

                            // If there is a stack next to this one,
                            // to the left or to the right...
                            if (otherStack) {
                                i = seriesIndex as any;
                                // Can go either up or down,
                                // depending on reversedStacks
                                while (i >= 0 && i < seriesLength) {
                                    stackPoint = otherStack.points[i];
                                    if (!stackPoint) {
                                        // If the next point in this series
                                        // is missing, mark the point
                                        // with point.leftNull or
                                        // point.rightNull = true.
                                        if (i === seriesIndex) {
                                            (pointMap[x] as any)[nullName] =
                                                true;

                                            // If there are missing points in
                                            // the next stack in any of the
                                            // series below this one, we need
                                            // to substract the missing values
                                            // and add a hiatus to the left or
                                            // right.
                                        } else if (
                                            (visibleSeries as any)[i as any]
                                        ) {
                                            stackedValues =
                                                stack[x].points[i as any];
                                            if (stackedValues) {
                                                cliff -=
                                                    (stackedValues as any)[1] -
                                                    (stackedValues as any)[0];
                                            }
                                        }
                                    }
                                    // When reversedStacks is true, loop up,
                                    // else loop down
                                    i += upOrDown;
                                }
                            }
                            (pointMap[x] as any)[cliffName] = cliff;
                        });


                    // There is no point for this X value in this series, so we
                    // insert a dummy point in order for the areas to be drawn
                    // correctly.
                    } else {

                        // Loop down the stack to find the series below this
                        // one that has a value (#1991)
                        i = seriesIndex as any;
                        while (i >= 0 && i < seriesLength) {
                            stackPoint = stack[x].points[i];
                            if (stackPoint) {
                                y = (stackPoint as any)[1];
                                break;
                            }
                            // When reversedStacks is true, loop up, else loop
                            // down
                            i += upOrDown;
                        }
                        y = yAxis.translate(// #6272
                            y, 0 as any, 1 as any, 0 as any, 1 as any
                        ) as any;
                        segment.push({ // @todo create real point object
                            isNull: true,
                            plotX: xAxis.translate(// #6272
                                x as any, 0 as any, 0 as any, 0 as any, 1 as any
                            ),
                            x: x as any,
                            plotY: y,
                            yBottom: y
                        } as any);
                    }
                });

            }

            return segment;
        },

        /**
         * @private
         */
        getGraphPath: function (
            this: Highcharts.AreaSeries,
            points: Array<Highcharts.AreaPoint>
        ): Highcharts.SVGPathArray {
            var getGraphPath = Series.prototype.getGraphPath,
                graphPath: Highcharts.SVGPathArray,
                options = this.options,
                stacking = options.stacking,
                yAxis = this.yAxis,
                topPath: Highcharts.AreaPathObject,
                bottomPath,
                bottomPoints: Array<Highcharts.AreaPoint> = [],
                graphPoints: Array<Highcharts.AreaPoint> = [],
                seriesIndex = this.index,
                i,
                areaPath: Highcharts.AreaPathObject,
                plotX: number|undefined,
                stacks = yAxis.stacks[this.stackKey as any],
                threshold = options.threshold,
                translatedThreshold = Math.round( // #10909
                    yAxis.getThreshold(options.threshold as any) as any
                ),
                isNull,
                yBottom,
                connectNulls = pick( // #10574
                    options.connectNulls,
                    stacking === 'percent'
                ),

                // To display null points in underlying stacked series, this
                // series graph must be broken, and the area also fall down to
                // fill the gap left by the null point. #2069
                addDummyPoints = function (
                    i: number,
                    otherI: number,
                    side: string
                ): void {
                    var point = points[i],
                        stackedValues = stacking &&
                            stacks[point.x as any].points[seriesIndex as any],
                        nullVal = (point as any)[side + 'Null'] || 0,
                        cliffVal = (point as any)[side + 'Cliff'] || 0,
                        top,
                        bottom,
                        isNull = true;

                    if (cliffVal || nullVal) {

                        top = (nullVal ?
                            (stackedValues as any)[0] :
                            (stackedValues as any)[1]
                        ) + cliffVal;
                        bottom = (stackedValues as any)[0] + cliffVal;
                        isNull = !!nullVal;

                    } else if (
                        !stacking &&
                    points[otherI] &&
                    points[otherI].isNull
                    ) {
                        top = bottom = threshold;
                    }

                    // Add to the top and bottom line of the area
                    if (typeof top !== 'undefined') {
                        graphPoints.push({
                            plotX: plotX,
                            plotY: top === null ?
                                translatedThreshold :
                                yAxis.getThreshold(top),
                            isNull: isNull,
                            isCliff: true
                        } as any);
                        bottomPoints.push({ // @todo create real point object
                            plotX: plotX,
                            plotY: bottom === null ?
                                translatedThreshold :
                                yAxis.getThreshold(bottom),
                            doCurve: false // #1041, gaps in areaspline areas
                        } as any);
                    }
                };

            // Find what points to use
            points = points || this.points;

            // Fill in missing points
            if (stacking) {
                points = this.getStackPoints(points);
            }

            for (i = 0; i < points.length; i++) {

                // Reset after series.update of stacking property (#12033)
                if (!stacking) {
                    points[i].leftCliff = points[i].rightCliff =
                        points[i].leftNull = points[i].rightNull = void 0;
                }

                isNull = points[i].isNull;
                plotX = pick(points[i].rectPlotX, points[i].plotX);
                yBottom = pick(points[i].yBottom, translatedThreshold);

                if (!isNull || connectNulls) {

                    if (!connectNulls) {
                        addDummyPoints(i, i - 1, 'left');
                    }
                    // Skip null point when stacking is false and connectNulls
                    // true
                    if (!(isNull && !stacking && connectNulls)) {
                        graphPoints.push(points[i]);
                        bottomPoints.push({ // @todo make real point object
                            x: i,
                            plotX: plotX,
                            plotY: yBottom
                        } as any);
                    }

                    if (!connectNulls) {
                        addDummyPoints(i, i + 1, 'right');
                    }
                }
            }

            topPath = getGraphPath.call(this, graphPoints, true, true);

            (bottomPoints as any).reversed = true;
            bottomPath = getGraphPath.call(this, bottomPoints, true, true);
            if (bottomPath.length) {
                bottomPath[0] = 'L';
            }

            areaPath = topPath.concat(bottomPath);
            // TODO: don't set leftCliff and rightCliff when connectNulls?
            graphPath = getGraphPath
                .call(this, graphPoints, false, connectNulls);
            areaPath.xMap = topPath.xMap;
            this.areaPath = areaPath;

            return graphPath;
        },

        /**
         * Draw the graph and the underlying area. This method calls the Series
         * base function and adds the area. The areaPath is calculated in the
         * getSegmentPath method called from Series.prototype.drawGraph.
         * @private
         */
        drawGraph: function (this: Highcharts.AreaSeries): void {

            // Define or reset areaPath
            this.areaPath = [];

            // Call the base method
            Series.prototype.drawGraph.apply(this);

            // Define local variables
            var series = this,
                areaPath = this.areaPath,
                options = this.options,
                zones = this.zones,
                props = [[
                    'area',
                    'highcharts-area',
                    this.color as any,
                    options.fillColor as any
                ]]; // area name, main color, fill color

            zones.forEach(function (
                zone: Highcharts.SeriesZonesOptions,
                i: number
            ): void {
                props.push([
                    'zone-area-' + i,
                    'highcharts-area highcharts-zone-area-' + i + ' ' +
                    zone.className,
                    zone.color || series.color,
                    zone.fillColor || options.fillColor
                ]);
            });

            props.forEach(function (prop: Array<string>): void {
                var areaKey = prop[0],
                    area = (series as any)[areaKey],
                    verb = area ? 'animate' : 'attr',
                    attribs = {} as Highcharts.SVGAttributes;

                // Create or update the area
                if (area) { // update
                    area.endX = series.preventGraphAnimation ?
                        null :
                        areaPath.xMap;
                    area.animate({ d: areaPath });

                } else { // create

                    attribs.zIndex = 0; // #1069

                    area = (series as any)[areaKey] = series.chart.renderer
                        .path(areaPath)
                        .addClass(prop[1])
                        .add(series.group);
                    area.isArea = true;
                }

                if (!series.chart.styledMode) {
                    attribs.fill = pick(
                        prop[3],
                        color(prop[2])
                            .setOpacity(pick(options.fillOpacity, 0.75))
                            .get()
                    );
                }
                area[verb](attribs);

                area.startX = areaPath.xMap;
                area.shiftUnit = options.step ? 2 : 1;
            });
        },

        drawLegendSymbol: LegendSymbolMixin.drawRectangle
    }
);

/* eslint-enable valid-jsdoc */

/**
 * A `area` series. If the [type](#series.area.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.area
 * @excluding dataParser, dataURL, useOhlcData
 * @product   highcharts highstock
 * @apioption series.area
 */

/**
 * An array of data points for the series. For the `area` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` * and `pointInterval` given in the series options. If the
 *    axis has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 9],
 *        [1, 7],
 *        [2, 6]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.area.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 6,
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
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.area.data
 */

''; // adds doclets above to transpilat
