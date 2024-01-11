/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Component from '../../Components/Component';
import type { Options as HighchartsOptions } from '../HighchartsTypes';


/* *
 *
 *  Declarations
 *
 * */


export interface Options extends Component.Options {

    /**
     * Additional chart options used to render the navigator. Here you can
     * change things like `chart.type`, `chart.height`, or `title.text`.
     *
     * @example
     * ``` JavaScript
     * {
     *     chartOptions: {
     *         chart: {
     *             height: '80px',
     *             type: 'column'
     *         },
     *         title: {
     *             text: 'My Navigator'
     *         }
     *     }
     * }
     * ```
     */
    chartOptions: HighchartsOptions;

    /**
     * Column assignments have impact on navigator and range. Only the first
     * assignment is used and usually matches against the `y` values.
     *
     * If crossfilter sync is enabled, the column assignment will show the
     * distribution of values instead of the values themself.
     *
     * @example
     * ``` JavaScript
     * {
     *     columnAssignments: {
     *         'My Column': 'y'
     *     }
     * }
     * ```
     */
    columnAssignments?: Record<string, string | null>;

    /**
     * Default type of the navigator.
     */
    type: 'Navigator';
}


/* *
 *
 *  Default Export
 *
 * */


export default Options;
