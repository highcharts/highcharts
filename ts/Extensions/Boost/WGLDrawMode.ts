/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

export default WGLDrawMode;
