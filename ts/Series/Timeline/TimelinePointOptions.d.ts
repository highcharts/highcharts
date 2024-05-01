/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2024 Highsoft AS
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

    /**
     * The description of event. This description will be shown in tooltip.
     *
     * @product highcharts
     */
    description?: string;

    isNull?: boolean;

    /**
     * The label of event.
     *
     * @product highcharts
     */
    label?: string;

    /**
     * The name of event.
     *
     * @product highcharts
     */
    name?: string;

    radius?: number;

    visible?: boolean;

}

/* *
 *
 *  Default Export
 *
 * */

export default TimelinePointOptions;
