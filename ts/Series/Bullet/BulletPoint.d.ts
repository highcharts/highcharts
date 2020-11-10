/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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
import type BulletPointOptions from './BulletPointOptions';
import type BulletSeries from './BulletSeries';
import type ColumnPoint from '../Column/ColumnPoint';

/* *
 *
 *  Class
 *
 * */
declare class BulletPoint extends ColumnPoint {
    public borderColor: BulletPointOptions['borderColor'];
    public options: BulletPointOptions;
    public series: BulletSeries;
    public target?: number;
    public targetGraphic?: SVGElement;
    public destroy(): undefined;
}

/* *
 *
 *  Export Default
 *
 * */
export default BulletPoint;
