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
        options: OrganizationDataLabelOptions
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
