'use strict';
import H from '../parts/Globals.js';
import '../parts/Series.js';

var each = H.each,
    Series = H.Series,
    addEvent = H.addEvent,
    noop = H.noop;


/* ***************************************************************************
*
* DERIVED SERIES MIXIN
*
**************************************************************************** */

/**
 * Provides methods for auto setting/updating series data based on the based
 * series data.
 *
 * @mixin
 **/
var derivedSeriesMixin = {
  /**
   * Initialise series
   *
   * returns {undefined}
   **/
    init: function () {
        Series.prototype.init.apply(this, arguments);

        this.initialised = false;
        this.baseSeries = null;
        this.eventRemovers = [];

        this.addEvents();
    },

  /**
   * Method to be implemented - inside the method the series has already access
   * to the base series via m `this.baseSeries` and the bases data is
   * initialised. It should return data in the format accepted by
   * `Series.setData()` method
   *
   * @returns {Array} - an array of data
   **/
    setDerivedData: noop,

  /**
   * Sets base series for the series
   *
   * returns {undefined}
   **/
    setBaseSeries: function () {
        var chart = this.chart,
            baseSeriesOptions = this.options.baseSeries,
            baseSeries =
        baseSeriesOptions &&
        (chart.series[baseSeriesOptions] || chart.get(baseSeriesOptions));

        this.baseSeries = baseSeries || null;
    },

  /**
   * Adds events for the series
   *
   * @returns {undefined}
   **/
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
   * Adds events to the base series - it required for recalculating the data in
   * the series if the base series is updated / removed / etc.
   *
   * @returns {undefined}
   **/
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
   * @returns {undefined}
   **/
    destroy: function () {
        each(this.eventRemovers, function (remover) {
            remover();
        });

        Series.prototype.destroy.apply(this, arguments);
    }
};

export default derivedSeriesMixin;
