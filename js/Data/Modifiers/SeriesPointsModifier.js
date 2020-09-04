/* *
 *
 *  Data Layer
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
import DataModifier from './DataModifier.js';
import DataJSON from './../DataJSON.js';
import DataTable from './../DataTable.js';
import U from './../../Core/Utilities.js';
import DataTableRow from './../DataTableRow.js';
var merge = U.merge;
var SeriesPointsModifier = /** @class */ (function (_super) {
    __extends(SeriesPointsModifier, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the series points modifier.
     *
     * @param {SeriesPointsModifier.Options} [options]
     * Options to configure the series points modifier.
     */
    function SeriesPointsModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(SeriesPointsModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a class JSON to a series points modifier.
     *
     * @param {SeriesPointsModifier.ClassJSON} json
     * Class JSON to convert to an instance of series points modifier.
     *
     * @return {SeriesPointsModifier}
     * Series points modifier of the class JSON.
     */
    SeriesPointsModifier.fromJSON = function (json) {
        return new SeriesPointsModifier(json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Create new DataTable with the same rows and add alternative
     * column names (alias) depending on mapping option.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     */
    SeriesPointsModifier.prototype.execute = function (table, eventDetail) {
        var modifier = this, aliasMap = modifier.options.aliasMap || {}, aliasKeys = Object.keys(aliasMap), aliasValues = [], newTable = new DataTable();
        var row, newRow, newCells, cellName, cellAliasOrName, cellNames, cell, aliasIndex;
        this.emit({ type: 'execute', detail: eventDetail, table: table });
        for (var k = 0, kEnd = aliasKeys.length; k < kEnd; k++) {
            aliasValues.push(aliasMap[aliasKeys[k]]);
        }
        for (var i = 0, iEnd = table.getRowCount(); i < iEnd; i++) {
            row = table.getRow(i);
            if (row) {
                newCells = {};
                cellNames = row.getCellNames();
                for (var j = 0, jEnd = row.getCellCount(); j < jEnd; j++) {
                    cellName = cellNames[j];
                    aliasIndex = aliasValues.indexOf(cellName);
                    cellAliasOrName = aliasIndex !== -1 ? aliasKeys[aliasIndex] : cellName;
                    cell = row.getCell(cellName);
                    newCells[cellAliasOrName] = cell;
                }
                newRow = new DataTableRow(newCells);
                newTable.insertRow(newRow);
            }
        }
        this.emit({ type: 'afterExecute', detail: eventDetail, table: newTable });
        return newTable;
    };
    /**
     * Converts the series points modifier to a class JSON,
     * including all containing all modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this series points modifier.
     */
    SeriesPointsModifier.prototype.toJSON = function () {
        var json = {
            $class: 'SeriesPointsModifier',
            options: merge(this.options)
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options for the series points modifier.
     */
    SeriesPointsModifier.defaultOptions = {
        modifier: 'SeriesPoints',
        aliasMap: {}
    };
    return SeriesPointsModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(SeriesPointsModifier);
DataModifier.addModifier(SeriesPointsModifier);
/* *
 *
 *  Export
 *
 * */
export default SeriesPointsModifier;
