/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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


import type ConnectorHandler from '../ConnectorHandler.js';
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
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/grid-sync/ | Allow connector update comparison}
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
    connector?: (ConnectorOptions | Array<ConnectorOptions>);

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
export interface ConnectorOptions extends ConnectorHandler.ConnectorOptions {
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
    /**
     * Highlight sync is available for Highcharts and Grid components.
     * It allows to highlight hovered corresponding rows in the table and
     * chart points.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/ | Highlight Sync }
     *
     * @default false
     */
    highlight?: boolean | HighchartsHighlightSyncOptions;
    /**
     * Visibility sync is available for Highcharts and Grid components.
     * Synchronizes the visibility of data from a hidden/shown series.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/ | Visibility Sync }
     *
     * @default false
     */
    visibility?: boolean | Sync.OptionsEntry;
}

/**
 * Highcharts component highlight sync options.
 *
 * Example:
 * ```
 * {
 *     enabled: true,
 *     highlightPoint: true,
 *     showTooltip: false,
 *     showCrosshair: true
 * }
 * ```
 */
export interface HighchartsHighlightSyncOptions extends Sync.OptionsEntry {
    /**
     * ID of the series that should be affected by the highlight. If not
     * defined, the appropriate series will be found according to the column
     * assignment. This option only makes sense with `tooltip.shared: false`.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/sync/highcharts-highlight-affected-series | Affected Series ID Option }
     *
     * @default null
     */
    affectedSeriesId?: string | null;
    /**
     * Whether the marker should be synced. When hovering over a point in
     * other component in the same group, the 'hover' state is enabled at
     * the corresponding point in this component.
     *
     * @default true
     */
    highlightPoint?: boolean;
    /**
     * Whether the tooltip should be synced. When hovering over a point in
     * other component in the same group, in this component the tooltip
     * should be also shown.
     *
     * @default true
     */
    showTooltip?: boolean;
    /**
     * Whether the crosshair should be synced. When hovering over a point in
     * other component in the same group, in this component the crosshair
     * should be also shown.
     *
     * Works only for axes that have crosshair enabled.
     *
     * @default true
     */
    showCrosshair?: boolean;
}


/* *
 *
 *  Default Export
 *
 * */


export default Options;
