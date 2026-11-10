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

import type OrganizationDataLabelOptions from './OrganizationDataLabelOptions';
import type SankeyPointOptions from '../Sankey/SankeyPointOptions';
import type ColorString from '../../Core/Color/ColorString';
import type { OrganizationLinkOptions } from './OrganizationSeriesOptions';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel';

/* *
 *
 *  Declarations
 *
 * */

export interface OrganizationPointOptions extends SankeyPointOptions {

    /**
     * The color of the link between this node and the next one. This option
     * is deprecated and moved to
     * [link.color](#plotOptions.organization.link.color).
     *
     * @deprecated 10.3.0
     */
    linkColor?: ColorString;

    /**
     * Opacity of the link between this node and the next one.
     */
    linkOpacity?: number;

    /**
     * The line width of the link between this node and the next one, in
     * pixels. This option is deprecated and moved to
     * [link.lineWidth](#plotOptions.organization.link.lineWidth).
     *
     * @deprecated 10.3.0
     */
    linkLineWidth?: number;

    /**
     * Link styling options for the link between this node and the next one.
     *
     * @since 10.3.0
     */
    link?: OrganizationLinkOptions;

    /**
     * The border radius of the node card.
     */
    borderRadius?: number;

    /**
     * Individual data label for the node. The options are the same as the
     * ones for
     * [series.organization.dataLabels](#series.organization.dataLabels).
     */
    dataLabels?: (
        OrganizationPointDataLabelOptions |
        Array<OrganizationPointDataLabelOptions>
    );

    /**
     * The offset of the link in relation to the node, either in pixels or as
     * a percentage of the node height.
     */
    offset?: (number|string);
}

export type OrganizationPointDataLabelOptions =
    OrganizationDataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationPointOptions;
