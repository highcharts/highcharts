/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Instrument class for sonification module.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import H from '../../Core/Globals.js';
const { win } = H;
import Sonification from './Sonification.js';
import SU from './SonificationUtilities.js';
import U from '../../Core/Utilities.js';
const {
    error,
    merge,
    pick,
    uniqueKey
} = U;
/* eslint-disable no-invalid-this, valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

/**
 * The Instrument class. Instrument objects represent an instrument capable of
 * playing a certain pitch for a specified duration.
 *
 * @sample highcharts/sonification/instrument/
 *         Using Instruments directly
 * @sample highcharts/sonification/instrument-advanced/
 *         Using callbacks for instrument parameters
 *
 * @requires module:modules/sonification
 *
 * @class
 * @name Highcharts.Instrument
 *
 * @param {Highcharts.InstrumentOptionsObject} options
 *        Options for the instrument instance.
 */
class Instrument {

    /* *
     *
     *  Static properties
     *
     * */

    public static audioContext: AudioContext;

    // Default options for Instrument constructor
    public static defaultOptions: Instrument.Options = {
        type: 'oscillator',
        playCallbackInterval: 20,
        masterVolume: 1,
        oscillator: {
            waveformShape: 'sine'
        }
    };

    public static definitions = {} as Instrument.Definitions;

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: Instrument.Options
    ) {
        this.init(options);
    }

    /* *
    *
    *  Properties
    *
    * */

    public _play?: Instrument['play'];
    public gainNode?: GainNode;
    public destinationNode?: AudioNode;
    public id: string = void 0 as any;
    public masterVolume: number = void 0 as any;
    public options: Instrument.Options = void 0 as any;
    public oscillator?: OscillatorNode;
    public oscillatorStarted?: boolean;
    public panNode?: StereoPannerNode;
    public playCallbackTimers: Array<number> = void 0 as any;
    public stopCallback?: Function;
    public stopOscillatorTimeout?: number;
    public stopTimeout?: number;

    /* *
    *
    *  Functions
    *
    * */

    public init(
        this: Instrument,
        options: Instrument.Options
    ): void {
        if (!this.initAudioContext()) {
            error(29);
            return;
        }

        this.options = merge(Instrument.defaultOptions, options);
        this.id = this.options.id = options && options.id || uniqueKey();
        this.masterVolume = this.options.masterVolume || 0;

        // Init the audio nodes
        const ctx = Instrument.audioContext,
            // Note: Destination node can be overridden by setting
            // Highcharts.sonification.Instrument.prototype.destinationNode.
            // This allows for inserting an additional chain of nodes after
            // the default processing.
            destination = this.destinationNode || ctx.destination;

        this.gainNode = ctx.createGain();
        this.setGain(0);
        this.panNode = ctx.createStereoPanner && ctx.createStereoPanner();
        if (this.panNode) {
            this.setPan(0);
            this.gainNode.connect(this.panNode);
            this.panNode.connect(destination);
        } else {
            this.gainNode.connect(destination);
        }

        // Oscillator initialization
        if (this.options.type === 'oscillator') {
            this.initOscillator(this.options.oscillator as any);
        }

        // Init timer list
        this.playCallbackTimers = [];
    }

    /**
     * Return a copy of an instrument. Only one instrument instance can play at
     * a time, so use this to get a new copy of the instrument that can play
     * alongside it. The new instrument copy will receive a new ID unless one is
     * supplied in options.
     *
     * @function Highcharts.Instrument#copy
     *
     * @param {Highcharts.InstrumentOptionsObject} [options]
     *        Options to merge in for the copy.
     *
     * @return {Highcharts.Instrument}
     *         A new Instrument instance with the same options.
     */
    public copy(
        this: Instrument,
        options?: Instrument.Options
    ): Instrument {
        return new (Instrument as any)(
            merge(this.options, { id: null }, options)
        );
    }

    /**
     * Init the audio context, if we do not have one.
     * @private
     * @return {boolean} True if successful, false if not.
     */
    public initAudioContext(
        this: Instrument
    ): boolean {
        const Context = win.AudioContext || win.webkitAudioContext,
            hasOldContext = !!Instrument.audioContext;

        if (Context) {
            Instrument.audioContext = Instrument.audioContext || new Context();
            if (
                !hasOldContext &&
                Instrument.audioContext &&
                Instrument.audioContext.state === 'running'
            ) {
                Instrument.audioContext.suspend(); // Pause until we need it
            }
            return !!(
                Instrument.audioContext &&
                (Instrument.audioContext.createOscillator) &&
                (Instrument.audioContext.createGain)
            );
        }
        return false;
    }

    /**
     * Init an oscillator instrument.
     * @private
     * @param {Highcharts.OscillatorOptionsObject} oscillatorOptions
     * The oscillator options passed to Highcharts.Instrument#init.
     */
    public initOscillator(
        this: Instrument,
        options: Instrument.OscillatorOptions
    ): void {
        const ctx = Instrument.audioContext;

        this.oscillator = ctx.createOscillator();
        this.oscillator.type = options.waveformShape as any;
        this.oscillator.connect(this.gainNode as any);
        this.oscillatorStarted = false;
    }

    /**
     * Set pan position.
     * @private
     * @param {number} panValue
     * The pan position to set for the instrument.
     */
    public setPan(
        this: Instrument,
        panValue: number
    ): void {
        if (this.panNode) {
            this.panNode.pan.setValueAtTime(
                panValue,
                Instrument.audioContext.currentTime
            );
        }
    }

    /**
     * Set gain level. A maximum of 1.2 is allowed before we emit a warning. The
     * actual volume is not set above this level regardless of input. This
     * function also handles the Instrument's master volume.
     * @private
     * @param {number} gainValue
     * The gain level to set for the instrument.
     * @param {number} [rampTime=0]
     * Gradually change the gain level, time given in milliseconds.
     */
    public setGain(
        this: Instrument,
        gainValue: number,
        rampTime?: number
    ): void {
        const gainNode = this.gainNode;
        let newVal = gainValue * this.masterVolume;
        if (gainNode) {
            if (newVal > 1.2) {
                console.warn( // eslint-disable-line
                    'Highcharts sonification warning: ' +
                    'Volume of instrument set too high.'
                );
                newVal = 1.2;
            }
            if (rampTime) {
                gainNode.gain.setValueAtTime(
                    gainNode.gain.value, Instrument.audioContext.currentTime
                );
                gainNode.gain.linearRampToValueAtTime(
                    newVal,
                    Instrument.audioContext.currentTime + rampTime / 1000
                );
            } else {
                gainNode.gain.setValueAtTime(
                    newVal, Instrument.audioContext.currentTime
                );
            }
        }
    }

    /**
     * Cancel ongoing gain ramps.
     * @private
     */
    public cancelGainRamp(
        this: Instrument
    ): void {
        if (this.gainNode) {
            this.gainNode.gain.cancelScheduledValues(0);
        }
    }

    /**
     * Set the master volume multiplier of the instrument after creation.
     * @param {number} volumeMultiplier
     * The gain level to set for the instrument.
     */
    public setMasterVolume(
        this: Instrument,
        volumeMultiplier: number
    ): void {
        this.masterVolume = volumeMultiplier || 0;
    }

    /**
     * Get the closest valid frequency for this instrument.
     * @private
     * @param {number} frequency
     * The target frequency.
     * @param {number} [min]
     * Minimum frequency to return.
     * @param {number} [max]
     * Maximum frequency to return.
     * @return {number}
     * The closest valid frequency to the input frequency.
     */
    public getValidFrequency(
        this: Instrument,
        frequency: number,
        min?: number,
        max?: number
    ): number {
        const validFrequencies = this.options.allowedFrequencies,
            maximum = pick(max, Infinity),
            minimum = pick(min, -Infinity);

        return !validFrequencies || !validFrequencies.length ?
            // No valid frequencies for this instrument, return the target
            frequency :
            // Use the valid frequencies and return the closest match
            validFrequencies.reduce(function (
                acc: number,
                cur: number
            ): number {
                // Find the closest allowed value
                return Math.abs(cur - frequency) < Math.abs(acc - frequency) &&
                    cur < maximum && cur > minimum ?
                    cur : acc;
            }, Infinity);
    }


    /**
     * Clear existing play callback timers.
     * @private
     */
    public clearPlayCallbackTimers(
        this: Instrument
    ): void {
        this.playCallbackTimers.forEach(function (timer: number): void {
            clearInterval(timer);
        });
        this.playCallbackTimers = [];
    }


    /**
     * Set the current frequency being played by the instrument. The closest
     * valid frequency between the frequency limits is used.
     * @param {number} frequency
     * The frequency to set.
     * @param {Highcharts.Dictionary<number>} [frequencyLimits]
     * Object with maxFrequency and minFrequency
     */
    public setFrequency(
        this: Instrument,
        frequency: number,
        frequencyLimits?: Record<string, number>
    ): void {
        const limits = frequencyLimits || {},
            validFrequency = this.getValidFrequency(
                frequency, limits.min, limits.max
            );

        if (this.options.type === 'oscillator') {
            this.oscillatorPlay(validFrequency);
        }
    }

    /**
     * Play oscillator instrument.
     * @private
     * @param {number} frequency
     * The frequency to play.
     */
    public oscillatorPlay(
        this: Instrument,
        frequency: number
    ): void {
        if (!this.oscillatorStarted) {
            (this.oscillator as any).start();
            this.oscillatorStarted = true;
        }

        (this.oscillator as any).frequency.setValueAtTime(
            frequency, Instrument.audioContext.currentTime
        );
    }


    /**
     * Prepare instrument before playing. Resumes the audio context and starts
     * the oscillator.
     * @private
     */
    public preparePlay(
        this: Instrument
    ): void {
        this.setGain(0.001);
        if (Instrument.audioContext.state === 'suspended') {
            Instrument.audioContext.resume();
        }
        if (this.oscillator && !this.oscillatorStarted) {
            this.oscillator.start();
            this.oscillatorStarted = true;
        }
    }


    /**
     * Play the instrument according to options.
     *
     * @sample highcharts/sonification/instrument/
     *         Using Instruments directly
     * @sample highcharts/sonification/instrument-advanced/
     *         Using callbacks for instrument parameters
     *
     * @function Highcharts.Instrument#play
     *
     * @param {Highcharts.InstrumentPlayOptionsObject} options
     *        Options for the playback of the instrument.
     *
     */
    public play(
        this: Instrument,
        options: Instrument.PlayOptions
    ): void {
        const instrument = this,
            duration = options.duration || 0,
            // Set a value, or if it is a function, set it continously as a
            // timer. Pass in the value/function to set, the setter function,
            // and any additional data to pass through to the setter function.
            setOrStartTimer = function (
                value: (number|Function),
                setter: string,
                setterData?: unknown
            ): void {
                const target = options.duration,
                    callbackInterval = instrument.options.playCallbackInterval;
                let currentDurationIx = 0;

                if (typeof value === 'function') {
                    const timer = setInterval(function (): void {
                        currentDurationIx++;
                        const curTime = (
                            currentDurationIx *
                            (callbackInterval as any) / target
                        );

                        if (curTime >= 1) {
                            (instrument as any)[setter](value(1), setterData);
                            clearInterval(timer);
                        } else {
                            (instrument as any)[setter](
                                value(curTime),
                                setterData
                            );
                        }
                    }, callbackInterval);

                    instrument.playCallbackTimers.push(timer);
                } else {
                    (instrument as any)[setter](value, setterData);
                }
            };

        if (!instrument.id) {
            // No audio support - do nothing
            return;
        }

        // If the AudioContext is suspended we have to resume it before playing
        if (
            Instrument.audioContext.state === 'suspended' ||
            this.oscillator && !this.oscillatorStarted
        ) {
            instrument.preparePlay();
            // Try again in 10ms
            setTimeout(function (): void {
                instrument.play(options);
            }, 10);
            return;
        }

        // Clear any existing play timers
        if (instrument.playCallbackTimers.length) {
            instrument.clearPlayCallbackTimers();
        }

        // Clear any gain ramps
        instrument.cancelGainRamp();

        // Clear stop oscillator timer
        if (instrument.stopOscillatorTimeout) {
            clearTimeout(instrument.stopOscillatorTimeout);
            delete instrument.stopOscillatorTimeout;
        }

        // If a note is playing right now, clear the stop timeout, and call the
        // callback.
        if (instrument.stopTimeout) {
            clearTimeout(instrument.stopTimeout);
            delete instrument.stopTimeout;
            if (instrument.stopCallback) {
                // We have a callback for the play we are interrupting. We do
                // not allow this callback to start a new play, because that
                // leads to chaos. We pass in 'cancelled' to indicate that this
                // note did not finish, but still stopped.
                instrument._play = instrument.play;
                instrument.play = function (): void { };
                instrument.stopCallback('cancelled');
                instrument.play = instrument._play;
            }
        }

        // Stop the note without fadeOut if the duration is too short to hear
        // the note otherwise.
        const immediate = duration < Sonification.fadeOutDuration + 20;

        // Stop the instrument after the duration of the note
        instrument.stopCallback = options.onEnd;
        const onStop = function (): void {
            delete instrument.stopTimeout;
            instrument.stop(immediate);
        };

        if (duration) {
            instrument.stopTimeout = setTimeout(
                onStop,
                immediate ? duration :
                    duration - Sonification.fadeOutDuration
            );

            // Play the note
            setOrStartTimer(options.frequency, 'setFrequency', {
                minFrequency: options.minFrequency,
                maxFrequency: options.maxFrequency
            });

            // Set the volume and panning
            setOrStartTimer(
                pick(options.volume, 1),
                'setGain',
                4
            ); // Slight ramp
            setOrStartTimer(pick(options.pan, 0), 'setPan');
        } else {
            // No note duration, so just stop immediately
            onStop();
        }
    }

    /**
     * Mute an instrument that is playing. If the instrument is not currently
     * playing, this function does nothing.
     *
     * @function Highcharts.Instrument#mute
     */
    public mute(this: Instrument): void {
        this.setGain(0.0001, Sonification.fadeOutDuration * 0.8);
    }


    /**
     * Stop the instrument playing.
     *
     * @function Highcharts.Instrument#stop
     *
     * @param {boolean} immediately
     *        Whether to do the stop immediately or fade out.
     *
     * @param {Function} [onStopped]
     *        Callback function to be called when the stop is completed.
     *
     * @param {*} [callbackData]
     *        Data to send to the onEnd callback functions.
     *
     */
    public stop(
        immediately: boolean,
        onStopped?: Function,
        callbackData?: unknown
    ): void {
        const instr = this,
            reset = function (): void {
                // Remove timeout reference
                if (instr.stopOscillatorTimeout) {
                    delete instr.stopOscillatorTimeout;
                }
                if (
                    instr.oscillator &&
                    instr.options.oscillator
                ) {
                    // The oscillator may have stopped in the meantime here, so
                    // allow this function to fail if so.
                    try {
                        instr.oscillator.stop();
                    } catch (e) {
                        // silent error
                    }
                    if (instr.gainNode) {
                        instr.oscillator.disconnect(instr.gainNode);
                    }
                    // We need a new oscillator in order to restart it
                    instr.initOscillator(instr.options.oscillator);
                }
                // Done stopping, call the callback from the stop
                if (onStopped) {
                    onStopped(callbackData);
                }
                // Call the callback for the play we finished
                if (instr.stopCallback) {
                    instr.stopCallback(callbackData);
                }
            };

        // Clear any existing timers
        if (instr.playCallbackTimers.length) {
            instr.clearPlayCallbackTimers();
        }
        if (instr.stopTimeout) {
            clearTimeout(instr.stopTimeout);
        }
        if (immediately) {
            instr.setGain(0);
            reset();
        } else {
            instr.mute();
            // Stop the oscillator after the mute fade-out has finished
            instr.stopOscillatorTimeout =
                setTimeout(reset, Sonification.fadeOutDuration + 100);
        }
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

// ['sine', 'square', 'triangle', 'sawtooth'].forEach(function (
['sine', 'square', 'triangle', 'sawtooth'].forEach(function (
    waveform: Instrument.Waveform
): void {
    // Add basic instruments
    Instrument.definitions[waveform] = new Instrument({
        oscillator: { waveformShape: waveform }
    });

    // Add musical instruments
    Instrument.definitions[waveform + 'Musical'] = new (Instrument as any)({
        allowedFrequencies: SU.musicalFrequencies,
        oscillator: { waveformShape: waveform }
    });

    // Add scaled instruments
    Instrument.definitions[waveform + 'Major'] = new Instrument({
        allowedFrequencies: SU.getMusicalScale([1, 3, 5, 6, 8, 10, 12]),
        oscillator: { waveformShape: waveform }
    });
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace Instrument {

    export interface Definitions extends Record<string, Instrument> {
        sawtooth: Instrument;
        sawtoothMajor: Instrument;
        sawtoothMusical: Instrument;
        sine: Instrument;
        sineMajor: Instrument;
        sineMusical: Instrument;
        square: Instrument;
        squareMajor: Instrument;
        squareMusical: Instrument;
        triangle: Instrument;
        triangleMajor: Instrument;
        triangleMusical: Instrument;
    }

    export interface Options {
        allowedFrequencies?: Array<number>;
        id?: string;
        masterVolume?: number;
        oscillator?: OscillatorOptions;
        playCallbackInterval?: number;
        type?: string;
    }

    export interface PlayOptions {
        duration: number;
        frequency: (number|Function);
        maxFrequency?: number;
        minFrequency?: number;
        onEnd?: Function;
        pan?: (number|Function);
        volume?: (number|Function);
    }

    export interface OscillatorOptions{
        waveformShape?: Waveform;
    }

    export type Waveform = keyof Definitions;

}

/* *
 *
 *  Default Export
 *
 * */

export default Instrument;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * A set of options for the Instrument class.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.InstrumentOptionsObject
 *//**
 * The type of instrument. Currently only `oscillator` is supported. Defaults
 * to `oscillator`.
 * @name Highcharts.InstrumentOptionsObject#type
 * @type {string|undefined}
 *//**
 * The unique ID of the instrument. Generated if not supplied.
 * @name Highcharts.InstrumentOptionsObject#id
 * @type {string|undefined}
 *//**
 * The master volume multiplier to apply to the instrument, regardless of other
 * volume changes. Defaults to 1.
 * @name Highcharts.InstrumentPlayOptionsObject#masterVolume
 * @type {number|undefined}
 *//**
 * When using functions to determine frequency or other parameters during
 * playback, this options specifies how often to call the callback functions.
 * Number given in milliseconds. Defaults to 20.
 * @name Highcharts.InstrumentOptionsObject#playCallbackInterval
 * @type {number|undefined}
 *//**
 * A list of allowed frequencies for this instrument. If trying to play a
 * frequency not on this list, the closest frequency will be used. Set to `null`
 * to allow all frequencies to be used. Defaults to `null`.
 * @name Highcharts.InstrumentOptionsObject#allowedFrequencies
 * @type {Array<number>|undefined}
 *//**
 * Options specific to oscillator instruments.
 * @name Highcharts.InstrumentOptionsObject#oscillator
 * @type {Highcharts.OscillatorOptionsObject|undefined}
 */

/**
 * Options for playing an instrument.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.InstrumentPlayOptionsObject
 *//**
 * The frequency of the note to play. Can be a fixed number, or a function. The
 * function receives one argument: the relative time of the note playing (0
 * being the start, and 1 being the end of the note). It should return the
 * frequency number for each point in time. The poll interval of this function
 * is specified by the Instrument.playCallbackInterval option.
 * @name Highcharts.InstrumentPlayOptionsObject#frequency
 * @type {number|Function}
 *//**
 * The duration of the note in milliseconds.
 * @name Highcharts.InstrumentPlayOptionsObject#duration
 * @type {number}
 *//**
 * The minimum frequency to allow. If the instrument has a set of allowed
 * frequencies, the closest frequency is used by default. Use this option to
 * stop too low frequencies from being used.
 * @name Highcharts.InstrumentPlayOptionsObject#minFrequency
 * @type {number|undefined}
 *//**
 * The maximum frequency to allow. If the instrument has a set of allowed
 * frequencies, the closest frequency is used by default. Use this option to
 * stop too high frequencies from being used.
 * @name Highcharts.InstrumentPlayOptionsObject#maxFrequency
 * @type {number|undefined}
 *//**
 * The volume of the instrument. Can be a fixed number between 0 and 1, or a
 * function. The function receives one argument: the relative time of the note
 * playing (0 being the start, and 1 being the end of the note). It should
 * return the volume for each point in time. The poll interval of this function
 * is specified by the Instrument.playCallbackInterval option. Defaults to 1.
 * @name Highcharts.InstrumentPlayOptionsObject#volume
 * @type {number|Function|undefined}
 *//**
 * The panning of the instrument. Can be a fixed number between -1 and 1, or a
 * function. The function receives one argument: the relative time of the note
 * playing (0 being the start, and 1 being the end of the note). It should
 * return the panning value for each point in time. The poll interval of this
 * function is specified by the Instrument.playCallbackInterval option.
 * Defaults to 0.
 * @name Highcharts.InstrumentPlayOptionsObject#pan
 * @type {number|Function|undefined}
 *//**
 * Callback function to be called when the play is completed.
 * @name Highcharts.InstrumentPlayOptionsObject#onEnd
 * @type {Function|undefined}
 */


/**
 * @requires module:modules/sonification
 *
 * @interface Highcharts.OscillatorOptionsObject
 *//**
 * The waveform shape to use for oscillator instruments. Defaults to `sine`.
 * @name Highcharts.OscillatorOptionsObject#waveformShape
 * @type {string|undefined}
 */

(''); // keeps doclets above in JS file
