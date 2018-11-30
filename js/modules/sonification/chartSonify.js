/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Sonification functions for chart/series.
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../../parts/Globals.js';
import utilities from 'utilities.js';


/**
 * Get the relative time value of a point.
 * @private
 *
 * @param   {Highcharts.Point} point The point.
 * @param   {Function|String} timeProp The time axis data prop or the time
 *          function.
 * @return  {number} The time value.
 */
function getPointTimeValue(point, timeProp) {
    return typeof timeProp === 'function' ?
        timeProp(point) :
        H.pick(point[timeProp], point.options[timeProp]);
}


/**
 * Get the time extremes of this series. This is handled outside of the
 * dataExtremes, as we always want to just sonify the visible points, and we
 * always want the extremes to be the extremes of the visible points.
 * @private
 *
 * @param   {Highcharts.Series} series The series to compute on.
 * @param   {Function|String} timeProp The time axis data prop or the time
 *          function.
 * @return  {Object} Object with min/max extremes for the time values.
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
 *
 * @param   {Highcharts.Chart} chart
 *          The chart to calculate extremes from.
 * @param   {Array<PointInstrumentOptions>} instruments
 *          The instrument definitions used.
 * @param   {Object} [dataExtremes]
 *          Predefined extremes for each data prop.
 * @return  {Object}
 *          New extremes with data properties mapped to min/max objects.
 */
function getExtremesForInstrumentProps(chart, instruments, dataExtremes) {
    return instruments.reduce(function (newExtremes, instrumentDefinition) {
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
 *
 * @param {Highcharts.Point} point The point to find earcons for.
 * @param {Array<EarconConfiguration>} earconDefinitions Earcons to check.
 * @return {Array<Earcon>} Array of earcons to be played with this point.
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
 * Create a TimelinePath from a series. Takes the same options as seriesSonify.
 * @private
 *
 * @param {Highcharts.Series} series The series to build from.
 * @param {Object} options The options for building the TimelinePath.
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
                        instruments: options.instruments,
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
            if (event instanceof H.Point && options.onPointStart) {
                options.onPointStart(event);
            }
        },
        onEventEnd: function (eventData) {
            if (eventData.event instanceof H.Point && options.onPointEnd) {
                options.onPointEnd(eventData.event);
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
 * @typedef {Object} EarconConfiguration
 * @property  {Highcharts.Earcon} earcon - An Earcon instance
 * @property  {String} [onPoint] - The ID of the point to play the Earcon on.
 * @property  {Function} [condition] - A function to determine whether or not to
 *            play this earcon on a point. The function is called for every
 *            point, receiving that point as parameter. It should return either
 *            a boolean indicating whether or not to play the earcon, or a new
 *            Earcon instance - in which case the new Earcon will be played.
 */

/**
 * Sonify a series.
 *
 * @function Highcharts.Series#sonify
 *
 * @param   {Object} options
 *          The options for sonifying this series.
 * @param   {number} options.duration
 *          The duration for playing the points. Note that points might continue
 *          to play after the duration has passed, but no new points will start
 *          playing.
 * @param   {String|Function} pointPlayTime
 *          The axis to use for when to play the points. Can be a string with a
 *          data property (e.g. `x`), or a function. If it is a function, this
 *          function receives the point as argument, and should return a numeric
 *          value. The points with the lowest numeric values are then played
 *          first, and the time between points will be proportional to the
 *          distance between the numeric values.
 * @param   {Array<PointInstrumentOptions>} options.instruments
 *          The instrument definitions for the points in this series.
 * @param   {Function} [options.onPointStart]
 *          Callback before a point is played.
 * @param   {Function} [options.onPointEnd]
 *          Callback after a point has finished playing.
 * @param   {Function} [options.onEnd]
 *          Callback after the series has played.
 * @param   {Array<EarconConfiguration>} [earcons]
 *          Earcons to add to the series.
 * @param   {Object} [options.dataExtremes]
 *          Optionally provide the minimum/maximum data values for the points.
 *          If this is not supplied, it is calculated from all points in the
 *          chart on demand. This option is supplied in the following format,
 *          as a map of point data properties to objects with min/max values:
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
 *
 * @param {Highcharts.Series} series The series to return options for.
 * @param {Object} dataExtremes Pre-calculated data extremes for the chart.
 * @param {Object} chartSonifyOptions Options passed in to chart.sonify.
 * @return {Object} Options for buildTimelinePathFromSeries.
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
            onEnd: chartSonifyOptions.onSeriesEnd
        },
        // Merge in the specific series options by ID
        H.isArray(seriesOptions) ? (
            H.find(seriesOptions, function (optEntry) {
                return optEntry.id === series.id;
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
 *
 * @param   {Object} orderOptions
 *          Order options for the sonification.
 * @param   {Highcharts.Chart} chart
 *          The chart we are sonifying.
 * @param   {Function} seriesOptionsCallback
 *          A function that takes a series as argument, and returns the series
 *          options for that series to be used with buildTimelinePathFromSeries.
 * @return  {Array<Object|Array<Object|TimelinePath>>}
 *          If order is sequential, we return an array of objects to create
 *          series paths from. If order is simultaneous we return an array of
 *          an array with the same. If there is a custom order, we return
 *          an array of arrays of either objects (for series) or TimelinePaths
 *          (for earcons and delays).
 */
function buildPathOrder(orderOptions, chart, seriesOptionsCallback) {
    var order;
    if (orderOptions === 'sequential' || orderOptions === 'simultaneous') {
        // Just add the series from the chart
        order = chart.series.map(function (series) {
            return {
                series: series,
                seriesOptions: seriesOptionsCallback(series)
            };
        });
        // If order is simultaneous, group all series together
        if (order === 'simultaneous') {
            order = [order];
        }
    } else {
        // We have a specific order, and potentially custom items - like
        // earcons or silent waits.
        order = orderOptions.map(function (orderDef) {
            // Return set of items to play simultaneously. Could be only one.
            return H.splat(orderDef).map(function (item) {
                // Is this item a series ID?
                if (typeof item === 'string') {
                    var series = chart.get(item);
                    return {
                        series: series,
                        seriesOptions: seriesOptionsCallback(series)
                    };
                }

                // Is it an earcon? If so, just create the path.
                if (item instanceof H.sonification.Earcon) {
                    // Path with a single event
                    return new H.sonification.TimelinePath({
                        events: [new H.sonification.TimelineEvent({
                            eventObject: item
                        })]
                    });
                }

                // Is this item a silent wait? If so, just create the path.
                if (item.silentWait) {
                    return new H.sonification.TimelinePath({
                        silentWait: item.silentWait
                    });
                }
            });
        });
    }
    return order;
}


/**
 * Utility function to add a silent wait after all series.
 * @private
 *
 * @param {Array<*>} order The order of items.
 * @param {number} wait The wait in milliseconds to add.
 * @return {Array<*>} The order with waits inserted.
 */
function addAfterSeriesWaits(order, wait) {
    if (!wait) {
        return order;
    }

    return order.reduce(function (newOrder, orderDef, i) {
        var simultaneousPaths = H.splat(orderDef);
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
 *
 * @param {Array<*>} order The order of TimelinePaths/items.
 * @return {number} The total time in ms spent on wait paths between playing.
 */
function getWaitTime(order) {
    return order.reduce(function (waitTime, orderDef) {
        var def = H.splat(orderDef);
        return waitTime + (
            def.length === 1 && def[0].silentWait || 0
        );
    }, 0);
}


/**
 * Utility function to ensure simultaneous paths have start/end events at the
 * same time, to sync them.
 * @private
 *
 * @param {Array<*>} order The order of TimelinePaths/items. The order array is
 *  modified in place.
 */
function syncSimultaneousPaths(order) {
    order.forEach(function (orderDef) {
        var simultaneousPaths = H.splat(orderDef),
            simulExtremes = simultaneousPaths.reduce(function (acc, item) {
                if (item.series) {
                    acc.min = Math.min(
                        acc.min, item.seriesOptions.timeExtremes.min
                    );
                    acc.max = Math.max(
                        acc.max, item.seriesOptions.timeExtremes.max
                    );
                }
                return acc;
            }, {
                min: Infinity,
                max: -Infinity
            });

        // If we have extremes for these paths, go through them and normalize
        if (isFinite(simulExtremes.max) && isFinite(simulExtremes.min)) {
            simultaneousPaths.forEach(function (item) {
                var start = new H.sonification.TimelineEvent({
                        time: simulExtremes.min
                    }),
                    end = new H.sonification.TimelineEvent({
                        time: simulExtremes.max
                    });
                if (item.series) {
                    // If the item is a series building object, add props only
                    item.startEvent = start;
                    item.endEvent = end;
                    item.durationValueSpan =
                        simulExtremes.max - simulExtremes.min;
                } else {
                    // If we have a timeline, just add the events directly
                    item.addTimelineEvents([start, end]);
                }
            });
        }
    });
}


/**
 * Utility function to find the total duration span for all simul path sets
 * that include series.
 * @private
 *
 * @param {Array<*>} order The order of TimelinePaths/items.
 * @return {number} The total time value span difference for all series.
 */
function getSimulPathDurationTotal(order) {
    return order.reduce(function (acc, cur) {
        var seriesItem = H.find(H.splat(cur), function (item) {
            return item.durationValueSpan;
        });
        return acc + (
            seriesItem ? seriesItem.durationValueSpan : 0
        );
    }, 0);
}


/**
 * Function to calculate the duration in ms for a series.
 * @private
 *
 * @param   {number} seriesValueDuration
 *          The duration of the series in value difference.
 * @param   {number} totalValueDuration
 *          The total duration of all (non simultaneous) series in value
 *          difference.
 * @param   {number} totalDurationMs
 *          The desired total duration for all series in milliseconds.
 * @return  {number} The duration for the series in milliseconds.
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
 *
 * @param {Array<*>} order The order list.
 * @param {number} duration Total duration to aim for in milliseconds.
 * @return {Array<Array<TimelinePath>>} Array of TimelinePath objects to play.
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
        var simultaneousPaths = H.splat(orderDef).reduce(
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
                        var path = buildTimelinePathFromSeries(
                            item.series,
                            item.seriesOptions
                        );

                        // Add start/end times to sync with other paths played
                        // at the same time.
                        path.addTimelineEvents(
                            [item.startEvent, item.endEvent]
                        );

                        // Push the path
                        simulPaths.push(path);
                    }
                    return simulPaths;
                }, []
            );

        // Add in the simultaneous paths
        return allPaths.concat(simultaneousPaths);
    }, []);
}


/**
 * Sonify a chart.
 *
 * @function Highcharts.Chart#sonify
 *
 * @param   {Object} options
 *          The options for sonifying this chart.
 * @param   {number} options.duration
 *          Duration for sonifying the entire chart. The duration is distributed
 *          across the different series intelligently, but does not take earcons
 *          into account. It is also possible to set the duration explicitly per
 *          series, using options.seriesOptions. Note that points may continue
 *          to play after the duration has passed, but no new points will start
 *          playing.
 * @param   {String|Array<*>} order
 *          Define the order to play the series in. This can be given as a
 *          string, or an array specifying a custom ordering. If given as a
 *          string, valid values are `sequential` - where each series is played
 *          in order - or `simultaneous`, where all series are played at once.
 *          For custom ordering, supply an array as the order. Each element in
 *          the array can be either a string with a series ID, an Earcon object,
 *          or an object with a numeric `silentWait` property designating a
 *          number of milliseconds to wait before continuing. Each element of
 *          the array will be played in order. To play elements simultaneously,
 *          group the elements in an array.
 * @param   {String|Function} pointPlayTime
 *          The axis to use for when to play the points. Can be a string with a
 *          data property (e.g. `x`), or a function. If it is a function, this
 *          function receives the point as argument, and should return a numeric
 *          value. The points with the lowest numeric values are then played
 *          first, and the time between points will be proportional to the
 *          distance between the numeric values. This option can not be
 *          overridden per series.
 * @param   {Object|Array<Object>} [options.seriesOptions]
 *          Options as given to `series.sonify` to override options per series.
 *          If the option is supplied as an array of options objects, the `id`
 *          property of the object should correspond to the series' id. If the
 *          option is supplied as a single object, the options apply to all
 *          series.
 * @param   {number} [options.afterSeriesWait]
 *          Milliseconds of silent waiting to add between series. Note that
 *          waiting time is considered part of the sonify duration.
 * @param   {Array<PointInstrumentOptions>} [options.instruments]
 *          The instrument definitions for the points in this chart.
 * @param   {Function} [options.onSeriesStart]
 *          Callback before a series is played.
 * @param   {Function} [options.onSeriesEnd]
 *          Callback after a series has finished playing.
 * @param   {Function} [options.onEnd]
 *          Callback after the chart has played.
 * @param   {Object} [options.dataExtremes]
 *          Optionally provide the minimum/maximum data values for the points.
 *          If this is not supplied, it is calculated from all points in the
 *          chart on demand. This option is supplied in the following format,
 *          as a map of point data properties to objects with min/max values:
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

    // Stretch simultaneous paths to span the same relative time, and add waits
    // after simultaneous paths with series in them.
    syncSimultaneousPaths(order);
    order = addAfterSeriesWaits(order);

    // We now have a list of either TimelinePath objects or series that need to
    // be converted to TimelinePath objects. Convert everything to paths.
    var paths = buildPathsFromOrder(order, options.duration);

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
 * @return {Array<Highcharts.Point>} The points currently under the cursor.
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
 * @param   {Highcharts.Point|Array<Highcharts.Point>} points
 *          The point or points to set the cursor to. If setting multiple points
 *          under the cursor, the points have to be in different series that
 *          are being played simultaneously.
 */
function setCursor(points) {
    var timeline = this.sonification.timeline;
    if (timeline) {
        H.splat(points).forEach(function (point) {
            // We created the events with the ID of the points, which makes
            // this easy. Just call setCursor for each ID.
            timeline.setCursor(point.id);
        });
    }
}


/**
 * Pause the running sonification.
 *
 * @param {boolean} [fadeOut=true] Fade out as we pause to avoid clicks.
 */
function pause(fadeOut) {
    if (this.sonification.timeline) {
        this.sonification.timeline.pause(H.pick(fadeOut, true));
    } else if (this.sonification.currentlyPlayingPoint) {
        this.sonification.currentlyPlayingPoint.cancelSonify(fadeOut);
    }
}


/**
 * Resume the currently running sonification. Requires series.sonify or
 * chart.sonify to have been played at some point earlier.
 *
 * @param {Function} onEnd Callback to call when play finished.
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
 * @param {Function} onEnd Callback to call when play finished.
 */
function rewind(onEnd) {
    if (this.sonification.timeline) {
        this.sonification.timeline.rewind(onEnd);
    }
}


/**
 * Cancel current sonification and reset cursor.
 *
 * @param {boolean} [fadeOut=true] Fade out as we pause to avoid clicks.
 */
function cancel(fadeOut) {
    this.sonification.pause(fadeOut);
    this.sonification.resetCursor();
}


/**
 * Reset cursor to start. Requires series.sonify or chart.sonify to have been
 * played at some point earlier.
 */
function resetCursor() {
    if (this.sonification.timeline) {
        this.sonification.timeline.resetCursor();
    }
}


/**
 * Reset cursor to end. Requires series.sonify or chart.sonify to have been
 * played at some point earlier.
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
