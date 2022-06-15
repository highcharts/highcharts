/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Earcons for the sonification module in Highcharts.
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
import type InstrumentType from './Instrument';

import Instrument from './Instrument.js';
import U from '../../Core/Utilities.js';
const {
    error,
    merge,
    pick,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

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
class Earcon {


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: Earcon.Options
    ) {
        this.init(options || {});
    }

    /* *
     *
     *  Properties
     *
     * */

    public id: string = void 0 as any;
    public instrumentsPlaying: Record<string, InstrumentType> = void 0 as any;
    public options: Earcon.Options = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public init(
        options: Earcon.Options
    ): void {
        this.options = options;
        if (!this.options.id) {
            this.options.id = this.id = uniqueKey();
        }
        this.instrumentsPlaying = {};
    }

    /**
     * Play the earcon, optionally overriding init options.
     *
     * @sample highcharts/sonification/earcon/
     *         Using earcons directly
     *
     * @function Highcharts.Earcon#sonify
     *
     * @param {Highcharts.EarconOptionsObject} options
     * Override existing options.
     */
    public sonify(
        options: Partial<Earcon.Options>
    ): void {
        const playOptions = merge(this.options, options),
            // Find master volume/pan settings
            masterVolume = pick(playOptions.volume, 1),
            masterPan = playOptions.pan,
            earcon = this,
            playOnEnd = options && options.onEnd,
            masterOnEnd = earcon.options.onEnd;

        // Go through the instruments and play them
        playOptions.instruments.forEach(function (
            opts: Earcon.Instrument
        ): void {
            const instrument = typeof opts.instrument === 'string' ?
                    Instrument.definitions[opts.instrument] : opts.instrument,
                instrumentOpts = merge(opts.playOptions);
            let instrOnEnd: (Function|undefined),
                instrumentCopy,
                copyId = '';

            if (instrument && (instrument.play)) {
                if (opts.playOptions) {
                    instrumentOpts.pan = pick(masterPan, instrumentOpts.pan);

                    // Handle onEnd
                    instrOnEnd = instrumentOpts.onEnd;
                    instrumentOpts.onEnd = function (): void {
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

                    // Play the instrument. Use a copy so we can play multiple
                    // at the same time.
                    instrumentCopy = instrument.copy();
                    instrumentCopy.setMasterVolume(masterVolume);
                    copyId = instrumentCopy.id;
                    earcon.instrumentsPlaying[copyId] = instrumentCopy;
                    instrumentCopy.play(instrumentOpts);
                }
            } else {
                error(30);
            }
        });
    }
    /**
     * Cancel any current sonification of the Earcon. Calls onEnd functions.
     *
     * @function Highcharts.Earcon#cancelSonify
     *
     * @param {boolean} [fadeOut=false]
     *        Whether or not to fade out as we stop. If false, the earcon is
     *        cancelled synchronously.
     */
    public cancelSonify(
        fadeOut?: boolean
    ): void {
        const playing = this.instrumentsPlaying,
            instrIds = playing && Object.keys(playing);

        if (instrIds && instrIds.length) {
            instrIds.forEach(function (instr: string): void {
                playing[instr].stop(!fadeOut, null as any, 'cancelled');
            });
            this.instrumentsPlaying = {};
        }
    }
}

/* *
 *
 *  Class namespace
 *
 * */

namespace Earcon {

    export interface Configuration {
        condition: Function;
        earcon: Earcon;
        onPoint?: string;
    }

    export interface Instrument {
        instrument: (string|InstrumentType);
        playOptions: InstrumentType.PlayOptions;
    }

    export interface Options{
        id?: string;
        instruments: Array<Instrument>;
        onEnd?: Function;
        pan?: number;
        volume?: number;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Earcon;

/* *
 *
 *  API Declarations
 *
 * */

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
 * @type {string|Highcharts.Instrument}
 *//**
 * The options to pass to Instrument.play.
 * @name Highcharts.EarconInstrument#playOptions
 * @type {Highcharts.InstrumentPlayOptionsObject}
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

(''); // detach doclets above
