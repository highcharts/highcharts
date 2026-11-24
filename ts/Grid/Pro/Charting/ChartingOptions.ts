/* *
 *
 *  Grid Charting options
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Markus Barstad
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type Charting from './Charting';
import type { AnyRecord } from '../../../Shared/Types';
import type { GridEvent } from '../../Core/GridUtils';
import type { RowId } from '../../Core/Data/DataProvider';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Chart types the Grid can create from its data. `stackedColumn` is a column
 * chart with the series stacked on top of each other.
 */
export type ChartingChartType = (
    'area' | 'bar' | 'bubble' | 'column' | 'line' | 'pie' | 'scatter' |
    'stackedColumn'
);

/**
 * Options for creating charts from the Grid data.
 */
export interface ChartingOptions {
    /**
     * Highcharts options merged into every chart created from the Grid, after
     * the generated options.
     */
    chartOptions?: AnyRecord;

    /**
     * The chart types to offer, in order of preference. Types that do not fit
     * the selected data are left out.
     *
     * @default ['line', 'area', 'column', 'stackedColumn', 'bar', 'pie', 'scatter', 'bubble']
     */
    types?: Array<ChartingChartType>;
}

/**
 * Options for `grid.charting.createChart()`.
 */
export interface CreateChartOptions {
    /**
     * Highcharts options merged into the generated options, after the
     * `charting.chartOptions` of the Grid.
     */
    chartOptions?: AnyRecord;

    /**
     * The ids of the columns to chart. Defaults to every enabled column bound
     * to data.
     */
    columns?: Array<string>;

    /**
     * The element, or its id, to render the chart in. When not set, the chart
     * opens in a popup over the Grid.
     */
    renderTo?: string | HTMLElement;

    /**
     * The ids of the rows to chart, such as the ids returned by
     * `grid.rowSelection.getSelectedRowIds()`. The rows are charted in the
     * order the Grid presents them, and rows filtered out are left out.
     * Defaults to every row after sorting and filtering.
     */
    rows?: Array<RowId>;

    /**
     * The chart type. Defaults to the first recommended type for the columns.
     */
    type?: ChartingChartType;
}

/**
 * Payload of the `beforeChartCreate` event.
 */
export interface BeforeChartCreateEvent extends GridEvent<Grid> {
    /**
     * The generated chart options. Change them in place to customize the
     * chart.
     */
    chartOptions: AnyRecord;

    /**
     * The ids of the charted columns.
     */
    columns: Array<string>;

    /**
     * The chart type.
     */
    chartType: ChartingChartType;

    /**
     * Cancels the chart creation.
     */
    preventDefault: () => void;
}

/**
 * Payload of the `afterChartCreate` event.
 */
export interface AfterChartCreateEvent extends GridEvent<Grid> {
    /**
     * The created Highcharts chart.
     */
    chart: AnyRecord;

    /**
     * The ids of the charted columns.
     */
    columns: Array<string>;

    /**
     * The chart type.
     */
    chartType: ChartingChartType;
}


/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * Options for creating Highcharts charts from the Grid data. Requires
         * Highcharts to be loaded.
         */
        charting?: ChartingOptions;
    }
}

declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * Language options for creating charts from the Grid data.
         */
        charting?: {
            /**
             * The accessible label of the button closing the chart popup.
             *
             * @default 'Close chart'
             */
            closeChart?: string;
        };
    }
}

declare module '../GridEvents' {
    interface GridEvents {
        /**
         * Callback function to be called before a chart is created from the
         * Grid data. Change `event.chartOptions` to customize the chart, or
         * call `event.preventDefault()` to cancel it.
         */
        beforeChartCreate?: (this: Grid, e: BeforeChartCreateEvent) => void;

        /**
         * Callback function to be called after a chart was created from the
         * Grid data.
         */
        afterChartCreate?: (this: Grid, e: AfterChartCreateEvent) => void;
    }
}

declare module '../../Core/Grid' {
    export default interface Grid {
        charting?: Charting;
    }
}
