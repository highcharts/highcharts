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
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import U from '../Core/Utilities.js';
var getOptions = U.getOptions, merge = U.merge, pick = U.pick;
import './MapSymbols.js';
/* eslint-disable valid-jsdoc */
var Map;
(function (Map) {
    /* *
     *
     *  Constants
     *
     * */
    /**
     * Contains all loaded map data for Highmaps.
     *
     * @requires modules/map
     *
     * @name Highcharts.maps
     * @type {Record<string,*>}
     */
    Map.maps = {};
    /* *
     *
     *  Functions
     *
     * */
    /**
     * The factory function for creating new map charts. Creates a new {@link
     * Highcharts.Chart|Chart} object with different default options than the
     * basic Chart.
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
     * @return {Highcharts.Chart}
     * The chart object.
     */
    function mapChart(a, b, c) {
        var hasRenderToArg = typeof a === 'string' || a.nodeName, options = arguments[hasRenderToArg ? 1 : 0], userOptions = options, hiddenAxis = {
            endOnTick: false,
            visible: false,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false
        }, seriesOptions, defaultCreditsOptions = getOptions().credits;
        /* For visual testing
        hiddenAxis.gridLineWidth = 1;
        hiddenAxis.gridZIndex = 10;
        hiddenAxis.tickPositions = undefined;
        // */
        // Don't merge the data
        seriesOptions = options.series;
        options.series = null;
        options = merge({
            chart: {
                panning: {
                    enabled: true,
                    type: 'xy'
                },
                type: 'map'
            },
            credits: {
                mapText: pick(defaultCreditsOptions.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">' +
                    '{geojson.copyrightShort}</a>'),
                mapTextFull: pick(defaultCreditsOptions.mapTextFull, '{geojson.copyright}')
            },
            tooltip: {
                followTouchMove: false
            },
            xAxis: hiddenAxis,
            yAxis: merge(hiddenAxis, { reversed: true })
        }, options, // user's options
        {
            chart: {
                inverted: false,
                alignTicks: false
            }
        });
        options.series = userOptions.series = seriesOptions;
        return hasRenderToArg ?
            new Chart(a, options, c) :
            new Chart(options, b);
    }
    Map.mapChart = mapChart;
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
    function splitPath(path) {
        var arr;
        if (typeof path === 'string') {
            path = path
                // Move letters apart
                .replace(/([A-Za-z])/g, ' $1 ')
                // Trim
                .replace(/^\s*/, '').replace(/\s*$/, '');
            // Split on spaces and commas. The semicolon is bogus, designed to
            // circumvent string replacement in the pre-v7 assembler that built
            // specific styled mode files.
            var split = path.split(/[ ,;]+/);
            arr = split.map(function (item) {
                if (!/[A-za-z]/.test(item)) {
                    return parseFloat(item);
                }
                return item;
            });
        }
        else {
            arr = path;
        }
        return SVGRenderer.prototype.pathToSegments(arr);
    }
    Map.splitPath = splitPath;
})(Map || (Map = {}));
/* *
 *
 *  Compatibility
 *
 * */
H.Map = Map.mapChart; // @todo remove fake class for jQuery
H.mapChart = Map.mapChart;
H.maps = Map.maps;
/* *
 *
 *  Default Export
 *
 * */
export default Map;
