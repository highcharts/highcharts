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
/**
 * Abstract class to provide an interface for modifying DataTable.
 */
var DataModifier = /** @class */ (function () {
    function DataModifier() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Adds a modifier class to the registry. The modifier has to provide the
     * `DataModifier.options` property and the `DataModifier.execute` method to
     * modify the DataTable.
     *
     * @param {DataModifier} modifier
     * Modifier class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a modifier registered with this name.
     */
    DataModifier.addModifier = function (modifier) {
        var name = DataModifier.getName(modifier), registry = DataModifier.registry;
        if (!name ||
            registry[name]) {
            return false;
        }
        registry[name] = modifier;
        return true;
    };
    /**
     * Returns all registered modifier names.
     *
     * @return {Array<string>}
     * All registered modifier names.
     */
    DataModifier.getAllModifierNames = function () {
        return Object.keys(DataModifier.registry);
    };
    /**
     * Returns a copy of the modifier registry as record object with
     * modifier names and their modifier class.
     *
     * @return {DataModifier.ModifierRegistry}
     * Copy of the modifier registry.
     */
    DataModifier.getAllModifiers = function () {
        return merge(DataModifier.registry);
    };
    /**
     * Returns a modifier class (aka class constructor) of the given modifier
     * name.
     *
     * @param {string} name
     * Registered class name of the class type.
     *
     * @return {DataModifier|undefined}
     * Class type, if the class name was found, otherwise `undefined`.
     */
    DataModifier.getModifier = function (name) {
        return DataModifier.registry[name];
    };
    /**
     * Extracts the name from a given modifier class.
     *
     * @param {DataModifier} modifier
     * Modifier class to extract the name from.
     *
     * @return {string}
     * Modifier name, if the extraction was successful, otherwise an empty
     * string.
     */
    DataModifier.getName = function (modifier) {
        return (modifier.toString().match(DataModifier.nameRegExp) ||
            ['', ''])[1];
    };
    /**
     * Emits an event on the modifier to all registered callbacks of this event.
     *
     * @param {DataEventEmitter.EventObject} [e]
     * Event object containing additonal event information.
     */
    DataModifier.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    /**
     * Registers a callback for a specific modifier event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    DataModifier.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Regular expression to extract the modifier name (group 1) from the
     * stringified class type.
     */
    DataModifier.nameRegExp = /^function\s+(\w*?)(?:DataModifier)?\s*\(/;
    /**
     * Registry as a record object with modifier names and their class.
     */
    DataModifier.registry = {};
    return DataModifier;
}());
/* *
 *
 *  Export
 *
 * */
export default DataModifier;
