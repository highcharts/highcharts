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
            series.chart, options.dataExtremes, options.instruments
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
            options.onStart(series);
        },
        onEventStart: function (event) {
            if (event instanceof H.Point) {
                options.onPointStart(event);
            }
        },
        onEventEnd: function (eventData) {
            if (eventData.event instanceof H.Point) {
                options.onPointStart(eventData.event);
            }
        },
        onEnd: function () {
            options.onEnd(series);
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
        chartSonification = this.chart.sonifiation;

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
 * Sonify a chart.
 */
function chartSonify(options) {
    var chart = this;

    // Only one timeline can play at a time.
    if (this.sonification.timeline) {
        this.sonification.timeline.pause();
    }

    // Calculate data extremes for the props used
    var dataExtremes = getExtremesForInstrumentProps(
        this, options.dataExtremes, options.instruments
    );

    // Utility function to assemble options for creating TimelinePath from a
    // series
    var buildSeriesOptions = function (series) {
        var seriesOptions = options.seriesOptions || {};
        return H.merge(
            {
                // Calculated dataExtremes for chart
                dataExtremes: dataExtremes,
                // We need to get timeExtremes for each series. We pass this
                // in when building the TimelinePath objects to avoid
                // calculating twice.
                timeExtremes: getTimeExtremes(series, options.pointPlayTime),
                // Some options we just pass on
                instruments: options.instruments,
                pointPlayTime: options.pointPlayTime,
                onStart: options.onSeriesStart,
                onEnd: options.onSeriesEnd
            },
            // Merge in the series options
            H.isArray(seriesOptions) ? (
                H.find(seriesOptions, function (optEntry) {
                    return optEntry.id === series.id;
                }) || {}
            ) : seriesOptions
        );
    };

    // Figure out ordering of series
    var order = options.order;
    if (order === 'sequential' || order === 'simultaneous') {
        // Just add the series from the chart
        order = this.series.map(function (series) {
            return {
                series: series,
                seriesOptions: buildSeriesOptions(series)
            };
        });
        if (order === 'simultaneous') {
            order = [order];
        }
    } else {
        // We have a specific order, and potentially custom items - like
        // earcons or silent waits.
        order = order.map(function (orderDef) {
            // Return set of items to play simultaneously. Could be only one.
            return H.splat(orderDef).map(function (item) {
                // Is this item a series ID?
                if (typeof item === 'string') {
                    var series = chart.get(item);
                    return {
                        series: series,
                        seriesOptions: buildSeriesOptions(series)
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

    // Add delays and figure out the total available duration
    var totalAvailableDuration = options.duration,
        newOrder = [],
        totalTimeExtremes = {
            min: Infinity,
            max: -Infinity
        };
    order.forEach(function (orderDef, i) {
        // Add to new order
        newOrder.push(orderDef);

        // Go throuh the paths/series to play at this point
        if (
            orderDef.length === 1 &&
            orderDef[0].options &&
            orderDef[0].options.silentWait
        ) {
            // We have a custom delay, subtract this from available duration
            totalAvailableDuration -= orderDef[0].options.silentWait;
        } else {
            // Not a delay. Find out if there is a series, if there is we might
            // want to add a delay after.
            var hasSeries = false;
            orderDef.forEach(function (item) {
                if (item.series) {
                    hasSeries = true;

                    // Compute total time extremes
                    totalTimeExtremes.min = Math.min(
                        totalTimeExtremes.min,
                        item.seriesOptions.timeExtremes.min
                    );
                    totalTimeExtremes.max = Math.max(
                        totalTimeExtremes.max,
                        item.seriesOptions.timeExtremes.max
                    );
                }
            });

            // If we have a series, and we want an after series delay, add it.
            // Also reduce the total available duration accordingly.
            // Do not add a delay after the final series.
            if (hasSeries && options.afterSeriesDelay && i < order.length - 1) {
                newOrder.push(new H.sonification.TimelinePath({
                    silentWait: options.afterSeriesDelay
                }));
                totalAvailableDuration -= options.afterSeriesDelay;
            }
        }
    });

    // Function to get the duration for a series.
    var getSeriesDuration = function (
        seriesTimeExtremes, overallTimeExtremes, duration
    ) {
        // A series spanning the whole chart would get the full duration.
        return utilities.virtualAxisTranslate(
            seriesTimeExtremes.max - seriesTimeExtremes.min,
            overallTimeExtremes.max - overallTimeExtremes.min,
            { min: 0, max: duration }
        );
    };

    // We now have a list of either TimelinePath objects or series that need to
    // be converted to TimelinePath objects. Go through the ordering and make
    // objects from them. Add delay after each series if applicable.
    var paths = order.reduce(function (allPaths, orderDef) {
        var simultaneousPaths = H.splat(orderDef).reduce(
                function (simulPaths, item) {
                    if (item instanceof H.sonification.TimelinePath) {
                        // This item is already a path object
                        simulPaths.push(item);
                    } else if (item.series) {
                        // We have a series.
                        // We need to set the duration of the series
                        item.seriesOptions.duration = getSeriesDuration(
                            item.seriesOptions.timeExtremes,
                            totalTimeExtremes,
                            totalAvailableDuration // Non-delay time
                        );

                        // Add the path
                        simulPaths.push(
                            buildTimelinePathFromSeries(
                                item.series,
                                item.seriesOptions
                            )
                        );
                    }
                    return simulPaths;
                }, []
            );

        // Add in the simultaneous paths
        return allPaths.concat(simultaneousPaths);
    }, []);


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
    var timeline = this.sonfication.timeline;
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
