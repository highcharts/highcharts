/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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


import type Component from '../Component';
import type Sync from '../Sync/Sync';
import type {
    Options as HighchartsOptions
} from '../../Plugins/HighchartsTypes';


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
     * Column assignment have impact on navigator and range. Only the first
     * assignment is used and usually matches against the `y` values.
     *
     * If crossfilter sync is enabled, the column assignment will show the
     * distribution of values instead of the values themselves.
     *
     * @example
     * ``` JavaScript
     * {
     *     columnAssignment: {
     *         'My Column': 'y'
     *     }
     * }
     * ```
     */
    columnAssignment?: Record<string, string | null>;

    /**
     * Connector options
     */
    connector?: Component.ConnectorOptions;

    /**
     * Defines which elements should be synced.
     * ```
     * Example:
     * {
     *     extremes: true
     * }
     * ```
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/crossfilter | Crossfilter Sync }
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Extremes Sync }
     *
     */
    sync?: SyncOptions;

    /**
     * Default type of the navigator.
     */
    type: 'Navigator';
}

/**
 * Sync options available for the Navigator component.
 *
 * Example:
 * ```
 * {
 *     crossfilter: true
 * }
 * ```
 */
export interface SyncOptions extends Sync.RawOptionsRecord {
    /**
     * Crossfilter sync is available for Navigator components. Modifies data
     * by selecting only those rows that meet common ranges.
     *
     * Alternatively to the boolean value, it can accept an object
     * containing additional options for operating this type of
     * synchronization.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/crossfilter | Crossfilter Sync }
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/crossfilter-affecting-navigators | Crossfilter with affectNavigators enabled }
     *
     * @default false
     */
    crossfilter?: boolean | CrossfilterSyncOptions;
    /**
     * Extremes sync is available for Highcharts, KPI, Grid and
     * Navigator components. Sets a common range of displayed data. For the
     * KPI Component sets the last value.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Extremes Sync }
     *
     * @default false
     */
    extremes?: boolean | Sync.OptionsEntry;
}

/**
 * Crossfilter sync options.
 *
 * Example:
 * ```
 * {
 *     enabled: true,
 *     affectNavigator: true
 * }
 * ```
 */
export interface CrossfilterSyncOptions extends Sync.OptionsEntry {
    /**
     * Whether this navigator component's content should be affected by
     * other navigators with crossfilter enabled.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/crossfilter-affecting-navigators | Affect Navigators Enabled }
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Affect Navigators Disabled }
     *
     * @default false
     */
    affectNavigator?: boolean;
}


/* *
 *
 *  Default Export
 *
 * */


export default Options;
