/* *
 *
 *  Grid Exporting class
 *
 *  (c) 2020-2025 Highsoft AS
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

import type Grid from '../../Core/Grid';
import type { ExportingOptions } from '../../Core/Options';

import U from '../../../Core/Utilities.js';

const { merge } = U;


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
     * The options for the exporting.
     */
    public options: ExportingOptions;

    /**
     * Default options of the credits.
     */
    public static defaultOptions: ExportingOptions = {
        firstRowAsNames: true,
        itemDelimiter: ',',
        lineDelimiter: '\n',
        useLocalDecimalPoint: true
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
     *
     * @param options
     * The options for the exporting.
     */
    constructor(grid: Grid, options?: ExportingOptions) {
        this.grid = grid;
        this.options = merge(Exporting.defaultOptions, options);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Downloads the CSV string as a file.
     */
    public downloadCSV(): void {
        const csv = this.getCSV();

        // eslint-disable-next-line no-console
        console.log(csv);
    }

    /**
     * Creates a CSV string from the data table.
     *
     * @return
     * CSV string representing the data table.
     */
    public getCSV(): string {
        const dataTable = this.grid.dataTable;

        if (!dataTable) {
            return '';
        }

        const options =
            this.grid.options?.exporting || Exporting.defaultOptions;
        const { useLocalDecimalPoint, lineDelimiter, firstRowAsNames } =
            options;
        const exportNames = (firstRowAsNames !== false);
        let { decimalPoint, itemDelimiter } = options;

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

        const columns = dataTable.getColumns(),
            columnIds = Object.keys(columns),
            csvRows: string[] = [],
            columnsCount = columnIds.length;

        const rowArray: any[] = [];

        // Add the names as the first row if they should be exported
        if (exportNames) {
            csvRows.push(columnIds.map(
                (columnId): string => `"${columnId}"`
            ).join(itemDelimiter));
        }

        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const columnId = columnIds[columnIndex],
                column = columns[columnId],
                columnLength = column.length;

            let columnDataType;

            for (let rowIndex = 0; rowIndex < columnLength; rowIndex++) {
                let cellValue = column[rowIndex];

                if (!rowArray[rowIndex]) {
                    rowArray[rowIndex] = [];
                }

                // Prefer datatype from metadata
                if (columnDataType === 'string') {
                    cellValue = '"' + cellValue + '"';
                } else if (typeof cellValue === 'number') {
                    cellValue = String(cellValue).replace('.', decimalPoint);
                } else if (typeof cellValue === 'string') {
                    cellValue = `"${cellValue}"`;
                }

                rowArray[rowIndex][columnIndex] = cellValue;

                // On the final column, push the row to the CSV
                if (columnIndex === columnsCount - 1) {
                    // Trim repeated undefined values starting at the end
                    // Currently, we export the first "comma" even if the
                    // second value is undefined
                    let i = columnIndex;
                    while (rowArray[rowIndex].length > 2) {
                        const cellVal = rowArray[rowIndex][i];
                        if (cellVal !== void 0) {
                            break;
                        }
                        rowArray[rowIndex].pop();
                        i--;
                    }

                    csvRows.push(rowArray[rowIndex].join(itemDelimiter));
                }
            }
        }

        return csvRows.join(lineDelimiter);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Exporting {
}


/* *
 *
 *  Default Export
 *
 * */

export default Exporting;
