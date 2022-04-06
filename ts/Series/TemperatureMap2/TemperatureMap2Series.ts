/* *
 *
 *  (c) 2010-2021 Sebastian Bochan, Rafal Sebestjanski
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

import type TemperatureMap2SeriesOptions from './TemperatureMap2SeriesOptions';

import MapBubbleSeries from '../MapBubble/MapBubbleSeries.js';
import TemperatureMap2Point from './TemperatureMap2Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
// const {
//     seriesTypes: {
//         mapbubble: MapBubbleSeries
//     }
// } = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    merge,
    extend
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
 * The temperaturemap2 series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.temperaturemap2
 *
 * @augments Highcharts.Series
 */
class TemperatureMap2Series extends MapBubbleSeries {

    /* *
     *
     * Static properties
     *
     * */

    //public static compose = MapBubbleSeries.compose;

    public static defaultOptions: TemperatureMap2SeriesOptions = MapBubbleSeries.defaultOptions;

    /* *
     *
     * Properties
     *
     * */

    public data: Array<TemperatureMap2Point> = void 0 as any;
    public options: TemperatureMap2SeriesOptions = void 0 as any;
    public points: Array<TemperatureMap2Point> = void 0 as any;


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

interface TemperatureMap2Series {
    // type: string;
    // getProjectedBounds: typeof MapSeries.prototype['getProjectedBounds'];
    // pointArrayMap: Array<string>;
    // pointClass: typeof TemperatureMap2Point;
    // setData: typeof MapSeries.prototype['setData'];
    // processData: typeof MapSeries.prototype['processData'];
    // projectPoint: typeof MapPointSeries.prototype['projectPoint'];
    // setOptions: typeof MapSeries.prototype['setOptions'];
    // updateData: typeof MapSeries.prototype['updateData'];
    // xyFromShape: boolean;
}

//TemperatureMap2Series.prototype.pointClass = MapBubbleSeries.prototype.pointClass;

// extend(TemperatureMap2Series.prototype, {
//     type: 'temperaturemap2'
// });

// interface TemperatureMap2Series {
//     pointClass: typeof TemperatureMap2Point;
// }

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        temperaturemap2: typeof TemperatureMap2Series;
    }
}

SeriesRegistry.registerSeriesType('temperaturemap2', TemperatureMap2Series);

/* *
 *
 *  Default export
 *
 * */

export default TemperatureMap2Series;

/* *
 *
 *  API options
 *
 * */

''; // adds doclets above to transpiled file
