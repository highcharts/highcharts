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

    style?: DataLabelOptions['style'] & {
        /** @default 'none' */
        textOutline?: Required<DataLabelOptions>['style']['textOutline'];

        /** @default 'normal' */
        fontWeight?: Required<DataLabelOptions>['style']['fontWeight'];

        /** @default '0.8em' */
        fontSize?: Required<DataLabelOptions>['style']['fontSize'];

        /** @default 'left' */
        textAlign?: Required<DataLabelOptions>['style']['textAlign'];
    };
}

/* *
 *
 *  Default Export
 *
 * */

export default TimelineDataLabelOptions;
