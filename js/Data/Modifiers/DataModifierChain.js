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
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent;
/** eslint-disable valid-jsdoc */
var DataModifierChain = /** @class */ (function (_super) {
    __extends(DataModifierChain, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function DataModifierChain(name) {
        var modifiers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifiers[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, name) || this;
        var self = _this;
        _this.dataModifiersMap = {};
        _this.dataModifiers = modifiers || [];
        if (self.dataModifiers.length) {
            self.dataModifiers.forEach(function (modifier, i) {
                self.dataModifiersMap[modifier.name] = i;
            });
        }
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    DataModifierChain.prototype.add = function (dataModifier) {
        this.dataModifiers.push(dataModifier);
        this.dataModifiersMap[dataModifier.name] = this.dataModifiers.length - 1;
    };
    DataModifierChain.prototype.remove = function (dataModifier) {
        var index = this.dataModifiersMap[dataModifier.name];
        delete this.dataModifiersMap[dataModifier.name];
        this.dataModifiers.splice(index, 1);
    };
    DataModifierChain.prototype.clear = function () {
        this.dataModifiersMap = {};
        this.dataModifiers.length = 0;
    };
    DataModifierChain.prototype.execute = function (dataTable) {
        return new DataTable(dataTable.getAllRows());
    };
    return DataModifierChain;
}(DataModifier));
export default DataModifierChain;
