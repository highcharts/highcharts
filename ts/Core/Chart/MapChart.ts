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
import type SVGPath from '../Renderer/SVG/SVGPath';
import Chart from './Chart.js';
import O from '../../Core/Options.js';
const { getOptions } = O;
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import U from '../Utilities.js';
const {
    merge,
    pick
} = U;
import '../../Maps/MapSymbols.js';

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
        userOptions: Partial<Highcharts.Options>,
        callback?: Chart.CallbackFunction
    ): void {
        const hiddenAxis = {
                endOnTick: false,
                visible: false,
                minPadding: 0,
                maxPadding: 0,
                startOnTick: false
            },
            seriesOptions = userOptions.series,
            defaultCreditsOptions = getOptions().credits;

        /* For visual testing
        hiddenAxis.gridLineWidth = 1;
        hiddenAxis.gridZIndex = 10;
        hiddenAxis.tickPositions = undefined;
        // */

        // Don't merge the data
        userOptions.series = void 0;

        userOptions = merge(
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

        userOptions.series = seriesOptions;

        super.init(userOptions, callback);
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
        a: (string|HTMLDOMElement|Highcharts.Options),
        b?: (Chart.CallbackFunction|Highcharts.Options),
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

/* *
 *
 *  Default Export
 *
 * */

export default MapChart;
