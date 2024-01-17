/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Component from '../../Components/Component';
import type Sync from '../../Components/Sync/Sync';
import type { Options as HighchartsOptions } from '../HighchartsTypes';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Type of the constructor that is called for creating a chart.
 */
export type ConstructorType = (
    'chart' | 'stockChart' | 'mapChart' | 'ganttChart'
);


export interface Options extends Component.Options {
    /**
     * Whether to allow the component to edit the store to which it is
     * attached.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/datagrid-sync/ | Allow connector update comparison}
     *
     * @default true
     */
    allowConnectorUpdate?: boolean;

    /**
     * The string that declares constructor that is called for creating
     * a chart.
     *
     * Example: `chart`, `stockChart`, `mapChart` or `ganttChart`.
     *
     * @default 'chart'
     */
    chartConstructor?: ConstructorType;

    /**
     * Type of the component.
     */
    type: 'Highcharts';

    /**
     * A full set of chart options used by the chart.
     * [Highcharts API](https://api.highcharts.com/highcharts/)
     */
    chartOptions?: Partial<HighchartsOptions>;

    /**
     * The name of class that is applied to the chart's container.
     */
    chartClassName?: string;

    /**
     * The id that is applied to the chart's container.
     */
    chartID?: string;

    /**
     * Names that should be mapped to point values or props. You can
     * declare which columns will be parameter of the point. It is useful for
     * series like OHLC, candlestick, columnrange or arearange.
     *
     * The seriesName field is mandatory for displaying series (for instance in
     * the legend) properly.
     *
     * @example
     * ```
     * columnAssignment: {
     *      'Dates': 'x',
     *      'mySeriesName': {
     *             'open': 'myOpen',
     *             'high': 'myHigh',
     *             'low': 'myLow',
     *             'close': 'myClose'
     *      }
     * }
     * ```
    */
    columnAssignment?: Record<string, string | Record<string, string>>;

    /**
     * Defines which elements should be synced.
     * ```
     * Example:
     * {
     *     highlight: true
     * }
     * ```
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Extremes Sync }
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/ | Highlight Sync }
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/ | Visibility Sync }
     *
     */
    sync?: SyncOptions;
}

/**
 * Sync options available for the Highcharts component.
 *
 * Example:
 * ```
 * {
 *     highlight: true
 * }
 * ```
 */
export interface SyncOptions extends Sync.RawOptionsRecord {
    /**
     * Extremes sync is available for Highcharts, KPI, DataGrid and
     * Navigator components. Sets a common range of displayed data. For the
     * KPI Component sets the last value.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Extremes Sync }
     *
     * @default false
     */
    extremes?: boolean|Sync.OptionsEntry;
    /**
     * Highlight sync is available for Highcharts and DataGrid components.
     * It allows to highlight hovered corresponding rows in the table and
     * chart points.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/ | Highlight Sync }
     *
     * @default false
     */
    highlight?: boolean|Sync.HighlightSyncOptions;
    /**
     * Visibility sync is available for Highcharts and DataGrid components.
     * Synchronizes the visibility of data from a hidden/shown series.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/ | Visibility Sync }
     *
     * @default false
     */
    visibility?: boolean|Sync.OptionsEntry;
}


/* *
 *
 *  Default Export
 *
 * */


export default Options;
