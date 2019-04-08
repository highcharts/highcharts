'use strict';

import H from '../parts/Globals.js';
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
var derivedSeriesMixin = {

    hasDerivedData: true,
    /**
     * Initialise series
     *
     * @private
     * @function derivedSeriesMixin.init
     */
    init: function () {
        Series.prototype.init.apply(this, arguments);

        this.initialised = false;
        this.baseSeries = null;
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
     *
     * @return {Array<*>}
     *         An array of data
     */
    setDerivedData: noop,

    /**
     * Sets base series for the series
     *
     * @private
     * @function derivedSeriesMixin.setBaseSeries
     */
    setBaseSeries: function () {
        var chart = this.chart,
            baseSeriesOptions = this.options.baseSeries,
            baseSeries = (
                H.defined(baseSeriesOptions) &&
                (
                    chart.series[baseSeriesOptions] ||
                    chart.get(baseSeriesOptions)
                )
            );

        this.baseSeries = baseSeries || null;
    },

    /**
     * Adds events for the series
     *
     * @private
     * @function derivedSeriesMixin.addEvents
     */
    addEvents: function () {
        var derivedSeries = this,
            chartSeriesLinked;

        chartSeriesLinked = addEvent(
            this.chart,
            'afterLinkSeries',
            function () {
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
     */
    addBaseSeriesEvents: function () {
        var derivedSeries = this,
            updatedDataRemover,
            destroyRemover;

        updatedDataRemover = addEvent(
            derivedSeries.baseSeries,
            'updatedData',
            function () {
                derivedSeries.setDerivedData();
            }
        );

        destroyRemover = addEvent(
            derivedSeries.baseSeries,
            'destroy',
            function () {
                derivedSeries.baseSeries = null;
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
    destroy: function () {
        this.eventRemovers.forEach(function (remover) {
            remover();
        });

        Series.prototype.destroy.apply(this, arguments);
    }
};

export default derivedSeriesMixin;
