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
    /**
     * Whether to position data labels alternately. For example, if
     * [distance](#plotOptions.timeline.dataLabels.distance)
     * is set equal to `100`, then data labels will be positioned
     * alternately (on both sides of the point) at a distance of 100px.
     *
     * @sample {highcharts} highcharts/series-timeline/alternate-disabled
     *         Alternate disabled
     */
    alternate?: boolean;

    /**
     * The color of the line connecting the data label to the point.
     * The default color is the same as the point's color.
     *
     * In styled mode, the connector stroke is given in the
     * `.highcharts-data-label-connector` class.
     *
     * @sample {highcharts} highcharts/series-timeline/connector-styles
     *         Custom connector width and color
     */
    connectorColor?: ColorType;

    /**
     * The width of the line connecting the data label to the point.
     *
     * In styled mode, the connector stroke width is given in the
     * `.highcharts-data-label-connector` class.
     *
     * @sample {highcharts} highcharts/series-timeline/connector-styles
     *         Custom connector width and color
     */
    connectorWidth?: number;

    /**
     * A pixel value defining the distance between the data label and
     * the point. Negative numbers puts the label on top of the point in a
     * non-inverted chart. Defaults to 100 for horizontal and 20 for
     * vertical timeline (`chart.inverted: true`).
     */
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
