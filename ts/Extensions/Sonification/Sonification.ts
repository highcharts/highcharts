/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Sonification module for Highcharts
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

import type ChartSonify from './ChartSonify';
import type SeriesSonify from './SeriesSonify';

import D from '../../Core/DefaultOptions.js';
const { defaultOptions } = D;
import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;
import Instrument from './Instrument.js';
import IntrumentDefinitions from './InstrumentDefinitions.js';
import Earcon from './Earcon.js';
import pointSonifyFunctions from './PointSonify.js';
import utilities from './Utilities.js';
import TimelineClasses from './Timeline.js';
import sonificationOptions from './Options.js';


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        sonification?: ChartSonify.SonifyableChart['sonification'];
        sonify?: ChartSonify.SonifyableChart['sonify'];
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        cancelSonify?: Highcharts.SonifyablePoint['cancelSonify'];
        sonify?: Highcharts.SonifyablePoint['sonify'];
    }
}

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface PointSonificationStateObject {
            currentlyPlayingPoint?: SonifyablePoint;
            instrumentsPlaying?: Record<string, Instrument>;
            signalHandler?: SignalHandler;
        }
        interface SonificationObject {
            Earcon: typeof Earcon;
            Instrument: typeof Instrument;
            Timeline: typeof Timeline;
            TimelineEvent: typeof TimelineEvent;
            TimelinePath: typeof TimelinePath;
            fadeOutDuration: number;
            instruments: Record<string, Instrument>;
            utilities: SonificationUtilitiesObject;
        }
        interface SonifyablePoint extends Point {
            cancelSonify: PointSonifyFunctions['pointCancelSonify'];
            series: SeriesSonify.Composition;
            sonification: PointSonificationStateObject;
            sonify: PointSonifyFunctions['pointSonify'];
        }
        let sonification: SonificationObject;
    }
}

// Expose on the Highcharts object

/**
 * Global classes and objects related to sonification.
 *
 * @requires module:modules/sonification
 *
 * @name Highcharts.sonification
 * @type {Highcharts.SonificationObject}
 */

/**
 * Global classes and objects related to sonification.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.SonificationObject
 *//**
 * Note fade-out-time in milliseconds. Most notes are faded out quickly by
 * default if there is time. This is to avoid abrupt stops which will cause
 * perceived clicks.
 * @name Highcharts.SonificationObject#fadeOutDuration
 * @type {number}
 *//**
 * Utility functions.
 * @name Highcharts.SonificationObject#utilities
 * @private
 * @type {object}
 *//**
 * The Instrument class.
 * @name Highcharts.SonificationObject#Instrument
 * @type {Function}
 *//**
 * Predefined instruments, given as an object with a map between the instrument
 * name and the Highcharts.Instrument object.
 * @name Highcharts.SonificationObject#instruments
 * @type {Object}
 *//**
 * The Earcon class.
 * @name Highcharts.SonificationObject#Earcon
 * @type {Function}
 *//**
 * The TimelineEvent class.
 * @private
 * @name Highcharts.SonificationObject#TimelineEvent
 * @type {Function}
 *//**
 * The TimelinePath class.
 * @private
 * @name Highcharts.SonificationObject#TimelinePath
 * @type {Function}
 *//**
 * The Timeline class.
 * @private
 * @name Highcharts.SonificationObject#Timeline
 * @type {Function}
 */

// Add default options
merge(
    true,
    defaultOptions,
    sonificationOptions
);

// Chart specific
Point.prototype.sonify = pointSonifyFunctions.pointSonify;
Point.prototype.cancelSonify = pointSonifyFunctions.pointCancelSonify;

/* *
 *
 *  Default Export
 *
 * */

const Sonification = {
    fadeOutDuration: 20,

    // Classes and functions
    utilities: utilities,
    Instrument: Instrument as any,
    instruments: IntrumentDefinitions,
    Earcon: Earcon as any,
    TimelineEvent: TimelineClasses.TimelineEvent,
    TimelinePath: TimelineClasses.TimelinePath,
    Timeline: TimelineClasses.Timeline
};

export default Sonification;
