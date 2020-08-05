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
    function DataModifierChain(options) {
        var modifiers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifiers[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, options) || this;
        _this.modifiers = modifiers;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    DataModifierChain.prototype.add = function (modifier) {
        this.modifiers.push(modifier);
    };
    DataModifierChain.prototype.clear = function () {
        this.modifiers.length = 0;
    };
    DataModifierChain.prototype.execute = function (table) {
        var modifiers = this.modifiers;
        for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            table = modifiers[i].execute(table);
        }
        return table;
    };
    DataModifierChain.prototype.remove = function (modifier) {
        var modifiers = this.modifiers;
        modifiers.splice(modifiers.indexOf(modifier), 1);
    };
    DataModifierChain.prototype.reverse = function () {
        this.modifiers = this.modifiers.reverse();
    };
    return DataModifierChain;
}(DataModifier));
DataModifier.addModifier(DataModifierChain);
export default DataModifierChain;
