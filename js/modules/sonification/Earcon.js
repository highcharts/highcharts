/* *
 *
 *  (c) 2009-2018 Øystein Moseng
 *
 *  Earcons for the sonification module in Highcharts.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';

/**
 * Define an Instrument and the options for playing it.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.EarconInstrument
 *//**
 * An instrument instance or the name of the instrument in the
 * Highcharts.sonification.instruments map.
 * @name Highcharts.EarconInstrument#instrument
 * @type {Highcharts.Instrument|String}
 *//**
 * The options to pass to Instrument.play.
 * @name Highcharts.EarconInstrument#playOptions
 * @type {object}
 */


/**
 * Options for an Earcon.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.EarconOptionsObject
 *//**
 * The instruments and their options defining this earcon.
 * @name Highcharts.EarconOptionsObject#instruments
 * @type {Array<Highcharts.EarconInstrument>}
 *//**
 * The unique ID of the Earcon. Generated if not supplied.
 * @name Highcharts.EarconOptionsObject#id
 * @type {string|undefined}
 *//**
 * Global panning of all instruments. Overrides all panning on individual
 * instruments. Can be a number between -1 and 1.
 * @name Highcharts.EarconOptionsObject#pan
 * @type {number|undefined}
 *//**
 * Master volume for all instruments. Volume settings on individual instruments
 * can still be used for relative volume between the instruments. This setting
 * does not affect volumes set by functions in individual instruments. Can be a
 * number between 0 and 1. Defaults to 1.
 * @name Highcharts.EarconOptionsObject#volume
 * @type {number|undefined}
 *//**
 * Callback function to call when earcon has finished playing.
 * @name Highcharts.EarconOptionsObject#onEnd
 * @type {Function|undefined}
 */

/**
 * The Earcon class. Earcon objects represent a certain sound consisting of
 * one or more instruments playing a predefined sound.
 *
 * @sample highcharts/sonification/earcon/
 *         Using earcons directly
 *
 * @requires module:modules/sonification
 *
 * @class
 * @name Highcharts.Earcon
 *
 * @param {Highcharts.EarconOptionsObject} options
 *        Options for the Earcon instance.
 */
function Earcon(options) {
    this.init(options || {});
}
Earcon.prototype.init = function (options) {
    this.options = options;
    if (!this.options.id) {
        this.options.id = this.id = H.uniqueKey();
    }
    this.instrumentsPlaying = {};
};


/**
 * Play the earcon, optionally overriding init options.
 *
 * @sample highcharts/sonification/earcon/
 *         Using earcons directly
 *
 * @function Highcharts.Earcon#sonify
 *
 * @param {Highcharts.EarconOptionsObject} options
 *        Override existing options.
 */
Earcon.prototype.sonify = function (options) {
    var playOptions = H.merge(this.options, options);

    // Find master volume/pan settings
    var masterVolume = H.pick(playOptions.volume, 1),
        masterPan = playOptions.pan,
        earcon = this,
        playOnEnd = options && options.onEnd,
        masterOnEnd = earcon.options.onEnd;

    // Go through the instruments and play them
    playOptions.instruments.forEach(function (opts) {
        var instrument = typeof opts.instrument === 'string' ?
                H.sonification.instruments[opts.instrument] : opts.instrument,
            instrumentOpts = H.merge(opts.playOptions),
            instrOnEnd,
            instrumentCopy,
            copyId;
        if (instrument && instrument.play) {
            if (opts.playOptions) {
                // Handle master pan/volume
                if (typeof opts.playOptions.volume !== 'function') {
                    instrumentOpts.volume = H.pick(masterVolume, 1) *
                        H.pick(opts.playOptions.volume, 1);
                }
                instrumentOpts.pan = H.pick(masterPan, instrumentOpts.pan);

                // Handle onEnd
                instrOnEnd = instrumentOpts.onEnd;
                instrumentOpts.onEnd = function () {
                    delete earcon.instrumentsPlaying[copyId];
                    if (instrOnEnd) {
                        instrOnEnd.apply(this, arguments);
                    }
                    if (!Object.keys(earcon.instrumentsPlaying).length) {
                        if (playOnEnd) {
                            playOnEnd.apply(this, arguments);
                        }
                        if (masterOnEnd) {
                            masterOnEnd.apply(this, arguments);
                        }
                    }
                };

                // Play the instrument. Use a copy so we can play multiple at
                // the same time.
                instrumentCopy = instrument.copy();
                copyId = instrumentCopy.id;
                earcon.instrumentsPlaying[copyId] = instrumentCopy;
                instrumentCopy.play(instrumentOpts);
            }
        } else {
            H.error(30);
        }
    });
};


/**
 * Cancel any current sonification of the Earcon. Calls onEnd functions.
 *
 * @function Highcharts.Earcon#cancelSonify
 *
 * @param {boolean} [fadeOut=false]
 *        Whether or not to fade out as we stop. If false, the earcon is
 *        cancelled synchronously.
 */
Earcon.prototype.cancelSonify = function (fadeOut) {
    var playing = this.instrumentsPlaying,
        instrIds = playing && Object.keys(playing);
    if (instrIds && instrIds.length) {
        instrIds.forEach(function (instr) {
            playing[instr].stop(!fadeOut, null, 'cancelled');
        });
        this.instrumentsPlaying = {};
    }
};


export default Earcon;
