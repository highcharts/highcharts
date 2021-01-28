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
import DataJSON from '../DataJSON.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import AST from '../../Core/Renderer/HTML/AST.js';
import H from '../../Core/Globals.js';
var win = H.win;
import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import U from '../../Core/Utilities.js';
var merge = U.merge, objectEach = U.objectEach, extend = U.extend, pick = U.pick;
/** eslint-disable valid-jsdoc */
/**
 * Class that handles creating a datastore from an HTML table
 */
var HTMLTableStore = /** @class */ (function (_super) {
    __extends(HTMLTableStore, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Constructs an instance of HTMLTableDataStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {HTMLTableStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    function HTMLTableStore(table, options, parser) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, table) || this;
        _this.tableElement = null;
        _this.options = merge(HTMLTableStore.defaultOptions, options);
        _this.parserOptions = _this.options;
        _this.parser = parser || new HTMLTableParser(_this.options, _this.tableElement);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates an HTMLTableStore from ClassJSON
     *
     * @param {HTMLTableStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {HTMLTableStore}
     * HTMLTableStore from the ClassJSON
     */
    HTMLTableStore.fromJSON = function (json) {
        var options = json.options, parser = HTMLTableParser.fromJSON(json.parser), table = DataTable.fromJSON(json.table), store = new HTMLTableStore(table, options, parser);
        store.metadata = merge(json.metadata);
        return store;
    };
    /**
     * Handles retrieving the HTML table by ID if an ID is provided
     */
    HTMLTableStore.prototype.fetchTable = function () {
        var store = this, tableHTML = store.options.table;
        var tableElement;
        if (typeof tableHTML === 'string') {
            store.tableID = tableHTML;
            tableElement = win.document.getElementById(tableHTML);
        }
        else {
            tableElement = tableHTML;
            store.tableID = tableElement.id;
        }
        store.tableElement = tableElement;
    };
    /**
     * Initiates creating the datastore from the HTML table
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits HTMLTableDataStore#load
     * @emits HTMLTableDataStore#afterLoad
     * @emits HTMLTableDataStore#loadError
     */
    HTMLTableStore.prototype.load = function (eventDetail) {
        var store = this;
        store.fetchTable();
        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });
        if (!store.tableElement) {
            store.emit({
                type: 'loadError',
                detail: eventDetail,
                error: 'HTML table not provided, or element with ID not found',
                table: store.table
            });
            return;
        }
        store.parser.parse(merge({ tableHTML: store.tableElement }, store.options), eventDetail);
        store.table = store.parser.getTable();
        store.emit({
            type: 'afterLoad',
            detail: eventDetail,
            table: store.table,
            tableElement: store.tableElement
        });
    };
    /**
     * Creates an HTML table from the datatable on the store instance.
     *
     * @param {HTMLTableStore.ExportOptions} [exportOptions]
     * Options used for exporting.
     *
     * @return {string}
     * The HTML table.
     */
    HTMLTableStore.prototype.getTableAST = function (exportOptions) {
        if (exportOptions === void 0) { exportOptions = {}; }
        // Merge in the provided parser options
        objectEach(this.parserOptions, function (value, key) {
            if (key in exportOptions) {
                exportOptions[key] = value;
            }
        });
        var treeChildren = [];
        var options = exportOptions, decimalPoint = options.useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.', exportNames = (this.parserOptions.firstRowAsNames !== false), useMultiLevelHeaders = options.useMultiLevelHeaders, useRowspanHeaders = options.useRowspanHeaders;
        var isRowEqual = function (row1, row2) {
            var i = row1.length;
            if (row2.length === i) {
                while (i--) {
                    if (row1[i] !== row2[i]) {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
            return true;
        };
        // Get table header markup from row data
        var getTableHeaderHTML = function (topheaders, subheaders, rowLength) {
            var theadChildren = [];
            var i = 0, len = rowLength || subheaders && subheaders.length, next, cur, curColspan = 0, rowspan;
            // Clean up multiple table headers. Chart.getDataRows() returns two
            // levels of headers when using multilevel, not merged. We need to
            // merge identical headers, remove redundant headers, and keep it
            // all marked up nicely.
            if (useMultiLevelHeaders &&
                topheaders &&
                subheaders &&
                !isRowEqual(topheaders, subheaders)) {
                var trChildren = [];
                for (; i < len; ++i) {
                    cur = topheaders[i];
                    next = topheaders[i + 1];
                    if (cur === next) {
                        ++curColspan;
                    }
                    else if (curColspan) {
                        // Ended colspan
                        // Add cur to HTML with colspan.
                        trChildren.push(getCellHTMLFromValue('th', 'highcharts-table-topheading', {
                            scope: 'col',
                            colspan: curColspan + 1
                        }, cur));
                        curColspan = 0;
                    }
                    else {
                        // Cur is standalone. If it is same as sublevel,
                        // remove sublevel and add just toplevel.
                        if (cur === subheaders[i]) {
                            if (useRowspanHeaders) {
                                rowspan = 2;
                                delete subheaders[i];
                            }
                            else {
                                rowspan = 1;
                                subheaders[i] = '';
                            }
                        }
                        else {
                            rowspan = 1;
                        }
                        var cell = getCellHTMLFromValue('th', 'highcharts-table-topheading', { scope: 'col' }, cur);
                        if (rowspan > 1 && cell.attributes) {
                            cell.attributes.valign = 'top';
                            cell.attributes.rowspan = rowspan;
                        }
                        trChildren.push(cell);
                    }
                }
                theadChildren.push({
                    tagName: 'tr',
                    children: trChildren
                });
            }
            // Add the subheaders (the only headers if not using multilevels)
            if (subheaders) {
                var trChildren = [];
                for (i = 0, len = subheaders.length; i < len; ++i) {
                    var subheader = subheaders[i];
                    if (typeof subheader !== 'undefined') {
                        trChildren.push(getCellHTMLFromValue('th', null, { scope: 'col' }, subheader));
                    }
                }
                theadChildren.push({
                    tagName: 'tr',
                    children: trChildren
                });
            }
            return {
                tagName: 'thead',
                children: theadChildren
            };
        };
        var getCellHTMLFromValue = function (tagName, classes, attributes, value) {
            var textContent = pick(value, ''), className = 'text' + (classes ? ' ' + classes : '');
            // Convert to string if number
            if (typeof textContent === 'number') {
                textContent = textContent.toString();
                if (decimalPoint === ',') {
                    textContent = textContent.replace('.', decimalPoint);
                }
                className = 'number';
            }
            else if (!value) {
                className = 'empty';
            }
            attributes = extend({ 'class': className }, attributes);
            return {
                tagName: tagName,
                attributes: attributes,
                textContent: textContent
            };
        };
        var _a = this.getColumnsForExport(options.exportIDColumn, options.usePresentationOrder), columnNames = _a.columnNames, columnValues = _a.columnValues, columnsCount = columnNames.length;
        var rowArray = [];
        // Add table caption
        // Current exportdata falls back to chart title
        // but that should probably be handled in the export module
        if (options === null || options === void 0 ? void 0 : options.tableCaption) {
            treeChildren.push({
                tagName: 'caption',
                attributes: {
                    'class': 'highcharts-table-caption'
                },
                textContent: options.tableCaption
            });
        }
        // Add the names as the first row if they should be exported
        if (exportNames) {
            var subcategories_1 = [];
            // If using multilevel headers, the first value
            // of each column is a subcategory
            if (useMultiLevelHeaders) {
                columnValues.forEach(function (column) {
                    var subhead = (column.shift() || '').toString();
                    subcategories_1.push(subhead);
                });
                treeChildren.push(getTableHeaderHTML(columnNames, subcategories_1));
            }
            else {
                treeChildren.push(getTableHeaderHTML(null, columnNames));
            }
        }
        var astRows = [];
        var longestColumn = 0;
        for (var columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            var columnName = columnNames[columnIndex], column = columnValues[columnIndex], columnLength = column.length;
            if (columnLength > longestColumn) {
                longestColumn = columnLength;
            }
            var columnMeta = this.whatIs(columnName);
            var columnDataType = void 0;
            if (columnMeta) {
                columnDataType = columnMeta === null || columnMeta === void 0 ? void 0 : columnMeta.dataType;
            }
            for (var rowIndex = 0; rowIndex < longestColumn; rowIndex++) {
                var cellValue = column[rowIndex];
                if (!rowArray[rowIndex]) {
                    rowArray[rowIndex] = [];
                }
                // Handle datatype
                // if(columnDataType && typeof cellValue !== columnDataType) {
                //     do something?
                // }
                if (!(typeof cellValue === 'string' ||
                    typeof cellValue === 'number' ||
                    typeof cellValue === 'undefined')) {
                    cellValue = (cellValue || '').toString();
                }
                rowArray[rowIndex][columnIndex] = getCellHTMLFromValue(columnIndex ? 'td' : 'th', null, columnIndex ? {} : { scope: 'row' }, cellValue !== void 0 ? cellValue : '');
                // On the final column, push the row to the array
                if (columnIndex === columnsCount - 1) {
                    astRows.push({
                        tagName: 'tr',
                        children: rowArray[rowIndex]
                    });
                }
            }
        }
        treeChildren.push({
            tagName: 'tbody',
            children: astRows
        });
        var tree = {
            tagName: 'table',
            children: treeChildren
        };
        return tree;
    };
    /**
     * Exports the datastore as an HTML string, using the options
     * provided on import unless other options are provided.
     *
     * @param {HTMLTableStore.ExportOptions} [htmlExportOptions]
     * Options that override default or existing export options.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {string}
     * HTML from the current dataTable.
     *
     */
    HTMLTableStore.prototype.save = function (htmlExportOptions, eventDetail) {
        var exportOptions = HTMLTableStore.defaultExportOptions;
        // Merge in provided options
        return AST.serialize(this.getTableAST(merge(exportOptions, htmlExportOptions)));
    };
    /**
     * Converts the store to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this store.
     */
    HTMLTableStore.prototype.toJSON = function () {
        var store = this, json = {
            $class: 'HTMLTableStore',
            metadata: merge(store.metadata),
            options: merge(this.options),
            parser: store.parser.toJSON(),
            table: store.table.toJSON(),
            tableElementID: store.tableID || ''
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    HTMLTableStore.defaultOptions = {
        table: ''
    };
    HTMLTableStore.defaultExportOptions = {
        decimalPoint: null,
        exportIDColumn: false,
        useRowspanHeaders: true,
        useMultiLevelHeaders: true,
        usePresentationOrder: true
    };
    return HTMLTableStore;
}(DataStore));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(HTMLTableStore);
DataStore.addStore(HTMLTableStore);
/* *
 *
 *  Export
 *
 * */
export default HTMLTableStore;
