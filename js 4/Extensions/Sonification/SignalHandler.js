/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Utility functions for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
/* eslint-disable no-invalid-this, valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
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
var SignalHandler = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function SignalHandler(supportedSignals) {
        /* *
         *
         *  Properties
         *
         * */
        this.signals = void 0;
        this.supportedSignals = void 0;
        this.init(supportedSignals || []);
    }
    /* *
     *
     * Functions
     *
     * */
    SignalHandler.prototype.init = function (supportedSignals) {
        this.supportedSignals = supportedSignals;
        this.signals = {};
    };
    /**
     * Register a set of signal callbacks with this SignalHandler.
     * Multiple signal callbacks can be registered for the same signal.
     * @private
     * @param {Highcharts.Dictionary<(Function|undefined)>} signals
     * An object that contains a mapping from the signal name to the callbacks.
     * Only supported events are considered.
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
     * @param {Array<string>} [signalNames]
     * A list of signal names to clear. If not supplied, all signal callbacks
     * are removed.
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
     * @param {string} signalName
     * Name of signal to emit.
     * @param {*} [data]
     * Data to pass to the callback.
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
    return SignalHandler;
}());
/* *
 *
 * Default Export
 *
 * */
export default SignalHandler;
