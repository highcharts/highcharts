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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/** eslint-disable valid-jsdoc */
var ChainDataModifier = /** @class */ (function (_super) {
    __extends(ChainDataModifier, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function ChainDataModifier(options) {
        var modifiers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifiers[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.modifiers = modifiers;
        _this.options = merge(ChainDataModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    ChainDataModifier.fromJSON = function (json) {
        var jsonModifiers = json.modifiers, modifiers = [];
        for (var i = 0, iEnd = jsonModifiers.length; i < iEnd; ++i) {
            modifiers.push(DataJSON.fromJSON(jsonModifiers[i]));
        }
        return new (ChainDataModifier.bind.apply(ChainDataModifier, __spreadArrays([void 0, json.options], modifiers)))();
    };
    /* *
     *
     *  Functions
     *
     * */
    ChainDataModifier.prototype.add = function (modifier) {
        this.modifiers.push(modifier);
    };
    ChainDataModifier.prototype.clear = function () {
        this.modifiers.length = 0;
    };
    ChainDataModifier.prototype.execute = function (table) {
        var modifier = this, modifiers = this.modifiers;
        this.emit('execute', { table: table });
        for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            table = modifiers[i].execute(table);
        }
        this.emit('afterExecute', { table: table });
        return table;
    };
    ChainDataModifier.prototype.remove = function (modifier) {
        var modifiers = this.modifiers;
        modifiers.splice(modifiers.indexOf(modifier), 1);
    };
    ChainDataModifier.prototype.reverse = function () {
        this.modifiers = this.modifiers.reverse();
    };
    ChainDataModifier.prototype.toJSON = function () {
        var modifiers = this.modifiers, json = {
            $class: 'ChainDataModifier',
            modifiers: [],
            options: merge(this.options)
        };
        for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            json.modifiers.push(modifiers[i].toJSON());
        }
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    ChainDataModifier.defaultOptions = {
        modifier: 'Chain'
    };
    return ChainDataModifier;
}(DataModifier));
DataJSON.addClass(ChainDataModifier);
export default ChainDataModifier;
