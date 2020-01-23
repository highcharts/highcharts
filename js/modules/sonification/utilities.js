/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Utility functions for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import musicalFrequencies from './musicalFrequencies.js';
import U from '../../parts/Utilities.js';
var clamp = U.clamp;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * The SignalHandler class. Stores signal callbacks (event handlers), and
 * provides an interface to register them, and emit signals. The word "event" is
 * not used to avoid confusion with TimelineEvents.
 *
 * @requires module:modules/sonification
 *
 * @private
 * @class
 * @name Highcharts.SignalHandler
 *
 * @param {Array<string>} supportedSignals
 *        List of supported signal names.
 */
function SignalHandler(supportedSignals) {
    this.init(supportedSignals || []);
}
SignalHandler.prototype.init = function (supportedSignals) {
    this.supportedSignals = supportedSignals;
    this.signals = {};
};
/**
 * Register a set of signal callbacks with this SignalHandler.
 * Multiple signal callbacks can be registered for the same signal.
 * @private
 * @param {Highcharts.Dictionary<(Function|undefined)>} signals
 * An object that contains a mapping from the signal name to the callbacks. Only
 * supported events are considered.
 * @return {void}
 */
SignalHandler.prototype.registerSignalCallbacks = function (signals) {
    var signalHandler = this;
    signalHandler.supportedSignals.forEach(function (supportedSignal) {
        var signal = signals[supportedSignal];
        if (signal) {
            (signalHandler.signals[supportedSignal] =
                signalHandler.signals[supportedSignal] || []).push(signal);
        }
    });
};
/**
 * Clear signal callbacks, optionally by name.
 * @private
 * @param {Array<string>} [signalNames] - A list of signal names to clear. If
 * not supplied, all signal callbacks are removed.
 * @return {void}
 */
SignalHandler.prototype.clearSignalCallbacks = function (signalNames) {
    var signalHandler = this;
    if (signalNames) {
        signalNames.forEach(function (signalName) {
            if (signalHandler.signals[signalName]) {
                delete signalHandler.signals[signalName];
            }
        });
    }
    else {
        signalHandler.signals = {};
    }
};
/**
 * Emit a signal. Does nothing if the signal does not exist, or has no
 * registered callbacks.
 * @private
 * @param {string} signalNames
 * Name of signal to emit.
 * @param {*} [data]
 * Data to pass to the callback.
 * @return {*}
 */
SignalHandler.prototype.emitSignal = function (signalName, data) {
    var retval;
    if (this.signals[signalName]) {
        this.signals[signalName].forEach(function (handler) {
            var result = handler(data);
            retval = typeof result !== 'undefined' ? result : retval;
        });
    }
    return retval;
};
var utilities = {
    // List of musical frequencies from C0 to C8
    musicalFrequencies: musicalFrequencies,
    // SignalHandler class
    SignalHandler: SignalHandler,
    /**
     * Get a musical scale by specifying the semitones from 1-12 to include.
     *  1: C, 2: C#, 3: D, 4: D#, 5: E, 6: F,
     *  7: F#, 8: G, 9: G#, 10: A, 11: Bb, 12: B
     * @private
     * @param {Array<number>} semitones
     * Array of semitones from 1-12 to include in the scale. Duplicate entries
     * are ignored.
     * @return {Array<number>}
     * Array of frequencies from C0 to C8 that are included in this scale.
     */
    getMusicalScale: function (semitones) {
        return musicalFrequencies.filter(function (freq, i) {
            var interval = i % 12 + 1;
            return semitones.some(function (allowedInterval) {
                return allowedInterval === interval;
            });
        });
    },
    /**
     * Calculate the extreme values in a chart for a data prop.
     * @private
     * @param {Highcharts.Chart} chart - The chart
     * @param {string} prop - The data prop to find extremes for
     * @return {Highcharts.RangeObject} Object with min and max properties
     */
    calculateDataExtremes: function (chart, prop) {
        return chart.series.reduce(function (extremes, series) {
            // We use cropped points rather than series.data here, to allow
            // users to zoom in for better fidelity.
            series.points.forEach(function (point) {
                var val = typeof point[prop] !== 'undefined' ?
                    point[prop] : point.options[prop];
                extremes.min = Math.min(extremes.min, val);
                extremes.max = Math.max(extremes.max, val);
            });
            return extremes;
        }, {
            min: Infinity,
            max: -Infinity
        });
    },
    /**
     * Translate a value on a virtual axis. Creates a new, virtual, axis with a
     * min and max, and maps the relative value onto this axis.
     * @private
     * @param {number} value
     * The relative data value to translate.
     * @param {Highcharts.RangeObject} dataExtremes
     * The possible extremes for this value.
     * @param {object} limits
     * Limits for the virtual axis.
     * @return {number}
     * The value mapped to the virtual axis.
     */
    virtualAxisTranslate: function (value, dataExtremes, limits) {
        var lenValueAxis = dataExtremes.max - dataExtremes.min, lenVirtualAxis = limits.max - limits.min, virtualAxisValue = limits.min +
            lenVirtualAxis * (value - dataExtremes.min) / lenValueAxis;
        return lenValueAxis > 0 ?
            clamp(virtualAxisValue, limits.min, limits.max) :
            limits.min;
    }
};
export default utilities;
