/* *
 *
 *  (c) 2019-2026 Highsoft AS
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
 *  Constants
 *
 * */

// These are the series we allow boosting for.
const Boostables = [
    'area',
    'areaspline',
    'arearange',
    'column',
    'columnrange',
    'bar',
    'line',
    'scatter',
    'heatmap',
    'bubble',
    'treemap'
];

/* *
 *
 *  Default Export
 *
 * */

export default Boostables;
