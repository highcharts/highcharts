/* *
 *
 *  Grid Exporting class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Karol Kołodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type { ExportingOptions } from '../../Core/Options';
import type DataTable from '../../../Data/DataTable';
import type {
    CellType as DataTableCellType,
    Column as DataTableColumn
} from '../../../Data/DataTable';
import type { ColumnDataType } from '../../Core/Table/Column';

import {
    hasDataTableProvider
} from '../../Core/Data/DataProvider.js';
import {
    downloadURL,
    getBlobFromContent
} from '../../../Shared/DownloadURL.js';
import { defined } from '../../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Export the given table to CSV format.
 */
class Exporting {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The Grid instance.
     */
    public readonly grid: Grid;

    /**
     * Default options of the credits.
     */
    public static defaultOptions: ExportingOptions = {
        filename: 'Grid',
        csv: {
            firstRowAsNames: true,
            useLocalDecimalPoint: true,
            itemDelimiter: ',',
            lineDelimiter: '\n'
        }
    };


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Construct the exporting.
     *
     * @param grid
     * The Grid instance.
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
     * Downloads the CSV string as a file.
     *
     * @param modified
     * Whether to return the modified data table (after filtering/sorting/etc.)
     * or the unmodified, original one. Default value is set to `true`.
     */
    public downloadCSV(modified: boolean = true): void {
        const csv = this.getCSV(modified);

        downloadURL(
            getBlobFromContent(csv, 'text/csv') ||
                'data:text/csv,\uFEFF' + encodeURIComponent(csv),
            this.getFilename() + '.csv'
        );
    }

    /**
     * Downloads the JSON string as a file.
     *
     * @param modified
     * Whether to return the modified data table (after filtering/sorting/etc.)
     * or the unmodified, original one. Default value is set to `true`.
     */
    public downloadJSON(modified: boolean = true): void {
        const json = this.getJSON(modified);

        downloadURL(
            getBlobFromContent(json, 'application/json') ||
                'data:application/json,\uFEFF' + encodeURIComponent(json),
            this.getFilename() + '.json'
        );
    }

    /**
     * Creates a CSV string from the data grid.
     *
     * @param modified
     * Whether to return the data including the modifiers (filtering, sorting,
     * etc.) or the original data. Default value is set to `true`.
     *
     * @return
     * CSV string representing the data table.
     */
    public getCSV(modified: boolean = true): string {
        const { grid } = this;
        const dataTable = this.getDataTable(modified);

        if (!dataTable) {
            return '';
        }

        const options =
            this.grid.options?.exporting || Exporting.defaultOptions;
        const { useLocalDecimalPoint, lineDelimiter, firstRowAsNames } =
            options.csv ?? {};
        const exportNames = firstRowAsNames !== false;
        let { decimalPoint, itemDelimiter } = options.csv ?? {};

        if (!decimalPoint) {
            decimalPoint = (
                itemDelimiter !== ',' && useLocalDecimalPoint ?
                    (1.1).toLocaleString()[1] :
                    '.'
            );
        }

        if (!itemDelimiter) {
            itemDelimiter = (decimalPoint === ',' ? ';' : ',');
        }

        const columnIds = (grid.enabledColumns ?? []).filter(
            (columnId): boolean => grid.columnPolicy.isColumnExportable(
                columnId
            )
        );
        const columnsCount = columnIds?.length;
        const csvRows: string[] = [];
        const rowArray: DataTableCellType[][] = [];

        // Add the names as the first row if they should be exported
        if (exportNames) {
            csvRows.push(columnIds.map(
                (columnId): string => `"${columnId}"`
            ).join(itemDelimiter));
        }

        const typeParser = (
            type: ColumnDataType
        ): ((val: DataTableCellType) => string) => {
            switch (type) {
                case 'number':
                case 'datetime':
                    return (val: DataTableCellType): string => (
                        defined(val) ?
                            String(val).replace('.', decimalPoint) :
                            ''
                    );
                case 'string':
                    return (val: DataTableCellType): string => (
                        defined(val) ?
                            `"${val}"` :
                            ''
                    );
                case 'boolean':
                    return (val: DataTableCellType): string => (
                        defined(val) ?
                            (val ? 'TRUE' : 'FALSE') :
                            ''
                    );
            }
        };

        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const columnId = columnIds[columnIndex],
                column = grid.viewport?.getColumn(columnId),
                colType = column?.dataType,
                sourceColumnId = grid.columnPolicy.getColumnSourceId(columnId),
                columnArray = sourceColumnId ?
                    (dataTable.getColumn(sourceColumnId) ?? []) :
                    [],
                columnLength = columnArray?.length,
                parser = typeParser(colType ?? 'string');

            for (let rowIndex = 0; rowIndex < columnLength; rowIndex++) {
                let row = rowArray[rowIndex];
                if (!row) {
                    row = rowArray[rowIndex] = [];
                }

                row[columnIndex] = parser(columnArray[rowIndex]);

                // On the final column, push the row to the CSV
                if (columnIndex === columnsCount - 1) {
                    // Trim repeated undefined values starting at the end
                    // Currently, we export the first "comma" even if the
                    // second value is undefined
                    let i = columnIndex;
                    while (row.length > 2) {
                        const cellVal = row[i];
                        if (cellVal !== void 0) {
                            break;
                        }
                        row.pop();
                        i--;
                    }

                    csvRows.push(row.join(itemDelimiter));
                }
            }
        }

        return csvRows.join(lineDelimiter);
    }

    /**
     * Returns the current grid data as a JSON string.
     *
     * @param modified
     * Whether to return the modified data table (after filtering/sorting/etc.)
     * or the unmodified, original one. Default value is set to `true`.
     *
     * @return
     * JSON representation of the data
     */
    public getJSON(modified: boolean = true): string {
        const dataTable = this.getDataTable(modified);
        const tableColumns = dataTable?.columns;
        const outputColumns: Record<string, DataTableColumn> = {};

        if (!dataTable) {
            // eslint-disable-next-line no-console
            console.warn('getJSON() works only with LocalDataProvider.');
            return JSON.stringify({
                error: 'getJSON() works only with LocalDataProvider.'
            }, null, 2);
        }

        if (!this.grid.enabledColumns || !tableColumns) {
            return '{}';
        }

        const typeParser = (type: ColumnDataType) => {
            const TypeMap: Record<
                ColumnDataType,
                (value: DataTableCellType) => DataTableCellType
            > = {
                number: Number,
                datetime: Number,
                string: String,
                'boolean': Boolean
            };

            return (value: DataTableCellType): DataTableCellType | null => (
                defined(value) ? TypeMap[type](value) : null
            );
        };

        for (const columnId of this.grid.enabledColumns) {
            const column = this.grid.viewport?.getColumn(columnId);
            const sourceColumnId =
                this.grid.columnPolicy.getColumnSourceId(columnId);

            if (
                !column ||
                !sourceColumnId ||
                !this.grid.columnPolicy.isColumnExportable(columnId)
            ) {
                continue;
            }

            const columnData = tableColumns[sourceColumnId];
            if (!columnData) {
                continue;
            }

            const parser = typeParser(column.dataType);
            outputColumns[columnId] = ((): DataTableColumn => {
                const result = [];
                for (let i = 0, iEnd = columnData.length; i < iEnd; ++i) {
                    result.push(parser(columnData[i]));
                }
                return result;
            })();
        }

        return JSON.stringify(outputColumns, null, 2);
    }

    /**
     * Get the default file name used for exported the grid.
     *
     * @returns
     * A file name without extension.
     */
    private getFilename(): string {
        let filename = this.grid.options?.exporting?.filename || 'Grid';

        if (filename) {
            return filename.replace(/\//g, '-');
        }

        if (typeof filename === 'string') {
            filename = filename
                .toLowerCase()
                .replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
                .replace(/[\s_]+/g, '-')
                .replace(/[^a-z\d\-]/g, '') // Preserve only latin
                .replace(/^[\-]+/g, '') // Dashes in the start
                .replace(/[\-]+/g, '-') // Dashes in a row
                .substr(0, 24)
                .replace(/[\-]+$/g, ''); // Dashes in the end;
        }

        return filename;
    }

    private getDataTable(modified: boolean): DataTable | undefined {
        const { dataProvider } = this.grid;

        return hasDataTableProvider(dataProvider) ?
            dataProvider.getDataTable(modified) :
            void 0;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Exporting;
