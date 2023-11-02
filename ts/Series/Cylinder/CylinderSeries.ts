/* *
 *
 *  Highcharts cylinder - a 3D series
 *
 *  (c) 2010-2021 Highsoft AS
 *
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

import type CylinderSeriesOptions from './CylinderSeriesOptions';

import CylinderComposition from './CylinderComposition.js';
import CylinderPoint from './CylinderPoint.js';
import CylinderSeriesDefaults from './CylinderSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The cylinder series type.
 *
 * @requires module:highcharts-3d
 * @requires module:modules/cylinder
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cylinder
 *
 * @augments Highcharts.Series
 */
class CylinderSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static compose = CylinderComposition.compose;

    public static defaultOptions: CylinderSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        CylinderSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<CylinderPoint> = void 0 as any;

    public options: CylinderSeriesOptions = void 0 as any;

    public points: Array<CylinderPoint> = void 0 as any;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface CylinderSeries {
    pointClass: typeof CylinderPoint;
}

extend(CylinderSeries.prototype, {
    pointClass: CylinderPoint
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        cylinder: typeof CylinderSeries;
    }
}

SeriesRegistry.registerSeriesType('cylinder', CylinderSeries);

/* *
 *
 *  Default Export
 *
 * */

export default CylinderSeries;
