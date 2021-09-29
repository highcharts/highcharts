/* *
 *
 *  Vector plot series module
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

import type ScatterPoint from '../Scatter/ScatterPoint';
import type VectorPointOptions from './VectorPointOptions';
import type VectorSeries from './VectorSeries';

/* *
 *
 *  Class
 *
 * */

declare class VectorPoint extends ScatterPoint {
    public direction: VectorPointOptions['direction'];
    public length: VectorPointOptions['length'];
    public options: VectorPointOptions;
    public series: VectorSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default VectorPoint;
