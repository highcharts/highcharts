/* *
 *
 *  Highcharts pyramid3d series module
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Kacper Madej
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

import type Pyramid3DPoint from './Pyramid3DPoint';
import type Pyramid3DSeriesOptions from './Pyramid3DSeriesOptions';

import Pyramid3DSeriesDefaults from './Pyramid3DSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    funnel3d: Funnel3DSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The pyramid3d series type.
 *
 * @class
 * @name Highcharts.seriesTypes.pyramid3d
 * @augments seriesTypes.funnel3d
 * @requires highcharts-3d
 * @requires modules/cylinder
 * @requires modules/funnel3d
 * @requires modules/pyramid3d
 */
class Pyramid3DSeries extends Funnel3DSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: Pyramid3DSeriesOptions = merge(
        Funnel3DSeries.defaultOptions,
        Pyramid3DSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<Pyramid3DPoint> = void 0 as any;

    public options: Pyramid3DSeriesOptions = void 0 as any;

    public points: Array<Pyramid3DPoint> = void 0 as any;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface Pyramid3DSeries {
    pointClass: typeof Pyramid3DPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pyramid3d: typeof Pyramid3DSeries;
    }
}

SeriesRegistry.registerSeriesType('pyramid3d', Pyramid3DSeries);

/* *
 *
 *  Default Export
 *
 * */

export default Pyramid3DSeries;
