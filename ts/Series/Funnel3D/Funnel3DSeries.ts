/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Kacper Madej
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

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type Funnel3DSeriesOptions from './Funnel3DSeriesOptions';
import type SVGLabel from '../../Core/Renderer/SVG/SVGLabel';

import Funnel3DComposition from './Funnel3DComposition.js';
import Funnel3DSeriesDefaults from './Funnel3DSeriesDefaults.js';
import Funnel3DPoint from './Funnel3DPoint.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import Math3D from '../../Core/Math3D.js';
const { perspective } = Math3D;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The funnel3d series type.
 *
 * @class
 * @name Highcharts.seriesTypes.funnel3d
 * @augments seriesTypes.column
 * @requires highcharts-3d
 * @requires modules/cylinder
 * @requires modules/funnel3d
 */
class Funnel3DSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static compose = Funnel3DComposition.compose;
    public static defaultOptions: Funnel3DSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        Funnel3DSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public center: Array<number> = void 0 as any;

    public centerX?: number;

    public data: Array<Funnel3DPoint> = void 0 as any;

    public options: Funnel3DSeriesOptions = void 0 as any;

    public points: Array<Funnel3DPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public alignDataLabel(
        point: Funnel3DPoint,
        _dataLabel: SVGLabel,
        options: DataLabelOptions
    ): void {
        const series = this,
            dlBoxRaw = point.dlBoxRaw,
            inverted = series.chart.inverted,
            below = (point.plotY as any) > pick(
                series.translatedThreshold,
                series.yAxis.len
            ),
            inside = pick(options.inside, !!series.options.stacking),
            dlBox: BBoxObject = {
                x: dlBoxRaw.x,
                y: dlBoxRaw.y,
                height: 0
            } as any;

        options.align = pick(
            options.align,
            !inverted || inside ? 'center' : below ? 'right' : 'left'
        );
        options.verticalAlign = pick(
            options.verticalAlign,
            inverted || inside ? 'middle' : below ? 'top' : 'bottom'
        );

        if (options.verticalAlign !== 'top') {
            dlBox.y += dlBoxRaw.bottom /
                (options.verticalAlign === 'bottom' ? 1 : 2);
        }

        dlBox.width = series.getWidthAt(dlBox.y);

        if (series.options.reversed) {
            dlBox.width = dlBoxRaw.fullWidth - dlBox.width;
        }

        if (inside) {
            dlBox.x -= dlBox.width / 2;
        } else {
            // swap for inside
            if (options.align === 'left') {
                options.align = 'right';
                dlBox.x -= dlBox.width * 1.5;
            } else if (options.align === 'right') {
                options.align = 'left';
                dlBox.x += dlBox.width / 2;
            } else {
                dlBox.x -= dlBox.width / 2;
            }
        }

        point.dlBox = dlBox;
        ColumnSeries.prototype.alignDataLabel.apply(
            series,
            arguments
        );
    }

    /**
     * Override default axis options with series required options for axes.
     * @private
     */
    public bindAxes(): void {
        Series.prototype.bindAxes.apply(this, arguments);

        extend(this.xAxis.options, {
            gridLineWidth: 0,
            lineWidth: 0,
            title: void 0,
            tickPositions: []
        });
        merge(true, this.yAxis.options, {
            gridLineWidth: 0,
            title: void 0,
            labels: {
                enabled: false
            }
        });
    }

    /**
     * @private
     */
    public translate(): void {
        Series.prototype.translate.apply(this, arguments);

        const series = this,
            chart = series.chart,
            options = series.options,
            reversed = options.reversed,
            ignoreHiddenPoint = options.ignoreHiddenPoint,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            center: Array<(number|string)> = options.center as any,
            centerX = relativeLength(center[0], plotWidth),
            centerY = relativeLength(center[1], plotHeight),
            width = relativeLength(options.width as any, plotWidth),
            height = relativeLength(options.height as any, plotHeight),
            neckWidth = relativeLength(options.neckWidth as any, plotWidth),
            neckHeight = relativeLength(
                options.neckHeight as any,
                plotHeight
            ),
            neckY = (centerY - height / 2) + height - neckHeight,
            data = series.data;

        let sum = 0,
            cumulative = 0, // start at top
            tempWidth,
            getWidthAt: (y: number) => number,
            fraction,
            tooltipPos,
            //
            y1: number,
            y3: number,
            y5: (number|null),
            //
            h: number,
            shapeArgs: any; // @todo: Type it. It's an extended SVGAttributes.

        // Return the width at a specific y coordinate
        series.getWidthAt = getWidthAt = function (y: number): number {
            const top = (centerY - height / 2);

            return (y > neckY || height === neckHeight) ?
                neckWidth :
                neckWidth + (width - neckWidth) *
                    (1 - (y - top) / (height - neckHeight));
        };

        // Expose
        series.center = [centerX, centerY, height];
        series.centerX = centerX;

        /*
            * Individual point coordinate naming:
            *
            *  _________centerX,y1________
            *  \                         /
            *   \                       /
            *    \                     /
            *     \                   /
            *      \                 /
            *        ___centerX,y3___
            *
            * Additional for the base of the neck:
            *
            *       |               |
            *       |               |
            *       |               |
            *        ___centerX,y5___
            */

        // get the total sum
        for (const point of data) {
            if (!ignoreHiddenPoint || point.visible !== false) {
                sum += point.y;
            }
        }

        for (const point of data) {
            // set start and end positions
            y5 = null;
            fraction = sum ? point.y / sum : 0;
            y1 = centerY - height / 2 + cumulative * height;
            y3 = y1 + fraction * height;
            tempWidth = getWidthAt(y1);
            h = y3 - y1;
            shapeArgs = {
                // for fill setter
                gradientForSides: pick(
                    point.options.gradientForSides,
                    options.gradientForSides
                ),

                x: centerX,
                y: y1,
                height: h,
                width: tempWidth,
                z: 1,
                top: {
                    width: tempWidth
                }
            };
            tempWidth = getWidthAt(y3);
            shapeArgs.bottom = {
                fraction: fraction,
                width: tempWidth
            };

            // the entire point is within the neck
            if (y1 >= neckY) {
                shapeArgs.isCylinder = true;
            } else if (y3 > neckY) {
                // the base of the neck
                y5 = y3;
                tempWidth = getWidthAt(neckY);
                y3 = neckY;

                shapeArgs.bottom.width = tempWidth;
                shapeArgs.middle = {
                    fraction: h ? (neckY - y1) / h : 0,
                    width: tempWidth
                };
            }

            if (reversed) {
                shapeArgs.y = y1 = centerY + height / 2 -
                    (cumulative + fraction) * height;

                if (shapeArgs.middle) {
                    shapeArgs.middle.fraction = 1 -
                        (h ? shapeArgs.middle.fraction : 0);
                }
                tempWidth = shapeArgs.width;
                shapeArgs.width = shapeArgs.bottom.width;
                shapeArgs.bottom.width = tempWidth;
            }
            point.shapeArgs = extend(point.shapeArgs, shapeArgs);

            // for tooltips and data labels context
            point.percentage = fraction * 100;
            point.plotX = centerX;

            if (reversed) {
                point.plotY = centerY + height / 2 -
                    (cumulative + fraction / 2) * height;
            } else {
                point.plotY = (y1 + (y5 || y3)) / 2;
            }

            // Placement of tooltips and data labels in 3D
            tooltipPos = perspective([{
                x: centerX,
                y: point.plotY,
                z: reversed ?
                    -(width - getWidthAt(point.plotY)) / 2 :
                    -(getWidthAt(point.plotY)) / 2
            }], chart, true)[0];
            point.tooltipPos = [tooltipPos.x, tooltipPos.y];

            // base to be used when alignment options are known
            point.dlBoxRaw = {
                x: centerX,
                width: getWidthAt(point.plotY),

                y: y1,
                bottom: shapeArgs.height || 0,

                fullWidth: width
            };

            if (!ignoreHiddenPoint || point.visible !== false) {
                cumulative += fraction;
            }
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface Funnel3DSeries {
    getWidthAt(y: number): number; // added during translate
    pointClass: typeof Funnel3DPoint;
    translate3dShapes(): void;
}
extend(Funnel3DSeries.prototype, {
    pointClass: Funnel3DPoint,
    translate3dShapes: noop
});

/* *
 *
 *  Registration
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        funnel3d: typeof Funnel3DSeries;
    }
}

SeriesRegistry.registerSeriesType('funnel3d', Funnel3DSeries);

/* *
 *
 *  Default Export
 *
 * */

export default Funnel3DSeries;
