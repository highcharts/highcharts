/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type OrganizationDataLabelOptions from './OrganizationDataLabelOptions';
import type SankeyPointOptions from '../Sankey/SankeyPointOptions';
import type ColorString from '../../Core/Color/ColorString';
import type { OrganizationLinkOptions } from './OrganizationSeriesOptions';

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
    dataLabels?: (OrganizationDataLabelOptions|Array<OrganizationDataLabelOptions>);
    offset?: (number|string);
}

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationPointOptions;
