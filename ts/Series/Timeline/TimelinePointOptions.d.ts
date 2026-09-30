/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Daniel Studencki
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type LinePointOptions from '../Line/LinePointOptions.js';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel.js';
import type TimelineDataLabelOptions from './TimelineDataLabelOptions.js';

/* *
 *
 *  Declarations
 *
 * */

export interface TimelinePointOptions extends LinePointOptions {

    dataLabels?: TimelinePointDataLabelOptions;

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

export type TimelinePointDataLabelOptions =
    TimelineDataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default TimelinePointOptions;
