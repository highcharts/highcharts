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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        var csv = options.csv, csvURL = options.csvURL, enablePolling = options.enablePolling, dataRefreshRate = options.dataRefreshRate, parserOptions = __rest(options, ["csv", "csvURL", "enablePolling", "dataRefreshRate"]);
        _this.parserOptions = parserOptions;
        _this.options = merge(CSVDataStore.defaultOptions, { csv: csv, csvURL: csvURL, enablePolling: enablePolling, dataRefreshRate: dataRefreshRate });
        _this.dataParser = new CSVDataParser(table);
        _this.addEvents();
        return _this;
    }
    CSVDataStore.prototype.addEvents = function () {
        var _this = this;
        this.on('load', function (e) {
            _this.dataParser.parse(__assign({ csv: e.csv }, _this.parserOptions));
            if (_this.liveDataURL) {
                _this.poll();
            }
            fireEvent(_this, 'afterLoad', { table: _this.dataParser.getTable() });
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
                fireEvent(store, 'load', { csv: csv });
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
            fireEvent(store, 'load', { csv: csv });
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
