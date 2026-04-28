/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Torstein Hønsi
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
        options: OrganizationDataLabelOptions|SankeyDataLabelOptions
    ): (string|undefined);
}


export interface OrganizationDataLabelOptions extends SankeyDataLabelOptions {
    nodeFormatter?: OrganizationDataLabelsFormatterCallbackFunction;
    linkFormat?: string;
    linkFormatter?: OrganizationDataLabelsFormatterCallbackFunction;

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
