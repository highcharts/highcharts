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
        if (typeof name === 'undefined' ||
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
     * @return {Record<string,DataModifierRegistryType>}
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
     * Runs a timed execution of the modifier on the given datatable.
     * Can be configured to run multiple times.
     *
     * @param {DataTable} dataTable
     * The datatable to execute
     *
     * @param {DataModifier.BenchmarkOptions} options
     * Options. Currently supports `iterations` for number of iterations.
     *
     * @return {Array<number>}
     * An array of times in milliseconds
     *
     */
    DataModifier.prototype.benchmark = function (dataTable, options) {
        var results = [];
        var modifier = this;
        var execute = function () {
            modifier.execute(dataTable);
            modifier.emit({ type: 'afterBenchmarkIteration' });
        };
        var defaultOptions = {
            iterations: 1
        };
        var iterations = merge(defaultOptions, options).iterations;
        modifier.on('afterBenchmarkIteration', function () {
            if (results.length === iterations) {
                modifier.emit({ type: 'afterBenchmark', results: results });
                return;
            }
            // Run again
            execute();
        });
        var times = {
            startTime: 0,
            endTime: 0
        };
        // Add timers
        modifier.on('execute', function () {
            times.startTime = window.performance.now();
        });
        modifier.on('afterExecute', function () {
            times.endTime = window.performance.now();
            results.push(times.endTime - times.startTime);
        });
        // Initial run
        execute();
        return results;
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
