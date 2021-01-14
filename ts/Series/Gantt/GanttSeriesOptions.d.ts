/* *
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type GanttSeries from './GanttSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type XRangeSeriesOptions from '../../Series/XRange/XRangeSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface GanttAnimationOptions extends Partial<AnimationOptions> {
    reversed?: boolean;
}

export interface GanttConnectorOptions extends Highcharts.ConnectorsOptions {
    animation?: (boolean|GanttAnimationOptions);
    startMarker?: GanttConnectorStartMarkerOptions;
}

export interface GanttConnectorStartMarkerOptions extends Highcharts.ConnectorsStartMarkerOptions {
    fill: ColorType;
}

export type GanttDependencyOptions = (
    string|
    GanttConnectorOptions|
    Array<GanttConnectorOptions>|
    Array<string>
);

export interface GanttSeriesOptions extends XRangeSeriesOptions {
    connectors?: GanttConnectorOptions;
    states?: SeriesStatesOptions<GanttSeries>;
}

export default GanttSeriesOptions;
