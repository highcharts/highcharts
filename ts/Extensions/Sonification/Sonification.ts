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
import type SignalHandler from './SignalHandler';

import D from '../../Core/DefaultOptions.js';
const { defaultOptions } = D;
import Point from '../../Core/Series/Point.js';
import PointSonify from './PointSonify.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;
import Instrument from './Instrument.js';
import Earcon from './Earcon.js';
import SU from './SonificationUtilities.js';
import Timeline from './Timeline.js';
import TimelineEvent from './TimelineEvent.js';
import TimelinePath from './TimelinePath.js';
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
        cancelSonify?: Sonification.SonifyablePoint['cancelSonify'];
        sonify?: Sonification.SonifyablePoint['sonify'];
    }
}

/* *
 *
 *  Functions
 *
 * */

// Expose on the Highcharts object

// Add default options
merge(
    true,
    defaultOptions,
    sonificationOptions
);

/* *
 *
 *  Default Export
 *
 * */

const Sonification = {
    fadeOutDuration: 20,

    // Classes and functions
    utilities: SU,
    Instrument: Instrument as any,
    instruments: Instrument.definitions,
    Earcon: Earcon as any,
    TimelineEvent: TimelineEvent,
    TimelinePath: TimelinePath,
    Timeline: Timeline
};

/* *
 *
 *  Namespace
 *
 * */

namespace Sonification {
    export interface PointSonificationStateObject {
        currentlyPlayingPoint?: SonifyablePoint;
        instrumentsPlaying?: Record<string, Instrument>;
        signalHandler?: SignalHandler;
    }
    export interface SonifyablePoint extends Point {
        cancelSonify: PointSonify.Composition['pointCancelSonify'];
        series: SeriesSonify.Composition;
        sonification: PointSonificationStateObject;
        sonify: PointSonify.Composition['pointSonify'];
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Sonification;

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
(''); // detach doclets above
