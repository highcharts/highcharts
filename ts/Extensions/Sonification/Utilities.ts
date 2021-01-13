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

import type Chart from '../../Core/Chart/Chart';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';
import musicalFrequencies from './MusicalFrequencies.js';
import U from '../../Core/Utilities.js';
const { clamp } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class SignalHandler {
            public constructor(supportedSignals: Array<string>);
            public signals: Record<string, Array<Function>>;
            public supportedSignals: Array<string>;
            public clearSignalCallbacks(signalNames?: Array<string>): void;
            public emitSignal(
                signalName: string,
                data?: unknown
            ): (unknown|undefined);
            public init(supportedSignals: Array<string>): void;
            public registerSignalCallbacks(
                signals: Record<string, (Function|undefined)>
            ): void;
        }
        interface SonificationUtilitiesObject {
            SignalHandler: typeof SignalHandler;
            musicalFrequencies: Array<number>;
            calculateDataExtremes(chart: Chart, prop: string): RangeObject;
            getMusicalScale(semitones: Array<number>): Array<number>;
            virtualAxisTranslate(
                value: number,
                dataExtremes: RangeObject,
                limits: RangeObject,
                invert?: boolean
            ): number;
        }
    }
}

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
function SignalHandler(
    this: Highcharts.SignalHandler,
    supportedSignals: Array<string>
): void {
    this.init(supportedSignals || []);
}
SignalHandler.prototype.init = function (
    supportedSignals: Array<string>
): void {
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
SignalHandler.prototype.registerSignalCallbacks = function (
    this: Highcharts.SignalHandler,
    signals: Record<string, (Function|undefined)>
): void {
    var signalHandler = this;

    signalHandler.supportedSignals.forEach(function (
        supportedSignal: keyof typeof signals
    ): void {
        const signal = signals[supportedSignal];
        if (signal) {
            (
                signalHandler.signals[supportedSignal] =
                signalHandler.signals[supportedSignal] || []
            ).push(signal);
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
SignalHandler.prototype.clearSignalCallbacks = function (
    this: Highcharts.SignalHandler,
    signalNames?: Array<string>
): void {
    var signalHandler = this;

    if (signalNames) {
        signalNames.forEach(function (signalName: string): void {
            if (signalHandler.signals[signalName]) {
                delete signalHandler.signals[signalName];
            }
        });
    } else {
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
SignalHandler.prototype.emitSignal = function (
    this: Highcharts.SignalHandler,
    signalName: string,
    data?: unknown
): (unknown|undefined) {
    var retval: unknown;

    if (this.signals[signalName]) {
        this.signals[signalName].forEach(function (handler: Function): void {
            var result = handler(data);

            retval = typeof result !== 'undefined' ? result : retval;
        });
    }
    return retval;
};


var utilities: Highcharts.SonificationUtilitiesObject = {

    // List of musical frequencies from C0 to C8
    musicalFrequencies: musicalFrequencies,

    // SignalHandler class
    SignalHandler: SignalHandler as any,

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
    getMusicalScale: function (semitones: Array<number>): Array<number> {
        return musicalFrequencies.filter(function (
            freq: number,
            i: number
        ): boolean {
            var interval = i % 12 + 1;

            return semitones.some(function (
                allowedInterval: number
            ): boolean {
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
    calculateDataExtremes: function (
        chart: Chart,
        prop: string
    ): Highcharts.RangeObject {
        return chart.series.reduce(function (
            extremes: Highcharts.RangeObject,
            series: Series
        ): Highcharts.RangeObject {
            // We use cropped points rather than series.data here, to allow
            // users to zoom in for better fidelity.
            series.points.forEach(function (point: Point): void {
                var val = typeof (point as any)[prop] !== 'undefined' ?
                    (point as any)[prop] : (point.options as any)[prop];

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
     * @param {Highcharts.RangeObject} DataExtremesObject
     * The possible extremes for this value.
     * @param {object} limits
     * Limits for the virtual axis.
     * @param {boolean} [invert]
     * Invert the virtual axis.
     * @return {number}
     * The value mapped to the virtual axis.
     */
    virtualAxisTranslate: function (
        value: number,
        dataExtremes: Highcharts.RangeObject,
        limits: Highcharts.RangeObject,
        invert?: boolean
    ): number {
        const lenValueAxis = dataExtremes.max - dataExtremes.min,
            lenVirtualAxis = Math.abs(limits.max - limits.min),
            valueDelta = invert ?
                dataExtremes.max - value :
                value - dataExtremes.min,
            virtualValueDelta = lenVirtualAxis * valueDelta / lenValueAxis,
            virtualAxisValue = limits.min + virtualValueDelta;

        return lenValueAxis > 0 ?
            clamp(virtualAxisValue, limits.min, limits.max) :
            limits.min;
    }
};

export default utilities;
