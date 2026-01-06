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
 *  - Karol Kolodziej
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
import type { ColumnDataType } from '../../Core/Table/Column';

import DownloadURL from '../../../Shared/DownloadURL.js';
import U from '../../../Core/Utilities.js';

const { downloadURL, getBlobFromContent } = DownloadURL;
const { defined } = U;


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
        const dataTable = modified ? grid.presentationTable : grid.dataTable;

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

        const columnIds = grid.enabledColumns ?? [];
        const columnsCount = columnIds?.length;
        const csvRows: string[] = [];
        const rowArray: DataTable.CellType[][] = [];

        // Add the names as the first row if they should be exported
        if (exportNames) {
            csvRows.push(columnIds.map(
                (columnId): string => `"${columnId}"`
            ).join(itemDelimiter));
        }

        const typeParser = (
            type: ColumnDataType
        ): ((val: DataTable.CellType) => string) => {
            switch (type) {
                case 'number':
                case 'datetime':
                    return (val: DataTable.CellType): string => (
                        defined(val) ?
                            String(val).replace('.', decimalPoint) :
                            ''
                    );
                case 'string':
                    return (val: DataTable.CellType): string => (
                        defined(val) ?
                            `"${val}"` :
                            ''
                    );
                case 'boolean':
                    return (val: DataTable.CellType): string => (
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
                columnArray = dataTable.getColumn(columnId) ?? [],
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
        return this.grid.getData(modified);
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
}

/* *
 *
 *  Default Export
 *
 * */

export default Exporting;
