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
import DataTable from './DataTable.js';
import ajaxModule from '../Extensions/Ajax.js';
import U from '../Core/Utilities.js';
import CSVDataParser from './Parsers/CSVDataParser.js';
var ajax = ajaxModule.ajax;
var fireEvent = U.fireEvent, merge = U.merge;
/* eslint-disable valid-jsdoc, require-jsdoc */
/**
 * @private
 */
var CSVDataStore = /** @class */ (function (_super) {
    __extends(CSVDataStore, _super);
    /* *
    *
    *  Constructors
    *
    * */
    function CSVDataStore(table, options) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, table) || this;
        _this.options = merge(CSVDataStore.defaultOptions, options);
        _this.dataParser = new CSVDataParser(table, _this.options);
        _this.addEvents();
        return _this;
    }
    CSVDataStore.prototype.addEvents = function () {
        var _this = this;
        this.on('load', function (e) {
            // console.log(e)
        });
        this.on('afterLoad', function (e) {
            _this.table = e.table;
        });
        this.on('parse', function (e) {
            // console.log(e)
        });
        this.on('fail', function (e) {
            // throw new Error(e.error)
        });
    };
    /**
     * Handle polling of live data
     */
    CSVDataStore.prototype.poll = function () {
        var _this = this;
        var _a = this.options, dataRefreshRate = _a.dataRefreshRate, pollingEnabled = _a.enablePolling, csvURL = _a.csvURL;
        var updateIntervalMs = (dataRefreshRate > 1 ? dataRefreshRate : 1) * 1000;
        if (pollingEnabled && csvURL === this.liveDataURL) {
            // We need to stop doing this if the URL has changed
            this.liveDataTimeout = setTimeout(function () {
                _this.fetchCSV();
            }, updateIntervalMs);
        }
    };
    CSVDataStore.prototype.fetchCSV = function (initialFetch) {
        var store = this, maxRetries = 3, csvURL = store.options.csvURL;
        var currentRetries;
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }
        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv) {
                fireEvent(store, 'load', { csv: csv }, function () {
                    store.dataParser.parse(csv);
                    store.poll();
                    fireEvent(store, 'afterLoad', { table: store.dataParser.getTable() });
                });
            },
            error: function (xhr, text) {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                fireEvent(store, 'fail', { error: { xhr: xhr, text: text } });
            }
        });
    };
    CSVDataStore.prototype.load = function () {
        var store = this, _a = store.options, csv = _a.csv, csvURL = _a.csvURL;
        if (csv) {
            fireEvent(store, 'load', { csv: csv }, function () {
                store.dataParser.parse(csv);
                fireEvent(store, 'afterLoad', { table: store.dataParser.getTable() });
            });
        }
        else if (csvURL) {
            store.fetchCSV(true);
        }
    };
    CSVDataStore.prototype.save = function () {
    };
    /* *
     *
     *  Static Properties
     *
     * */
    CSVDataStore.defaultOptions = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1
    };
    return CSVDataStore;
}(DataStore));
export default CSVDataStore;
