/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    AnimationStepCallbackFunction
} from '../../Core/Animation/AnimationOptions';
import type GeoHeatmapSeriesOptions from './GeoHeatmapSeriesOptions.js';
import type { InterpolationObject } from './GeoHeatmapSeriesOptions.js';
import type MapView from '../../Maps/MapView.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import {
    animObject,
    stop
} from '../../Core/Animation/AnimationUtilities.js';
import GeoHeatmapPoint from './GeoHeatmapPoint.js';
import GeoHeatmapSeriesDefaults from './GeoHeatmapSeriesDefaults.js';
import H from '../../Core/Globals.js';
const {
    noop
} = H;
import IU from '../InterpolationUtilities.js';
const {
    colorFromPoint,
    getContext
} = IU;
import Point from '../../Core/Series/Point.js';
import PointerEvent from '../../Core/PointerEvent.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        map: MapSeries
    }
} = SeriesRegistry;
import {
    addEvent,
    extend,
    isNumber,
    isObject,
    merge,
    pick
} from '../../Shared/Utilities.js';
import { error } from '../../Core/Utilities.js';

/**
 * Normalize longitude value to -180:180 range.
 * @internal
 */
function normalizeLonValue(lon: number): number {
    return lon - Math.floor((lon + 180) / 360) * 360;
}

/**
 * Get proper point's position for PixelData array.
 * @internal
 */
function scaledPointPos(
    lon: number,
    lat: number,
    canvasWidth: number,
    canvasHeight: number,
    colsize: number,
    rowsize: number
): number {
    return Math.ceil(
        (canvasWidth * (canvasHeight - 1 - (lat + 90) / rowsize)) +
        ((lon + 180) / colsize)
    );
}

/* *
 *
 *  Class
 *
 * */

/**
 * The Geo Heatmap series type.
 *
 * @internal
 * @class
 * @name Highcharts.seriesTypes.geoheatmap
 *
 * @augments Highcharts.Series
 */

class GeoHeatmapSeries extends MapSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: GeoHeatmapSeriesOptions =
        merge(MapSeries.defaultOptions, GeoHeatmapSeriesDefaults);

    /* *
     *
     *  Properties
     *
     * */

    public options!: GeoHeatmapSeriesOptions;

    public data!: Array<GeoHeatmapPoint>;

    public points!: Array<GeoHeatmapPoint>;

    public canvas?: HTMLCanvasElement;

    public context?: CanvasRenderingContext2D;

    public isDirtyCanvas: boolean = true;

    /* *
     *
     *  Functions
     *
     * */


    /**
     * For updated colsize and rowsize options
     * @internal
     */
    public update(): void {
        const series = this;

        series.options = merge(series.options, arguments[0]);
        if (series.getInterpolation().enabled) {
            series.isDirtyCanvas = true;

            series.points.forEach((point): void => {
                if (point.graphic) {
                    point.graphic.destroy();
                    delete point.graphic;
                }
            });
        }
        super.update.apply(series, arguments);
    }

    /**
     * Override translate method to not fire if not needed.
     * @internal
     */
    public translate(): void {
        if (
            this.getInterpolation().enabled &&
            this.image &&
            !this.isDirty &&
            !this.isDirtyData
        ) {
            return;
        }
        super.translate.apply(this, arguments);
    }

    /**
     * Create the extended object out of the boolean
     * @internal
     */
    public getInterpolation(): InterpolationObject {
        if (!isObject(this.options.interpolation)) {
            return {
                blur: 1,
                enabled: this.options.interpolation
            };
        }
        return this.options.interpolation;
    }

    /**
     * Overriding drawPoints original method to apply new features.
     * @internal
     */
    public drawPoints(): void {
        const
            series = this,
            chart = series.chart,
            mapView = chart.mapView,
            seriesOptions = series.options;

        if (series.getInterpolation().enabled && mapView && series.bounds) {
            const ctx = series.context || getContext(series),
                {
                    canvas,
                    colorAxis,
                    image,
                    chart,
                    points
                } = series,
                [colsize, rowsize] = [
                    pick(seriesOptions.colsize, 1),
                    pick(seriesOptions.rowsize, 1)
                ],
                // Calculate dimensions based on series bounds
                topLeft = mapView.projectedUnitsToPixels({
                    x: series.bounds.x1,
                    y: series.bounds.y2
                }),
                bottomRight = mapView.projectedUnitsToPixels({
                    x: series.bounds.x2,
                    y: series.bounds.y1
                });

            if (canvas && ctx && colorAxis && topLeft && bottomRight) {
                const
                    { x, y } = topLeft,
                    width = bottomRight.x - x,
                    height = bottomRight.y - y,
                    dimensions = {
                        x,
                        y,
                        width,
                        height
                    };

                if (
                    // Do not calculate new canvas if not necessary
                    series.isDirtyCanvas ||
                    // Calculate new canvas if data is dirty
                    series.isDirtyData ||
                    // Always calculate new canvas for Orthographic projection
                    mapView.projection.options.name === 'Orthographic'
                ) {
                    const canvasWidth = canvas.width = ~~(360 / colsize) + 1,
                        canvasHeight = canvas.height = ~~(180 / rowsize) + 1,
                        canvasArea = canvasWidth * canvasHeight,
                        pixelData = new Uint8ClampedArray(canvasArea * 4),
                        // Guess if we have to round lon/lat with this data
                        { lat = 0, lon = 0 } = points[0].options,
                        unEvenLon = lon % rowsize !== 0,
                        unEvenLat = lat % colsize !== 0,
                        getAdjustedLon = (
                            unEvenLon ?
                                (lon: number): number => (
                                    Math.round(lon / rowsize) * rowsize
                                ) :
                                (lon: number): number => lon
                        ),
                        getAdjustedLat = (
                            unEvenLat ?
                                (lat: number): number => (
                                    Math.round(lat / colsize) * colsize
                                ) :
                                (lat: number): number => lat
                        ),
                        pointsLen = points.length;

                    if (unEvenLon || unEvenLat) {
                        error(
                            'Highcharts Warning: For best performance,' +
                            ' lon/lat datapoints should spaced by a single ' +
                            'colsize/rowsize',
                            false,
                            series.chart,
                            {
                                colsize: String(colsize),
                                rowsize: String(rowsize)
                            }
                        );
                    }

                    // Needed for tooltip
                    series.directTouch = false;
                    series.isDirtyCanvas = true;

                    // First pixelData represents the geo coordinates
                    for (let i = 0; i < pointsLen; i++) {
                        const p = points[i],
                            { lon, lat } = p.options;
                        if (isNumber(lon) && isNumber(lat)) {
                            pixelData.set(
                                colorFromPoint(p.value, p),
                                scaledPointPos(
                                    getAdjustedLon(lon),
                                    getAdjustedLat(lat),
                                    canvasWidth,
                                    canvasHeight,
                                    colsize,
                                    rowsize
                                ) * 4
                            );
                        }
                    }

                    const blur = series.getInterpolation().blur,
                        blurFactor = blur === 0 ? 1 : blur * 11,
                        upscaledWidth = ~~(canvasWidth * blurFactor),
                        upscaledHeight = ~~(canvasHeight * blurFactor),
                        projectedWidth = ~~width,
                        projectedHeight = ~~height,
                        img =
                            new ImageData(pixelData, canvasWidth, canvasHeight);

                    canvas.width = upscaledWidth;
                    canvas.height = upscaledHeight;

                    // Next step is to upscale pixelData to big image to get
                    // the blur on the interpolation
                    ctx.putImageData(img, 0, 0);
                    // Now we have an unscaled version of our ImageData
                    // let's make the compositing mode to 'copy' so that
                    // our next drawing op erases whatever was there
                    // previously just like putImageData would have done
                    ctx.globalCompositeOperation = 'copy';
                    // Now we can draw ourself over ourself
                    ctx.drawImage(
                        canvas,
                        0, 0, img.width, img.height, // Grab the ImageData
                        0, 0, upscaledWidth, upscaledHeight // Scale it
                    );

                    // Add projection to upscaled ImageData
                    const
                        projectedPixelData = this.getProjectedImageData(
                            mapView,
                            projectedWidth,
                            projectedHeight,
                            ctx.getImageData(
                                0, 0, upscaledWidth, upscaledHeight
                            ),
                            canvas,
                            x,
                            y
                        );

                    canvas.width = projectedWidth;
                    canvas.height = projectedHeight;

                    ctx.putImageData(
                        new ImageData(
                            projectedPixelData as ImageDataArray,
                            projectedWidth,
                            projectedHeight
                        ),
                        0,
                        0
                    );
                }

                if (image) {
                    if (chart.renderer.globalAnimation && chart.hasRendered) {
                        const startX = Number(
                                image.attr('x')
                            ),
                            startY = Number(
                                image.attr('y')
                            ),
                            startWidth = Number(
                                image.attr('width')
                            ),
                            startHeight = Number(
                                image.attr('height')
                            );

                        const step: AnimationStepCallbackFunction = (
                            now,
                            fx
                        ): void => {
                            const pos = fx.pos;
                            image.attr({
                                x: (
                                    startX + (
                                        x - startX
                                    ) * pos
                                ),
                                y: (
                                    startY + (
                                        y - startY
                                    ) * pos
                                ),
                                width: (
                                    startWidth + (
                                        width - startWidth
                                    ) * pos
                                ),
                                height: (
                                    startHeight + (
                                        height - startHeight
                                    ) * pos
                                )
                            });
                        };

                        const animOptions = merge(
                                animObject(chart.renderer.globalAnimation)
                            ),
                            userStep = animOptions.step;

                        animOptions.step =
                            function (): void {
                                if (userStep) {
                                    userStep.apply(this, arguments);
                                }
                                step.apply(this, arguments);
                            };

                        image
                            .attr(
                                merge(
                                    { animator: 0 },
                                    series.isDirtyCanvas ? {
                                        href: canvas.toDataURL('image/png', 1)
                                    } : void 0
                                )
                            )
                            .animate({ animator: 1 }, animOptions);

                    // When dragging or first rendering, animation is off
                    } else {
                        stop(image);

                        image.attr(
                            merge(
                                dimensions,
                                series.isDirtyCanvas ? {
                                    href: canvas.toDataURL('image/png', 1)
                                } : void 0
                            )
                        );
                    }
                } else {
                    series.image = chart.renderer.image(
                        canvas.toDataURL('image/png', 1)
                    )
                        .attr(dimensions)
                        .add(series.group);
                }
                series.isDirtyCanvas = false;
            }
        } else {
            super.drawPoints.apply(series, arguments);
        }
    }

    /**
     * Project ImageData to actual mapView projection used on a chart.
     * @internal
     */
    public getProjectedImageData(
        mapView: MapView,
        projectedWidth: number,
        projectedHeight: number,
        cartesianImageData: ImageData,
        canvas: HTMLCanvasElement,
        horizontalShift: number,
        verticalShift: number
    ): Uint8ClampedArray {
        const projectedPixelData = new Uint8ClampedArray(
                projectedWidth * projectedHeight * 4
            ),
            lambda = pick(
                mapView.projection.options.rotation?.[0],
                0
            ),
            widthFactor = canvas.width / 360,
            heightFactor = -1 * canvas.height / 180;
        let y = -1;
        // For each pixel on the map plane, find the map
        // coordinate and get the color value
        for (let i = 0; i < projectedPixelData.length; i += 4) {
            const x = (i / 4) % projectedWidth;

            if (x === 0) {
                y++;
            }

            const projectedCoords = mapView.pixelsToLonLat({
                x: horizontalShift + x,
                y: verticalShift + y
            });

            if (projectedCoords) {
                // Normalize lon values
                if (
                    projectedCoords.lon > -180 - lambda &&
                    projectedCoords.lon < 180 - lambda
                ) {
                    projectedCoords.lon =
                        normalizeLonValue(projectedCoords.lon);
                }

                const projected = [
                        projectedCoords.lon,
                        projectedCoords.lat
                    ],
                    cvs2PixelX = projected[0] * widthFactor + canvas.width / 2,
                    cvs2PixelY = projected[1] * heightFactor +
                        canvas.height / 2;

                if (
                    cvs2PixelX >= 0 &&
                    cvs2PixelX <= canvas.width &&
                    cvs2PixelY >= 0 &&
                    cvs2PixelY <= canvas.height
                ) {
                    const redPos = (
                        // Rows
                        Math.floor(cvs2PixelY) *
                        canvas.width * 4 +
                        // Columns
                        Math.round(cvs2PixelX) * 4
                    );
                    projectedPixelData[i] =
                        cartesianImageData.data[redPos];
                    projectedPixelData[i + 1] =
                        cartesianImageData.data[redPos + 1];
                    projectedPixelData[i + 2] =
                        cartesianImageData.data[redPos + 2];
                    projectedPixelData[i + 3] =
                        cartesianImageData.data[redPos + 3];
                }
            }
        }

        return projectedPixelData;
    }

    public searchPoint(
        e: PointerEvent,
        compareX?: boolean
    ): Point | undefined {
        const series = this,
            chart = this.chart,
            mapView = chart.mapView;

        if (
            mapView &&
            series.bounds &&
            series.image &&
            chart.tooltip &&
            chart.tooltip.options.enabled
        ) {
            if (
                // If user drags map do not build k-d-tree
                !chart.pointer.hasDragged &&
                // If user zooms in/out map do not build k-d-tree
                (
                    +series.image.attr('animator') <= 0.01 ||
                    +series.image.attr('animator') >= 0.99
                )
            ) {
                const topLeft = mapView.projectedUnitsToPixels({
                        x: series.bounds.x1,
                        y: series.bounds.y2
                    }),
                    bottomRight = mapView.projectedUnitsToPixels({
                        x: series.bounds.x2,
                        y: series.bounds.y1
                    });
                chart.pointer.normalize(e);

                if (
                    e.lon && e.lat &&
                    topLeft && bottomRight &&
                    e.chartX - chart.plotLeft > topLeft.x &&
                    e.chartX - chart.plotLeft < bottomRight.x &&
                    e.chartY - chart.plotTop > topLeft.y &&
                    e.chartY - chart.plotTop < bottomRight.y
                ) {
                    return this.searchKDTree({
                        clientX: e.chartX,
                        lon: normalizeLonValue(e.lon),
                        lat: e.lat
                    }, compareX, e);
                }
            } else {
                chart.tooltip.destroy();
            }
        }
    }
}

addEvent(GeoHeatmapSeries, 'afterDataClassLegendClick', function (): void {
    this.isDirtyCanvas = true;
    this.drawPoints();
});

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface GeoHeatmapSeries {
    pointClass: typeof GeoHeatmapPoint;
    pointArrayMap: Array<string>;
    image?: SVGElement
}
extend(GeoHeatmapSeries.prototype, {
    type: 'geoheatmap',
    applyJitter: noop,
    pointClass: GeoHeatmapPoint,
    pointArrayMap: ['lon', 'lat', 'value'],
    kdAxisArray: ['lon', 'lat'] // Search k-d-tree by lon/lat values
});

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        geoheatmap: typeof GeoHeatmapSeries;
    }
}
SeriesRegistry.registerSeriesType('geoheatmap', GeoHeatmapSeries);

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default GeoHeatmapSeries;
