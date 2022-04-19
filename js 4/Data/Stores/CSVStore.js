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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import CSVParser from '../Parsers/CSVParser.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import HU from '../../Core/HttpUtilities.js';
var ajax = HU.ajax;
import U from '../../Core/Utilities.js';
var merge = U.merge, objectEach = U.objectEach;
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
var CSVStore = /** @class */ (function (_super) {
    __extends(CSVStore, _super);
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
    function CSVStore(table, options, parser) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, table) || this;
        var csv = options.csv, csvURL = options.csvURL, enablePolling = options.enablePolling, dataRefreshRate = options.dataRefreshRate, parserOptions = __rest(options, ["csv", "csvURL", "enablePolling", "dataRefreshRate"]);
        _this.parserOptions = parserOptions;
        _this.options = merge(CSVStore.defaultOptions, { csv: csv, csvURL: csvURL, enablePolling: enablePolling, dataRefreshRate: dataRefreshRate });
        _this.parser = parser || new CSVParser(parserOptions);
        return _this;
    }
    /**
     * Handles polling of live data
     */
    CSVStore.prototype.poll = function () {
        var _this = this;
        var _a = this.options, dataRefreshRate = _a.dataRefreshRate, enablePolling = _a.enablePolling, csvURL = _a.csvURL;
        var updateIntervalMs = (dataRefreshRate > 1 ? dataRefreshRate : 1) * 1000;
        if (enablePolling && csvURL === this.liveDataURL) {
            // We need to stop doing this if the URL has changed
            this.liveDataTimeout = setTimeout(function () {
                _this.fetchCSV();
            }, updateIntervalMs);
        }
    };
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
    CSVStore.prototype.fetchCSV = function (initialFetch, eventDetail) {
        var store = this, maxRetries = 3, csvURL = store.options.csvURL;
        var currentRetries;
        // Clear the table
        store.table.deleteColumns();
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }
        store.emit({ type: 'load', detail: eventDetail, table: store.table });
        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv) {
                store.parser.parse({ csv: csv });
                // On inital fetch we need to set the columns
                store.table.setColumns(store.parser.getTable().getColumns());
                if (store.liveDataURL) {
                    store.poll();
                }
                store.emit({
                    type: 'afterLoad',
                    csv: csv,
                    detail: eventDetail,
                    table: store.table
                });
            },
            error: function (xhr, error) {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error: error,
                    table: store.table,
                    xhr: xhr
                });
            }
        });
    };
    /**
     * Initiates the loading of the CSV source to the store
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVParser#load
     * @emits CSVParser#afterLoad
     */
    CSVStore.prototype.load = function (eventDetail) {
        var store = this, parser = store.parser, table = store.table, _a = store.options, csv = _a.csv, csvURL = _a.csvURL;
        if (csv) {
            // If already loaded, clear the current rows
            table.deleteRows();
            store.emit({
                type: 'load',
                csv: csv,
                detail: eventDetail,
                table: table
            });
            parser.parse({ csv: csv });
            table.setColumns(parser.getTable().getColumns());
            store.emit({
                type: 'afterLoad',
                csv: csv,
                detail: eventDetail,
                table: table
            });
        }
        else if (csvURL) {
            store.fetchCSV(true, eventDetail);
        }
        else {
            store.emit({
                type: 'loadError',
                detail: eventDetail,
                error: 'Unable to load: no CSV string or URL was provided',
                table: table
            });
        }
    };
    /**
     * Creates a CSV string from the datatable on the store instance.
     *
     * @param {CSVStore.ExportOptions} exportOptions
     * The options used for the export.
     *
     * @return {string}
     * A CSV string from the table.
     */
    CSVStore.prototype.getCSVForExport = function (exportOptions) {
        var useLocalDecimalPoint = exportOptions.useLocalDecimalPoint, lineDelimiter = exportOptions.lineDelimiter, exportNames = (this.parserOptions.firstRowAsNames !== false);
        var decimalPoint = exportOptions.decimalPoint, itemDelimiter = exportOptions.itemDelimiter;
        if (!decimalPoint) {
            decimalPoint = itemDelimiter !== ',' && useLocalDecimalPoint ?
                (1.1).toLocaleString()[1] :
                '.';
        }
        if (!itemDelimiter) {
            itemDelimiter = decimalPoint === ',' ? ';' : ',';
        }
        var _a = this.getColumnsForExport(exportOptions.usePresentationOrder), columnNames = _a.columnNames, columnValues = _a.columnValues;
        var csvRows = [], columnsCount = columnNames.length;
        var rowArray = [];
        // Add the names as the first row if they should be exported
        if (exportNames) {
            csvRows.push(columnNames.map(function (columnName) { return "\"" + columnName + "\""; }).join(itemDelimiter));
        }
        for (var columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            var columnName = columnNames[columnIndex], column = columnValues[columnIndex], columnLength = column.length;
            var columnMeta = this.whatIs(columnName);
            var columnDataType = void 0;
            if (columnMeta) {
                columnDataType = columnMeta.dataType;
            }
            for (var rowIndex = 0; rowIndex < columnLength; rowIndex++) {
                var cellValue = column[rowIndex];
                if (!rowArray[rowIndex]) {
                    rowArray[rowIndex] = [];
                }
                // Prefer datatype from metadata
                if (columnDataType === 'string') {
                    cellValue = "\"" + cellValue + "\"";
                }
                else if (typeof cellValue === 'number') {
                    cellValue = String(cellValue).replace('.', decimalPoint);
                }
                else if (typeof cellValue === 'string') {
                    cellValue = "\"" + cellValue + "\"";
                }
                rowArray[rowIndex][columnIndex] = cellValue;
                // On the final column, push the row to the CSV
                if (columnIndex === columnsCount - 1) {
                    // Trim repeated undefined values starting at the end
                    // Currently, we export the first "comma" even if the
                    // second value is undefined
                    var i = columnIndex;
                    while (rowArray[rowIndex].length > 2) {
                        var cellVal = rowArray[rowIndex][i];
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
    };
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
    CSVStore.prototype.save = function (csvExportOptions) {
        var exportOptions = CSVStore.defaultExportOptions;
        // Merge in the provided parser options
        objectEach(this.parserOptions, function (value, key) {
            if (key in exportOptions) {
                exportOptions[key] = value;
            }
        });
        return this.getCSVForExport(merge(exportOptions, csvExportOptions));
    };
    /* *
     *
     *  Static Properties
     *
     * */
    CSVStore.defaultOptions = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1
    };
    CSVStore.defaultExportOptions = {
        decimalPoint: null,
        itemDelimiter: null,
        lineDelimiter: '\n'
    };
    return CSVStore;
}(DataStore));
/* *
 *
 *  Registry
 *
 * */
DataStore.addStore(CSVStore);
/* *
 *
 *  Export
 *
 * */
export default CSVStore;
