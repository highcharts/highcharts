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

import type AreaPoint from '../Area/AreaPoint';
import type AreaSplinePointOptions from './AreaSplinePointOptions';
import type AreaSplineSeries from './AreaSplineSeries';
import type SplinePoint from '../Spline/SplinePoint';

/* *
 *
 *  Declarations
 *
 * */

declare class AreaSplinePoint extends SplinePoint {
    public isCliff?: AreaPoint['isCliff'];
    public options: AreaSplinePointOptions;
    public series: AreaSplineSeries;
}

/* *
 *
 *  Default export
 *
 * */

export default AreaSplinePoint;
