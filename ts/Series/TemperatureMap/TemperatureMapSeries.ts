/* *
 *
 *  (c) 2010-2021
 *  Rafal Sebestjanski, Piotr Madej, Askel Eirik Johansson
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *  Imports
 *
 * */

import type TemperatureMapSeriesOptions from './TemperatureMapSeriesOptions';

import Color from '../../Core/Color/Color.js';
import MapBubbleSeries from '../MapBubble/MapBubbleSeries.js';
import TemperatureMapPoint from './TemperatureMapPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import GradientColorStop from '../../Core/Color/GradientColor';

// const {
//     seriesTypes: {
//         mapbubble: MapBubbleSeries
//     }
// } = SeriesRegistry;
import U from '../../Core/Utilities.js';
import ColorType from '../../Core/Color/ColorType';
import SVGElementLike from '../../Core/Renderer/SVG/SVGElementLike';
const {
    correctFloat,
    defined,
    extend,
    isArray,
    isNumber,
    merge,
    relativeLength
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {

    }
}

/**
 * The temperaturemap series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.temperaturemap
 *
 * @augments Highcharts.Series
 */
class TemperatureMapSeries extends MapBubbleSeries {

    /* *
     *
     * Static properties
     *
     * */

    public static defaultOptions: TemperatureMapSeriesOptions = merge(
        MapBubbleSeries.defaultOptions,
        {
            marker: {
                lineColor: 'transparent'
            },
            maxSize: 100,
            minSize: 20,
            opacity: 0.75,
            /**
             * TO DO: add a description
             *
             * TO DO: Add a sample
             * @sample highcharts/demo/parliament-chart
             *         Parliament chart
             * @type {Array<ColorType>}
             */
            temperatureColors: [
                '#ff0000',
                '#ffff00',
                '#00ff00',
                '#00ffff',
                '#0000ff'
            ]
        }
    );

    public isPointInside(): boolean {
        return true;
    }

    public getPxExtremes(): {
        minPxSize: number,
        maxPxSize: number
    } {
        const ret = super.getPxExtremes.apply(this),
            temperatureColors = this.options.temperatureColors,
            colorStop = this.colorStop;

        let sizeFactor: number = colorStop || (1 / temperatureColors.length);

        // Recalculate minPxSize only when translating, not when calculating
        // radii
        if (this.adjustMinSize) {
            ret.minPxSize = ret.minPxSize * sizeFactor;
        }

        if (temperatureColors && temperatureColors.length && !colorStop) {
            // ret.maxPxSize = Math.max(
            //     this.getPxSize(this.options.maxSize),
            //     ret.minPxSize
            // );
        }

        return ret;
    }

    public getRadius(
        zMin: number,
        zMax: number,
        minSize: number,
        maxSize: number,
        value: number | null | undefined,
        yValue?: number | null
    ): number | null {
        const temperatureColors = this.options.temperatureColors,
            colorIndex = this.temperatureColorIndex,
            colorStop = this.colorStop;

        let ret = super.getRadius.apply(
            this,
            [zMin, zMax, minSize, maxSize, value, yValue]
        );

        if (isNumber(colorStop)) {
            ret = (ret || 0) * colorStop;
        } else if (temperatureColors && isNumber(colorIndex)) {
            ret = (ret || 0) * (
                correctFloat(1 - colorIndex / temperatureColors.length)
            );
        }

        return ret;
    }

    public drawPoints(): void {
        const series = this,
            pointLength = series.points.length;

        // QUESTION: Why colors from chart.options?
        // let temperatureColors: any = series.options.temperatureColors ||
        // series.chart.options.temperatureColors,
        let temperatureColors: any =
            series.options.temperatureColors.slice().reverse(),
            i: number;

        const colorsLength = temperatureColors.length;
        const options: any = series.options;

        temperatureColors = temperatureColors.forEach(
            (color: ColorType | GradientColorStop | any, ii: number): void => {
                if (isArray(color)) {
                    (this as any).colorStop = color[0];
                }

                color = typeof color === 'string' ? color : color[1];

                const fillColor = {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.5,
                        r: 0.5
                    },
                    // TODO, refactor how the array is created.
                    // There is code that can be shared.
                    stops: [
                        [ii === colorsLength - 1 ? 0 : 0.5, color],
                        [1, (new Color(color)).setOpacity(0).get('rgba')]
                    ]
                };

                // Options from point level not supported - API says it should,
                // but visually is it useful at all?
                options.marker.fillColor = fillColor;

                this.temperatureColorIndex = ii;

                series.getRadii(); // recalc. radii

                series.adjustMinSize = true;
                series.translateBubble(); // use radii
                series.adjustMinSize = false;

                super.drawPoints.apply(series);

                this.temperatureColorIndex = null;

                i = 0;
                while (i < pointLength) {
                    const point = series.points[i];

                    point.graphics = point.graphics || [];

                    if (point && point.graphic && point.visible) {
                        if (point.graphics[ii]) {
                            point.graphics[ii].destroy();
                            point.graphic.attr({
                                zIndex: ii
                            });
                            point.graphics[ii] = point.graphic;
                        } else {
                            point.graphic.attr({
                                zIndex: ii
                            });

                            // Last graphic will be as point.graphic instead of
                            // in the point.graphics array
                            if (ii !== colorsLength - 1) {
                                point.graphics.push(point.graphic);
                            }
                        }

                        // Don't reset point.graphic in the last iteration
                        if (ii !== colorsLength - 1) {
                            point.graphic = void 0;
                        }
                    }

                    i++;
                }
            });

        // Set color for legend item marker
        if (options.marker) {
            options.marker.fillColor = series.color;
        }

        // series.options.maxSize = temperatureColors[0].size;
        // series.getRadii(); // recalc. radii
        // series.translateBubble(); // use radii
    }

    /* *
     *
     * Properties
     *
     * */

    public data: Array<TemperatureMapPoint> = void 0 as any;
    public options: TemperatureMapSeriesOptions = void 0 as any;
    public points: Array<TemperatureMapPoint> = void 0 as any;


    /**
     *
     *  Functions
     *
     */


}

/* *
 *
 *  Prototype properties
 *
 * */

interface TemperatureMapSeries {
    colorStop: number;
    adjustMinSize: boolean;
    temperatureColorIndex: null|number;
}

/* *
 *
 *  Prototype properties
 *
 * */

interface TemperatureMapSeries {
    pointClass: typeof TemperatureMapPoint;
}
extend(TemperatureMapSeries.prototype, {
    pointClass: TemperatureMapPoint,
    isPointInside: TemperatureMapSeries.prototype.isPointInside
});

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        temperaturemap: typeof TemperatureMapSeries;
    }
}

SeriesRegistry.registerSeriesType('temperaturemap', TemperatureMapSeries);

/* *
 *
 *  Default export
 *
 * */

export default TemperatureMapSeries;

/* *
 *
 *  API options
 *
 * */

''; // adds doclets above to transpiled file
