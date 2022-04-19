/* *
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
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
import DataModifier from './DataModifier.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 */
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
     *  Functions
     *
     * */
    /**
     * Renames columns to alternative column names (alias) depending on mapping
     * option.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with `modified` property as a reference.
     */
    SeriesPointsModifier.prototype.modifyTable = function (table, eventDetail) {
        var modifier = this;
        modifier.emit({ type: 'modify', detail: eventDetail, table: table });
        var aliasMap = modifier.options.aliasMap || {}, aliases = Object.keys(aliasMap), modified = table.modified = table.clone(false, eventDetail);
        for (var i = 0, iEnd = aliases.length, alias = void 0; i < iEnd; ++i) {
            alias = aliases[i];
            modified.renameColumn(aliasMap[alias], alias);
        }
        modifier.emit({ type: 'afterModify', detail: eventDetail, table: table });
        return table;
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
        modifier: 'SeriesPoints'
    };
    return SeriesPointsModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataModifier.addModifier(SeriesPointsModifier);
/* *
 *
 *  Export
 *
 * */
export default SeriesPointsModifier;
