/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DerivedSeriesMixin {
            hasDerivedData: boolean;
            addBaseSeriesEvents(): void;
            addEvents(): void;
            destroy(): void;
            init(this: Series): void;
            setBaseSeries(): void;
            setDerivedData(): Array<PointOptionsType>;
        }
        interface DerivedSeriesOptions extends SeriesOptions {
            baseSeries?: (number|string);
        }
        interface Series {
            baseSeries?: Series;
            eventRemovers?: Array<Function>;
            hasDerivedData?: DerivedSeriesMixin['hasDerivedData'];
            initialised?: boolean;
        }
        class DerivedSeries extends Series implements DerivedSeriesMixin {
            public addBaseSeriesEvents: DerivedSeriesMixin[
                'addBaseSeriesEvents'
            ];
            public addEvents: DerivedSeriesMixin['addEvents'];
            public baseSeries?: Series;
            public destroy: DerivedSeriesMixin['destroy'];
            public eventRemovers: Array<Function>;
            public hasDerivedData: boolean;
            public init: DerivedSeriesMixin['init'];
            public initialised: boolean;
            public options: DerivedSeriesOptions;
            public setBaseSeries: DerivedSeriesMixin['setBaseSeries'];
            public setDerivedData: DerivedSeriesMixin['setDerivedData'];
        }
    }
}

import U from '../parts/Utilities.js';
var defined = U.defined;

import '../parts/Series.js';

var Series = H.Series,
    addEvent = H.addEvent,
    noop = H.noop;


/* ************************************************************************** *
 *
 * DERIVED SERIES MIXIN
 *
 * ************************************************************************** */

/**
 * Provides methods for auto setting/updating series data based on the based
 * series data.
 *
 * @private
 * @mixin derivedSeriesMixin
 */
var derivedSeriesMixin: Highcharts.DerivedSeriesMixin = {

    hasDerivedData: true,

    /* eslint-disable valid-jsdoc */

    /**
     * Initialise series
     *
     * @private
     * @function derivedSeriesMixin.init
     * @return {void}
     */
    init: function (this: Highcharts.DerivedSeries): void {
        Series.prototype.init.apply(this, arguments as any);

        this.initialised = false;
        this.baseSeries = null as any;
        this.eventRemovers = [];

        this.addEvents();
    },

    /**
     * Method to be implemented - inside the method the series has already
     * access to the base series via m `this.baseSeries` and the bases data is
     * initialised. It should return data in the format accepted by
     * `Series.setData()` method
     *
     * @private
     * @function derivedSeriesMixin.setDerivedData
     * @return {Array<Highcharts.PointOptionsType>}
     *         An array of data
     */
    setDerivedData: noop as any,

    /**
     * Sets base series for the series
     *
     * @private
     * @function derivedSeriesMixin.setBaseSeries
     * @return {void}
     */
    setBaseSeries: function (this: Highcharts.DerivedSeries): void {
        var chart = this.chart,
            baseSeriesOptions = this.options.baseSeries,
            baseSeries = (
                defined(baseSeriesOptions) &&
                (
                    chart.series[baseSeriesOptions as any] ||
                    chart.get(baseSeriesOptions as any)
                )
            );

        this.baseSeries = baseSeries || null as any;
    },

    /**
     * Adds events for the series
     *
     * @private
     * @function derivedSeriesMixin.addEvents
     * @return {void}
     */
    addEvents: function (this: Highcharts.DerivedSeries): void {
        var derivedSeries = this,
            chartSeriesLinked;

        chartSeriesLinked = addEvent(
            this.chart,
            'afterLinkSeries',
            function (): void {
                derivedSeries.setBaseSeries();

                if (derivedSeries.baseSeries && !derivedSeries.initialised) {
                    derivedSeries.setDerivedData();
                    derivedSeries.addBaseSeriesEvents();
                    derivedSeries.initialised = true;
                }
            }
        );

        this.eventRemovers.push(
            chartSeriesLinked
        );
    },

    /**
     * Adds events to the base series - it required for recalculating the data
     * in the series if the base series is updated / removed / etc.
     *
     * @private
     * @function derivedSeriesMixin.addBaseSeriesEvents
     * @return {void}
     */
    addBaseSeriesEvents: function (this: Highcharts.DerivedSeries): void {
        var derivedSeries = this,
            updatedDataRemover,
            destroyRemover;

        updatedDataRemover = addEvent(
            derivedSeries.baseSeries,
            'updatedData',
            function (): void {
                derivedSeries.setDerivedData();
            }
        );

        destroyRemover = addEvent(
            derivedSeries.baseSeries,
            'destroy',
            function (): void {
                derivedSeries.baseSeries = null as any;
                derivedSeries.initialised = false;
            }
        );

        derivedSeries.eventRemovers.push(
            updatedDataRemover,
            destroyRemover
        );
    },

    /**
     * Destroys the series
     *
     * @private
     * @function derivedSeriesMixin.destroy
     */
    destroy: function (this: Highcharts.DerivedSeries): void {
        this.eventRemovers.forEach(function (remover: Function): void {
            remover();
        });

        Series.prototype.destroy.apply(this, arguments as any);
    }

    /* eslint-disable valid-jsdoc */

};

export default derivedSeriesMixin;
