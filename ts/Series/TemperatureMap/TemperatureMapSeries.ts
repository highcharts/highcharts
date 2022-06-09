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
    extend,
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

    public isPointInside(): boolean {
        return true;
    }

    public drawPoints(): void {
        const series = this,
            pointLength = series.points.length;

        let colors: any = series.options.colors || series.chart.options.colors,
            i: number;

        colors = colors.map(
            (color: ColorType | GradientColorStop, ii: number): any => {
                const maxSize2 =
                    relativeLength((series as any).options.maxSize, 100);
                const radiusFactor: number = ii / (colors.length - 1),
                    maxSize = (1 - radiusFactor) * maxSize2,
                    fillColor = {
                        radialGradient: {
                            cx: 0.5,
                            cy: 0.5,
                            r: 0.5
                        },
                        // TODO, refactor how the array is created.
                        // There is code that can be shared.
                        stops: (typeof color === 'string') ? [
                            [ii === colors.length - 1 ? 0 : 0.5, color],
                            [1, (new Color(color)).setOpacity(0).get('rgba')]
                        ] : [color, [1, new Color((color as any)[1])
                            .setOpacity(0).get('rgba')]]
                    };

                // Options from point level not supported - API says it should,
                // but visually is it useful at all?
                (series as any).options.marker.fillColor = fillColor;
                series.options.maxSize = maxSize;
                series.getRadii(); // recalc. radii
                series.translateBubble(); // use radii

                super.drawPoints.apply(series);

                i = 0;
                while (i < pointLength) {
                    const point = series.points[i];
                    let graphics: Array<SVGElementLike>;

                    point.graphics = graphics = point.graphics || [];

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
                            if (ii !== colors.length - 1) {
                                point.graphics.push(point.graphic);
                            }
                        }

                        // Don't reset point.graphic in the last iteration
                        if (ii !== colors.length - 1) {
                            point.graphic = void 0;
                        }
                    }

                    i++;
                }

                return {
                    maxSize,
                    fillColor
                };
            });

        // Clean up for animation (else the first color is as small as the last)
        if (series.options.marker) {
            series.options.marker.fillColor = colors[0].fillColor;
        }

        series.options.maxSize = colors[0].maxSize;
        series.getRadii(); // recalc. radii
        series.translateBubble(); // use radii

        // Change opacity of the whole series
        // this should be done in a better place
        series.group && series.group.attr({
            opacity: 0.75
        });
    }

    /* *
     *
     * Static properties
     *
     * */

    // public static compose = MapBubbleSeries.compose;

    public static defaultOptions: TemperatureMapSeriesOptions = MapBubbleSeries.defaultOptions;

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
    // type: string;
    // getProjectedBounds: typeof MapSeries.prototype['getProjectedBounds'];
    // pointArrayMap: Array<string>;
    // pointClass: typeof TemperatureMapPoint;
    // setData: typeof MapSeries.prototype['setData'];
    // processData: typeof MapSeries.prototype['processData'];
    // projectPoint: typeof MapPointSeries.prototype['projectPoint'];
    // setOptions: typeof MapSeries.prototype['setOptions'];
    // updateData: typeof MapSeries.prototype['updateData'];
    // xyFromShape: boolean;
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
