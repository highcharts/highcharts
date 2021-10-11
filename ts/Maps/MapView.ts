/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
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
    fireEvent,
    isNumber,
    merge,
    pick,
    relativeLength
} = U;


/**
 * The world size equals meters in the Web Mercator projection, to match a
 * 256 square tile to zoom level 0
 */
const worldSize = 40097932.2;
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
 * @param {DeepPartial<Highcharts.MapViewOptions>} options
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
        this.zoom = o.zoom;

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
     * @param {Highcharts.MapBounds} bounds
     *        Bounds in terms of projected units. If not set, fit to the bounds
     *        of the current data set
     * @param {number|string} [padding=0]
     *        Padding inside the bounds. A number signifies pixels, while a
     *        percentage string (like `5%`) can be used as a fraction of the
     *        plot area size.
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart immediately
     * @param {boolean|Partial<Highcharts.AnimationOptions>} [animation]
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
     * @param {boolean|Partial<Highcharts.AnimationOptions>} [animation]
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

    public projectedUnitsToPixels(pos: ProjectedXY): PositionObject {
        const scale = this.getScale();
        const projectedCenter = this.projection.forward(this.center);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;

        const x = centerPxX - scale * (projectedCenter[0] - pos.x);
        const y = centerPxY + scale * (projectedCenter[1] - pos.y);

        return { x, y };
    }

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
     * @param {DeepPartial<Highcharts.MapViewOptions>} options
     *        The new map view options to apply
     * @param {boolean} [redraw=true]
     *        Whether to redraw immediately
     * @param {boolean|Partial<Highcharts.AnimationOptions>} [animation]
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
     *        Optional chart coordinates to keep fixed, in terms of pixels
     * @param {boolean|Partial<Highcharts.AnimationOptions>} [animation]
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
