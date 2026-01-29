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

/**
 * A line series displays information as a series of data points connected by
 * straight line segments.
 *
 * @sample {highcharts} highcharts/demo/line-chart/
 *         Line chart
 * @sample {highstock} stock/demo/basic-line/
 *         Line chart
 *
 * @product highcharts highstock
 */
export interface LineSeriesOptions extends SeriesOptions {
    /**
     * @default 'lineMarker'
     */
    legendSymbol?: SeriesOptions['legendSymbol'];

    // TODO: verify & +doclet or move to the correct location or/and interface
    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    connectEnds?: boolean;
    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
    linkedTo?: string;
    pointStart?: number;
    states?: SeriesStatesOptions<LineSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LineSeriesOptions;
