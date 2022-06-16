/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson
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

import type FlowMapSeriesOptions from './FlowMapSeriesOptions';
import SankeySeries from '../Sankey/SankeySeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

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
 * The flowmap series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.flowmap
 *
 * @augments Highcharts.Series
 */
class FlowMapSeries extends SankeySeries { // Sankey?

    /* *
     *
     * Static properties
     *
     * */

    // public static compose = MapBubbleSeries.compose;

    public static defaultOptions: FlowMapSeriesOptions = SankeySeries.defaultOptions; // Sankey?

    /* *
     *
     * Properties
     *
     * */

    public options: FlowMapSeriesOptions = void 0 as any;


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

interface FlowMapSeries {

}

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        flowmap: typeof FlowMapSeries;
    }
}

SeriesRegistry.registerSeriesType('flowmap', FlowMapSeries);

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeries;

/* *
 *
 *  API options
 *
 * */

''; // adds doclets above to transpiled file
