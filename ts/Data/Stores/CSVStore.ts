/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Christer Vasseng
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type JSON from '../../Core/JSON';

import CSVParser from '../Parsers/CSVParser.js';
import DataPromise from '../DataPromise.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import HU from '../../Core/HttpUtilities.js';
const { ajax } = HU;
import U from '../../Core/Utilities.js';
const {
    merge,
    objectEach
} = U;

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * Class that handles creating a datastore from CSV
 *
 * @private
 */
class CSVStore extends DataStore {

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
    };

    static readonly defaultExportOptions: CSVStore.ExportOptions = {
        decimalPoint: null,
        itemDelimiter: null,
        lineDelimiter: '\n'
    };

    /* *
    *
    *  Constructors
    *
    * */

    /**
     * Constructs an instance of CSVDataStore.
     *
     * @param {DataTable} table
     * Optional table to create the store from.
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser.
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser.
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: CSVStore.OptionsType = {},
        parser?: CSVParser
    ) {
        super(table);

        const {
            csv,
            csvURL,
            enablePolling,
            dataRefreshRate,
            ...parserOptions
        } = options;

        this.parserOptions = parserOptions;
        this.options = merge(
            CSVStore.defaultOptions,
            { csv, csvURL, enablePolling, dataRefreshRate }
        );
        this.parser = parser || new CSVParser(parserOptions);
    }


    /* *
     *
     *  Properties
     *
     * */

    public export?: string;
    /**
     * The URL to fetch if the source is external
     */
    private liveDataURL?: string;

    /**
     * The current timeout ID if polling is enabled
     */
    private liveDataTimeout?: number;

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

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Handles polling of live data
     */
    private poll(): void {
        const { dataRefreshRate, enablePolling, csvURL } = this.options;
        const updateIntervalMs = (
            dataRefreshRate > 1 ? dataRefreshRate : 1
        ) * 1000;
        if (enablePolling && csvURL === this.liveDataURL) {
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
     * @emits CSVDataStore#load
     * @emits CSVDataStore#afterLoad
     * @emits CSVDataStore#loadError
     */
    private fetchCSV(initialFetch?: boolean): DataPromise<this> {
        const store = this,
            maxRetries = 3,
            { csvURL } = store.options;
        let currentRetries: number;

        // Clear the table
        store.table.deleteColumns();
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }

        return new DataPromise((resolve, reject): void => {
            ajax({
                url: store.liveDataURL || '',
                dataType: 'text',
                success: function (csv): void {
                    csv = `${csv}`;

                    store.parser.parse({ csv });

                    // On inital fetch we need to set the columns
                    store.table.setColumns(
                        store.parser.getTable().getColumns()
                    );

                    if (store.liveDataURL) {
                        store.poll();
                    }

                    resolve(store);
                },
                error: function (xhr, error): void {
                    if (++currentRetries < maxRetries) {
                        store.poll();
                    }
                    reject(error);
                }
            });
        });
    }

    /**
     * Initiates the loading of the CSV source to the store
     *
     * @emits CSVParser#load
     * @emits CSVParser#afterLoad
     */
    public load(): DataPromise<this> {
        const store = this,
            parser = store.parser,
            table = store.table,
            {
                csv,
                csvURL
            } = store.options;

        if (csv) {
            // If already loaded, clear the current rows
            table.deleteRows();
            store.dispatchEvent({
                type: 'load',
                csv,
                table
            });
            parser.parse({ csv });
            table.setColumns(parser.getTable().getColumns());
            store.dispatchEvent({
                type: 'afterLoad',
                csv,
                table
            });
            return DataPromise.resolve(store);
        }

        if (csvURL) {
            return store.fetchCSV(true);
        }

        store.dispatchEvent({
            type: 'loadError',
            error: 'Unable to load: no CSV string or URL was provided',
            table
        });

        return DataPromise.reject(new Error(
            'Unable to load: no CSV string or URL was provided'
        ));
    }

    /**
     * Creates a CSV string from the datatable on the store instance.
     *
     * @param {CSVStore.ExportOptions} exportOptions
     * The options used for the export.
     *
     * @return {string}
     * A CSV string from the table.
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
            exportOptions.usePresentationOrder
        );
        const csvRows: Array<string> = [],
            columnsCount = columnNames.length;

        const rowArray: Array<DataTable.Row> = [];

        // Add the names as the first row if they should be exported
        if (exportNames) {
            csvRows.push(columnNames.map(
                (columnName): string => `"${columnName}"`
            ).join(itemDelimiter));
        }

        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            const columnName = columnNames[columnIndex],
                column = columnValues[columnIndex],
                columnLength = column.length;

            const columnMeta = this.whatIs(columnName);
            let columnDataType;

            if (columnMeta) {
                columnDataType = columnMeta.dataType;
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
     * CSV from the store's current table.
     *
     */
    public save(
        csvExportOptions?: Partial<CSVStore.ExportOptions>
    ): DataPromise<this> {
        const exportOptions = CSVStore.defaultExportOptions;

        // Merge in the provided parser options
        objectEach(this.parserOptions, function (value, key): void {
            if (key in exportOptions) {
                exportOptions[key] = value;
            }
        });

        return new DataPromise((resolve): void => {
            delete this.export;
            this.export = this.getCSVForExport(
                merge(exportOptions, csvExportOptions)
            );
            resolve();
        });
    }

}

/**
 *
 *  Namespace
 *
 */

/**
 * Types for class-specific options
 */
namespace CSVStore {

    /**
     * Options for the CSVDataStore class constructor
     */
    export type OptionsType = Partial<(CSVStore.Options&CSVParser.OptionsType)>;

    /**
     * @todo move this to the dataparser?
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * Internal options for CSVDataStore
     */
    export interface Options extends JSON.Object {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

    /**
     * The available options when exporting the table as CSV.
     */
    export interface ExportOptions extends JSON.Object {
        decimalPoint: string | null;
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

declare module './StoreType' {
    interface StoreTypeRegistry {
        CSVStore: typeof CSVStore;
    }
}

DataStore.addStore(CSVStore);

/* *
 *
 *  Export
 *
 * */

export default CSVStore;
