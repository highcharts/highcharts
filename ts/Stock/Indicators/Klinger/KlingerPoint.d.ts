/* *
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

import type KlingerIndicator from './KlingerIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class KlingerPoint extends SMAPoint {
    public series: KlingerIndicator;
    public signal?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default KlingerPoint;
