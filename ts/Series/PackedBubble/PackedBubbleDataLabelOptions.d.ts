/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński, Sebastian Bochan
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Import
 *
 * */

import type { DataLabelOptions } from '../../Core/Series/DataLabelOptions';
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
    parentNodeTextPath?: DataLabelOptions['textPath'];
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleDataLabelOptions;
