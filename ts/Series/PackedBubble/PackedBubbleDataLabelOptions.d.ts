/* *
 *
 *  (c) 2010-2024 Grzegorz Blachlinski, Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
    (this: (Point|PackedBubblePoint)): (number|string|null|undefined);
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
