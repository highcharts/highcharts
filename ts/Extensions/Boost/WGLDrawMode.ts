/* *
 *
 *  (c) 2019-2025 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { SeriesTypeRegistry } from '../../Core/Series/SeriesType';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export type WGLDrawModeValue = (
    'LINE_STRIP' |
    'LINES' |
    'POINTS' |
    'TRIANGLES'
);

/* *
 *
 *  Constants
 *
 * */

/** @internal */
const WGLDrawMode: Record<keyof SeriesTypeRegistry, WGLDrawModeValue> = {
    'area': 'LINES',
    'arearange': 'LINES',
    'areaspline': 'LINES',
    'column': 'LINES',
    'columnrange': 'LINES',
    'bar': 'LINES',
    'line': 'LINE_STRIP',
    'scatter': 'POINTS',
    'heatmap': 'TRIANGLES',
    'treemap': 'TRIANGLES',
    'bubble': 'POINTS'
};

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default WGLDrawMode;
