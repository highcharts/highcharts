/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2024 Torstein Honsi
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
        this: (Point|OrganizationPoint|SankeyPoint)
    ): (string|undefined);
}


export interface OrganizationDataLabelOptions extends SankeyDataLabelOptions {
    nodeFormatter?: OrganizationDataLabelsFormatterCallbackFunction;
    linkFormat?: string;
    linkFormatter?: OrganizationDataLabelsFormatterCallbackFunction;
}

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationDataLabelOptions;
