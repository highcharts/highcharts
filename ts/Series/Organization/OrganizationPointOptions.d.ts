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

import type OrganizationDataLabelOptions from './OrganizationDataLabelOptions.js';
import type SankeyPointOptions from '../Sankey/SankeyPointOptions.js';
import type ColorString from '../../Core/Color/ColorString.js';
import type { OrganizationLinkOptions } from './OrganizationSeriesOptions.js';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel.js';

/* *
 *
 *  Declarations
 *
 * */

export interface OrganizationPointOptions extends SankeyPointOptions {
    linkColor?: ColorString;
    linkOpacity?: number;
    linkLineWidth?: number;
    link?: OrganizationLinkOptions;
    borderRadius?: number;
    dataLabels?: (
        OrganizationPointDataLabelOptions |
        Array<OrganizationPointDataLabelOptions>
    );
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
