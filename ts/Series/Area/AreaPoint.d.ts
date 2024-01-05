/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AreaPointOptions from './AreaPointOptions';
import type AreaSeries from './AreaSeries';
import type LinePoint from '../Line/LinePoint';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        isCliff?: AreaPoint['isCliff'];
    }
}

/* *
 *
 *  Class
 *
 * */

declare class AreaPoint extends LinePoint {
    public isCliff?: boolean;
    public leftNull?: boolean;
    public options: AreaPointOptions;
    public rightNull?: boolean;
    public series: AreaSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaPoint;
