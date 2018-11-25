/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Earcons for the sonification module in Highcharts.
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../../parts/Globals.js';

/**
 * @typedef {Object} EarconInstrument
 * @property {Highcharts.Instrument|String} instrument - An instrument instance
 *      or the name of the instrument in the Highcharts.sonification.instruments
 *      map.
 * @property {Object} playOptions - The options to pass to Instrument.play
 */

/**
 * The Earcon class. Earcon objects represent a certain sound consisting of
 * one or more instruments playing a predefined sound.
 *
 * @class Earcon
 *
 * @param   {Object} options
 *          Options for the Earcon instance.
 *
 * @param   {Array<EarconInstrument>} options.instruments
 *          The instruments and their options defining this earcon.
 *
 * @param   {String} [options.id]
 *          The unique ID of the Earcon. Generated if not supplied.
 *
 * @param   {number} [options.pan]
 *          Global panning of all instruments. Overrides all panning on
 *          individual instruments. Can be a number between -1 and 1.
 *
 * @param   {number} [options.volume=1]
 *          Master volume for all instruments. Volume settings on individual
 *          instruments can still be used for relative volume between the
 *          instruments. This setting does not affect volumes set by functions
 *          in individual instruments. Can be a number between 0 and 1.
 *
 * @sample highcharts/sonification/earcon/
 *         Using earcons directly
 */
function Earcon(options) {
    this.init(options || {});
}
Earcon.prototype.init = function (options) {
    this.options = options;
    if (!this.options.id) {
        this.options.id = this.id = H.uniqueKey();
    }
};

/**
 * Play the earcon, optionally overriding init options.
 *
 * @param   {Object} options
 *          Override existing options. Same as for Earcon.init.
 *
 * @sample highcharts/sonification/earcon/
 *         Using earcons directly
 */
Earcon.prototype.play = function (options) {
    this.options = H.merge(this.options, options);

    // Find master volume/pan settings
    var masterVolume = H.pick(this.options.volume, 1),
        masterPan = this.options.pan;

    // Go through the instruments and play them
    this.options.instruments.forEach(function (opts) {
        var instrument = typeof opts.instrument === 'string' ?
                H.sonification.instruments[opts.instrument] : opts.instrument,
            playOpts = H.merge(opts.playOptions);
        if (instrument && instrument.play) {
            if (playOpts) {
                // Handle master pan/volume
                if (typeof opts.playOptions.volume !== 'function') {
                    playOpts.volume = H.pick(masterVolume, 1) *
                        H.pick(opts.playOptions.volume, 1);
                }
                playOpts.pan = H.pick(masterPan, playOpts.pan);

                // Play the instrument. Use a copy so we can play multiple at
                // the same time.
                instrument.copy().play(playOpts);
            }
        } else {
            H.error(30);
        }
    });
};

export default Earcon;
