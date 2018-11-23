/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Instrument class for sonification module.
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';

var stopOffset = 15, // Time it takes to fade out note
    stopImmediateThreshold = 30; // No fade out if duration is less

// Default options for Instrument constructor
var defaultOptions = {
    type: 'oscillator',
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
 * @param   {Object} [options.oscillator]
 *          Options specific to oscillator instruments.
 *
 * @param   {String} [options.oscillator.waveformShape='sine']
 *          The waveform shape to use for oscillator instruments.
 *
 * @sample highcharts/sonification/instrument/
 *         Using Instruments directly
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
 * Set gain level.
 * @private
 *
 * @param   {number} gainValue
 *          The gain level to set for the instrument.
 */
Instrument.prototype.setGain = function (gainValue) {
    if (this.gainNode) {
        this.gainNode.gain.value = gainValue;
    }
};


/**
 * Play oscillator instrument.
 * @private
 *
 * @param   {Object} options
 *          Play options, same as Instrument.play.
 */
Instrument.prototype.oscillatorPlay = function (options) {
    if (!this.oscillatorStarted) {
        this.oscillator.start();
        this.oscillatorStarted = true;
    }

    this.oscillator.frequency.linearRampToValueAtTime(
        options.frequency, H.audioContext.currentTime + 0.002
    );
};


/**
 * Play the instrument according to options.
 *
 * @param   {Object} options
 *          Options for the playback of the instrument.
 *
 * @param   {Function} options.onEnd
 *          Callback function to be called when the play is completed.
 *
 * @param   {number} options.frequency
 *          The frequency of the note to play.
 *
 * @param   {number} options.duration
 *          The duration of the note in milliseconds.
 *
 * @param   {number} [options.volume=1]
 *          The volume of the instrument.
 *
 * @param   {number} [options.pan=0]
 *          The panning of the instrument.
 *
 * @sample highcharts/sonification/instrument/
 *         Using Instruments directly
 */
Instrument.prototype.play = function (options) {
    var instrument = this;
    if (!instrument.id) {
        // No audio support - do nothing
        return;
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

    // Stop the instrument after the duration of the note
    var immediate = options.duration < stopImmediateThreshold;
    instrument.stopTimeout = setTimeout(function () {
        delete instrument.stopTimeout;
        instrument.stop(immediate, function () {
            // After stop, call the stop callback for the play we finished
            if (instrument.stopCallback) {
                instrument.stopCallback();
            }
        });
    }, immediate ? options.duration : options.duration - stopOffset);
    instrument.stopCallback = options.onEnd;

    // Set the volume and panning
    instrument.setGain(H.pick(options.volume, 1));
    instrument.setPan(H.pick(options.pan, 0));

    // Play, depending on instrument type
    if (instrument.options.type === 'oscillator') {
        instrument.oscillatorPlay(options);
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
            0.0001, H.audioContext.currentTime + 0.008
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
 */
Instrument.prototype.stop = function (immediately, onStopped) {
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
            // Done stopping, call the callback
            if (onStopped) {
                onStopped();
            }
        };
    if (immediately) {
        instr.setGain(0);
        reset();
    } else {
        instr.mute();
        // Stop the oscillator after the mute fade-out has finished
        setTimeout(reset, 10);
    }
};


export default Instrument;
