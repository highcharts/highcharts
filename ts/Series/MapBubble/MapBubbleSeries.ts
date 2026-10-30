/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

import type MapBubbleSeriesOptions from './MapBubbleSeriesOptions';
import type Point from '../../Core/Series/Point';
import type PointerEvent from '../../Core/PointerEvent';

import BubbleSeries from '../Bubble/BubbleSeries.js';
import MapBubblePoint from './MapBubblePoint.js';
import MapBubbleSeriesDefaults from './MapBubbleSeriesDefaults.js';
import MapPointSeries from '../MapPoint/MapPointSeries.js';
import MapSeries from '../Map/MapSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { extend, merge } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * @class
 * @name Highcharts.seriesTypes.mapbubble
 *
 * @augments Highcharts.Series
 *
 * @requires BubbleSeries
 * @requires MapPointSeries
 */
class MapBubbleSeries extends BubbleSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /** @internal */
    public static defaultOptions: MapBubbleSeriesOptions = merge(
        BubbleSeries.defaultOptions,
        MapBubbleSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<MapBubblePoint>;

    public options!: MapBubbleSeriesOptions;

    public points!: Array<MapBubblePoint>;

    /** @internal */
    public clearBounds = MapSeries.prototype.clearBounds;

    /** @internal */
    public searchPoint(
        e: PointerEvent,
        compareX?: boolean
    ): (Point|undefined) {
        return this.searchKDTree({
            plotX: e.chartX - this.chart.plotLeft,
            plotY: e.chartY - this.chart.plotTop
        }, compareX, e);
    }

    /** @internal */
    translate(): void {
        MapPointSeries.prototype.translate.call(this);
        this.getRadii();
        this.translateBubble();
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapBubbleSeries {
    /** @internal */
    type: string;
    /** @internal */
    getProjectedBounds: typeof MapSeries.prototype.getProjectedBounds;
    /** @internal */
    pointArrayMap: Array<string>;
    /** @internal */
    pointClass: typeof MapBubblePoint;
    /** @internal */
    setData: typeof MapSeries.prototype.setData;
    /** @internal */
    processData: typeof MapSeries.prototype.processData;
    /** @internal */
    projectPoint: typeof MapPointSeries.prototype.projectPoint;
    /** @internal */
    setOptions: typeof MapSeries.prototype.setOptions;
    /** @internal */
    xyFromShape: boolean;
}
extend(MapBubbleSeries.prototype, {
    type: 'mapbubble',

    axisTypes: ['colorAxis'],

    getProjectedBounds: MapSeries.prototype.getProjectedBounds,

    isCartesian: false,

    // If one single value is passed, it is interpreted as z
    pointArrayMap: ['z'],

    pointClass: MapBubblePoint,

    processData: MapSeries.prototype.processData,

    projectPoint: MapPointSeries.prototype.projectPoint,

    kdAxisArray: ['plotX', 'plotY'],

    setData: MapSeries.prototype.setData,

    setOptions: MapSeries.prototype.setOptions,

    useMapGeometry: true,

    xyFromShape: true
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        mapbubble: typeof MapBubbleSeries;
    }
}
SeriesRegistry.registerSeriesType('mapbubble', MapBubbleSeries);

/* *
 *
 *  Default Export
 *
 * */

export default MapBubbleSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `mapbubble` series. If the [type](#series.mapbubble.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.mapbubble
 * @product   highmaps
 * @apioption series.mapbubble
 */

/**
 * An array of data points for the series. For the `mapbubble` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values
 *    will be interpreted as `z` options. Example:
 *
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.mapbubble.turboThreshold),
 *    this option is not available.
 *
 *    ```js
 *        data: [{
 *            z: 9,
 *            name: "Point2",
 *            color: "#00FF00"
 *        }, {
 *            z: 10,
 *            name: "Point1",
 *            color: "#FF00FF"
 *        }]
 *    ```
 *
 * @basic
 * @type      {Array<number|null|*>}
 * @extends   series.mappoint.data
 * @excluding labelrank, middleX, middleY, path, value, x, y, lat, lon
 * @product   highmaps
 * @apioption series.mapbubble.data
 */

/**
 * While the `x` and `y` values of the bubble are determined by the
 * underlying map, the `z` indicates the actual value that gives the
 * size of the bubble.
 *
 * @sample {highmaps} maps/demo/map-bubble/
 *         Bubble
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.mapbubble.data.z
 */

/**
 * @excluding enabled, enabledThreshold, height, radius, width
 * @sample {highmaps} maps/plotoptions/mapbubble-symbol
 *         Map bubble with mapmarker symbol
 * @apioption series.mapbubble.marker
 */

''; // Adds doclets above to transpiled file
