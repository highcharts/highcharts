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
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, merge = U.merge;
/** eslint-disable valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
var DataModifier = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function DataModifier(options) {
        var defaultOptions = {
            modifier: DataModifier.getName(this.constructor)
        };
        this.options = merge(defaultOptions, options);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataModifier.addModifier = function (modifier) {
        var name = DataModifier.getName(modifier), registry = DataModifier.registry;
        if (!name ||
            registry[name]) {
            return false;
        }
        registry[name] = modifier;
        return true;
    };
    DataModifier.getAllModifiers = function () {
        return merge(DataModifier.registry);
    };
    DataModifier.getModifier = function (name, options) {
        var Class = DataModifier.registry[name];
        if (Class) {
            return new Class(options);
        }
        return;
    };
    DataModifier.getName = function (modifier) {
        return (modifier.toString().match(DataModifier.nameRegExp) ||
            ['', ''])[1];
    };
    /* *
     *
     *  Functions
     *
     * */
    DataModifier.prototype.execute = function (table) {
        return table;
    };
    DataModifier.prototype.on = function (eventName, callback) {
        return addEvent(this, eventName, callback);
    };
    DataModifier.prototype.toJSON = function () {
        return {
            $class: 'DataModifier',
            options: merge(this.options)
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataModifier.nameRegExp = /^function\s+(\w*?)(?:DataModifier)?\s*\(/;
    DataModifier.registry = {};
    return DataModifier;
}());
export default DataModifier;
