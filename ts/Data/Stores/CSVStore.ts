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

import type DataEventEmitter from '../DataEventEmitter';
import Ajax from '../../Extensions/Ajax.js';
import CSVParser from '../Parsers/CSVParser.js';
import DataJSON from '../DataJSON.js';
const {
    ajax
} = Ajax;
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
import DataTableRow from '../DataTableRow';
const {
    merge,
    pick,
    objectEach
} = U;

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * Class that handles creating a datastore from CSV
 */
class CSVStore extends DataStore<CSVStore.EventObjects> implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */
    protected static readonly defaultOptions: CSVStore.Options = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1
    }

    static readonly defaultExportOptions: CSVStore.ExportOptions = {
        decimalPoint: null,
        itemDelimiter: null,
        lineDelimiter: '\n',
        exportIDColumn: false
    }

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates a CSVDatastore from a ClassJSON object.
     *
     * @param {CSVStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {CSVStore}
     * CSVDataStore from the ClassJSON.
     */
    public static fromJSON(json: CSVStore.ClassJSON): CSVStore {
        const options = json.options,
            parser = CSVParser.fromJSON(json.parser),
            table = DataTable.fromJSON(json.table),
            store = new CSVStore(table, options, parser);

        store.metadata = merge(json.metadata);

        return store;
    }

    /* *
    *
    *  Constructors
    *
    * */

    /**
     * Constructs an instance of CSVDataStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: CSVStore.OptionsType = {},
        parser?: CSVParser
    ) {
        super(table);

        const { csv, csvURL, enablePolling, dataRefreshRate, ...parserOptions } = options;

        this.parserOptions = parserOptions;
        this.options = merge(CSVStore.defaultOptions, { csv, csvURL, enablePolling, dataRefreshRate });
        this.parser = parser || new CSVParser(parserOptions);
    }


    /* *
    *
    *  Properties
    *
    * */

    /**
     * Options related to the handling of the CSV datastore,
     * i.e. source, fetching, polling
     */
    public readonly options: CSVStore.Options;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: CSVParser;

    /**
     * The options that were passed to the parser.
     */
    private parserOptions: CSVParser.OptionsType;

    /**
     * The URL to fetch if the source is external
     */
    private liveDataURL?: string;

    /**
     * The current timeout ID if polling is enabled
     */
    private liveDataTimeout?: number;

    /**
     * Handles polling of live data
     */
    private poll(): void {
        const { dataRefreshRate, enablePolling: pollingEnabled, csvURL } = this.options;
        const updateIntervalMs = (dataRefreshRate > 1 ? dataRefreshRate : 1) * 1000;
        if (pollingEnabled && csvURL === this.liveDataURL) {
            // We need to stop doing this if the URL has changed
            this.liveDataTimeout = setTimeout((): void => {
                this.fetchCSV();
            }, updateIntervalMs);
        }
    }

    /**
     * Fetches CSV from external source
     *
     * @param {boolean} initialFetch
     * Indicates whether this is a single fetch or a repeated fetch
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataStore#load
     * @emits CSVDataStore#afterLoad
     * @emits CSVDataStore#loadError
     */
    private fetchCSV(
        initialFetch?: boolean,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const store = this,
            maxRetries = 3,
            { csvURL } = store.options;
        let currentRetries: number;

        // Clear the table
        store.table.clear();
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }

        store.emit({ type: 'load', detail: eventDetail, table: store.table });

        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv: string): void {
                store.parser.parse({ csv });
                if (store.liveDataURL) {
                    store.poll();
                }
                store.table.insertRows(store.parser.getTable().getAllRows());
                store.emit({
                    type: 'afterLoad',
                    csv,
                    detail: eventDetail,
                    table: store.table
                });
            },
            error: function (xhr, error): void {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    table: store.table,
                    xhr
                });
            }
        });
    }

    /**
     * Initiates the loading of the CSV source to the store
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVParser#load
     * @emits CSVParser#afterLoad
     */
    public load(eventDetail?: DataEventEmitter.EventDetail): void {
        const store = this,
            { csv, csvURL } = store.options;

        if (csv) {
            // If already loaded, clear the current rows
            store.table.clear();
            store.emit({
                type: 'load',
                csv,
                detail: eventDetail,
                table: store.table
            });
            store.parser.parse({ csv });
            store.table.insertRows(store.parser.getTable().getAllRows());
            store.emit({
                type: 'afterLoad',
                csv,
                detail: eventDetail,
                table: store.table
            });
        } else if (csvURL) {
            store.fetchCSV(true, eventDetail);
        } else {
            store.emit(
                {
                    type: 'loadError',
                    table: store.table,
                    error: 'Unable to load: no CSV string or URL was provided',
                    detail: eventDetail
                }
            );
        }
    }

    /**
     * Creates a CSV string from the datatable on the store instance.
     *
     * @param {CSVStore.ExportOptions} exportOptions
     * The options used for the export.
     *
     * @return {string}
     * A CSV string from the DataTable.
     */
    public getCSVForExport(exportOptions: CSVStore.ExportOptions): string {
        const { useLocalDecimalPoint, lineDelimiter } = exportOptions,
            exportNames = (this.parserOptions.firstRowAsNames !== false);

        let { decimalPoint, itemDelimiter } = exportOptions;

        if (!decimalPoint) {
            decimalPoint = itemDelimiter !== ',' && useLocalDecimalPoint ?
                (1.1).toLocaleString()[1] :
                '.';
        }

        if (!itemDelimiter) {
            itemDelimiter = decimalPoint === ',' ? ';' : ',';
        }

        const { columnNames, columnValues } = this.getColumnsForExport(
            exportOptions.exportIDColumn,
            exportOptions.usePresentationOrder
        );
        const csvRows: Array<string> = [],
            columnsCount = columnNames.length;

        const rowArray: Array<Array<DataTableRow.CellType>> = [];

        // Add the names as the first row if they should be exported
        if (exportNames) {
            csvRows.push(columnNames.map((columnName): string => `"${columnName}"`).join(itemDelimiter));
        }

        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const columnName = columnNames[columnIndex],
                column = columnValues[columnIndex],
                columnLength = column.length;

            const columnMeta = this.whatIs(columnName);
            let columnDataType;

            if (columnMeta) {
                columnDataType = columnMeta?.dataType;
            }

            for (let rowIndex = 0; rowIndex < columnLength; rowIndex++) {
                let cellValue = column[rowIndex];

                if (!rowArray[rowIndex]) {
                    rowArray[rowIndex] = [];
                }

                // Prefer datatype from metadata
                if (columnDataType === 'string') {
                    cellValue = `"${cellValue}"`;
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

    /**
     * Exports the datastore as a CSV string, using the options
     * provided on import unless other options are provided.
     *
     * @param {CSVStore.ExportOptions} [csvExportOptions]
     * Options to use instead of those used on import.
     *
     * @return {string}
     * CSV from the store's current DataTable.
     *
     */
    public save(csvExportOptions?: Partial<CSVStore.ExportOptions>): string {
        const exportOptions = CSVStore.defaultExportOptions;

        // Merge in the provided parser options
        objectEach(this.parserOptions, function (value, key): void {
            if (key in exportOptions) {
                exportOptions[key] = value;
            }
        });

        return this.getCSVForExport(merge(exportOptions, csvExportOptions));
    }

    /**
     * Converts the store to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this store.
     */
    public toJSON(): CSVStore.ClassJSON {
        const json: CSVStore.ClassJSON = {
            $class: 'CSVStore',
            metadata: merge(this.metadata),
            options: merge(this.options),
            parser: this.parser.toJSON(),
            table: this.table.toJSON()
        };

        return json;
    }
}

/**
 *
 *  Namespace
 *
 */

/**
 * Types for class-specific options and events
 */
namespace CSVStore {

    /**
     * Event objects fired from CSVDataStore events
     */
    export type EventObjects = (ErrorEventObject | LoadEventObject);

    /**
     * Options for the CSVDataStore class constructor
     */
    export type OptionsType = Partial<(CSVStore.Options & CSVParser.OptionsType)>

    /**
     * The class JSON when importing/exporting CSVDataStore
     */
    export interface ClassJSON extends DataStore.ClassJSON {
        options: Options;
        parser: CSVParser.ClassJSON;
    }

    /**
     * @todo move this to the dataparser?
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * The event object that is provided on errors within CSVDataStore
     */
    export interface ErrorEventObject extends DataStore.EventObject {
        type: ('loadError');
        error: (string | Error);
        xhr?: XMLHttpRequest;
    }

    /**
     * The event object that is provided on load events within CSVDataStore
     */
    export interface LoadEventObject extends DataStore.EventObject {
        type: ('load' | 'afterLoad');
        csv?: string;
    }

    /**
     * Internal options for CSVDataStore
     */
    export interface Options extends DataJSON.JSONObject {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

    /**
     * The available options when exporting the table as CSV.
     */
    export interface ExportOptions extends DataJSON.JSONObject {
        decimalPoint: string | null;
        exportIDColumn: boolean;
        itemDelimiter: string | null;
        lineDelimiter: string;
        useLocalDecimalPoint?: boolean;
        usePresentationOrder?: boolean;
    }

}

/* *
 *
 *  Registry
 *
 * */
DataJSON.addClass(CSVStore);
DataStore.addStore(CSVStore);

declare module './StoreType' {
    interface StoreTypeRegistry {
        CSVStore: typeof CSVStore;
    }
}


/* *
 *
 *  Export
 *
 * */

export default CSVStore;
