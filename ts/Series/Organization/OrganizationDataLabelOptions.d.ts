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

import type OrganizationPoint from './OrganizationPoint';
import type OrganizationSeries from './OrganizationSeries';
import type Point from '../../Core/Series/Point';
import type {
    SankeyDataLabelFormatterContext,
    SankeyDataLabelOptions
} from '../Sankey/SankeyDataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface OrganizationDataLabelsFormatterCallbackFunction {
    (
        this: (
            OrganizationDataLabelFormatterContext|
            SankeyDataLabelFormatterContext|
            Point.PointLabelObject
        )
    ): (string|undefined);
}
export interface OrganizationDataLabelFormatterContext extends SankeyDataLabelFormatterContext {
    point: OrganizationPoint;
    series: OrganizationSeries;
}


export interface OrganizationDataLabelOptions extends SankeyDataLabelOptions {
    nodeFormatter?: OrganizationDataLabelsFormatterCallbackFunction;
}

export default OrganizationDataLabelOptions;
