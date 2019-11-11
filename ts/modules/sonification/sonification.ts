/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Sonification module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../../parts/Globals.js';
var addEvent = H.addEvent;
import U from '../../parts/Utilities.js';
var extend = U.extend;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            sonification?: SonifyableChart['sonification'];
            sonify?: SonifyableChart['sonify'];
        }
        interface ChartSonificationStateObject {
            currentlyPlayingPoint?: SonifyablePoint;
            timeline?: Timeline;
        }
        interface Point {
            cancelSonify?: SonifyablePoint['cancelSonify'];
            sonify?: SonifyablePoint['sonify'];
        }
        interface PointSonificationStateObject {
            currentlyPlayingPoint?: SonifyablePoint;
            instrumentsPlaying?: Dictionary<Instrument>;
            signalHandler?: SignalHandler;
        }
        interface Series {
            sonify?: SonifyableSeries['sonify'];
        }
        interface SonificationObject {
            Earcon: typeof Earcon;
            Instrument: typeof Instrument;
            Timeline: typeof Timeline;
            TimelineEvent: typeof TimelineEvent;
            TimelinePath: typeof TimelinePath;
            fadeOutDuration: number;
            instruments: Dictionary<Instrument>;
            utilities: SonificationUtilitiesObject;
        }
        interface SonifyableChart extends Chart {
            cancelSonify: SonifyChartFunctionsObject['cancel'];
            getCurrentSonifyPoints: (
                SonifyChartFunctionsObject['getCurrentPoints']
            );
            pauseSonify: SonifyChartFunctionsObject['pause'];
            resetSonifyCursor: SonifyChartFunctionsObject['resetCursor'];
            resetSonifyCursorEnd: SonifyChartFunctionsObject['resetCursorEnd'];
            resumeSonify: SonifyChartFunctionsObject['resume'];
            rewindSonify: SonifyChartFunctionsObject['rewind'];
            series: Array<SonifyableSeries>;
            setSonifyCursor: SonifyChartFunctionsObject['setCursor'];
            sonification: ChartSonificationStateObject;
            sonify: SonifyChartFunctionsObject['chartSonify'];
        }
        interface SonifyablePoint extends Point {
            cancelSonify: PointSonifyFunctions['pointCancelSonify'];
            series: SonifyableSeries;
            sonification: PointSonificationStateObject;
            sonify: PointSonifyFunctions['pointSonify'];
        }
        interface SonifyableSeries extends Series {
            chart: SonifyableChart;
            points: Array<SonifyablePoint>;
            sonify: SonifyChartFunctionsObject['seriesSonify'];
        }
        let sonification: SonificationObject;
    }
}

import Instrument from './Instrument.js';
import instruments from './instrumentDefinitions.js';
import Earcon from './Earcon.js';
import pointSonifyFunctions from './pointSonify.js';
import chartSonifyFunctions from './chartSonify.js';
import utilities from './utilities.js';
import TimelineClasses from './Timeline.js';

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
H.sonification = {
    fadeOutDuration: 20,

    // Classes and functions
    utilities: utilities,
    Instrument: Instrument as any,
    instruments: instruments,
    Earcon: Earcon as any,
    TimelineEvent: TimelineClasses.TimelineEvent,
    TimelinePath: TimelineClasses.TimelinePath,
    Timeline: TimelineClasses.Timeline
};

// Chart specific
H.Point.prototype.sonify = pointSonifyFunctions.pointSonify;
H.Point.prototype.cancelSonify = pointSonifyFunctions.pointCancelSonify;
H.Series.prototype.sonify = chartSonifyFunctions.seriesSonify;
extend(H.Chart.prototype, {
    sonify: chartSonifyFunctions.chartSonify,
    pauseSonify: chartSonifyFunctions.pause,
    resumeSonify: chartSonifyFunctions.resume,
    rewindSonify: chartSonifyFunctions.rewind,
    cancelSonify: chartSonifyFunctions.cancel,
    getCurrentSonifyPoints: chartSonifyFunctions.getCurrentPoints,
    setSonifyCursor: chartSonifyFunctions.setCursor,
    resetSonifyCursor: chartSonifyFunctions.resetCursor,
    resetSonifyCursorEnd: chartSonifyFunctions.resetCursorEnd
});

/* eslint-disable no-invalid-this */

// Prepare charts for sonification on init
addEvent(H.Chart, 'init', function (): void {
    this.sonification = {};
});
