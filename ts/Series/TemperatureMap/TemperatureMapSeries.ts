/* *
 *
 *  (c) 2010-2022 Rafal Sebestjanski
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
import ColorType from '../../Core/Color/ColorType';
import MapBubbleSeries from '../MapBubble/MapBubbleSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
import TemperatureMapPoint from './TemperatureMapPoint.js';
import U from '../../Core/Utilities.js';

const {
    correctFloat,
    extend,
    isArray,
    isNumber,
    merge,
    pick
} = U;

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

    /**
     * A temperature series is a special case of the bubble series where
     * multiple bubbles with different colors make one point. Multiple points
     * can represent a temperature map or e.g. density.
     *
     * @sample maps/demo/temperaturemap
     *         Temperature map chart
     *
     * @extends      plotOptions.mapbubble
     * @product      highmaps
     * @excluding    allowPointSelect, lineColor, lineWidth
     * @optionparent plotOptions.temperaturemap
     */
    public static defaultOptions: TemperatureMapSeriesOptions = merge(
        MapBubbleSeries.defaultOptions,
        {
            marker: {
                lineWidth: 0
            },
            maxSize: 100,
            minSize: 20,
            opacity: 0.75,
            /**
             * States for a single point marker.
             *
             * @excluding hover, select
             */
            states: {
                hover: {
                    enabled: false
                }
            },
            /**
             * Set of colors for each point. Can be an array of strings (if 3
             * colors defined, every next marker is 33.3% smaller) or an array
             * of color stops (e.g. for `[[0.2, '#ff0000'], [1, '#0000ff']]`
             * the smallest top marker is 5 times smaller than the biggest
             * bottom one).
             *
             * @sample maps/plotoptions/temperaturemap-themes
             *         Temperature colors themes
             * @sample maps/plotoptions/temperaturemap-color-steps
             *         Temperature colors with steps
             *
             * @default ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff"]
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

    /**
     *
     *  Functions
     *
     */

    /**
     * @private
     */
    public isPointInside(): true {
        // Do not hide cut bubbles outside the plot area
        return true;
    }

    /**
     * @private
     */
    public getPxExtremes(): {
        minPxSize: number,
        maxPxSize: number
    } {
        const ret = super.getPxExtremes.apply(this),
            temperatureColors = this.options.temperatureColors,
            sizeFactor = this.sizeFactor || (1 / temperatureColors.length);

        // Recalculate minPxSize to draw smaller bubbles
        if (this.adjustMinSize) { // only when necessary
            ret.minPxSize = ret.minPxSize * sizeFactor;
        }

        return ret;
    }

    /**
     * Calculate radius of bubbles based on index of the color in the
     * `series.temperatureColors` array.
     * @private
     */
    public getRadius(
        zMin: number,
        zMax: number,
        minSize: number,
        maxSize: number,
        value: number | null | undefined,
        yValue?: number | null
    ): number | null {
        const temperatureColors = this.options.temperatureColors,
            colorIndex = this.temperatureColorIndex || 0;

        let ret = super.getRadius.apply(
            this,
            [zMin, zMax, minSize, maxSize, value, yValue]
        );

        if (!isNumber(ret)) {
            return ret;
        }

        ret *= this.sizeFactor ?
            this.sizeFactor :
            1 - colorIndex / temperatureColors.length;

        // Ceiling like in the bubble series - solves decimal issues and rounds
        // to 1px
        return Math.ceil(correctFloat(ret) * 2) / 2;
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
            this.options.temperatureColors.forEach((_, i: number): void => {
                this.points.forEach((point): void => {
                    const graphic = point.graphics[i];

                    if (
                        graphic &&
                        graphic.width // URL symbols don't have width
                    ) {
                        // Save the real bubble size
                        const size = {
                            width: graphic.width,
                            height: graphic.height,
                            x: (point.plotX || 0) - graphic.width / 2,
                            y: (point.plotY || 0) - graphic.height / 2
                        };

                        // Make the bubble small, prepare for size animation
                        if (!this.hasRendered) {
                            graphic.attr({
                                x: point.plotX,
                                y: point.plotY,
                                width: 1,
                                height: 1
                            });
                        }

                        // Run animation from 1x1 to a real size
                        graphic.animate(size, this.options.animation);
                    }
                });
            });
        }
    }

    /**
     * Draw all the bubbles
     * @private
     */
    public drawPoints(): void {
        const series = this,
            options = series.options,
            temperatureColors = series.options.temperatureColors
                .slice().reverse(); // loop form backward (easier calculations)

        temperatureColors.forEach((
            color: ColorType|[number, ColorType],
            colorIndex: number
        ): void => {
            // Save size factor for further calculations
            if (isArray(color)) { // if stops defined
                series.sizeFactor = color[0];

                color = color[1];
            } else { // If size decreases evenly
                series.temperatureColorIndex = colorIndex;
            }

            const colorsLength = temperatureColors.length,
                fillColor = {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.5,
                        r: 0.5
                    },
                    stops: [
                        [colorIndex === colorsLength - 1 ? 0 : 0.5, color],
                        [1, (new Color(color)).setOpacity(0).get('rgba')]
                    ]
                };

            options.marker = merge(options.marker, { fillColor });

            series.getRadii(); // recalculate radii

            series.adjustMinSize = true; // recalculate minPxSize only here
            series.translateBubble(); // use radii
            series.adjustMinSize = false; // reset

            if (options.marker.enabled !== false || series._hasPointMarkers) {
                const points = series.points,
                    chart = series.chart,
                    markerGroup = (
                        (series as any)[series.specialGroup as any] ||
                        series.markerGroup
                    );

                points.forEach((point): void => {
                    point.graphics = point.graphics || [];

                    let graphic = point.graphics[colorIndex];

                    const pointMarkerOptions = point.marker || {},
                        hasPointMarker = !!point.marker,
                        verb = graphic ? 'animate' : 'attr',
                        shouldDrawMarker = (
                            (
                                (options.marker || {}).enabled &&
                                typeof pointMarkerOptions.enabled ===
                                    'undefined'
                            ) || pointMarkerOptions.enabled
                        ) &&
                        !point.isNull &&
                        point.visible !== false &&
                        // Above zThreshold
                        (point.options as any).z >= (this.options.zMin || 0);

                    if (shouldDrawMarker) {
                        const symbol = pick(
                                pointMarkerOptions.symbol,
                                series.symbol,
                                'rect' as SymbolKey
                            ),
                            markerAttribs = series.markerAttribs(
                                point,
                                point.selected ? 'select' : void 0
                            );

                        if (graphic) { // if exists
                            // Update
                            graphic.animate(markerAttribs);
                        } else if ( // if doesn't exist yet
                            (markerAttribs.width || 0) > 0 ||
                            point.hasImage
                        ) {
                            // Create
                            graphic = chart.renderer
                                .symbol(
                                    symbol,
                                    markerAttribs.x,
                                    markerAttribs.y,
                                    markerAttribs.width,
                                    markerAttribs.height,
                                    hasPointMarker ?
                                        pointMarkerOptions :
                                        options.marker
                                )
                                .add(markerGroup);

                            (graphic.element as any).point = point;

                            point.graphics.push(graphic);
                        }

                        if (graphic) {
                            if (!chart.styledMode) {
                                const pointAttribs = series.pointAttribs(
                                        point,
                                        point.selected ? 'select' : void 0
                                    ),
                                    attribs = merge(
                                        pointAttribs,
                                        verb === 'animate' ?
                                            markerAttribs :
                                            {},
                                        { zIndex: colorIndex }
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
                });
            }
        });

        // Set color for legend item marker
        if (options.marker) {
            options.marker.fillColor = series.color;
        }
    }

    /* *
     *
     * Properties
     *
     * */

    public data: Array<TemperatureMapPoint> = void 0 as any;
    public options: TemperatureMapSeriesOptions = void 0 as any;
    public points: Array<TemperatureMapPoint> = void 0 as any;

}

interface TemperatureMapSeries {
    adjustMinSize: boolean;
    sizeFactor?: number;
    temperatureColorIndex?: number;
    temperatureColors: [ColorType|[number, ColorType]];
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

/**
 * A `temperaturemap` series. If the [type](#series.temperaturemap.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.temperaturemap
 * @excluding allAreas, allowPointSelect, boostBlending, boostThreshold,
 *            borderColor, borderWidth, dataParser, dataURL, dragDrop,
 *            lineColor, lineWidth
 * @product   highmaps
 * @apioption series.temperaturemap
 */

/**
 * States for a single point marker.
 *
 * @product   highmaps
 * @excluding hover, select
 * @apioption series.temperaturemap.states
 */

''; // adds doclets above to transpiled file
