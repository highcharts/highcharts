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
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, merge = U.merge;
/** eslint-disable valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
var DataModifier = /** @class */ (function () {
    function DataModifier() {
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
    DataModifier.prototype.emit = function (type, e) {
        fireEvent(this, type, e);
    };
    DataModifier.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
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
