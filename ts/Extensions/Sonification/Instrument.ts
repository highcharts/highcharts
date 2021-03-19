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
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    error,
    merge,
    pick,
    uniqueKey
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class Instrument {
            public constructor(options: InstrumentOptionsObject);
            public _play?: Instrument['play'];
            public gainNode?: GainNode;
            public destinationNode?: AudioNode;
            public id: string;
            public masterVolume: number;
            public options: InstrumentOptionsObject;
            public oscillator?: OscillatorNode;
            public oscillatorStarted?: boolean;
            public panNode?: StereoPannerNode;
            public playCallbackTimers: Array<number>;
            public stopCallback?: Function;
            public stopOscillatorTimeout?: number;
            public stopTimeout?: number;
            public cancelGainRamp(): void;
            public clearPlayCallbackTimers(): void;
            public copy(options?: InstrumentOptionsObject): Instrument;
            public getValidFrequency(
                frequency: number,
                min?: number,
                max?: number
            ): number;
            public init(options: InstrumentOptionsObject): void;
            public initAudioContext(): boolean;
            public initOscillator(options: OscillatorOptionsObject): void;
            public mute(): void;
            public oscillatorPlay(frequency: number): void;
            public play(options: InstrumentPlayOptionsObject): void;
            public preparePlay(): void;
            public setFrequency(
                frequency: number,
                frequencyLimits?: Record<string, number>
            ): void;
            public setGain(gainValue: number, rampTime?: number): void;
            public setMasterVolume(volumeMultiplier: number): void;
            public setPan(panValue: number): void;
            public stop(
                immediately: boolean,
                onStopped?: Function,
                callbackData?: unknown
            ): void;
        }
        interface InstrumentOptionsObject {
            allowedFrequencies?: Array<number>;
            id?: string;
            masterVolume?: number;
            oscillator?: OscillatorOptionsObject;
            playCallbackInterval?: number;
            type?: string;
        }
        interface InstrumentPlayOptionsObject {
            duration: number;
            frequency: (number|Function);
            maxFrequency?: number;
            minFrequency?: number;
            onEnd?: Function;
            pan?: (number|Function);
            volume?: (number|Function);
        }
        interface OscillatorOptionsObject {
            waveformShape?: InstrumentWaveform;
        }
        let audioContext: AudioContext;
    }
}

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

// Default options for Instrument constructor
var defaultOptions: Highcharts.InstrumentOptionsObject = {
    type: 'oscillator',
    playCallbackInterval: 20,
    masterVolume: 1,
    oscillator: {
        waveformShape: 'sine'
    }
};

/* eslint-disable no-invalid-this, valid-jsdoc */

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
function Instrument(
    this: Highcharts.Instrument,
    options: Highcharts.InstrumentOptionsObject
): void {
    this.init(options);
}
Instrument.prototype.init = function (
    this: Highcharts.Instrument,
    options: Highcharts.InstrumentOptionsObject
): void {
    if (!this.initAudioContext()) {
        error(29);
        return;
    }

    this.options = merge(defaultOptions, options);
    this.id = this.options.id = options && options.id || uniqueKey();
    this.masterVolume = this.options.masterVolume || 0;

    // Init the audio nodes
    const ctx = H.audioContext;
    // Note: Destination node can be overridden by setting
    // Highcharts.sonification.Instrument.prototype.destinationNode.
    // This allows for inserting an additional chain of nodes after
    // the default processing.
    const destination = this.destinationNode || ctx.destination;

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
};


/**
 * Return a copy of an instrument. Only one instrument instance can play at a
 * time, so use this to get a new copy of the instrument that can play alongside
 * it. The new instrument copy will receive a new ID unless one is supplied in
 * options.
 *
 * @function Highcharts.Instrument#copy
 *
 * @param {Highcharts.InstrumentOptionsObject} [options]
 *        Options to merge in for the copy.
 *
 * @return {Highcharts.Instrument}
 *         A new Instrument instance with the same options.
 */
Instrument.prototype.copy = function (
    this: Highcharts.Instrument,
    options?: Highcharts.InstrumentOptionsObject
): Highcharts.Instrument {
    return new (Instrument as any)(
        merge(this.options, { id: null }, options)
    );
};


/**
 * Init the audio context, if we do not have one.
 * @private
 * @return {boolean} True if successful, false if not.
 */
Instrument.prototype.initAudioContext = function (
    this: Highcharts.Instrument
): boolean {
    var Context = H.win.AudioContext || H.win.webkitAudioContext,
        hasOldContext = !!H.audioContext;

    if (Context) {
        H.audioContext = H.audioContext || new Context();
        if (
            !hasOldContext &&
            H.audioContext &&
            H.audioContext.state === 'running'
        ) {
            H.audioContext.suspend(); // Pause until we need it
        }
        return !!(
            H.audioContext &&
            H.audioContext.createOscillator &&
            H.audioContext.createGain
        );
    }
    return false;
};


/**
 * Init an oscillator instrument.
 * @private
 * @param {Highcharts.OscillatorOptionsObject} oscillatorOptions
 * The oscillator options passed to Highcharts.Instrument#init.
 * @return {void}
 */
Instrument.prototype.initOscillator = function (
    this: Highcharts.Instrument,
    options: Highcharts.OscillatorOptionsObject
): void {
    var ctx = H.audioContext;

    this.oscillator = ctx.createOscillator();
    this.oscillator.type = options.waveformShape as any;
    this.oscillator.connect(this.gainNode as any);
    this.oscillatorStarted = false;
};


/**
 * Set pan position.
 * @private
 * @param {number} panValue
 * The pan position to set for the instrument.
 * @return {void}
 */
Instrument.prototype.setPan = function (
    this: Highcharts.Instrument,
    panValue: number
): void {
    if (this.panNode) {
        this.panNode.pan.setValueAtTime(panValue, H.audioContext.currentTime);
    }
};


/**
 * Set gain level. A maximum of 1.2 is allowed before we emit a warning. The
 * actual volume is not set above this level regardless of input. This function
 * also handles the Instrument's master volume.
 * @private
 * @param {number} gainValue
 * The gain level to set for the instrument.
 * @param {number} [rampTime=0]
 * Gradually change the gain level, time given in milliseconds.
 * @return {void}
 */
Instrument.prototype.setGain = function (
    this: Highcharts.Instrument,
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
                gainNode.gain.value, H.audioContext.currentTime
            );
            gainNode.gain.linearRampToValueAtTime(
                newVal,
                H.audioContext.currentTime + rampTime / 1000
            );
        } else {
            gainNode.gain.setValueAtTime(
                newVal, H.audioContext.currentTime
            );
        }
    }
};


/**
 * Cancel ongoing gain ramps.
 * @private
 * @return {void}
 */
Instrument.prototype.cancelGainRamp = function (
    this: Highcharts.Instrument
): void {
    if (this.gainNode) {
        this.gainNode.gain.cancelScheduledValues(0);
    }
};


/**
 * Set the master volume multiplier of the instrument after creation.
 * @param {number} volumeMultiplier
 * The gain level to set for the instrument.
 * @return {void}
 */
Instrument.prototype.setMasterVolume = function (
    this: Highcharts.Instrument,
    volumeMultiplier: number
): void {
    this.masterVolume = volumeMultiplier || 0;
};


/**
 * Get the closest valid frequency for this instrument.
 * @private
 * @param {number} frequency - The target frequency.
 * @param {number} [min] - Minimum frequency to return.
 * @param {number} [max] - Maximum frequency to return.
 * @return {number} The closest valid frequency to the input frequency.
 */
Instrument.prototype.getValidFrequency = function (
    this: Highcharts.Instrument,
    frequency: number,
    min?: number,
    max?: number
): number {
    var validFrequencies = this.options.allowedFrequencies,
        maximum = pick(max, Infinity),
        minimum = pick(min, -Infinity);

    return !validFrequencies || !validFrequencies.length ?
        // No valid frequencies for this instrument, return the target
        frequency :
        // Use the valid frequencies and return the closest match
        validFrequencies.reduce(function (acc: number, cur: number): number {
            // Find the closest allowed value
            return Math.abs(cur - frequency) < Math.abs(acc - frequency) &&
                cur < maximum && cur > minimum ?
                cur : acc;
        }, Infinity);
};


/**
 * Clear existing play callback timers.
 * @private
 * @return {void}
 */
Instrument.prototype.clearPlayCallbackTimers = function (
    this: Highcharts.Instrument
): void {
    this.playCallbackTimers.forEach(function (timer: number): void {
        clearInterval(timer);
    });
    this.playCallbackTimers = [];
};


/**
 * Set the current frequency being played by the instrument. The closest valid
 * frequency between the frequency limits is used.
 * @param {number} frequency
 * The frequency to set.
 * @param {Highcharts.Dictionary<number>} [frequencyLimits]
 * Object with maxFrequency and minFrequency
 * @return {void}
 */
Instrument.prototype.setFrequency = function (
    this: Highcharts.Instrument,
    frequency: number,
    frequencyLimits?: Record<string, number>
): void {
    var limits = frequencyLimits || {},
        validFrequency = this.getValidFrequency(
            frequency, limits.min, limits.max
        );

    if (this.options.type === 'oscillator') {
        this.oscillatorPlay(validFrequency);
    }
};


/**
 * Play oscillator instrument.
 * @private
 * @param {number} frequency - The frequency to play.
 */
Instrument.prototype.oscillatorPlay = function (
    this: Highcharts.Instrument,
    frequency: number
): void {
    if (!this.oscillatorStarted) {
        (this.oscillator as any).start();
        this.oscillatorStarted = true;
    }

    (this.oscillator as any).frequency.setValueAtTime(
        frequency, H.audioContext.currentTime
    );
};


/**
 * Prepare instrument before playing. Resumes the audio context and starts the
 * oscillator.
 * @private
 */
Instrument.prototype.preparePlay = function (
    this: Highcharts.Instrument
): void {
    this.setGain(0.001);
    if (H.audioContext.state === 'suspended') {
        H.audioContext.resume();
    }
    if (this.oscillator && !this.oscillatorStarted) {
        this.oscillator.start();
        this.oscillatorStarted = true;
    }
};


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
 * @return {void}
 */
Instrument.prototype.play = function (
    this: Highcharts.Instrument,
    options: Highcharts.InstrumentPlayOptionsObject
): void {
    var instrument = this,
        duration = options.duration || 0,
        // Set a value, or if it is a function, set it continously as a timer.
        // Pass in the value/function to set, the setter function, and any
        // additional data to pass through to the setter function.
        setOrStartTimer = function (
            value: (number|Function),
            setter: string,
            setterData?: unknown
        ): void {
            var target = options.duration,
                currentDurationIx = 0,
                callbackInterval = instrument.options.playCallbackInterval;

            if (typeof value === 'function') {
                var timer = setInterval(function (): void {
                    currentDurationIx++;
                    var curTime = (
                        currentDurationIx * (callbackInterval as any) / target
                    );

                    if (curTime >= 1) {
                        (instrument as any)[setter](value(1), setterData);
                        clearInterval(timer);
                    } else {
                        (instrument as any)[setter](value(curTime), setterData);
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
        H.audioContext.state === 'suspended' ||
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
            // We have a callback for the play we are interrupting. We do not
            // allow this callback to start a new play, because that leads to
            // chaos. We pass in 'cancelled' to indicate that this note did not
            // finish, but still stopped.
            instrument._play = instrument.play;
            instrument.play = function (): void { };
            instrument.stopCallback('cancelled');
            instrument.play = instrument._play;
        }
    }

    // Stop the note without fadeOut if the duration is too short to hear the
    // note otherwise.
    var immediate = duration < H.sonification.fadeOutDuration + 20;

    // Stop the instrument after the duration of the note
    instrument.stopCallback = options.onEnd;
    var onStop = function (): void {
        delete instrument.stopTimeout;
        instrument.stop(immediate);
    };

    if (duration) {
        instrument.stopTimeout = setTimeout(
            onStop,
            immediate ? duration :
                duration - H.sonification.fadeOutDuration
        );

        // Play the note
        setOrStartTimer(options.frequency, 'setFrequency', {
            minFrequency: options.minFrequency,
            maxFrequency: options.maxFrequency
        });

        // Set the volume and panning
        setOrStartTimer(pick(options.volume, 1), 'setGain', 4); // Slight ramp
        setOrStartTimer(pick(options.pan, 0), 'setPan');
    } else {
        // No note duration, so just stop immediately
        onStop();
    }
};


/**
 * Mute an instrument that is playing. If the instrument is not currently
 * playing, this function does nothing.
 *
 * @function Highcharts.Instrument#mute
 */
Instrument.prototype.mute = function (this: Highcharts.Instrument): void {
    this.setGain(0.0001, H.sonification.fadeOutDuration * 0.8);
};


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
 * @return {void}
 */
Instrument.prototype.stop = function (
    immediately: boolean,
    onStopped?: Function,
    callbackData?: unknown
): void {
    var instr = this,
        reset = function (): void {
            // Remove timeout reference
            if (instr.stopOscillatorTimeout) {
                delete instr.stopOscillatorTimeout;
            }
            // The oscillator may have stopped in the meantime here, so allow
            // this function to fail if so.
            try {
                instr.oscillator.stop();
            } catch (e) {
                // silent error
            }
            instr.oscillator.disconnect(instr.gainNode);
            // We need a new oscillator in order to restart it
            instr.initOscillator(instr.options.oscillator);
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
            setTimeout(reset, H.sonification.fadeOutDuration + 100);
    }
};


export default Instrument;
