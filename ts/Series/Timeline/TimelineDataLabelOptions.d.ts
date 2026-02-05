/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Daniel Studencki
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type {
    DataLabelsFormatterCallbackFunction,
    DataLabelOptions
} from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type TimelinePoint from './TimelinePoint';

/* *
 *
 *  Declarations
 *
 * */

export interface TimelineDataLabelsFormatterCallbackFunction extends DataLabelsFormatterCallbackFunction {
    (this: (Point|TimelinePoint)): string;
}

export interface TimelineDataLabelOptions extends DataLabelOptions {
    alternate?: boolean;
    connectorColor?: ColorType;
    connectorWidth?: number;
    distance?: number;
    formatter?: TimelineDataLabelsFormatterCallbackFunction;
    width?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default TimelineDataLabelOptions;
