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

import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import O from '../../Core/Options.js';
const { defaultOptions } = O;
import Point from '../../Core/Series/Point.js';
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    merge
} = U;

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        sonification?: Highcharts.SonifyableChart['sonification'];
        sonify?: Highcharts.SonifyableChart['sonify'];
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        cancelSonify?: Highcharts.SonifyablePoint['cancelSonify'];
        sonify?: Highcharts.SonifyablePoint['sonify'];
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        sonify?: Highcharts.SonifyableSeries['sonify'];
    }
}

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface ChartSonificationStateObject {
            currentlyPlayingPoint?: SonifyablePoint;
            timeline?: Timeline;
            duration?: number;
        }
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
import instruments from './InstrumentDefinitions.js';
import Earcon from './Earcon.js';
import pointSonifyFunctions from './PointSonify.js';
import chartSonifyFunctions from './ChartSonify.js';
import utilities from './Utilities.js';
import TimelineClasses from './Timeline.js';
import sonificationOptions from './Options.js';

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

// Add default options
merge(
    true,
    defaultOptions,
    sonificationOptions
);

// Chart specific
Point.prototype.sonify = pointSonifyFunctions.pointSonify;
Point.prototype.cancelSonify = pointSonifyFunctions.pointCancelSonify;
Series.prototype.sonify = chartSonifyFunctions.seriesSonify;
extend(Chart.prototype, {
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
addEvent(Chart, 'init', function (): void {
    this.sonification = {};
});

// Update with chart/series/point updates
addEvent(Chart as any, 'update', function (
    this: Highcharts.SonifyableChart,
    e: { options: Highcharts.Options }
): void {
    const newOptions = e.options.sonification;
    if (newOptions) {
        merge(true, this.options.sonification, newOptions);
    }
});
