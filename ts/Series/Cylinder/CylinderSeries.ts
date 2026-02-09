/* *
 *
 *  Highcharts cylinder - a 3D series
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
 * @requires highcharts-3d
 * @requires modules/cylinder
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

    public data!: Array<CylinderPoint>;

    public options!: CylinderSeriesOptions;

    public points!: Array<CylinderPoint>;

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
