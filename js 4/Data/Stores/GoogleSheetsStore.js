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
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
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
import DataStore from './DataStore.js';
import GoogleSheetsParser from '../Parsers/GoogleSheetsParser.js';
import HU from '../../Core/HttpUtilities.js';
var ajax = HU.ajax;
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * *7

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */
/**
 * @private
 */
var GoogleSheetsStore = /** @class */ (function (_super) {
    __extends(GoogleSheetsStore, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of GoogleSheetsStore
     *
     * @param {DataTable} table
     * Optional table to create the store from.
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser.
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    function GoogleSheetsStore(table, options, parser) {
        var _this = _super.call(this, table) || this;
        _this.options = merge(GoogleSheetsStore.defaultOptions, options);
        _this.parser = parser || new GoogleSheetsParser({
            firstRowAsNames: _this.options.firstRowAsNames
        });
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    GoogleSheetsStore.prototype.fetchSheet = function (eventDetail) {
        var store = this, _a = store.options, enablePolling = _a.enablePolling, dataRefreshRate = _a.dataRefreshRate, googleSpreadsheetKey = _a.googleSpreadsheetKey, worksheet = _a.worksheet, url = [
            'https://spreadsheets.google.com/feeds/cells',
            googleSpreadsheetKey,
            worksheet,
            'public/values?alt=json'
        ].join('/');
        // If already loaded, clear the current table
        store.table.deleteColumns();
        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url: url
        });
        ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                store.parser.parse(json);
                store.table.setColumns(store.parser.getTable().getColumns());
                // Polling
                if (enablePolling) {
                    setTimeout(function () {
                        store.fetchSheet();
                    }, dataRefreshRate * 1000);
                }
                store.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    table: store.table,
                    url: url
                });
            },
            error: function (xhr, error) {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);
                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error: error,
                    table: store.table,
                    xhr: xhr
                });
            }
        });
        // return true;
    };
    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    GoogleSheetsStore.prototype.load = function (eventDetail) {
        if (this.options.googleSpreadsheetKey) {
            this.fetchSheet(eventDetail);
        }
    };
    /* *
     *
     *  Static Properties
     *
     * */
    GoogleSheetsStore.defaultOptions = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        enablePolling: false,
        dataRefreshRate: 2,
        firstRowAsNames: true
    };
    return GoogleSheetsStore;
}(DataStore));
/* *
 *
 *  Registry
 *
 * */
DataStore.addStore(GoogleSheetsStore);
/* *
 *
 *  Export
 *
 * */
export default GoogleSheetsStore;
