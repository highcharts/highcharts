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

import type Column from '../../Core/Table/Column';
import type Grid from '../../Core/Grid';
import type DataTable from '../../../Data/DataTable';
import type { CellType as DataTableCellType } from '../../../Data/DataTable';
import type { AnyRecord } from '../../../Shared/Types';
import type { RowId } from '../../Core/Data/DataProvider';
import type { ChartColumn } from './ChartRecommender';
import type {
    BeforeChartCreateEvent,
    ChartingChartType,
    ChartingOptions,
    CreateChartOptions
} from './ChartingOptions';

import ChartPopup from './ChartPopup.js';
import { buildChartOptions, getSeriesType } from './ChartConfigBuilder.js';
import { recommend } from './ChartRecommender.js';
import { LocalDataProvider } from '../../Core/Data/LocalDataProvider.js';
import { sanitizeText } from '../../Core/GridUtils.js';
import {
    fireEvent,
    isNumber,
    isString,
    merge
} from '../../../Shared/Utilities.js';


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


/**
 * Returns the display name of a column, resolved from its header options the
 * way the header cell renders it, as plain text. Unlike the header element,
 * it is there for columns that column virtualization has not rendered.
 *
 * @param column
 * The column.
 *
 * @return
 * The column name.
 */
function getColumnName(column: Column): string {
    const header = column.options.header;
    const value = header?.formatter?.call(column)?.toString() ||
        (isString(header?.format) ? column.format(header.format) : '');

    return (value && sanitizeText(value)) || column.id;
}

/**
 * Returns the indexes in the presentation table of the rows with the given
 * ids, in presentation order. Row ids are resolved like
 * `LocalDataProvider.getRowId`: the value in the `idColumn`, or the original
 * row index.
 *
 * @param dataTable
 * The presentation table.
 *
 * @param rowIds
 * The ids of the rows.
 *
 * @param idColumn
 * The id of the column holding the row ids, if any.
 *
 * @return
 * The row indexes.
 */
function getRowIndexes(
    dataTable: DataTable,
    rowIds: Array<RowId>,
    idColumn?: string
): Array<number> {
    const ids = new Set(rowIds);
    const idValues = idColumn ? dataTable.getColumn(idColumn) : void 0;
    const indexes: Array<number> = [];

    for (let i = 0, iEnd = dataTable.getRowCount(); i < iEnd; ++i) {
        const id = idValues ? idValues[i] : dataTable.getOriginalRowIndex(i);

        if ((isString(id) || isNumber(id)) && ids.has(id)) {
            indexes.push(i);
        }
    }

    return indexes;
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
        types: [
            'line', 'area', 'column', 'stackedColumn', 'bar', 'pie',
            'scatter', 'bubble'
        ]
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
     * @param rowIds
     * The ids of the rows to chart. Defaults to every row after sorting and
     * filtering.
     *
     * @return
     * The recommended chart types.
     */
    public getRecommendations(
        columnIds?: Array<string>,
        rowIds?: Array<RowId>
    ): Array<ChartingChartType> {
        return this.recommend(this.getChartColumns(columnIds, rowIds));
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

        const columns = this.getChartColumns(options.columns, options.rows);
        const type = options.type ?? this.recommend(columns)[0];
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
        // Anchored to the Grid, so that the popup follows it on reflow.
        this.popup.show(grid.contentWrapper);

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
     * Returns the chart types that fit the columns, limited to the types in
     * `charting.types` and, once Highcharts is loaded, to the types its loaded
     * modules can draw, such as `bubble`, which needs `highcharts-more.js`.
     *
     * @param columns
     * The columns prepared for charting.
     *
     * @return
     * The recommended chart types.
     */
    private recommend(columns: Array<ChartColumn>): Array<ChartingChartType> {
        const allowed = this.grid.options?.charting?.types ??
            Charting.defaultOptions.types ?? [];

        const seriesTypes = Charting.H?.seriesTypes;

        return recommend(columns).filter((type): boolean => (
            allowed.includes(type) &&
            (!seriesTypes || !!seriesTypes[getSeriesType(type)])
        ));
    }

    /**
     * Collects the values of the columns as the Grid presents them, after
     * sorting and filtering.
     *
     * @param columnIds
     * The ids of the columns. Defaults to every enabled column bound to data.
     *
     * @param rowIds
     * The ids of the rows. Defaults to every row after sorting and filtering.
     *
     * @return
     * The columns prepared for charting.
     */
    private getChartColumns(
        columnIds?: Array<string>,
        rowIds?: Array<RowId>
    ): Array<ChartColumn> {
        const { grid } = this;
        const { columnPolicy, dataProvider, viewport } = grid;
        const dataTable = dataProvider instanceof LocalDataProvider ?
            dataProvider.getDataTable(true) :
            void 0;
        const result: Array<ChartColumn> = [];

        if (!dataTable || !(dataProvider instanceof LocalDataProvider)) {
            warn(
                'Charts can only be created from a local ' +
                'data provider.'
            );
            return result;
        }

        const rowIndexes = rowIds && getRowIndexes(
            dataTable,
            rowIds,
            dataProvider.options.idColumn
        );

        for (const columnId of columnIds ?? grid.enabledColumns ?? []) {
            const sourceId = columnPolicy.getColumnSourceId(columnId);
            const values = sourceId && dataTable.getColumn(sourceId);
            const column = viewport?.getColumn(columnId);

            if (!values || !column) {
                continue;
            }

            result.push({
                id: columnId,
                name: getColumnName(column),
                dataType: column.dataType,
                format: column.options.cells?.format,
                values: rowIndexes ?
                    rowIndexes.map((i): DataTableCellType => values[i]) :
                    Array.from(values)
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
