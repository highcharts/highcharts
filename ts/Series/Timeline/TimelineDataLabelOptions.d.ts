/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2025 Highsoft AS
 *
 *  Author: Daniel Studencki
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

/* *
 *
 *  Declarations
 *
 * */

export interface TimelineDataLabelFormatterCallback extends DataLabelFormatterCallback {
    (this: (Point|TimelinePoint)): string;
}

export interface TimelineDataLabelOptions extends DataLabelOptions {
    alternate?: boolean;
    connectorColor?: ColorType;
    connectorWidth?: number;
    distance?: number;
    formatter?: TimelineDataLabelFormatterCallback;
    width?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default TimelineDataLabelOptions;
