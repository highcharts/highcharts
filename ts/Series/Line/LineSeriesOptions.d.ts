/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface LineSeriesOptions extends SeriesOptions {
    allAreas?: boolean;

    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;

    connectEnds?: boolean;
    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);

    /**
     * @default 'lineMarker'
     */
    legendSymbol?: SeriesOptions['legendSymbol'];

    linkedTo?: string;
    pointStart?: number;
    states?: SeriesStatesOptions<LineSeriesOptions>;
    supportingColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default LineSeriesOptions;
