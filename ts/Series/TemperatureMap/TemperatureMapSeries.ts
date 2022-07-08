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
import { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
const {
    correctFloat,
    extend,
    isArray,
    isNumber,
    merge,
    pick
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
            states: {
                hover: {
                    enabled: false
                },
                normal: {
                    enabled: false
                }
            },
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
            ret = (ret || 0) * (correctFloat(
                1 - colorIndex / temperatureColors.length
            ));
        }

        return ret;
    }

    /**
     * Perform animation on the bubbles
     * @private
     */
    public animate(init?: boolean): void {
        if (
            !init &&
            this.points.length < (this.options.animationLimit as any) // #8099
        ) {
            (this.options as any).temperatureColors.forEach(
                (color: any, i: number): void => {
                    this.points.forEach((point): void => {
                        const graphic = point.graphics[i];

                        if (
                            graphic &&
                            graphic.width // URL symbols don't have width
                        ) {
                            const size = {
                                width: graphic.width,
                                height: graphic.height,
                                x: (point.plotX || 0) - graphic.width / 2,
                                y: (point.plotY || 0) - graphic.height / 2
                            };

                            // Start values
                            if (!this.hasRendered) {
                                graphic.attr({
                                    x: point.plotX,
                                    y: point.plotY,
                                    width: 1,
                                    height: 1
                                });
                            }

                            // Run animation
                            graphic.animate(
                                size,
                                this.options.animation
                            );
                        }
                    });
                });
        }
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

                const points = series.points,
                    chart = series.chart,
                    seriesMarkerOptions = options.marker,
                    markerGroup = (
                        (series as any)[series.specialGroup as any] ||
                        series.markerGroup
                    );

                let i,
                    point,
                    graphic,
                    verb,
                    pointMarkerOptions,
                    hasPointMarker,
                    markerAttribs;

                this.temperatureColorIndex = null;

                if (
                    (seriesMarkerOptions as any).enabled !== false ||
                    series._hasPointMarkers
                ) {

                    for (i = 0; i < points.length; i++) {
                        point = points[i];
                        point.graphics = point.graphics || [];
                        graphic = point.graphics[ii];
                        verb = graphic ? 'animate' : 'attr';
                        pointMarkerOptions = point.marker || {};
                        hasPointMarker = !!point.marker;

                        const shouldDrawMarker = (
                            (
                                (seriesMarkerOptions as any).enabled &&
                                typeof pointMarkerOptions.enabled ===
                                    'undefined'
                            ) || pointMarkerOptions.enabled
                        ) && !point.isNull && point.visible !== false;

                        if (shouldDrawMarker) {
                            // Shortcuts
                            const symbol = pick(
                                pointMarkerOptions.symbol,
                                series.symbol,
                                'rect' as SymbolKey
                            );

                            markerAttribs = series.markerAttribs(
                                point,
                                (point.selected && 'select') as any
                            );

                            if (graphic) { // update
                                graphic.animate(markerAttribs);
                            } else if (
                                (markerAttribs.width || 0) > 0 ||
                                point.hasImage
                            ) {
                                graphic = chart.renderer
                                    .symbol(
                                        symbol,
                                        markerAttribs.x,
                                        markerAttribs.y,
                                        markerAttribs.width,
                                        markerAttribs.height,
                                        hasPointMarker ?
                                            pointMarkerOptions :
                                            seriesMarkerOptions
                                    )
                                    .add(markerGroup);

                                (graphic.element as any).point = point;

                                point.graphics.push(graphic);
                            }

                            if (graphic) {
                                if (!chart.styledMode) {
                                    const pointAttribs = series.pointAttribs(
                                            point,
                                            (point.selected && 'select') as any
                                        ),
                                        attribs = merge(
                                            pointAttribs,
                                            verb === 'animate' ?
                                                markerAttribs :
                                                {},
                                            { zIndex: ii }
                                        );

                                    graphic[verb](attribs);
                                } else {
                                    if (verb === 'animate') {
                                        graphic.animate(markerAttribs);
                                    }
                                }

                                graphic.addClass(point.getClassName(), true);
                            }

                        }
                    }
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
