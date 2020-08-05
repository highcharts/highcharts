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
import DataJSON from '../DataJSON';
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
    function DataModifier(name) {
        this.name = name;
        DataModifier.registerModifier(this);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataModifier.getModiferPool = function () {
        return merge(DataModifier.registry);
    };
    DataModifier.fromJSON = function (json) {
        return DataJSON.fromJSON(json);
    };
    DataModifier.registerModifier = function (modifier) {
        DataModifier.registry[modifier.name] = modifier;
    };
    DataModifier.prototype.on = function (eventName, callback) {
        return addEvent(this, eventName, callback);
    };
    DataModifier.prototype.toJSON = function () {
        return {
            $class: 'DataModifier',
            name: this.name
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataModifier.$class = 'DataModifier';
    return DataModifier;
}());
DataJSON.addClass(DataModifier);
export default DataModifier;
