/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type LinePoint from '../Line/LinePoint';
import type SplinePointOptions from './SplinePointOptions';
import type SplineSeries from './SplineSeries';

/* *
 *
 *  Class
 *
 * */

declare class SplinePoint extends LinePoint {
    public doCurve?: boolean;
    public leftCont?: ControlPoint;
    public options: SplinePointOptions;
    public rightCont?: ControlPoint;
    public rightContX?: number;
    public rightContY?: number;
    public series: SplineSeries;
}

/* *
 *
 *  Declarations
 *
 * */

export interface ControlPoint {
    plotX: number;
    plotY: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplinePoint;
