/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Authors: Torstein Hønsi, Magdalena Gut
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PictorialSeriesOptions from './PictorialSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A pictorial chart uses vector images to represents the data.
 * The shape of the data point is taken from the path parameter.
 *
 * @sample       {highcharts} highcharts/demo/pictorial/
 *               Pictorial chart
 *
 * @extends      plotOptions.column
 * @since 11.0.0
 * @product      highcharts
 * @excluding    allAreas, borderRadius,
 *               centerInCategory, colorAxis, colorKey, connectEnds,
 *               connectNulls, crisp, compare, compareBase, dataSorting,
 *               dashStyle, dataAsColumns, linecap, lineWidth, shadow,
 *               onPoint
 * @requires     modules/pictorial
 * @optionparent plotOptions.pictorial
 */
const PictorialSeriesDefaults: PictorialSeriesOptions = {
    borderWidth: 0
} as PictorialSeriesOptions;

/* *
 *
 *  Default Export
 *
 * */

export default PictorialSeriesDefaults;
