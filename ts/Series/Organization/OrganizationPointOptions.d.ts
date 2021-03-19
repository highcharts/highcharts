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

/* *
 *
 *  Declarations
 *
 * */

export interface OrganizationPointOptions extends SankeyPointOptions {
    dataLabels?: (OrganizationDataLabelOptions|Array<OrganizationDataLabelOptions>);
    offset?: (number|string);
}

export default OrganizationPointOptions;
