/* *
 *
 *  (c) 2019 Torstein Honsi
 *
 *  Item series type for Highcharts
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
        class ItemPoint extends PiePoint {
            public connectorShapes: PiePoint['connectorShapes'];
            public getConnectorPath: PiePoint['getConnectorPath'];
            public getTranslate: PiePoint['getTranslate'];
            public graphics: Dictionary<SVGElement>;
            public options: ItemPointOptions;
            public series: ItemSeries;
            public setVisible: PiePoint['setVisible'];
        }
        class ItemSeries extends PieSeries {
            public borderWidth?: number;
            public data: Array<ItemPoint>;
            public itemSize?: number;
            public options: ItemSeriesOptions;
            public pointClass: typeof ItemPoint;
            public points: Array<ItemPoint>;
            public slots?: Array<ItemGeometryObject>;
            public animate(init?: boolean): void;
            public drawDataLabels(): void;
            public drawPoints(): void;
            public getRows(): number;
            public getSlots(): (Array<ItemGeometryObject>|undefined);
            public translate(): void;
        }
        interface ItemPointOptions extends PiePointOptions {
        }
        interface ItemPointMarkerOptions extends PointMarkerOptionsObject {
            radius: undefined;
        }
        interface ItemRowObject {
            colCount: number;
            rowLength: number;
            rowRadius: number;
        }
        interface ItemGeometryObject extends GeometryObject {
            angle: number;
        }
        interface ItemRowContainerObject {
            angle: number;
            row: ItemRowObject;
        }
        interface ItemSeriesOptions extends PieSeriesOptions {
            crisp?: number;
            itemPadding?: number;
            layout?: string;
            marker?: ItemPointMarkerOptions;
            rows?: number;
            states?: SeriesStatesOptionsObject<ItemSeries>;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    defined,
    extend,
    isNumber,
    objectEach,
    pick
} = U;

import '../parts/Series.js';

var fireEvent = H.fireEvent,
    merge = H.merge,
    piePoint = H.seriesTypes.pie.prototype.pointClass.prototype;

/**
 * The item series type.
 *
 * @requires module:modules/item-series
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.item
 *
 * @augments Highcharts.seriesTypes.pie
 */
H.seriesType<Highcharts.ItemSeries>(
    'item',
    // Inherits pie as the most tested non-cartesian series with individual
    // point legend, tooltips etc. Only downside is we need to re-enable
    // marker options.
    'pie',
    /**
     * An item chart is an infographic chart where a number of items are laid
     * out in either a rectangular or circular pattern. It can be used to
     * visualize counts within a group, or for the circular pattern, typically
     * a parliament.
     *
     * The circular layout has much in common with a pie chart. Many of the item
     * series options, like `center`, `size` and data label positioning, are
     * inherited from the pie series and don't apply for rectangular layouts.
     *
     * @sample       highcharts/demo/parliament-chart
     *               Parliament chart (circular item chart)
     * @sample       highcharts/series-item/rectangular
     *               Rectangular item chart
     * @sample       highcharts/series-item/symbols
     *               Infographic with symbols
     *
     * @extends      plotOptions.pie
     * @since        7.1.0
     * @product      highcharts
     * @excluding    borderColor, borderWidth, depth, linecap, shadow,
     *               slicedOffset
     * @requires     modules/item-series
     * @optionparent plotOptions.item
     */
    {
        /**
         * In circular view, the end angle of the item layout, in degrees where
         * 0 is up.
         *
         * @sample highcharts/demo/parliament-chart
         *         Parliament chart
         * @type {undefined|number}
         */
        endAngle: void 0,
        /**
         * In circular view, the size of the inner diameter of the circle. Can
         * be a percentage or pixel value. Percentages are relative to the outer
         * perimeter. Pixel values are given as integers.
         *
         * If the `rows` option is set, it overrides the `innerSize` setting.
         *
         * @sample highcharts/demo/parliament-chart
         *         Parliament chart
         * @type {string|number}
         */
        innerSize: '40%',
        /**
         * The padding between the items, given in relative size where the size
         * of the item is 1.
         * @type {number}
         */
        itemPadding: 0.1,
        /**
         * The layout of the items in rectangular view. Can be either
         * `horizontal` or `vertical`.
         * @sample highcharts/series-item/symbols
         *         Horizontal layout
         * @type {string}
         */
        layout: 'vertical',
        /**
         * @extends plotOptions.series.marker
         */
        marker: merge(
            (H.defaultOptions.plotOptions as any).line.marker,
            {
                radius: null
            }
        ),
        /**
         * The number of rows to display in the rectangular or circular view. If
         * the `innerSize` is set, it will be overridden by the `rows` setting.
         *
         * @sample highcharts/series-item/rows-columns
         *         Fixed row count
         * @type {number}
         */
        rows: void 0,
        showInLegend: true,
        /**
         * In circular view, the start angle of the item layout, in degrees
         * where 0 is up.
         *
         * @sample highcharts/demo/parliament-chart
         *         Parliament chart
         * @type {undefined|number}
         */
        startAngle: void 0
    },
    // Prototype members
    {
        translate: function (this: Highcharts.ItemSeries): void {
            if (!this.slots) {
                this.slots = [];
            }
            if (
                isNumber(this.options.startAngle) &&
                isNumber(this.options.endAngle)
            ) {
                H.seriesTypes.pie.prototype.translate.call(this);
                this.slots = this.getSlots();
            } else {
                this.generatePoints();
                fireEvent(this, 'afterTranslate');
            }
        },

        // Get the semi-circular slots
        getSlots: function (
            this: Highcharts.ItemSeries
        ): (Array<Highcharts.ItemGeometryObject>|undefined) {
            var center = this.center,
                diameter = center[2],
                innerSize = center[3],
                row: number,
                slots = this.slots,
                x: number,
                y: number,
                rowRadius: number,
                rowLength: number,
                colCount: number,
                increment: number,
                angle: number,
                col: number,
                itemSize = 0,
                rowCount: number,
                fullAngle = (
                    (this.endAngleRad as any) - (this.startAngleRad as any)
                ),
                itemCount = Number.MAX_VALUE,
                finalItemCount: (number|undefined),
                rows: (Array<Highcharts.ItemRowObject>|undefined),
                testRows: (Array<Highcharts.ItemRowObject>|undefined),
                rowsOption = this.options.rows,
                // How many rows (arcs) should be used
                rowFraction = (diameter - innerSize) / diameter;

            // Increase the itemSize until we find the best fit
            while (itemCount > (this.total as any)) {

                finalItemCount = itemCount;

                // Reset
                (slots as any).length = 0;
                itemCount = 0;

                // Now rows is the last successful run
                rows = testRows;
                testRows = [];

                itemSize++;

                // Total number of rows (arcs) from the center to the
                // perimeter
                rowCount = diameter / itemSize / 2;

                if (rowsOption) {
                    innerSize = ((rowCount - rowsOption) / rowCount) * diameter;

                    if (innerSize >= 0) {
                        rowCount = rowsOption;

                    // If innerSize is negative, we are trying to set too
                    // many rows in the rows option, so fall back to
                    // treating it as innerSize 0
                    } else {
                        innerSize = 0;
                        rowFraction = 1;
                    }


                } else {
                    rowCount = Math.floor(rowCount * rowFraction);
                }

                for (row = rowCount; row > 0; row--) {
                    rowRadius = (innerSize + (row / rowCount) *
                        (diameter - innerSize - itemSize)) / 2;
                    rowLength = fullAngle * rowRadius;
                    colCount = Math.ceil(rowLength / itemSize);
                    testRows.push({
                        rowRadius: rowRadius,
                        rowLength: rowLength,
                        colCount: colCount
                    });

                    itemCount += colCount + 1;
                }
            }

            if (!rows) {
                return;
            }

            // We now have more slots than we have total items. Loop over
            // the rows and remove the last slot until the count is correct.
            // For each iteration we sort the last slot by the angle, and
            // remove those with the highest angles.
            var overshoot = (finalItemCount as any) - (this.total as any);
            /**
             * @private
             * @param {Highcharts.ItemRowContainerObject} item
             * Wrapped object with angle and row
             * @return {void}
             */
            function cutOffRow(item: Highcharts.ItemRowContainerObject): void {
                if (overshoot > 0) {
                    item.row.colCount--;
                    overshoot--;
                }
            }
            while (overshoot > 0) {
                rows
                    // Return a simplified representation of the angle of
                    // the last slot within each row.
                    .map(function (
                        row: Highcharts.ItemRowObject
                    ): Highcharts.ItemRowContainerObject {
                        return {
                            angle: row.colCount / row.rowLength,
                            row: row
                        };
                    })
                    // Sort by the angles...
                    .sort(function (
                        a: Highcharts.ItemRowContainerObject,
                        b: Highcharts.ItemRowContainerObject
                    ): number {
                        return b.angle - a.angle;
                    })
                    // ...so that we can ignore the items with the lowest
                    // angles...
                    .slice(
                        0,
                        Math.min(overshoot, Math.ceil(rows.length / 2))
                    )
                    // ...and remove the ones with the highest angles
                    .forEach(cutOffRow);
            }

            rows.forEach(function (row: Highcharts.ItemRowObject): void {
                var rowRadius = row.rowRadius,
                    colCount = row.colCount;
                increment = colCount ? fullAngle / colCount : 0;
                for (col = 0; col <= colCount; col += 1) {
                    angle = (this.startAngleRad as any) + col * increment;
                    x = center[0] + Math.cos(angle) * rowRadius;
                    y = center[1] + Math.sin(angle) * rowRadius;
                    (slots as any).push({ x: x, y: y, angle: angle });
                }
            }, this);

            // Sort by angle
            (slots as any).sort(function (
                a: Highcharts.ItemGeometryObject,
                b: Highcharts.ItemGeometryObject
            ): number {
                return a.angle - b.angle;
            });

            this.itemSize = itemSize;
            return slots;

        },

        getRows: function (this: Highcharts.ItemSeries): number {
            var rows = this.options.rows,
                cols: number,
                ratio: number;

            // Get the row count that gives the most square cells
            if (!rows) {
                ratio = this.chart.plotWidth / this.chart.plotHeight;
                rows = Math.sqrt(this.total as any);

                if (ratio > 1) {
                    rows = Math.ceil(rows);
                    while (rows > 0) {
                        cols = (this.total as any) / rows;
                        if (cols / rows > ratio) {
                            break;
                        }
                        rows--;
                    }
                } else {
                    rows = Math.floor(rows);
                    while (rows < (this.total as any)) {
                        cols = (this.total as any) / rows;
                        if (cols / rows < ratio) {
                            break;
                        }
                        rows++;
                    }
                }
            }
            return rows;
        },

        drawPoints: function (this: Highcharts.ItemSeries): void {
            var series = this,
                options = this.options,
                renderer = series.chart.renderer,
                seriesMarkerOptions: Highcharts.ItemPointMarkerOptions =
                    options.marker as any,
                borderWidth: number = this.borderWidth as any,
                crisp = borderWidth % 2 ? 0.5 : 1,
                i = 0,
                rows = this.getRows(),
                cols = Math.ceil((this.total as any) / rows),
                cellWidth = this.chart.plotWidth / cols,
                cellHeight = this.chart.plotHeight / rows,
                itemSize = this.itemSize || Math.min(cellWidth, cellHeight);

            /*
            this.slots.forEach(slot => {
                this.chart.renderer.circle(slot.x, slot.y, 6)
                    .attr({
                        fill: 'silver'
                    })
                    .add(this.group);
            });
            //*/

            this.points.forEach(function (point: Highcharts.ItemPoint): void {
                var attr: Highcharts.SVGAttributes,
                    graphics: Highcharts.Dictionary<Highcharts.SVGElement>,
                    pointAttr: (Highcharts.SVGAttributes|undefined),
                    pointMarkerOptions = point.marker || {},
                    symbol: string = (
                        pointMarkerOptions.symbol ||
                        (seriesMarkerOptions.symbol as any)
                    ),
                    r = pick(
                        pointMarkerOptions.radius,
                        seriesMarkerOptions.radius
                    ),
                    size = defined(r) ? 2 * r : itemSize,
                    padding = size * (options.itemPadding as any),
                    x: number,
                    y: number,
                    width: number,
                    height: number;

                point.graphics = graphics = point.graphics || {};

                if (!series.chart.styledMode) {
                    pointAttr = series.pointAttribs(
                        point,
                        (point.selected as any) && 'select'
                    );
                }

                if (!point.isNull && point.visible) {

                    if (!point.graphic) {
                        point.graphic = renderer.g('point')
                            .add(series.group);
                    }

                    for (var val = 0; val < (point.y as any); val++) {

                        // Semi-circle
                        if (series.center && series.slots) {

                            // Fill up the slots from left to right
                            var slot: Highcharts.ItemGeometryObject =
                                series.slots.shift() as any;
                            x = slot.x - itemSize / 2;
                            y = slot.y - itemSize / 2;

                        } else if (options.layout === 'horizontal') {
                            x = cellWidth * (i % cols);
                            y = cellHeight * Math.floor(i / cols);
                        } else {
                            x = cellWidth * Math.floor(i / rows);
                            y = cellHeight * (i % rows);
                        }

                        x += padding;
                        y += padding;
                        width = Math.round(size - 2 * padding);
                        height = width;

                        if (series.options.crisp) {
                            x = Math.round(x) - crisp;
                            y = Math.round(y) + crisp;
                        }
                        attr = {
                            x: x,
                            y: y,
                            width: width,
                            height: height
                        };
                        if (typeof r !== 'undefined') {
                            attr.r = r;
                        }


                        if (graphics[val]) {
                            graphics[val].animate(attr);
                        } else {
                            graphics[val] = renderer
                                .symbol(
                                    symbol,
                                    null as any,
                                    null as any,
                                    null as any,
                                    null as any,
                                    {
                                        backgroundSize: 'within'
                                    }
                                )
                                .attr(extend(attr, pointAttr as any))
                                .add(point.graphic);
                        }
                        graphics[val].isActive = true;


                        i++;
                    }
                }
                objectEach(graphics, function (
                    graphic: Highcharts.SVGElement,
                    key: string
                ): void {
                    if (!graphic.isActive) {
                        graphic.destroy();
                        delete graphics[key];
                    } else {
                        graphic.isActive = false;
                    }
                });
            });
        },
        drawDataLabels: function (this: Highcharts.ItemSeries): void {
            if (this.center && this.slots) {
                H.seriesTypes.pie.prototype.drawDataLabels.call(this);

            // else, it's just a dot chart with no natural place to put the
            // data labels
            } else {
                this.points.forEach(function (
                    point: Highcharts.ItemPoint
                ): void {
                    point.destroyElements({ dataLabel: 1 });
                });
            }
        },

        // Fade in the whole chart
        animate: function (this: Highcharts.ItemSeries, init?: boolean): void {
            if (init) {
                (this.group as any).attr({
                    opacity: 0
                });
            } else {
                (this.group as any).animate({
                    opacity: 1
                }, this.options.animation);
                this.animate = null as any;
            }
        }
    },
    // Point class
    {
        connectorShapes: piePoint.connectorShapes,
        getConnectorPath: piePoint.getConnectorPath,
        setVisible: piePoint.setVisible,
        getTranslate: piePoint.getTranslate
    }
);


/**
 * An `item` series. If the [type](#series.item.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.item
 * @excluding dataParser, dataURL, stack, xAxis, yAxis
 * @product   highcharts
 * @requires  modules/item-series
 * @apioption series.item
 */

/**
 * An array of data points for the series. For the `item` series type,
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
 *    [turboThreshold](#series.item.turboThreshold),
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
 * @extends   series.pie.data
 * @excludes  sliced
 * @product   highcharts
 * @apioption series.item.data
 */

/**
 * The sequential index of the data point in the legend.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.pie.data.legendIndex
 */

''; // adds the doclets above to the transpiled file
