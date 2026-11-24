/* *
 *
 *  Grid Charting class
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
import type { AnyRecord } from '../../../Shared/Types';
import type { ChartColumn } from './ChartRecommender';
import type {
    BeforeChartCreateEvent,
    ChartingChartType,
    ChartingOptions,
    CreateChartOptions
} from './ChartingOptions';

import ChartPopup from './ChartPopup.js';
import { buildChartOptions } from './ChartConfigBuilder.js';
import { recommend } from './ChartRecommender.js';
import { hasDataTableProvider } from '../../Core/Data/DataProvider.js';
import { fireEvent, merge } from '../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Warns about a charting problem in the console.
 *
 * @param message
 * The warning message.
 */
function warn(message: string): void {
    // eslint-disable-next-line no-console
    console.warn('Grid charting: ' + message);
}


/* *
 *
 *  Class
 *
 * */

/**
 * Creates Highcharts charts from the Grid data.
 */
class Charting {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The default charting options.
     */
    public static defaultOptions: ChartingOptions = {
        types: ['line', 'area', 'column', 'bar', 'pie', 'scatter', 'bubble']
    };

    /**
     * The Highcharts namespace used to create charts.
     */
    public static H?: AnyRecord;


    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Registers the Highcharts namespace used to create charts. Called
     * automatically when Highcharts is loaded before the Grid.
     *
     * @param H
     * The Highcharts namespace.
     */
    public static useHighcharts(H: AnyRecord): void {
        if (H && !Charting.H) {
            Charting.H = H;
        }
    }


    /* *
     *
     *  Properties
     *
     * */

    /**
     * The Grid the charts are created from.
     */
    public readonly grid: Grid;

    /**
     * The popup showing the last chart created without `renderTo`.
     */
    public popup?: ChartPopup;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs the charting controller of a Grid.
     *
     * @param grid
     * The Grid the charts are created from.
     */
    constructor(grid: Grid) {
        this.grid = grid;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns the chart types that fit the columns, best match first, limited
     * to the types in `charting.types`.
     *
     * @param columnIds
     * The ids of the columns to chart. Defaults to every enabled column bound
     * to data.
     *
     * @return
     * The recommended chart types.
     */
    public getRecommendations(
        columnIds?: Array<string>
    ): Array<ChartingChartType> {
        const allowed = this.grid.options?.charting?.types ??
            Charting.defaultOptions.types ?? [];

        return recommend(this.getChartColumns(columnIds)).filter(
            (type): boolean => allowed.includes(type)
        );
    }

    /**
     * Creates a chart from the Grid data, as it is presented after sorting
     * and filtering.
     *
     * @param options
     * What to chart, how and where.
     *
     * @return
     * The created chart, or `undefined` when no chart was created.
     */
    public createChart(
        options: CreateChartOptions = {}
    ): AnyRecord | undefined {
        const H = Charting.H;
        const grid = this.grid;

        if (!H) {
            warn(
                'Highcharts is not loaded. Load Highcharts ' +
                'before the Grid, or call ' +
                '`Grid.Charting.useHighcharts(Highcharts)`.'
            );
            return;
        }

        const columns = this.getChartColumns(options.columns);
        const type = options.type ??
            this.getRecommendations(options.columns)[0];
        const generated = type && buildChartOptions(columns, type);

        if (!type || !generated) {
            warn(
                'The columns hold no numbers to chart.'
            );
            return;
        }

        const columnIds = columns.map((column): string => column.id);
        const beforeEvent = {
            chartOptions: merge(
                generated,
                grid.options?.charting?.chartOptions,
                options.chartOptions
            ),
            columns: columnIds,
            chartType: type
        } as unknown as BeforeChartCreateEvent;

        fireEvent(grid, 'beforeChartCreate', beforeEvent);

        if ((beforeEvent as { defaultPrevented?: boolean }).defaultPrevented) {
            return;
        }

        const create = (container: string | HTMLElement): AnyRecord => {
            const chart: AnyRecord = H.chart(
                container,
                beforeEvent.chartOptions
            );

            fireEvent(grid, 'afterChartCreate', {
                chart,
                columns: columnIds,
                chartType: type
            });

            return chart;
        };

        if (options.renderTo) {
            return create(options.renderTo);
        }

        this.popup?.hide();
        this.popup = new ChartPopup(grid, create);
        this.popup.show();

        return this.popup.chart;
    }

    /**
     * Destroys the charting controller and the chart popup.
     */
    public destroy(): void {
        this.popup?.hide();
        delete this.popup;
    }

    /**
     * Collects the values of the columns as the Grid presents them, after
     * sorting and filtering.
     *
     * @param columnIds
     * The ids of the columns. Defaults to every enabled column bound to data.
     *
     * @return
     * The columns prepared for charting.
     */
    private getChartColumns(columnIds?: Array<string>): Array<ChartColumn> {
        const { grid } = this;
        const { columnPolicy, dataProvider, viewport } = grid;
        const dataTable = hasDataTableProvider(dataProvider) ?
            dataProvider.getDataTable(true) :
            void 0;
        const result: Array<ChartColumn> = [];

        if (!dataTable) {
            warn(
                'Charts can only be created from a local ' +
                'data provider.'
            );
            return result;
        }

        for (const columnId of columnIds ?? grid.enabledColumns ?? []) {
            const sourceId = columnPolicy.getColumnSourceId(columnId);
            const values = sourceId && dataTable.getColumn(sourceId);
            const column = viewport?.getColumn(columnId);

            if (!values || !column) {
                continue;
            }

            result.push({
                id: columnId,
                name: column.header?.headerContent?.textContent || columnId,
                dataType: column.dataType,
                values: Array.from(values)
            });
        }

        return result;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Charting;
