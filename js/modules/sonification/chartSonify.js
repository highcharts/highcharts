/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Sonification functions for chart/series.
 *
 *  License: www.highcharts.com/license
 *
 * */


/**
 * An Earcon configuration, specifying an Earcon and when to play it.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.EarconConfiguration
 *//**
 * An Earcon instance.
 * @name Highcharts.EarconConfiguration#earcon
 * @type {Highcharts.Earcon}
 *//**
 * The ID of the point to play the Earcon on.
 * @name Highcharts.EarconConfiguration#onPoint
 * @type {string|undefined}
 *//**
 * A function to determine whether or not to play this earcon on a point. The
 * function is called for every point, receiving that point as parameter. It
 * should return either a boolean indicating whether or not to play the earcon,
 * or a new Earcon instance - in which case the new Earcon will be played.
 * @name Highcharts.EarconConfiguration#condition
 * @type {Function|undefined}
 */

/**
 * Options for sonifying a series.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.SonifySeriesOptionsObject
 *//**
 * The duration for playing the points. Note that points might continue to play
 * after the duration has passed, but no new points will start playing.
 * @name Highcharts.SonifySeriesOptionsObject#duration
 * @type {number}
 *//**
 * The axis to use for when to play the points. Can be a string with a data
 * property (e.g. `x`), or a function. If it is a function, this function
 * receives the point as argument, and should return a numeric value. The points
 * with the lowest numeric values are then played first, and the time between
 * points will be proportional to the distance between the numeric values.
 * @name Highcharts.SonifySeriesOptionsObject#pointPlayTime
 * @type {string|Function}
 *//**
 * The instrument definitions for the points in this series.
 * @name Highcharts.SonifySeriesOptionsObject#instruments
 * @type {Array<Highcharts.PointInstrumentObject>}
 *//**
 * Earcons to add to the series.
 * @name Highcharts.SonifySeriesOptionsObject#earcons
 * @type {Array<Highcharts.EarconConfiguration>|undefined}
 *//**
 * Optionally provide the minimum/maximum data values for the points. If this is
 * not supplied, it is calculated from all points in the chart on demand. This
 * option is supplied in the following format, as a map of point data properties
 * to objects with min/max values:
 * ```js
 *     dataExtremes: {
 *         y: {
 *             min: 0,
 *             max: 100
 *         },
 *         z: {
 *             min: -10,
 *             max: 10
 *         }
 *         // Properties used and not provided are calculated on demand
 *     }
 * ```
 * @name Highcharts.SonifySeriesOptionsObject#dataExtremes
 * @type {object|undefined}
 *//**
 * Callback before a point is played.
 * @name Highcharts.SonifySeriesOptionsObject#onPointStart
 * @type {Function|undefined}
 *//**
 * Callback after a point has finished playing.
 * @name Highcharts.SonifySeriesOptionsObject#onPointEnd
 * @type {Function|undefined}
 *//**
 * Callback after the series has played.
 * @name Highcharts.SonifySeriesOptionsObject#onEnd
 * @type {Function|undefined}
 */

'use strict';

import H from '../../parts/Globals.js';

import U from '../../parts/Utilities.js';
var isArray = U.isArray,
    pick = U.pick,
    splat = U.splat;

import utilities from './utilities.js';


/**
 * Get the relative time value of a point.
 * @private
 * @param {Highcharts.Point} point - The point.
 * @param {Function|string} timeProp - The time axis data prop or the time
 * function.
 * @return {number} The time value.
 */
function getPointTimeValue(point, timeProp) {
    return typeof timeProp === 'function' ?
        timeProp(point) :
        pick(point[timeProp], point.options[timeProp]);
}


/**
 * Get the time extremes of this series. This is handled outside of the
 * dataExtremes, as we always want to just sonify the visible points, and we
 * always want the extremes to be the extremes of the visible points.
 * @private
 * @param {Highcharts.Series} series - The series to compute on.
 * @param {Function|string} timeProp - The time axis data prop or the time
 * function.
 * @return {object} Object with min/max extremes for the time values.
 */
function getTimeExtremes(series, timeProp) {
    // Compute the extremes from the visible points.
    return series.points.reduce(function (acc, point) {
        var value = getPointTimeValue(point, timeProp);

        acc.min = Math.min(acc.min, value);
        acc.max = Math.max(acc.max, value);
        return acc;
    }, {
        min: Infinity,
        max: -Infinity
    });
}


/**
 * Calculate value extremes for used instrument data properties.
 * @private
 * @param {Highcharts.Chart} chart - The chart to calculate extremes from.
 * @param {Array<Highcharts.PointInstrumentObject>} instruments - The instrument
 * definitions used.
 * @param {object} [dataExtremes] - Predefined extremes for each data prop.
 * @return {object} New extremes with data properties mapped to min/max objects.
 */
function getExtremesForInstrumentProps(chart, instruments, dataExtremes) {
    return (
        instruments || []
    ).reduce(function (newExtremes, instrumentDefinition) {
        Object.keys(instrumentDefinition.instrumentMapping || {}).forEach(
            function (instrumentParameter) {
                var value = instrumentDefinition.instrumentMapping[
                    instrumentParameter
                ];

                if (typeof value === 'string' && !newExtremes[value]) {
                    // This instrument parameter is mapped to a data prop.
                    // If we don't have predefined data extremes, find them.
                    newExtremes[value] = utilities.calculateDataExtremes(
                        chart, value
                    );
                }
            }
        );
        return newExtremes;
    }, H.merge(dataExtremes));
}


/**
 * Get earcons for the point if there are any.
 * @private
 * @param {Highcharts.Point} point - The point to find earcons for.
 * @param {Array<Highcharts.EarconConfiguration>} earconDefinitions - Earcons to
 * check.
 * @return {Array<Highcharts.Earcon>} Array of earcons to be played with this
 * point.
 */
function getPointEarcons(point, earconDefinitions) {
    return earconDefinitions.reduce(
        function (earcons, earconDefinition) {
            var cond,
                earcon = earconDefinition.earcon;

            if (earconDefinition.condition) {
                // We have a condition. This overrides onPoint
                cond = earconDefinition.condition(point);
                if (cond instanceof H.sonification.Earcon) {
                    // Condition returned an earcon
                    earcons.push(cond);
                } else if (cond) {
                    // Condition returned true
                    earcons.push(earcon);
                }
            } else if (
                earconDefinition.onPoint &&
                point.id === earconDefinition.onPoint
            ) {
                // We have earcon onPoint
                earcons.push(earcon);
            }
            return earcons;
        }, []
    );
}


/**
 * Utility function to get a new list of instrument options where all the
 * instrument references are copies.
 * @private
 * @param {Array<Highcharts.PointInstrumentObject>} instruments - The instrument
 * options.
 * @return {Array<Highcharts.PointInstrumentObject>} Array of copied instrument
 * options.
 */
function makeInstrumentCopies(instruments) {
    return instruments.map(function (instrumentDef) {
        var instrument = instrumentDef.instrument,
            copy = (typeof instrument === 'string' ?
                H.sonification.instruments[instrument] :
                instrument).copy();

        return H.merge(instrumentDef, { instrument: copy });
    });
}


/**
 * Create a TimelinePath from a series. Takes the same options as seriesSonify.
 * To intuitively allow multiple series to play simultaneously we make copies of
 * the instruments for each series.
 * @private
 * @param {Highcharts.Series} series - The series to build from.
 * @param {object} options - The options for building the TimelinePath.
 * @return {Highcharts.TimelinePath} A timeline path with events.
 */
function buildTimelinePathFromSeries(series, options) {
    // options.timeExtremes is internal and used so that the calculations from
    // chart.sonify can be reused.
    var timeExtremes = options.timeExtremes || getTimeExtremes(
            series, options.pointPlayTime, options.dataExtremes
        ),
        // Get time offset for a point, relative to duration
        pointToTime = function (point) {
            return utilities.virtualAxisTranslate(
                getPointTimeValue(point, options.pointPlayTime),
                timeExtremes,
                { min: 0, max: options.duration }
            );
        },
        // Compute any data extremes that aren't defined yet
        dataExtremes = getExtremesForInstrumentProps(
            series.chart, options.instruments, options.dataExtremes
        ),
        // Make copies of the instruments used for this series, to allow
        // multiple series with the same instrument to play together
        instruments = makeInstrumentCopies(options.instruments),
        // Go through the points, convert to events, optionally add Earcons
        timelineEvents = series.points.reduce(function (events, point) {
            var earcons = getPointEarcons(point, options.earcons || []),
                time = pointToTime(point);

            return events.concat(
                // Event object for point
                new H.sonification.TimelineEvent({
                    eventObject: point,
                    time: time,
                    id: point.id,
                    playOptions: {
                        instruments: instruments,
                        dataExtremes: dataExtremes
                    }
                }),
                // Earcons
                earcons.map(function (earcon) {
                    return new H.sonification.TimelineEvent({
                        eventObject: earcon,
                        time: time
                    });
                })
            );
        }, []);

    // Build the timeline path
    return new H.sonification.TimelinePath({
        events: timelineEvents,
        onStart: function () {
            if (options.onStart) {
                options.onStart(series);
            }
        },
        onEventStart: function (event) {
            var eventObject = event.options && event.options.eventObject;

            if (eventObject instanceof H.Point) {
                // Check for hidden series
                if (
                    !eventObject.series.visible &&
                    !eventObject.series.chart.series.some(function (series) {
                        return series.visible;
                    })
                ) {
                    // We have no visible series, stop the path.
                    event.timelinePath.timeline.pause();
                    event.timelinePath.timeline.resetCursor();
                    return false;
                }
                // Emit onPointStart
                if (options.onPointStart) {
                    options.onPointStart(event, eventObject);
                }
            }
        },
        onEventEnd: function (eventData) {
            var eventObject = eventData.event && eventData.event.options &&
                    eventData.event.options.eventObject;

            if (eventObject instanceof H.Point && options.onPointEnd) {
                options.onPointEnd(eventData.event, eventObject);
            }
        },
        onEnd: function () {
            if (options.onEnd) {
                options.onEnd(series);
            }
        }
    });
}

/**
 * Sonify a series.
 *
 * @sample highcharts/sonification/series-basic/
 *         Click on series to sonify
 * @sample highcharts/sonification/series-earcon/
 *         Series with earcon
 * @sample highcharts/sonification/point-play-time/
 *         Play y-axis by time
 * @sample highcharts/sonification/earcon-on-point/
 *         Earcon set on point
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Series#sonify
 *
 * @param {Highcharts.SonifySeriesOptionsObject} options
 *        The options for sonifying this series.
 */
function seriesSonify(options) {
    var timelinePath = buildTimelinePathFromSeries(this, options),
        chartSonification = this.chart.sonification;

    // Only one timeline can play at a time. If we want multiple series playing
    // at the same time, use chart.sonify.
    if (chartSonification.timeline) {
        chartSonification.timeline.pause();
    }

    // Create new timeline for this series, and play it.
    chartSonification.timeline = new H.sonification.Timeline({
        paths: [timelinePath]
    });

    chartSonification.timeline.play();
}


/**
 * Utility function to assemble options for creating a TimelinePath from a
 * series when sonifying an entire chart.
 * @private
 * @param {Highcharts.Series} series - The series to return options for.
 * @param {object} dataExtremes - Pre-calculated data extremes for the chart.
 * @param {object} chartSonifyOptions - Options passed in to chart.sonify.
 * @return {object} Options for buildTimelinePathFromSeries.
 */
function buildSeriesOptions(series, dataExtremes, chartSonifyOptions) {
    var seriesOptions = chartSonifyOptions.seriesOptions || {};

    return H.merge(
        {
            // Calculated dataExtremes for chart
            dataExtremes: dataExtremes,
            // We need to get timeExtremes for each series. We pass this
            // in when building the TimelinePath objects to avoid
            // calculating twice.
            timeExtremes: getTimeExtremes(
                series, chartSonifyOptions.pointPlayTime
            ),
            // Some options we just pass on
            instruments: chartSonifyOptions.instruments,
            onStart: chartSonifyOptions.onSeriesStart,
            onEnd: chartSonifyOptions.onSeriesEnd,
            earcons: chartSonifyOptions.earcons
        },
        // Merge in the specific series options by ID
        isArray(seriesOptions) ? (
            H.find(seriesOptions, function (optEntry) {
                return optEntry.id === pick(series.id, series.options.id);
            }) || {}
        ) : seriesOptions,
        {
            // Forced options
            pointPlayTime: chartSonifyOptions.pointPlayTime
        }
    );
}


/**
 * Utility function to normalize the ordering of timeline paths when sonifying
 * a chart.
 * @private
 * @param {string|Array<string|Highcharts.Earcon|Array<string|Highcharts.Earcon>>} orderOptions -
 * Order options for the sonification.
 * @param {Highcharts.Chart} chart - The chart we are sonifying.
 * @param {Function} seriesOptionsCallback - A function that takes a series as
 * argument, and returns the series options for that series to be used with
 * buildTimelinePathFromSeries.
 * @return {Array<object|Array<object|Highcharts.TimelinePath>>} If order is
 * sequential, we return an array of objects to create series paths from. If
 * order is simultaneous we return an array of an array with the same. If there
 * is a custom order, we return an array of arrays of either objects (for
 * series) or TimelinePaths (for earcons and delays).
 */
function buildPathOrder(orderOptions, chart, seriesOptionsCallback) {
    var order;

    if (orderOptions === 'sequential' || orderOptions === 'simultaneous') {
        // Just add the series from the chart
        order = chart.series.reduce(function (seriesList, series) {
            if (series.visible) {
                seriesList.push({
                    series: series,
                    seriesOptions: seriesOptionsCallback(series)
                });
            }
            return seriesList;
        }, []);

        // If order is simultaneous, group all series together
        if (orderOptions === 'simultaneous') {
            order = [order];
        }
    } else {
        // We have a specific order, and potentially custom items - like
        // earcons or silent waits.
        order = orderOptions.reduce(function (orderList, orderDef) {
            // Return set of items to play simultaneously. Could be only one.
            var simulItems = splat(orderDef).reduce(function (items, item) {
                var itemObject;

                // Is this item a series ID?
                if (typeof item === 'string') {
                    var series = chart.get(item);

                    if (series.visible) {
                        itemObject = {
                            series: series,
                            seriesOptions: seriesOptionsCallback(series)
                        };
                    }

                // Is it an earcon? If so, just create the path.
                } else if (item instanceof H.sonification.Earcon) {
                    // Path with a single event
                    itemObject = new H.sonification.TimelinePath({
                        events: [new H.sonification.TimelineEvent({
                            eventObject: item
                        })]
                    });

                }

                // Is this item a silent wait? If so, just create the path.
                if (item.silentWait) {
                    itemObject = new H.sonification.TimelinePath({
                        silentWait: item.silentWait
                    });
                }

                // Add to items to play simultaneously
                if (itemObject) {
                    items.push(itemObject);
                }
                return items;
            }, []);

            // Add to order list
            if (simulItems.length) {
                orderList.push(simulItems);
            }
            return orderList;
        }, []);
    }
    return order;
}


/**
 * Utility function to add a silent wait after all series.
 * @private
 * @param {Array<object|Array<object|TimelinePath>>} order - The order of items.
 * @param {number} wait - The wait in milliseconds to add.
 * @return {Array<object|Array<object|TimelinePath>>} The order with waits inserted.
 */
function addAfterSeriesWaits(order, wait) {
    if (!wait) {
        return order;
    }

    return order.reduce(function (newOrder, orderDef, i) {
        var simultaneousPaths = splat(orderDef);

        newOrder.push(simultaneousPaths);

        // Go through the simultaneous paths and see if there is a series there
        if (
            i < order.length - 1 && // Do not add wait after last series
            simultaneousPaths.some(function (item) {
                return item.series;
            })
        ) {
            // We have a series, meaning we should add a wait after these
            // paths have finished.
            newOrder.push(new H.sonification.TimelinePath({
                silentWait: wait
            }));
        }

        return newOrder;
    }, []);
}


/**
 * Utility function to find the total amout of wait time in the TimelinePaths.
 * @private
 * @param {Array<object|Array<object|TimelinePath>>} order - The order of
 * TimelinePaths/items.
 * @return {number} The total time in ms spent on wait paths between playing.
 */
function getWaitTime(order) {
    return order.reduce(function (waitTime, orderDef) {
        var def = splat(orderDef);

        return waitTime + (
            def.length === 1 && def[0].options && def[0].options.silentWait || 0
        );
    }, 0);
}


/**
 * Utility function to ensure simultaneous paths have start/end events at the
 * same time, to sync them.
 * @private
 * @param {Array<Highcharts.TimelinePath>} paths - The paths to sync.
 */
function syncSimultaneousPaths(paths) {
    // Find the extremes for these paths
    var extremes = paths.reduce(function (extremes, path) {
        var events = path.events;

        if (events && events.length) {
            extremes.min = Math.min(events[0].time, extremes.min);
            extremes.max = Math.max(
                events[events.length - 1].time, extremes.max
            );
        }
        return extremes;
    }, {
        min: Infinity,
        max: -Infinity
    });

    // Go through the paths and add events to make them fit the same timespan
    paths.forEach(function (path) {
        var events = path.events,
            hasEvents = events && events.length,
            eventsToAdd = [];

        if (!(hasEvents && events[0].time <= extremes.min)) {
            eventsToAdd.push(new H.sonification.TimelineEvent({
                time: extremes.min
            }));
        }
        if (!(hasEvents && events[events.length - 1].time >= extremes.max)) {
            eventsToAdd.push(new H.sonification.TimelineEvent({
                time: extremes.max
            }));
        }
        if (eventsToAdd.length) {
            path.addTimelineEvents(eventsToAdd);
        }
    });
}


/**
 * Utility function to find the total duration span for all simul path sets
 * that include series.
 * @private
 * @param {Array<object|Array<object|Highcharts.TimelinePath>>} order - The
 * order of TimelinePaths/items.
 * @return {number} The total time value span difference for all series.
 */
function getSimulPathDurationTotal(order) {
    return order.reduce(function (durationTotal, orderDef) {
        return durationTotal + splat(orderDef).reduce(
            function (maxPathDuration, item) {
                var timeExtremes = item.series && item.seriesOptions &&
                        item.seriesOptions.timeExtremes;

                return timeExtremes ?
                    Math.max(
                        maxPathDuration, timeExtremes.max - timeExtremes.min
                    ) : maxPathDuration;
            },
            0
        );
    }, 0);
}


/**
 * Function to calculate the duration in ms for a series.
 * @private
 * @param {number} seriesValueDuration - The duration of the series in value
 * difference.
 * @param {number} totalValueDuration - The total duration of all (non
 * simultaneous) series in value difference.
 * @param {number} totalDurationMs - The desired total duration for all series
 * in milliseconds.
 * @return {number} The duration for the series in milliseconds.
 */
function getSeriesDurationMs(
    seriesValueDuration, totalValueDuration, totalDurationMs
) {
    // A series spanning the whole chart would get the full duration.
    return utilities.virtualAxisTranslate(
        seriesValueDuration,
        { min: 0, max: totalValueDuration },
        { min: 0, max: totalDurationMs }
    );
}


/**
 * Convert series building objects into paths and return a new list of
 * TimelinePaths.
 * @private
 * @param {Array<object|Array<object|Highcharts.TimelinePath>>} order - The
 * order list.
 * @param {number} duration - Total duration to aim for in milliseconds.
 * @return {Array<Array<Highcharts.TimelinePath>>} Array of TimelinePath objects
 * to play.
 */
function buildPathsFromOrder(order, duration) {
    // Find time used for waits (custom or after series), and subtract it from
    // available duration.
    var totalAvailableDurationMs = Math.max(
            duration - getWaitTime(order), 0
        ),
        // Add up simultaneous path durations to find total value span duration
        // of everything
        totalUsedDuration = getSimulPathDurationTotal(order);

    // Go through the order list and convert the items
    return order.reduce(function (allPaths, orderDef) {
        var simultaneousPaths = splat(orderDef).reduce(
            function (simulPaths, item) {
                if (item instanceof H.sonification.TimelinePath) {
                    // This item is already a path object
                    simulPaths.push(item);
                } else if (item.series) {
                    // We have a series.
                    // We need to set the duration of the series
                    item.seriesOptions.duration =
                        item.seriesOptions.duration || getSeriesDurationMs(
                            item.seriesOptions.timeExtremes.max -
                            item.seriesOptions.timeExtremes.min,
                            totalUsedDuration,
                            totalAvailableDurationMs
                        );

                    // Add the path
                    simulPaths.push(buildTimelinePathFromSeries(
                        item.series,
                        item.seriesOptions
                    ));
                }
                return simulPaths;
            }, []
        );

        // Add in the simultaneous paths
        allPaths.push(simultaneousPaths);
        return allPaths;
    }, []);
}


/**
 * Options for sonifying a chart.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.SonifyChartOptionsObject
 *//**
 * Duration for sonifying the entire chart. The duration is distributed across
 * the different series intelligently, but does not take earcons into account.
 * It is also possible to set the duration explicitly per series, using
 * `seriesOptions`. Note that points may continue to play after the duration has
 * passed, but no new points will start playing.
 * @name Highcharts.SonifyChartOptionsObject#duration
 * @type {number}
 *//**
 * Define the order to play the series in. This can be given as a string, or an
 * array specifying a custom ordering. If given as a string, valid values are
 * `sequential` - where each series is played in order - or `simultaneous`,
 * where all series are played at once. For custom ordering, supply an array as
 * the order. Each element in the array can be either a string with a series ID,
 * an Earcon object, or an object with a numeric `silentWait` property
 * designating a number of milliseconds to wait before continuing. Each element
 * of the array will be played in order. To play elements simultaneously, group
 * the elements in an array.
 * @name Highcharts.SonifyChartOptionsObject#order
 * @type {string|Array<string|Highcharts.Earcon|Array<string|Highcharts.Earcon>>}
 *//**
 * The axis to use for when to play the points. Can be a string with a data
 * property (e.g. `x`), or a function. If it is a function, this function
 * receives the point as argument, and should return a numeric value. The points
 * with the lowest numeric values are then played first, and the time between
 * points will be proportional to the distance between the numeric values. This
 * option can not be overridden per series.
 * @name Highcharts.SonifyChartOptionsObject#pointPlayTime
 * @type {string|Function}
 *//**
 * Milliseconds of silent waiting to add between series. Note that waiting time
 * is considered part of the sonify duration.
 * @name Highcharts.SonifyChartOptionsObject#afterSeriesWait
 * @type {number|undefined}
 *//**
 * Options as given to `series.sonify` to override options per series. If the
 * option is supplied as an array of options objects, the `id` property of the
 * object should correspond to the series' id. If the option is supplied as a
 * single object, the options apply to all series.
 * @name Highcharts.SonifyChartOptionsObject#seriesOptions
 * @type {Object|Array<object>|undefined}
 *//**
 * The instrument definitions for the points in this chart.
 * @name Highcharts.SonifyChartOptionsObject#instruments
 * @type {Array<Highcharts.PointInstrumentObject>|undefined}
 *//**
 * Earcons to add to the chart. Note that earcons can also be added per series
 * using `seriesOptions`.
 * @name Highcharts.SonifyChartOptionsObject#earcons
 * @type {Array<Highcharts.EarconConfiguration>|undefined}
 *//**
 * Optionally provide the minimum/maximum data values for the points. If this is
 * not supplied, it is calculated from all points in the chart on demand. This
 * option is supplied in the following format, as a map of point data properties
 * to objects with min/max values:
 *  ```js
 *      dataExtremes: {
 *          y: {
 *              min: 0,
 *              max: 100
 *          },
 *          z: {
 *              min: -10,
 *              max: 10
 *          }
 *          // Properties used and not provided are calculated on demand
 *      }
 *  ```
 * @name Highcharts.SonifyChartOptionsObject#dataExtremes
 * @type {object|undefined}
 *//**
 * Callback before a series is played.
 * @name Highcharts.SonifyChartOptionsObject#onSeriesStart
 * @type {Function|undefined}
 *//**
 * Callback after a series has finished playing.
 * @name Highcharts.SonifyChartOptionsObject#onSeriesEnd
 * @type {Function|undefined}
 *//**
 * Callback after the chart has played.
 * @name Highcharts.SonifyChartOptionsObject#onEnd
 * @type {Function|undefined}
 */


/**
 * Sonify a chart.
 *
 * @sample highcharts/sonification/chart-sequential/
 *         Sonify a basic chart
 * @sample highcharts/sonification/chart-simultaneous/
 *         Sonify series simultaneously
 * @sample highcharts/sonification/chart-custom-order/
 *         Custom defined order of series
 * @sample highcharts/sonification/chart-earcon/
 *         Earcons on chart
 * @sample highcharts/sonification/chart-events/
 *         Sonification events on chart
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#sonify
 *
 * @param {Highcharts.SonifyChartOptionsObject} options
 *        The options for sonifying this chart.
 */
function chartSonify(options) {
    // Only one timeline can play at a time.
    if (this.sonification.timeline) {
        this.sonification.timeline.pause();
    }

    // Calculate data extremes for the props used
    var dataExtremes = getExtremesForInstrumentProps(
        this, options.instruments, options.dataExtremes
    );

    // Figure out ordering of series and custom paths
    var order = buildPathOrder(options.order, this, function (series) {
        return buildSeriesOptions(series, dataExtremes, options);
    });

    // Add waits after simultaneous paths with series in them.
    order = addAfterSeriesWaits(order, options.afterSeriesWait || 0);

    // We now have a list of either TimelinePath objects or series that need to
    // be converted to TimelinePath objects. Convert everything to paths.
    var paths = buildPathsFromOrder(order, options.duration);

    // Sync simultaneous paths
    paths.forEach(function (simultaneousPaths) {
        syncSimultaneousPaths(simultaneousPaths);
    });

    // We have a set of paths. Create the timeline, and play it.
    this.sonification.timeline = new H.sonification.Timeline({
        paths: paths,
        onEnd: options.onEnd
    });
    this.sonification.timeline.play();
}


/**
 * Get a list of the points currently under cursor.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#getCurrentSonifyPoints
 *
 * @return {Array<Highcharts.Point>}
 *         The points currently under the cursor.
 */
function getCurrentPoints() {
    var cursorObj;

    if (this.sonification.timeline) {
        cursorObj = this.sonification.timeline.getCursor(); // Cursor per pathID
        return Object.keys(cursorObj).map(function (path) {
            // Get the event objects under cursor for each path
            return cursorObj[path].eventObject;
        }).filter(function (eventObj) {
            // Return the events that are points
            return eventObj instanceof H.Point;
        });
    }
    return [];
}


/**
 * Set the cursor to a point or set of points in different series.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#setSonifyCursor
 *
 * @param {Highcharts.Point|Array<Highcharts.Point>} points
 *        The point or points to set the cursor to. If setting multiple points
 *        under the cursor, the points have to be in different series that are
 *        being played simultaneously.
 */
function setCursor(points) {
    var timeline = this.sonification.timeline;

    if (timeline) {
        splat(points).forEach(function (point) {
            // We created the events with the ID of the points, which makes
            // this easy. Just call setCursor for each ID.
            timeline.setCursor(point.id);
        });
    }
}


/**
 * Pause the running sonification.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#pauseSonify
 *
 * @param {boolean} [fadeOut=true]
 *        Fade out as we pause to avoid clicks.
 */
function pause(fadeOut) {
    if (this.sonification.timeline) {
        this.sonification.timeline.pause(pick(fadeOut, true));
    } else if (this.sonification.currentlyPlayingPoint) {
        this.sonification.currentlyPlayingPoint.cancelSonify(fadeOut);
    }
}


/**
 * Resume the currently running sonification. Requires series.sonify or
 * chart.sonify to have been played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#resumeSonify
 *
 * @param {Function} onEnd
 *        Callback to call when play finished.
 */
function resume(onEnd) {
    if (this.sonification.timeline) {
        this.sonification.timeline.play(onEnd);
    }
}


/**
 * Play backwards from cursor. Requires series.sonify or chart.sonify to have
 * been played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#rewindSonify
 *
 * @param {Function} onEnd
 *        Callback to call when play finished.
 */
function rewind(onEnd) {
    if (this.sonification.timeline) {
        this.sonification.timeline.rewind(onEnd);
    }
}


/**
 * Cancel current sonification and reset cursor.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#cancelSonify
 *
 * @param {boolean} [fadeOut=true]
 *        Fade out as we pause to avoid clicks.
 */
function cancel(fadeOut) {
    this.pauseSonify(fadeOut);
    this.resetSonifyCursor();
}


/**
 * Reset cursor to start. Requires series.sonify or chart.sonify to have been
 * played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#resetSonifyCursor
 */
function resetCursor() {
    if (this.sonification.timeline) {
        this.sonification.timeline.resetCursor();
    }
}


/**
 * Reset cursor to end. Requires series.sonify or chart.sonify to have been
 * played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#resetSonifyCursorEnd
 */
function resetCursorEnd() {
    if (this.sonification.timeline) {
        this.sonification.timeline.resetCursorEnd();
    }
}


// Export functions
var chartSonifyFunctions = {
    chartSonify: chartSonify,
    seriesSonify: seriesSonify,
    pause: pause,
    resume: resume,
    rewind: rewind,
    cancel: cancel,
    getCurrentPoints: getCurrentPoints,
    setCursor: setCursor,
    resetCursor: resetCursor,
    resetCursorEnd: resetCursorEnd
};

export default chartSonifyFunctions;
