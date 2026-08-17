/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2026 Highsoft AS
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

import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type SankeyPoint from './SankeyPoint';

/* *
 *
 *  Declarations
 *
 * */

export interface SankeyDataLabelsFormatterCallbackFunction {
    (
        this: (SankeyPoint|Point),
        options: SankeyDataLabelOptions
    ): (string|undefined);
}

export interface SankeyDataLabelFormatterContext {
    point: SankeyPoint;
}

export interface SankeyDataLabelOptions extends DataLabelOptions {
    nodeFormat?: string;
    nodeFormatter?: SankeyDataLabelsFormatterCallbackFunction;
    linkTextPath?: DataLabelOptions['textPath'];
}

/* *
 *
 *  Default Export
 *
 * */

export default SankeyDataLabelOptions;
