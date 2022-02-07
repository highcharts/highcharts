/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2021 Torstein Honsi
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

import type OrganizationDataLabelOptions from './OrganizationDataLabelOptions';
import type SankeyPointOptions from '../Sankey/SankeyPointOptions';
import type ColorString from '../../Core/Color/ColorString';
import type { LinkOptions } from './OrganizationSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface OrganizationPointOptions extends SankeyPointOptions {
    linkColor?: ColorString;
    linkLineWidth?: number;
    link?: LinkOptions;
    borderRadius?: number;
    dataLabels?: (OrganizationDataLabelOptions|Array<OrganizationDataLabelOptions>);
    offset?: (number|string);
}

export default OrganizationPointOptions;
