/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

import type OrganizationPoint from './OrganizationPoint';
import type Point from '../../Core/Series/Point';
import type {
    SankeyDataLabelOptions
} from '../Sankey/SankeyDataLabelOptions';
import type SankeyPoint from '../Sankey/SankeyPoint';

/* *
 *
 *  Declarations
 *
 * */

export interface OrganizationDataLabelsFormatterCallbackFunction {
    (
        this: (Point|OrganizationPoint|SankeyPoint),
        options: OrganizationDataLabelOptions|SankeyDataLabelOptions
    ): (string|undefined);
}


export interface OrganizationDataLabelOptions extends SankeyDataLabelOptions {

    /**
     * Callback to format data labels for _nodes_ in the organization chart.
     * The `nodeFormat` option takes precedence over the `nodeFormatter`.
     */
    nodeFormatter?: OrganizationDataLabelsFormatterCallbackFunction;

    /**
     * The format string specifying what to show for *links* in the
     * organization chart.
     *
     * Best to use with
     * [`linkTextPath`](#series.organization.dataLabels.linkTextPath) enabled.
     *
     * @sample highcharts/series-organization/link-labels
     *         Organization chart with link labels
     *
     * @since 11.0.0
     *
     * @product highcharts
     */
    linkFormat?: string;

    /**
     * Callback to format data labels for _links_ in the organization chart.
     * The `linkFormat` option takes precedence over the `linkFormatter`.
     *
     * @since 11.0.0
     *
     * @product highcharts
     */
    linkFormatter?: OrganizationDataLabelsFormatterCallbackFunction;

    /**
     * Text styles for the data labels.
     */
    style?: SankeyDataLabelOptions['style'] & {
        /** @default '0.9em' */
        fontSize?: Required<SankeyDataLabelOptions>['style']['fontSize'];

        /** @default 'normal' */
        fontWeight?: Required<SankeyDataLabelOptions>['style']['fontWeight'];

        /** @default 'left' */
        textAlign?: Required<SankeyDataLabelOptions>['style']['textAlign'];
    };
}

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationDataLabelOptions;
