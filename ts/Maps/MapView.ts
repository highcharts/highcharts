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

import type AnimationOptions from '../Core/Animation/AnimationOptions';
import type PositionObject from '../Core/Renderer/PositionObject';
import type {
    LonLatArray,
    MapBounds,
    MapViewOptions,
    ProjectedXY
} from './MapViewOptions';

import Chart from '../Core/Chart/Chart.js';
import defaultOptions from './MapViewOptionsDefault.js';
import Projection from './Projection.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    clamp,
    fireEvent,
    isNumber,
    merge,
    pick,
    relativeLength
} = U;


/**
 * The world size in terms of 10k meters in the Web Mercator projection, to
 * match a 256 square tile to zoom level 0
 */
const worldSize = 400.979322;
const tileSize = 256;

/**
 * The map view handles zooming and centering on the map, and various
 * client-side projection capabilities.
 *
 * On a chart instance, the map view is available as `chart.mapView`.
 *
 * @class
 * @name Highcharts.MapView
 *
 * @param {Highcharts.Chart} chart
 *        The Chart instance
 * @param {Highcharts.MapViewOptions} options
 *        MapView options
 */
class MapView {

    /* *
     * Return the composite bounding box of a collection of bounding boxes
     */
    public static compositeBounds = (
        arrayOfBounds: MapBounds[]
    ): MapBounds|undefined => {
        if (arrayOfBounds.length) {
            return arrayOfBounds
                .slice(1)
                .reduce((acc, cur): MapBounds => {
                    acc.x1 = Math.min(acc.x1, cur.x1);
                    acc.y1 = Math.min(acc.y1, cur.y1);
                    acc.x2 = Math.max(acc.x2, cur.x2);
                    acc.y2 = Math.max(acc.y2, cur.y2);
                    return acc;
                }, merge(arrayOfBounds[0]));
        }
        return;
    };

    public constructor(
        chart: Chart,
        options?: DeepPartial<MapViewOptions>
    ) {
        this.userOptions = options || {};

        const o = merge(defaultOptions, options);

        this.chart = chart;

        /**
         * The current center of the view in terms of `[longitude, latitude]`.
         * @name Highcharts.MapView#center
         * @readonly
         * @type {LonLatArray}
         */
        this.center = o.center;
        this.options = o;
        this.projection = new Projection(o.projection);

        /**
         * The current zoom level of the view.
         * @name Highcharts.MapView#zoom
         * @readonly
         * @type {number}
         */
        this.zoom = o.zoom || 0;


        // Initialize and respond to chart size changes
        addEvent(chart, 'afterSetChartSize', (): void => {
            if (
                this.minZoom === void 0 || // When initializing the chart
                this.minZoom === this.zoom // When resizing the chart
            ) {

                this.fitToBounds(void 0, void 0, false);

                if (isNumber(this.userOptions.zoom)) {
                    this.zoom = this.userOptions.zoom;
                }
                if (this.userOptions.center) {
                    merge(true, this.center, this.userOptions.center);
                }
            }
        });


        // Set up panning for maps. In orthographic projections the globe will
        // rotate, otherwise adjust the map center.
        let mouseDownCenterProjected: [number, number];
        let mouseDownKey: string;
        let mouseDownRotation: number[]|undefined;
        const onPan = (e: PointerEvent): void => {

            const pinchDown = chart.pointer.pinchDown;

            let {
                mouseDownX,
                mouseDownY
            } = chart;

            if (pinchDown.length === 1) {
                mouseDownX = pinchDown[0].chartX;
                mouseDownY = pinchDown[0].chartY;
            }

            if (
                typeof mouseDownX === 'number' &&
                typeof mouseDownY === 'number'
            ) {
                const key = `${mouseDownX},${mouseDownY}`,
                    { chartX, chartY } = (e as any).originalEvent;

                // Reset starting position
                if (key !== mouseDownKey) {
                    mouseDownKey = key;

                    mouseDownCenterProjected = this.projection
                        .forward(this.center);

                    mouseDownRotation = (
                        this.projection.options.rotation || [0, 0]
                    ).slice();
                }

                // Panning rotates the globe
                if (
                    this.projection.options.name === 'Orthographic' &&

                    // ... but don't rotate if we're loading only a part of the
                    // world
                    (this.minZoom || Infinity) < 3
                ) {

                    // Empirical ratio where the globe rotates roughly the same
                    // speed as moving the pointer across the center of the
                    // projection
                    const ratio = 440 / (this.getScale() * Math.min(
                        chart.plotWidth,
                        chart.plotHeight
                    ));

                    if (mouseDownRotation) {
                        const lon = (mouseDownX - chartX) * ratio -
                            mouseDownRotation[0];
                        const lat = clamp(
                            -mouseDownRotation[1] -
                                (mouseDownY - chartY) * ratio,
                            -80,
                            80
                        );
                        this.update({
                            projection: {
                                rotation: [-lon, -lat]
                            },
                            center: [lon, lat],
                            zoom: this.zoom
                        }, true, false);

                    }


                } else {

                    const scale = this.getScale();

                    const newCenter = this.projection.inverse([
                        mouseDownCenterProjected[0] +
                            (mouseDownX - chartX) / scale,
                        mouseDownCenterProjected[1] -
                            (mouseDownY - chartY) / scale
                    ]);

                    this.setView(newCenter, void 0, true, false);

                }

                e.preventDefault();
            }
        };
        addEvent(chart, 'pan', onPan);
        addEvent(chart, 'touchpan', onPan);


        // Perform the map zoom by selection
        addEvent(chart, 'selection', (evt: PointerEvent): void => {
            // Zoom in
            if (!(evt as any).resetSelection) {
                const x = evt.x - chart.plotLeft;
                const y = evt.y - chart.plotTop;
                const { y: y1, x: x1 } = this.pixelsToProjectedUnits({ x, y });
                const { y: y2, x: x2 } = this.pixelsToProjectedUnits(
                    { x: x + evt.width, y: y + evt.height }
                );
                this.fitToBounds(
                    { x1, y1, x2, y2 },
                    void 0,
                    true,
                    (evt as any).originalEvent.touches ?
                        // On touch zoom, don't animate, since we're already in
                        // transformed zoom preview
                        false :
                        // On mouse zoom, obey the chart-level animation
                        void 0
                );

                // Only for mouse. Touch users can pinch out.
                if (!/^touch/.test(((evt as any).originalEvent.type))) {
                    chart.showResetZoom();
                }

                evt.preventDefault();

            // Reset zoom
            } else {
                this.zoomBy();
            }
        });

    }

    public center: LonLatArray;
    public minZoom?: number;
    public options: MapViewOptions;
    public projection: Projection;
    public userOptions: DeepPartial<MapViewOptions>;
    public zoom: number;

    private chart: Chart;

    /**
     * Fit the view to given bounds
     *
     * @function Highcharts.MapView#fitToBounds
     * @param {Object} bounds
     *        Bounds in terms of projected units given as  `{ x1, y1, x2, y2 }`.
     *        If not set, fit to the bounds of the current data set
     * @param {number|string} [padding=0]
     *        Padding inside the bounds. A number signifies pixels, while a
     *        percentage string (like `5%`) can be used as a fraction of the
     *        plot area size.
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart immediately
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        What animation to use for redraw
     */
    public fitToBounds(
        bounds?: MapBounds,
        padding?: (number|string),
        redraw = true,
        animation?: boolean|Partial<AnimationOptions>
    ): void {

        const b = bounds || this.getProjectedBounds();

        if (b) {
            const { plotWidth, plotHeight } = this.chart,
                pad = pick(padding, bounds ? 0 : this.options.padding),
                paddingX = relativeLength(pad, plotWidth),
                paddingY = relativeLength(pad, plotHeight);

            const scaleToPlotArea = Math.max(
                (b.x2 - b.x1) / ((plotWidth - paddingX) / tileSize),
                (b.y2 - b.y1) / ((plotHeight - paddingY) / tileSize)
            );
            const zoom = Math.log(worldSize / scaleToPlotArea) / Math.log(2);

            // Reset minZoom when fitting to natural bounds
            if (!bounds) {
                this.minZoom = zoom;
            }

            const center = this.projection.inverse([
                (b.x2 + b.x1) / 2,
                (b.y2 + b.y1) / 2
            ]);

            this.setView(center, zoom, redraw, animation);
        }
    }

    public getProjectedBounds(): MapBounds|undefined {
        const allBounds = this.chart.series.reduce(
            (acc, s): MapBounds[] => {
                const bounds = s.getProjectedBounds && s.getProjectedBounds();
                if (bounds) {
                    acc.push(bounds);
                }
                return acc;
            },
            [] as MapBounds[]
        );
        return MapView.compositeBounds(allBounds);
    }

    public getScale(): number {
        // A zoom of 0 means the world (360x360 degrees) fits in a 256x256 px
        // tile
        return (tileSize / worldSize) * Math.pow(2, this.zoom);
    }

    public redraw(animation?: boolean|Partial<AnimationOptions>): void {
        this.chart.series.forEach((s): void => {
            if (s.useMapGeometry) {
                s.isDirty = true;
            }
        });

        this.chart.redraw(animation);
    }

    /**
     * Set the view to given center and zoom values.
     * @function Highcharts.MapView#setView
     * @param {Highcharts.LonLatArray|undefined} center
     *        The center point
     * @param {number} zoom
     *        The zoom level
     * @param {boolean} [redraw=true]
     *        Whether to redraw immediately
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Animation options for the redraw
     *
     * @sample maps/mapview/setview
     *        Set the view programmatically
     */
    public setView(
        center?: LonLatArray,
        zoom?: number,
        redraw = true,
        animation?: boolean|Partial<AnimationOptions>
    ): void {
        let zoomingIn = false;
        if (center) {
            this.center = center;
        }
        if (typeof zoom === 'number') {
            if (typeof this.minZoom === 'number') {
                zoom = Math.max(zoom, this.minZoom);
            }
            if (typeof this.options.maxZoom === 'number') {
                zoom = Math.min(zoom, this.options.maxZoom);
            }
            zoomingIn = zoom > this.zoom;
            this.zoom = zoom;
        }

        // Stay within the data bounds
        const bounds = this.getProjectedBounds();
        if (
            bounds &&
            // When zooming in, we don't need to adjust to the bounds, as that
            // could shift the location under the mouse
            !zoomingIn
        ) {
            const projectedCenter = this.projection.forward(this.center);
            const { plotWidth, plotHeight } = this.chart;
            const scale = this.getScale();
            const bottomLeft = this.projectedUnitsToPixels({
                x: bounds.x1,
                y: bounds.y1
            });
            const topRight = this.projectedUnitsToPixels({
                x: bounds.x2,
                y: bounds.y2
            });
            const boundsCenterProjected = [
                (bounds.x1 + bounds.x2) / 2,
                (bounds.y1 + bounds.y2) / 2
            ];

            // Pixel coordinate system is reversed vs projected
            const x1 = bottomLeft.x;
            const y1 = topRight.y;
            const x2 = topRight.x;
            const y2 = bottomLeft.y;

            // Map smaller than plot area, center it
            if (x2 - x1 < plotWidth) {
                projectedCenter[0] = boundsCenterProjected[0];

            // Off west
            } else if (x1 < 0 && x2 < plotWidth) {
                // Adjust eastwards
                projectedCenter[0] += Math.max(x1, x2 - plotWidth) / scale;

            // Off east
            } else if (x2 > plotWidth && x1 > 0) {
                // Adjust westwards
                projectedCenter[0] += Math.min(x2 - plotWidth, x1) / scale;
            }

            // Map smaller than plot area, center it
            if (y2 - y1 < plotHeight) {
                projectedCenter[1] = boundsCenterProjected[1];

            // Off north
            } else if (y1 < 0 && y2 < plotHeight) {
                // Adjust southwards
                projectedCenter[1] -= Math.max(y1, y2 - plotHeight) / scale;

            // Off south
            } else if (y2 > plotHeight && y1 > 0) {
                // Adjust northwards
                projectedCenter[1] -= Math.min(y2 - plotHeight, y1) / scale;
            }

            this.center = this.projection.inverse(projectedCenter);
        }

        fireEvent(this, 'afterSetView');

        if (redraw) {
            this.redraw(animation);
        }
    }

    /**
     * Convert projected units to pixel position
     *
     * @function Highcharts.MapView#projectedUnitsToPixels
     * @param {Highcharts.PositionObject} pos
     *        The position in projected units
     * @return {Highcharts.PositionObject} The position in pixels
     */
    public projectedUnitsToPixels(pos: ProjectedXY): PositionObject {
        const scale = this.getScale();
        const projectedCenter = this.projection.forward(this.center);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;

        const x = centerPxX - scale * (projectedCenter[0] - pos.x);
        const y = centerPxY + scale * (projectedCenter[1] - pos.y);

        return { x, y };
    }

    /**
     * Convert pixel position to projected units
     *
     * @function Highcharts.MapView#pixelsToProjectedUnits
     * @param {Highcharts.PositionObject} pos
     *        The position in pixels
     * @return {Highcharts.PositionObject} The position in projected units
     */
    public pixelsToProjectedUnits(pos: PositionObject): ProjectedXY {
        const { x, y } = pos;
        const scale = this.getScale();
        const projectedCenter = this.projection.forward(this.center);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;

        const projectedX = projectedCenter[0] + (x - centerPxX) / scale;
        const projectedY = projectedCenter[1] - (y - centerPxY) / scale;

        return { x: projectedX, y: projectedY };
    }

    /**
     * Update the view with given options
     *
     * @function Highcharts.MapView#update
     *
     * @param {Partial<Highcharts.MapViewOptions>} options
     *        The new map view options to apply
     * @param {boolean} [redraw=true]
     *        Whether to redraw immediately
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        The animation to apply to a the redraw
     */
    public update(
        options: DeepPartial<MapViewOptions>,
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const newProjection = options.projection;
        const isDirtyProjection = newProjection && (
            (
                Projection.toString(newProjection) !==
                Projection.toString(this.options.projection)
            )
        );

        merge(true, this.userOptions, options);
        merge(true, this.options, options);

        if (isDirtyProjection) {
            this.chart.series.forEach((series): void => {
                if (series.clearBounds) {
                    series.clearBounds();
                }
                series.isDirty = true;
                series.isDirtyData = true;
            });

            this.projection = new Projection(this.options.projection);

            // Fit to natural bounds if center/zoom are not explicitly given
            if (!options.center && !isNumber(options.zoom)) {
                this.fitToBounds(void 0, void 0, false);
            }
        }

        if (options.center || isNumber(options.zoom)) {
            this.setView(this.options.center, options.zoom, false);
        }

        if (redraw) {
            this.chart.redraw(animation);
        }

    }

    /**
     * Zoom the map view by a given number
     *
     * @function Highcharts.MapView#zoomBy
     *
     * @param {number|undefined} [howMuch]
     *        The amount of zoom to apply. 1 zooms in on half the current view,
     *        -1 zooms out. Pass `undefined` to zoom to the full bounds of the
     *        map.
     * @param {Highcharts.LonLatArray} [coords]
     *        Optional map coordinates to keep fixed
     * @param {Array<number>} [chartCoords]
     *        Optional chart coordinates to keep fixed, in pixels
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        The animation to apply to a the redraw
     */
    public zoomBy(
        howMuch?: number,
        coords?: LonLatArray,
        chartCoords?: [number, number],
        animation?: boolean|Partial<AnimationOptions>
    ): void {
        const chart = this.chart;
        const projectedCenter = this.projection.forward(this.center);

        // let { x, y } = coords || {};
        let [x, y] = coords ? this.projection.forward(coords) : [];


        if (typeof howMuch === 'number') {
            const zoom = this.zoom + howMuch;

            let center: LonLatArray|undefined;

            // Keep chartX and chartY stationary - convert to lat and lng
            if (chartCoords) {
                const [chartX, chartY] = chartCoords;
                const scale = this.getScale();

                const offsetX = chartX - chart.plotLeft - chart.plotWidth / 2;
                const offsetY = chartY - chart.plotTop - chart.plotHeight / 2;
                x = projectedCenter[0] + offsetX / scale;
                y = projectedCenter[1] + offsetY / scale;
            }

            // Keep lon and lat stationary by adjusting the center
            if (typeof x === 'number' && typeof y === 'number') {
                const scale = 1 - Math.pow(2, this.zoom) / Math.pow(2, zoom);

                // const projectedCenter = this.projection.forward(this.center);

                const offsetX = projectedCenter[0] - x;
                const offsetY = projectedCenter[1] - y;

                projectedCenter[0] -= offsetX * scale;
                projectedCenter[1] += offsetY * scale;

                center = this.projection.inverse(projectedCenter);
            }

            this.setView(center, zoom, void 0, animation);

        // Undefined howMuch => reset zoom
        } else {
            this.fitToBounds(void 0, void 0, void 0, animation);
        }

    }
}
export default MapView;
