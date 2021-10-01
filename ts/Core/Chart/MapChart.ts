/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type { HTMLDOMElement } from '../Renderer/DOMElementType';
import type Options from '../Options';
import type { ProjectionRotationOption } from '../../Maps/ProjectionOptions';
import type SVGPath from '../Renderer/SVG/SVGPath';
import Chart from './Chart.js';
import D from '../DefaultOptions.js';
const { getOptions } = D;
import MapView from '../../Maps/MapView.js';
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import U from '../Utilities.js';
const {
    addEvent,
    clamp,
    isNumber,
    merge,
    pick
} = U;
import '../../Maps/MapSymbols.js';


declare module './ChartLike'{
    interface ChartLike {
        mapView?: MapView;
    }
}

/**
 * Map-optimized chart. Use {@link Highcharts.Chart|Chart} for common charts.
 *
 * @requires modules/map
 *
 * @class
 * @name Highcharts.MapChart
 * @extends Highcharts.Chart
 */
class MapChart extends Chart {
    /**
     * Initializes the chart. The constructor's arguments are passed on
     * directly.
     *
     * @function Highcharts.MapChart#init
     *
     * @param {Highcharts.Options} userOptions
     *        Custom options.
     *
     * @param {Function} [callback]
     *        Function to run when the chart has loaded and and all external
     *        images are loaded.
     *
     * @return {void}
     *
     * @fires Highcharts.MapChart#event:init
     * @fires Highcharts.MapChart#event:afterInit
     */
    public init(
        userOptions: Partial<Options>,
        callback?: Chart.CallbackFunction
    ): void {
        const hiddenAxis = {
                endOnTick: false,
                visible: false,
                minPadding: 0,
                maxPadding: 0,
                startOnTick: false
            },
            defaultCreditsOptions = getOptions().credits;

        /* For visual testing
        hiddenAxis.gridLineWidth = 1;
        hiddenAxis.gridZIndex = 10;
        hiddenAxis.tickPositions = undefined;
        // */

        const options = merge(
            {
                chart: {
                    panning: {
                        enabled: true,
                        type: 'xy'
                    },
                    type: 'map'
                },
                credits: {
                    mapText: pick(
                        (defaultCreditsOptions as any).mapText,
                        ' \u00a9 <a href="{geojson.copyrightUrl}">' +
                            '{geojson.copyrightShort}</a>'
                    ),
                    mapTextFull: pick(
                        (defaultCreditsOptions as any).mapTextFull,
                        '{geojson.copyright}'
                    )
                },
                mapView: {}, // Required to enable Chart.mapView
                tooltip: {
                    followTouchMove: false
                },
                xAxis: hiddenAxis,
                yAxis: merge(hiddenAxis, { reversed: true })
            },
            userOptions, // user's options

            { // forced options
                chart: {
                    inverted: false,
                    alignTicks: false
                }
            }
        );

        super.init(options, callback);
    }
}

/* eslint-disable valid-jsdoc */

namespace MapChart {
    /**
     * Contains all loaded map data for Highmaps.
     *
     * @requires modules/map
     *
     * @name Highcharts.maps
     * @type {Record<string,*>}
     */
    export const maps: AnyRecord = {};

    /**
     * The factory function for creating new map charts. Creates a new {@link
     * Highcharts.MapChart|MapChart} object with different default options than
     * the basic Chart.
     *
     * @requires modules/map
     *
     * @function Highcharts.mapChart
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     * @param {Highcharts.Options} options
     * The chart options structure as described in the
     * [options reference](https://api.highcharts.com/highstock).
     *
     * @param {Highcharts.ChartCallbackFunction} [callback]
     * A function to execute when the chart object is finished loading and
     * rendering. In most cases the chart is built in one thread, but in
     * Internet Explorer version 8 or less the chart is sometimes initialized
     * before the document is ready, and in these cases the chart object will
     * not be finished synchronously. As a consequence, code that relies on the
     * newly built Chart object should always run in the callback. Defining a
     * [chart.events.load](https://api.highcharts.com/highstock/chart.events.load)
     * handler is equivalent.
     *
     * @return {Highcharts.MapChart}
     * The chart object.
     */
    export function mapChart(
        a: (string|HTMLDOMElement|Options),
        b?: (Chart.CallbackFunction|Options),
        c?: Chart.CallbackFunction
    ): MapChart {
        return new MapChart(a as any, b as any, c);
    }

    /**
     * Utility for reading SVG paths directly.
     *
     * @requires modules/map
     *
     * @function Highcharts.splitPath
     *
     * @param {string|Array<string|number>} path
     *
     * @return {Highcharts.SVGPathArray}
     */
    export function splitPath(
        path: string|Array<string|number>
    ): SVGPath {
        let arr: Array<string|number>;

        if (typeof path === 'string') {
            path = path
                // Move letters apart
                .replace(/([A-Za-z])/g, ' $1 ')
                // Trim
                .replace(/^\s*/, '').replace(/\s*$/, '');

            // Split on spaces and commas. The semicolon is bogus, designed to
            // circumvent string replacement in the pre-v7 assembler that built
            // specific styled mode files.
            const split = path.split(/[ ,;]+/);

            arr = split.map((item): (number|string) => {
                if (!/[A-za-z]/.test(item)) {
                    return parseFloat(item);
                }
                return item;
            });
        } else {
            arr = path;
        }

        return SVGRenderer.prototype.pathToSegments(arr);
    }
}

/* eslint-disable no-invalid-this */
addEvent(Chart, 'afterInit', function (): void {
    if (this.options.mapView) {
        this.mapView = new MapView(this, this.options.mapView);
    }
});

addEvent(Chart, 'afterSetChartSize', function (): void {
    const mapView = this.mapView;

    if (mapView && mapView.minZoom === void 0) {

        mapView.fitToBounds(void 0, false);

        if (isNumber(mapView.userOptions.zoom)) {
            mapView.zoom = mapView.userOptions.zoom;
        }
        if (mapView.userOptions.center) {
            merge(true, mapView.center, mapView.userOptions.center);
        }
    }
});

let mouseDownCenterProjected: [number, number];
let mouseDownKey: string;
let mouseDownRotation: number[]|undefined;
addEvent(Chart, 'pan', function (e: PointerEvent): void {
    const {
        mapView,
        mouseDownX,
        mouseDownY
    } = this;

    if (
        mapView &&
        typeof mouseDownX === 'number' &&
        typeof mouseDownY === 'number'
    ) {
        const key = `${mouseDownX},${mouseDownY}`;
        const { chartX, chartY } = (e as any).originalEvent;

        // Reset starting position
        if (key !== mouseDownKey) {
            mouseDownKey = key;

            mouseDownCenterProjected = mapView.projection
                .forward(mapView.center);

            mouseDownRotation = (
                mapView.projection.options.rotation || [0, 0]
            ).slice();
        }

        if (mapView.projection.options.projectionName === 'Orthographic') {

            // Empirical ratio where the globe rotates roughly the same speed
            // as moving the pointer across the center of the projection
            const ratio = 28000 /
                (mapView.getScale() * Math.min(this.plotWidth, this.plotHeight));

            if (mouseDownRotation) {
                const lon = (mouseDownX - chartX) * ratio - mouseDownRotation[0];
                const lat = clamp(
                    -mouseDownRotation[1] - (mouseDownY - chartY) * ratio,
                    -80,
                    80
                );
                mapView.update({
                    projection: {
                        rotation: [-lon, -lat]
                    },
                    center: [lon, lat],
                    zoom: mapView.zoom
                }, true, false);

            }


        } else {

            const scale = mapView.getScale();

            const newCenter = mapView.projection.inverse([
                mouseDownCenterProjected[0] + (mouseDownX - chartX) / scale,
                mouseDownCenterProjected[1] - (mouseDownY - chartY) / scale
            ]);

            mapView.setView(newCenter, void 0, true, false);

        }

        e.preventDefault();
    }
});

// Perform the map zoom by selection
addEvent(Chart, 'selection', function (evt: PointerEvent): void {
    const mapView = this.mapView;
    if (mapView) {

        // Zoom in
        if (!(evt as any).resetSelection) {
            const x = evt.x - this.plotLeft;
            const y = evt.y - this.plotTop;
            const { y: y1, x: x1 } = mapView.pixelsToProjectedUnits({ x, y });
            const { y: y2, x: x2 } = mapView.pixelsToProjectedUnits(
                { x: x + evt.width, y: y + evt.height }
            );
            mapView.fitToBounds(
                { x1, y1, x2, y2 },
                true,
                (evt as any).originalEvent.touches ?
                    // On touch zoom, don't animate, since we're already in
                    // transformed zoom preview
                    false :
                    // On mouse zoom, obey the chart-level animation
                    void 0
            );

            this.showResetZoom();

            evt.preventDefault();

        // Reset zoom
        } else {
            mapView.zoomBy();
        }

    }
});

/* *
 *
 *  Default Export
 *
 * */

export default MapChart;
