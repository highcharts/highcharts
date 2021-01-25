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

import type ColorType from '../../Core/Color/ColorType';
import type {
    DataLabelFormatterCallback,
    DataLabelOptions
} from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type TimelinePoint from './TimelinePoint';
import type TimelineSeries from './TimelineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface TimelineDataLabelFormatterCallback extends DataLabelFormatterCallback {
    (this: (Point.PointLabelObject|TimelineDataLabelContextObject)): string;
}
export interface TimelineDataLabelContextObject extends Point.PointLabelObject {
    key?: string;
    point: TimelinePoint;
    series: TimelineSeries;
}
export interface TimelineDataLabelOptions extends DataLabelOptions {
    alternate?: boolean;
    connectorColor?: ColorType;
    connectorWidth?: number;
    distance?: number;
    formatter?: TimelineDataLabelFormatterCallback;
    width?: number;
}

export default TimelineDataLabelOptions;
