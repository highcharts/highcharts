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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Chart from './Chart.js';
import D from '../DefaultOptions.js';
var getOptions = D.getOptions;
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import U from '../Utilities.js';
var merge = U.merge, pick = U.pick;
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
var MapChart = /** @class */ (function (_super) {
    __extends(MapChart, _super);
    function MapChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
     *
     * @emits Highcharts.MapChart#event:init
     * @emits Highcharts.MapChart#event:afterInit
     */
    MapChart.prototype.init = function (userOptions, callback) {
        var defaultCreditsOptions = getOptions().credits;
        var options = merge({
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
            mapView: {},
            tooltip: {
                followTouchMove: false
            }
        }, userOptions // user's options
        );
        _super.prototype.init.call(this, options, callback);
    };
    return MapChart;
}(Chart));
/* eslint-disable valid-jsdoc */
(function (MapChart) {
    /**
     * Contains all loaded map data for Highmaps.
     *
     * @requires modules/map
     *
     * @name Highcharts.maps
     * @type {Record<string,*>}
     */
    MapChart.maps = {};
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
    function mapChart(a, b, c) {
        return new MapChart(a, b, c);
    }
    MapChart.mapChart = mapChart;
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
     * Splitted SVG path
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
    MapChart.splitPath = splitPath;
})(MapChart || (MapChart = {}));
/* *
 *
 *  Default Export
 *
 * */
export default MapChart;
