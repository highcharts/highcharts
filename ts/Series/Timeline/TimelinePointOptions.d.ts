/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Daniel Studencki
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

import type LinePointOptions from '../Line/LinePointOptions';
import type TimelineDataLabelOptions from './TimelineDataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TimelinePointOptions extends LinePointOptions {
    dataLabels?: TimelineDataLabelOptions;
    isNull?: boolean;
    radius?: number;
    visible?: boolean;
}

export default TimelinePointOptions;
