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
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type SeriesOptions from '../../Core/Series/SeriesOptions';

import DataTable from '../DataTable.js';
import DataTableRow from '../DataTableRow.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
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
     * Converts the DataTable instance to a record of columns.
     *
     * @param {DataTable} table
     * Table to convert.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {Array<Array<DataTableRow.CellType>>}
     * A record of columns, where the key is the name of the column,
     * and the values are the content of the column.
     */
    public static getColumnsFromTable(
        table: DataTable,
        usePresentationOrder?: boolean
    ): Array<Array<DataTableRow.CellType>> {
        const columnsObject: DataTable.ColumnCollection = {
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
            (columnName: string): Array<DataTableRow.CellType> => columnsObject[columnName]
        );
    }

    /**
     * Converts the DataTableRow instance to common series options.
     *
     * @param {DataTableRow} tableRow
     * Table row to convert.
     *
     * @param {Array<string>} keys
     * Data keys to extract from the table row.
     *
     * @return {Highcharts.PointOptions}
     * Common point options.
     */
    public static getPointOptionsFromTableRow(
        tableRow: DataTableRow,
        keys: Array<string> = ['x', 'y']
    ): PointOptions {
        const pointOptions: (PointOptions&Record<string, any>) = {
                id: tableRow.id
            },
            cellNames = tableRow.getCellNames();

        let cellName: string;

        for (let j = 0, jEnd = cellNames.length; j < jEnd; ++j) {
            cellName = cellNames[j];
            if (keys.indexOf(cellName) === -1) {
                pointOptions.custom = (pointOptions.custom || {});
                pointOptions.custom[cellName] = tableRow.getCell(cellName);
            } else {
                pointOptions[cellName] = tableRow.getCell(cellName);
            }
        }

        return pointOptions;
    }

    /**
     * Converts the DataTable instance to common series options.
     *
     * @param {DataTable} table
     * Table to convert.
     *
     * @param {Array<string>} keys
     * Data keys to extract from table rows.
     *
     * @return {Highcharts.SeriesOptions}
     * Common series options.
     */
    public static getSeriesOptionsFromTable(
        table: DataTable,
        keys?: Array<string>
    ): SeriesOptions {
        const rows = table.getAllRows(),
            data: Array<PointOptions> = [],
            seriesOptions: SeriesOptions = {
                id: table.id,
                data,
                keys
            };

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            data.push(DataParser.getPointOptionsFromTableRow(rows[i], keys));
        }

        return seriesOptions;
    }

    /**
     * Converts a simple two dimensional array to a DataTable instance. The
     * array needs to be structured like a DataFrame, so that the first
     * dimension becomes the columns and the second dimension the rows.
     *
     * @param {Array<Array<DataTableRow.CellType>>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
     *
     * @return {DataTable}
     * DataTable instance from the arrays.
     */
    public static getTableFromColumns(
        columns: Array<Array<DataTableRow.CellType>> = [],
        headers: Array<string> = []
    ): DataTable {
        const columnsLength = columns.length,
            table = new DataTable();

        // Assign an unique id for every column
        // without a provided name
        while (headers.length < columnsLength) {
            headers.push(uniqueKey());
        }

        table.presentationState.setColumnOrder(headers);

        if (columnsLength) {
            for (let i = 0, iEnd = columns[0].length; i < iEnd; ++i) {
                const row = new DataTableRow();
                for (let j = 0; j < columnsLength; ++j) {
                    row.insertCell(headers[j], columns[j][i]);
                }
                table.insertRow(row);
            }
        }

        return table;
    }

    /**
     * Converts series options to a DataTable instance.
     *
     * @param {Highcharts.SeriesOptions} seriesOptions
     * Series options to convert.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    public static getTableFromSeriesOptions(
        seriesOptions: SeriesOptions
    ): DataTable {
        const table = new DataTable(void 0, seriesOptions.id),
            data = (seriesOptions.data || []);

        let keys = (seriesOptions.keys || []).slice();

        if (!keys.length) {
            if (seriesOptions.type) {
                const seriesClass = SeriesRegistry.seriesTypes[seriesOptions.type],
                    pointArrayMap = (
                        seriesClass &&
                        seriesClass.prototype.pointArrayMap
                    );
                if (pointArrayMap) {
                    keys = pointArrayMap.slice();
                    keys.unshift('x');
                }
            }
            if (!keys.length) {
                keys = ['x', 'y'];
            }
        }

        for (let i = 0, iEnd = data.length; i < iEnd; ++i) {
            table.insertRow(
                DataParser.getTableRowFromPointOptions(data[i], i, keys)
            );
        }

        return table;
    }

    /**
     * Converts series options to a DataTable instance.
     *
     * @param {Highcharts.PointOptions} pointOptions
     * Point options to convert.
     *
     * @param {number} [index]
     * Point index for x value.
     *
     * @param {Array<string>} [keys]
     * Data keys to convert options.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    public static getTableRowFromPointOptions(
        pointOptions: (
            (PointOptions&Record<string, any>)|
            PointShortOptions
        ),
        index: number = 0,
        keys: Array<string> = ['x', 'y']
    ): DataTableRow {
        let tableRow: DataTableRow;

        // Array
        if (pointOptions instanceof Array) {
            const tableRowOptions: (PointOptions&Record<string, any>) = {};
            for (let j = 0, jEnd = pointOptions.length; j < jEnd; ++j) {
                tableRowOptions[keys[j] || `${j}`] = pointOptions[j];
            }
            tableRow = new DataTableRow(tableRowOptions);

        // Object
        } else if (
            pointOptions &&
            typeof pointOptions === 'object'
        ) {
            tableRow = new DataTableRow(pointOptions);

        // Primitive
        } else {
            tableRow = new DataTableRow({
                [keys[0] || 'x']: index,
                [keys[1] || 'y']: pointOptions
            });
        }

        return tableRow;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Getter for the data table
     * @return {DataTable}
     */
    public abstract getTable(): DataTable;

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
        readonly columns: DataTableRow.CellType[][];
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
