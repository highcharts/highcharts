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
import type ComponentConnectorHandler from '../../Components/ComponentConnectorHandler.js';
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
     * Connector options for the component.
     */
    connector?: ConnectorOptions;

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
     * @deprecated
     * This option is deprecated and does not work anymore.
     * Use [`connector.columnAssignment`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_HighchartsComponent_HighchartsComponentOptions.ConnectorOptions#columnAssignment) instead.
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

    /**
    * Sync options for the component.
    */
    syncHandlers?: Sync.OptionsRecord;
}

/**
 * Highcharts component connector options.
 */
export interface ConnectorOptions extends ComponentConnectorHandler.ConnectorOptions {
    /**
     * It allows to assign the data from the connector to specific series in the
     * chart in different ways using series IDs and column names.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/highcharts-column-assignment-1d-data | One-dimensional data column assignment}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/highcharts-column-assignment-2d-data | Two-dimensional data column assignment}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/highcharts-column-assignment-keys-data | Key-defined two-dimensional data column assignment}
     *
     * @example
     * ```
     * // One-dimensional data column assignment
     * columnAssignment: [{
     *     seriesId: 'mySeriesId',
     *     data: 'myData'
     * }]
     *
     * // Two-dimensional data column assignment
     * columnAssignment: [{
     *     seriesId: 'mySeriesId',
     *     data: ['myX', 'myY']
     * }]
     *
     * // Key-defined two-dimensional data column assignment
     * columnAssignment: [{
     *     seriesId: 'myStockSeriesId',
     *     data: {
     *         x: 'myX',
     *         open: 'myOpen',
     *         high: 'myHigh',
     *         low: 'myLow',
     *         close: 'myClose'
     *     },
     * }, {
     *     seriesId: 'myColumnSeriesId',
     *     data: {
     *         name: 'myNamesColumn',
     *         y: 'myYColumn',
     *         'dataLabels.style.visibility': 'myDataLabelVisibilityColumn'
     *     }
     * }]
     * ```
     */
    columnAssignment?: ColumnAssignmentOptions[];
}

/**
 * Column to series data assignment options.
 */
export interface ColumnAssignmentOptions {
    /**
     * The series id that the data should be assigned to. If the series with
     * given `id` is not found, the series will be created automatically. The
     * series name will be the same as the series `id` then.
     */
    seriesId: string;
    /**
     * The column data for the series in the chart. Value can be:
     * - `string` - name of the column that contains the one-dimensional data.
     * - `string[]` - names of the columns that data will be used in the
     * two-dimensional format.
     * - `Record<string, string>` - the object with the keys as [series data key names](https://api.highcharts.com/highcharts/plotOptions.series.keys)
     * and column names that will be used for the key-defined two-dimensional
     * series data.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/highcharts-column-assignment-1d-data | One-dimensional data column assignment}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/highcharts-column-assignment-2d-data | Two-dimensional data column assignment}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/highcharts-column-assignment-keys-data | Key-defined two-dimensional data column assignment}
     *
     */
    data: string | string[] | Record<string, string>;
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
