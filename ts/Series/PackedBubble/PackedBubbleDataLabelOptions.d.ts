/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachlinski, Sebastian Bochan
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Import
 *
 * */

import type {
    DataLabelOptions,
    DataLabelTextPathOptions
} from '../../Core/Series/DataLabelOptions';
import type PackedBubblePoint from './PackedBubblePoint';
import type Point from '../../Core/Series/Point';

/* *
 *
 *  Declarations
 *
 * */

export interface PackedBubbleDataLabelsFormatterCallbackFunction {
    (
        this: (Point|PackedBubblePoint),
        options: PackedBubbleDataLabelOptions
    ): (number|string|null|undefined);
}

export interface PackedBubbleDataLabelOptions extends DataLabelOptions {
    format?: string;
    formatter?: PackedBubbleDataLabelsFormatterCallbackFunction;
    parentNodeFormat?: string;
    parentNodeFormatter?: (
        PackedBubbleDataLabelsFormatterCallbackFunction
    );
    parentNodeTextPath?: DataLabelTextPathOptions;
    textPath?: DataLabelTextPathOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleDataLabelOptions;
