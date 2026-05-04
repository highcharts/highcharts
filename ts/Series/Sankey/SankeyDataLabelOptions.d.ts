/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2026 Highsoft AS
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
