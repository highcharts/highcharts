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
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel';

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
