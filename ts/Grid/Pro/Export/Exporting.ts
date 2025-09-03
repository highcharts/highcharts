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
     */
    constructor(grid: Grid) {

        this.grid = grid;
    }


    /* *
    *
    *  Methods
    *
    * */

    public downloadCSV(): void {
        const csv = this.getCSV(true, true);

        console.log(csv);
    }

    /**
     * Creates a CSV string from the data table on the connector instance.
     *
     * @param dataTable
     * Connector instance to export from.
     *
     * @param {CSVConverterOptions} [options]
     * Options used for the export.
     *
     * @return {string}
     * CSV string from the connector table.
     */
    public getCSV(
        dataTable: any,
        options: any
    ): string {
        const { useLocalDecimalPoint, lineDelimiter, firstRowAsNames } = options;
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
