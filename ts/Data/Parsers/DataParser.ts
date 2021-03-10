/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';

import OldTownTable from '../OldTownTable.js';
import OldTownTableRow from '../OldTownTableRow.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Abstract class providing an interface and basic methods for a DataParser
 */
abstract class DataParser<TEventObject extends DataParser.EventObject>
implements DataEventEmitter<TEventObject>, DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options
     */
    protected static readonly defaultOptions: DataParser.Options = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true,
        switchRowsAndColumns: false
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts the OldTownTable instance to a record of columns.
     *
     * @param {OldTownTable} table
     * Table to convert.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {Array<Array<OldTownTableRow.CellType>>}
     * A record of columns, where the key is the name of the column,
     * and the values are the content of the column.
     */
    public static getColumnsFromTable(
        table: OldTownTable,
        usePresentationOrder?: boolean
    ): Array<Array<OldTownTableRow.CellType>> {
        const columnsObject: OldTownTable.ColumnCollection = {
                id: []
            },
            rows = table.getAllRows();

        for (let rowIndex = 0, rowCount = rows.length; rowIndex < rowCount; rowIndex++) {
            const row = rows[rowIndex],
                cellNames = row.getCellNames(),
                cellCount = cellNames.length;

            columnsObject.id.push(row.id); // Push the ID column

            for (let j = 0; j < cellCount; j++) {
                const cellName = cellNames[j],
                    cell = row.getCell(cellName);

                if (!columnsObject[cellName]) {
                    columnsObject[cellName] = [];
                    // If row number is greater than 0
                    // add the previous rows as undefined
                    if (rowIndex > 0) {
                        for (let rowNumber = 0; rowNumber < rowIndex; rowNumber++) {
                            columnsObject[cellName][rowNumber] = void 0;
                        }
                    }
                }
                columnsObject[cellName][rowIndex] = cell;
            }

            // If the object has columns that were not in the row
            // add them as undefined
            const columnsInObject = Object.keys(columnsObject);

            for (
                let columnIndex = 0;
                columnIndex < columnsInObject.length;
                columnIndex++
            ) {
                const columnName = columnsInObject[columnIndex];

                while (columnsObject[columnName].length - 1 < rowIndex) {
                    columnsObject[columnName].push(void 0);
                }
            }
        }

        const columnNames = Object.keys(columnsObject);

        if (usePresentationOrder) {
            columnNames.sort(table.presentationState.getColumnSorter());
        }

        return columnNames.map(
            (columnName: string): Array<OldTownTableRow.CellType> => columnsObject[columnName]
        );
    }

    /**
     * Converts a simple two dimensional array to a OldTownTable instance. The
     * array needs to be structured like a DataFrame, so that the first
     * dimension becomes the columns and the second dimension the rows.
     *
     * @param {Array<Array<OldTownTableRow.CellType>>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @return {OldTownTable}
     * OldTownTable instance from the arrays.
     */
    public static getTableFromColumns(
        columns: Array<Array<OldTownTableRow.CellType>> = [],
        headers: Array<string> = []
    ): OldTownTable {
        const columnsLength = columns.length,
            table = new OldTownTable();

        // Assign an unique id for every column
        // without a provided name
        while (headers.length < columnsLength) {
            headers.push(uniqueKey());
        }

        table.presentationState.setColumnOrder(headers);

        if (columnsLength) {
            const idIndex = headers.indexOf('id');

            if (idIndex >= 0) {
                const idColumn = columns.splice(idIndex, 1)[0];

                for (let i = 0, iEnd = idColumn.length; i < iEnd; ++i) {
                    table.insertRow(new OldTownTableRow({ id: idColumn[i] }));
                }

                headers.splice(idIndex, 1);
            }

            for (let i = 0, iEnd = headers.length; i < iEnd; ++i) {
                table.setColumn(headers[i], columns[i]);
            }
        }

        return table;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Getter for the data table
     * @return {OldTownTable}
     */
    public abstract getTable(): OldTownTable;

    /**
     * Emits an event on the DataParser instance.
     *
     * @param {DataParser.EventObject} [e]
     * Event object containing additional event data
     */
    public emit<T extends DataEventEmitter.EventObject>(e: T): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific parser event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on<T extends DataEventEmitter.EventObject>(
        type: T['type'],
        callback: DataEventEmitter.EventCallback<this, T>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Initiates the data parsing. Should emit `parseError` on failure.
     *
     * @param {DataParser.Options} options
     * Options for the parser.
     */
    public abstract parse(options: DataParser.Options): void;

    /**
     * Converts the class instance to ClassJSON
     *
     * @return {DataJSON.ClassJSON}
     */
    public abstract toJSON(): DataJSON.ClassJSON;

    /**
     * DataConverter for the parser.
     */
    public abstract converter: DataConverter;
}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for events and conversion.
 */
namespace DataParser {

    /**
     * The basic event object for a DataParser instance.
     * Valid types are `parse`, `afterParse`, and `parseError`
     */
    export interface EventObject extends DataEventEmitter.EventObject {
        readonly type: ('parse' | 'afterParse' | 'parseError');
        readonly columns: OldTownTableRow.CellType[][];
        readonly error?: (string | Error);
        readonly headers: string[];
    }

    /**
     * The shared options for all DataParser instances
     */
    export interface Options extends DataJSON.JSONObject {
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
        firstRowAsNames: boolean;
        switchRowsAndColumns: boolean;
    }

}

export default DataParser;
