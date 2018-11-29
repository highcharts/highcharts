/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Instrument class for sonification module.
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';

// Default options for Instrument constructor
var defaultOptions = {
    type: 'oscillator',
    playCallbackInterval: 20,
    oscillator: {
        waveformShape: 'sine'
    }
};


/**
 * The Instrument class. Instrument objects represent an instrument capable of
 * playing a certain pitch for a specified duration.
 *
 * @class Instrument
 *
 * @param   {Object} options
 *          Options for the instrument instance.
 *
 * @param   {String} [options.type='oscillator']
 *          The type of instrument. Currently only `oscillator` is supported.
 *
 * @param   {String} [options.id]
 *          The unique ID of the instrument. Generated if not supplied.
 *
 * @param   {number} [playCallbackInterval=20]
 *          When using functions to determine frequency or other parameters
 *          during playback, this options specifies how often to call the
 *          callback functions. Number given in milliseconds.
 *
 * @param   {Array<number>} [options.allowedFrequencies=null]
 *          A list of allowed frequencies for this instrument. If trying to play
 *          a frequency not on this list, the closest frequency will be used.
 *          Set to `null` to allow all frequencies to be used.
 *
 * @param   {Object} [options.oscillator]
 *          Options specific to oscillator instruments.
 *
 * @param   {String} [options.oscillator.waveformShape='sine']
 *          The waveform shape to use for oscillator instruments.
 *
 * @sample highcharts/sonification/instrument/
 *         Using Instruments directly
 * @sample highcharts/sonification/instrument-advanced/
 *         Using callbacks for instrument parameters
 */
function Instrument(options) {
    this.init(options);
}
Instrument.prototype.init = function (options) {
    if (!this.initAudioContext()) {
        H.error(29);
        return;
    }
    this.options = H.merge(defaultOptions, options);
    this.id = this.options.id = options && options.id || H.uniqueKey();

    // Init the audio nodes
    var ctx = H.audioContext;
    this.gainNode = ctx.createGain();
    this.setGain(0);
    this.panNode = ctx.createStereoPanner && ctx.createStereoPanner();
    if (this.panNode) {
        this.setPan(0);
        this.gainNode.connect(this.panNode);
        this.panNode.connect(ctx.destination);
    } else {
        this.gainNode.connect(ctx.destination);
    }

    // Oscillator initialization
    if (this.options.type === 'oscillator') {
        this.initOscillator(this.options.oscillator);
    }

    // Init timer list
    this.playCallbackTimers = [];
};


/**
 * Return a copy of an instrument. Only one instrument instance can play at a
 * time, so use this to get a new copy of the instrument that can play alongside
 * it.
 *
 * @param   {Object} options
 *          Options to merge in for the copy.
 *
 * @return {Highcharts.Instrument} A new Instrument instance with the same
 *  options.
 */
Instrument.prototype.copy = function (options) {
    return new Instrument(H.merge(this.options, { id: null }, options));
};


/**
 * Init the audio context, if we do not have one.
 * @private
 * @return {boolean} True if successful, false if not.
 */
Instrument.prototype.initAudioContext = function () {
    var Context = H.win.AudioContext || H.win.webkitAudioContext;
    if (Context) {
        H.audioContext = H.audioContext || new Context();
        if (H.audioContext && H.audioContext.state === 'running') {
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
 *
 * @param   {Object} oscillatorOptions
 *          The oscillator options passed to Instrument.init.
 */
Instrument.prototype.initOscillator = function (options) {
    var ctx = H.audioContext;
    this.oscillator = ctx.createOscillator();
    this.oscillator.type = options.waveformShape;
    this.oscillator.frequency.value = 0; // Start frequency at 0
    this.oscillator.connect(this.gainNode);
    this.oscillatorStarted = false;
};


/**
 * Set pan position.
 * @private
 *
 * @param   {number} panValue
 *          The pan position to set for the instrument.
 */
Instrument.prototype.setPan = function (panValue) {
    if (this.panNode) {
        this.panNode.pan.value = panValue;
    }
};


/**
 * Set gain level. A maximum of 1.2 is allowed before we emit a warning. The
 * actual volume is not set above this level regardless of input.
 * @private
 *
 * @param   {number} gainValue
 *          The gain level to set for the instrument.
 */
Instrument.prototype.setGain = function (gainValue) {
    if (this.gainNode) {
        if (gainValue > 1.2) {
            console.warn( // eslint-disable-line
                'Highcharts sonification warning: ' +
                'Volume of instrument set too high.'
            );
            gainValue = 1.2;
        }
        this.gainNode.gain.value = gainValue;
    }
};


/**
 * Get the closest valid frequency for this instrument.
 * @private
 *
 * @param   {number} frequency
 *          The target frequency.
 * @param   {number} [min]
 *          Minimum frequency to return.
 * @param   {number} [max]
 *          Maximum frequency to return.
 *
 * @return {number} The closest valid frequency to the input frequency.
 */
Instrument.prototype.getValidFrequency = function (frequency, min, max) {
    var validFrequencies = this.options.allowedFrequencies,
        maximum = H.pick(max, Infinity),
        minimum = H.pick(min, -Infinity);
    return !validFrequencies || !validFrequencies.length ?
            // No valid frequencies for this instrument, return the target
            frequency :
            // Use the valid frequencies and return the closest match
            validFrequencies.reduce(function (acc, cur) {
                // Find the closest allowed value
                return Math.abs(cur - frequency) < Math.abs(acc - frequency) &&
                    cur < maximum && cur > minimum ?
                    cur : acc;
            }, Infinity);
};


/**
 * Clear existing play callback timers.
 * @private
 */
Instrument.prototype.clearPlayCallbackTimers = function () {
    this.playCallbackTimers.forEach(function (timer) {
        clearInterval(timer);
    });
    this.playCallbackTimers = [];
};


/**
 * Play oscillator instrument.
 * @private
 *
 * @param   {number} frequency
 *          The frequency to play.
 */
Instrument.prototype.oscillatorPlay = function (frequency) {
    if (!this.oscillatorStarted) {
        this.oscillator.start();
        this.oscillatorStarted = true;
    }

    this.oscillator.frequency.setValueAtTime(
        frequency, H.audioContext.currentTime + 0.005
    );
};


/**
 * Play the instrument according to options.
 *
 * @param   {Object} options
 *          Options for the playback of the instrument.
 *
 * @param   {number|Function} options.frequency
 *          The frequency of the note to play. Can be a fixed number, or a
 *          function. The function receives one argument: the relative time of
 *          the note playing (0 being the start, and 1 being the end of the
 *          note). It should return the frequency number for each point in time.
 *          The poll interval of this function is specified by the
 *          Instrument.playCallbackInterval option.
 *
 * @param   {number} [options.minFrequency]
 *          The minimum frequency to allow. If the instrument has a set of
 *          allowed frequencies, the closest frequency is used by default. Use
 *          this option to stop too low frequencies from being used.
 *
 * @param   {number} [options.maxFrequency]
 *          The maximum frequency to allow. If the instrument has a set of
 *          allowed frequencies, the closest frequency is used by default. Use
 *          this option to stop too high frequencies from being used.
 *
 * @param   {number} options.duration
 *          The duration of the note in milliseconds.
 *
 * @param   {Function} [options.onEnd]
 *          Callback function to be called when the play is completed.
 *
 * @param   {number|Function} [options.volume=1]
 *          The volume of the instrument. Can be a fixed number between 0 and 1,
 *          or a function. The function receives one argument: the relative time
 *          of the note playing (0 being the start, and 1 being the end of the
 *          note). It should return the volume for each point in time. The poll
 *          interval of this function is specified by the
 *          Instrument.playCallbackInterval option.
 *
 * @param   {number|Function} [options.pan=0]
 *          The panning of the instrument. Can be a fixed number between -1 and
 *          1, or a function. The function receives one argument: the relative
 *          time of the note playing (0 being the start, and 1 being the end of
 *          the note). It should return the panning value for each point in
 *          time. The poll interval of this function is specified by the
 *          Instrument.playCallbackInterval option.
 *
 * @sample highcharts/sonification/instrument/
 *         Using Instruments directly
 * @sample highcharts/sonification/instrument-advanced/
 *         Using callbacks for instrument parameters
 */
Instrument.prototype.play = function (options) {
    var instrument = this,
        frequency = instrument.getValidFrequency(
            options.frequency, options.minFrequency, options.maxFrequency
        ),
        // Set a value, or if it is a function, set it continously as a timer
        setOrStartTimer = function (value, setter) {
            var target = options.duration,
                currentDurationIx = 0,
                callbackInterval = instrument.options.playCallbackInterval;
            if (typeof value === 'function') {
                instrument[setter](value(0)); // Init
                var timer = setInterval(function () {
                    currentDurationIx++;
                    var curTime = currentDurationIx * callbackInterval / target;
                    if (curTime >= 1) {
                        instrument[setter](value(1));
                        clearInterval(timer);
                    } else {
                        instrument[setter](value(curTime));
                    }
                }, callbackInterval);
                instrument.playCallbackTimers.push(timer);
            } else {
                instrument[setter](value);
            }
        };

    if (!instrument.id) {
        // No audio support - do nothing
        return;
    }

    // Clear any existing play timers
    if (instrument.playCallbackTimers.length) {
        instrument.clearPlayCallbackTimers();
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
            instrument.play = function () { };
            instrument.stopCallback('cancelled');
            instrument.play = instrument._play;
        }
    }

    // If the AudioContext is suspended we have to resume it before playing
    if (H.audioContext.state === 'suspended') {
        H.audioContext.resume();
    }

    // Stop the note without fadeOut if the duration is too short to hear the
    // note otherwise.
    var immediate = options.duration < H.sonification.fadeOutDuration + 20;

    // Stop the instrument after the duration of the note
    instrument.stopCallback = options.onEnd;
    instrument.stopTimeout = setTimeout(
        function () {
            delete instrument.stopTimeout;
            instrument.stop(immediate);
        },
        immediate ? options.duration :
            options.duration - H.sonification.fadeOutDuration
    );

    // Set the volume and panning
    setOrStartTimer(H.pick(options.volume, 1), 'setGain');
    setOrStartTimer(H.pick(options.pan, 0), 'setPan');

    // Play, depending on instrument type
    if (instrument.options.type === 'oscillator') {
        setOrStartTimer(frequency, 'oscillatorPlay');
    }
};


/**
 * Mute an instrument that is playing. If the instrument is not currently
 * playing, this function does nothing.
 */
Instrument.prototype.mute = function () {
    if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(
            this.gainNode.gain.value, H.audioContext.currentTime
        );
        this.gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            H.audioContext.currentTime +
                H.sonification.fadeOutDuration * 0.9 / 1000
        );
    }
};


/**
 * Stop the instrument playing.
 *
 * @param   {boolean} immediately
 *          Whether to do the stop immediately or fade out.
 *
 * @param   {Function} onStopped
 *          Callback function to be called when the stop is completed.
 *
 * @param   {*} callbackData
 *          Data to send to the onEnd callback functions.
 */
Instrument.prototype.stop = function (immediately, onStopped, callbackData) {
    var instr = this,
        reset = function () {
            // The oscillator may have stopped in the meantime here, so allow
            // this function to fail if so.
            try {
                instr.oscillator.stop();
            } catch (e) {}
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
        setTimeout(reset, H.sonification.fadeOutDuration);
    }
};


export default Instrument;
