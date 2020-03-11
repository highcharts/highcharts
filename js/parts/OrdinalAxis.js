/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import './Axis.js';
import U from './Utilities.js';
var addEvent = U.addEvent, css = U.css, defined = U.defined, extend = U.extend, pick = U.pick, timeUnits = U.timeUnits;
import './Chart.js';
import './Series.js';
// Has a dependency on Navigator due to the use of Axis.toFixedRange
import './Navigator.js';
var Axis = H.Axis, Chart = H.Chart, noop = H.noop, Series = H.Series;
/* eslint-disable no-invalid-this, valid-jsdoc */
/* ************************************************************************** *
 * Start ordinal axis logic                                                   *
 * ************************************************************************** */
addEvent(Series, 'updatedData', function () {
    var xAxis = this.xAxis;
    // Destroy the extended ordinal index on updated data
    if (xAxis && xAxis.options.ordinal) {
        delete xAxis.ordinalIndex;
    }
});
/**
 * In an ordinal axis, there might be areas with dense consentrations of points,
 * then large gaps between some. Creating equally distributed ticks over this
 * entire range may lead to a huge number of ticks that will later be removed.
 * So instead, break the positions up in segments, find the tick positions for
 * each segment then concatenize them. This method is used from both data
 * grouping logic and X axis tick position logic.
 * @private
 */
Axis.prototype.getTimeTicks = function (normalizedInterval, min, max, startOfWeek, positions, closestDistance, findHigherRanks) {
    var start = 0, end, segmentPositions, higherRanks = {}, hasCrossedHigherRank, info, posLength, outsideMax, groupPositions = [], lastGroupPosition = -Number.MAX_VALUE, tickPixelIntervalOption = this.options.tickPixelInterval, time = this.chart.time, 
    // Record all the start positions of a segment, to use when deciding
    // what's a gap in the data.
    segmentStarts = [];
    // The positions are not always defined, for example for ordinal positions
    // when data has regular interval (#1557, #2090)
    if ((!this.options.ordinal && !this.options.breaks) ||
        !positions ||
        positions.length < 3 ||
        typeof min === 'undefined') {
        return time.getTimeTicks.apply(time, arguments);
    }
    // Analyze the positions array to split it into segments on gaps larger than
    // 5 times the closest distance. The closest distance is already found at
    // this point, so we reuse that instead of computing it again.
    posLength = positions.length;
    for (end = 0; end < posLength; end++) {
        outsideMax = end && positions[end - 1] > max;
        if (positions[end] < min) { // Set the last position before min
            start = end;
        }
        if (end === posLength - 1 ||
            positions[end + 1] - positions[end] > closestDistance * 5 ||
            outsideMax) {
            // For each segment, calculate the tick positions from the
            // getTimeTicks utility function. The interval will be the same
            // regardless of how long the segment is.
            if (positions[end] > lastGroupPosition) { // #1475
                segmentPositions = time.getTimeTicks(normalizedInterval, positions[start], positions[end], startOfWeek);
                // Prevent duplicate groups, for example for multiple segments
                // within one larger time frame (#1475)
                while (segmentPositions.length &&
                    segmentPositions[0] <= lastGroupPosition) {
                    segmentPositions.shift();
                }
                if (segmentPositions.length) {
                    lastGroupPosition =
                        segmentPositions[segmentPositions.length - 1];
                }
                segmentStarts.push(groupPositions.length);
                groupPositions = groupPositions.concat(segmentPositions);
            }
            // Set start of next segment
            start = end + 1;
        }
        if (outsideMax) {
            break;
        }
    }
    // Get the grouping info from the last of the segments. The info is the same
    // for all segments.
    info = segmentPositions.info;
    // Optionally identify ticks with higher rank, for example when the ticks
    // have crossed midnight.
    if (findHigherRanks && info.unitRange <= timeUnits.hour) {
        end = groupPositions.length - 1;
        // Compare points two by two
        for (start = 1; start < end; start++) {
            if (time.dateFormat('%d', groupPositions[start]) !==
                time.dateFormat('%d', groupPositions[start - 1])) {
                higherRanks[groupPositions[start]] = 'day';
                hasCrossedHigherRank = true;
            }
        }
        // If the complete array has crossed midnight, we want to mark the first
        // positions also as higher rank
        if (hasCrossedHigherRank) {
            higherRanks[groupPositions[0]] = 'day';
        }
        info.higherRanks = higherRanks;
    }
    // Save the info
    info.segmentStarts = segmentStarts;
    groupPositions.info = info;
    // Don't show ticks within a gap in the ordinal axis, where the space
    // between two points is greater than a portion of the tick pixel interval
    if (findHigherRanks && defined(tickPixelIntervalOption)) {
        var length = groupPositions.length, i = length, itemToRemove, translated, translatedArr = [], lastTranslated, medianDistance, distance, distances = [];
        // Find median pixel distance in order to keep a reasonably even
        // distance between ticks (#748)
        while (i--) {
            translated = this.translate(groupPositions[i]);
            if (lastTranslated) {
                distances[i] = lastTranslated - translated;
            }
            translatedArr[i] = lastTranslated = translated;
        }
        distances.sort();
        medianDistance = distances[Math.floor(distances.length / 2)];
        if (medianDistance < tickPixelIntervalOption * 0.6) {
            medianDistance = null;
        }
        // Now loop over again and remove ticks where needed
        i = groupPositions[length - 1] > max ? length - 1 : length; // #817
        lastTranslated = void 0;
        while (i--) {
            translated = translatedArr[i];
            distance = Math.abs(lastTranslated - translated);
            // #4175 - when axis is reversed, the distance, is negative but
            // tickPixelIntervalOption positive, so we need to compare the same
            // values
            // Remove ticks that are closer than 0.6 times the pixel interval
            // from the one to the right, but not if it is close to the median
            // distance (#748).
            if (lastTranslated &&
                distance < tickPixelIntervalOption * 0.8 &&
                (medianDistance === null || distance < medianDistance * 0.8)) {
                // Is this a higher ranked position with a normal position to
                // the right?
                if (higherRanks[groupPositions[i]] &&
                    !higherRanks[groupPositions[i + 1]]) {
                    // Yes: remove the lower ranked neighbour to the right
                    itemToRemove = i + 1;
                    lastTranslated = translated; // #709
                }
                else {
                    // No: remove this one
                    itemToRemove = i;
                }
                groupPositions.splice(itemToRemove, 1);
            }
            else {
                lastTranslated = translated;
            }
        }
    }
    return groupPositions;
};
// Extend the Axis prototype
extend(Axis.prototype, /** @lends Axis.prototype */ {
    /**
     * Calculate the ordinal positions before tick positions are calculated.
     *
     * @private
     * @function Highcharts.Axis#beforeSetTickPositions
     * @return {void}
     */
    beforeSetTickPositions: function () {
        var axis = this, len, ordinalPositions = [], uniqueOrdinalPositions, useOrdinal = false, dist, extremes = axis.getExtremes(), min = extremes.min, max = extremes.max, minIndex, maxIndex, slope, hasBreaks = axis.isXAxis && !!axis.options.breaks, isOrdinal = axis.options.ordinal, overscrollPointsRange = Number.MAX_VALUE, ignoreHiddenSeries = axis.chart.options.chart.ignoreHiddenSeries, i, hasBoostedSeries;
        // Apply the ordinal logic
        if (isOrdinal || hasBreaks) { // #4167 YAxis is never ordinal ?
            axis.series.forEach(function (series, i) {
                uniqueOrdinalPositions = [];
                if ((!ignoreHiddenSeries || series.visible !== false) &&
                    (series.takeOrdinalPosition !== false || hasBreaks)) {
                    // concatenate the processed X data into the existing
                    // positions, or the empty array
                    ordinalPositions = ordinalPositions.concat(series.processedXData);
                    len = ordinalPositions.length;
                    // remove duplicates (#1588)
                    ordinalPositions.sort(function (a, b) {
                        // without a custom function it is sorted as strings
                        return a - b;
                    });
                    overscrollPointsRange = Math.min(overscrollPointsRange, pick(
                    // Check for a single-point series:
                    series.closestPointRange, overscrollPointsRange));
                    if (len) {
                        i = 0;
                        while (i < len - 1) {
                            if (ordinalPositions[i] !== ordinalPositions[i + 1]) {
                                uniqueOrdinalPositions.push(ordinalPositions[i + 1]);
                            }
                            i++;
                        }
                        // Check first item:
                        if (uniqueOrdinalPositions[0] !== ordinalPositions[0]) {
                            uniqueOrdinalPositions.unshift(ordinalPositions[0]);
                        }
                        ordinalPositions = uniqueOrdinalPositions;
                    }
                }
                if (series.isSeriesBoosting) {
                    hasBoostedSeries = true;
                }
            });
            if (hasBoostedSeries) {
                ordinalPositions.length = 0;
            }
            // cache the length
            len = ordinalPositions.length;
            // Check if we really need the overhead of mapping axis data against
            // the ordinal positions. If the series consist of evenly spaced
            // data any way, we don't need any ordinal logic.
            if (len > 2) { // two points have equal distance by default
                dist = ordinalPositions[1] - ordinalPositions[0];
                i = len - 1;
                while (i-- && !useOrdinal) {
                    if (ordinalPositions[i + 1] - ordinalPositions[i] !== dist) {
                        useOrdinal = true;
                    }
                }
                // When zooming in on a week, prevent axis padding for weekends
                // even though the data within the week is evenly spaced.
                if (!axis.options.keepOrdinalPadding &&
                    (ordinalPositions[0] - min > dist ||
                        max - ordinalPositions[ordinalPositions.length - 1] >
                            dist)) {
                    useOrdinal = true;
                }
            }
            else if (axis.options.overscroll) {
                if (len === 2) {
                    // Exactly two points, distance for overscroll is fixed:
                    overscrollPointsRange =
                        ordinalPositions[1] - ordinalPositions[0];
                }
                else if (len === 1) {
                    // We have just one point, closest distance is unknown.
                    // Assume then it is last point and overscrolled range:
                    overscrollPointsRange = axis.options.overscroll;
                    ordinalPositions = [
                        ordinalPositions[0],
                        ordinalPositions[0] + overscrollPointsRange
                    ];
                }
                else {
                    // In case of zooming in on overscrolled range, stick to the
                    // old range:
                    overscrollPointsRange = axis.overscrollPointsRange;
                }
            }
            // Record the slope and offset to compute the linear values from the
            // array index. Since the ordinal positions may exceed the current
            // range, get the start and end positions within it (#719, #665b)
            if (useOrdinal) {
                if (axis.options.overscroll) {
                    axis.overscrollPointsRange = overscrollPointsRange;
                    ordinalPositions = ordinalPositions.concat(axis.getOverscrollPositions());
                }
                // Register
                axis.ordinalPositions = ordinalPositions;
                // This relies on the ordinalPositions being set. Use Math.max
                // and Math.min to prevent padding on either sides of the data.
                minIndex = axis.ordinal2lin(// #5979
                Math.max(min, ordinalPositions[0]), true);
                maxIndex = Math.max(axis.ordinal2lin(Math.min(max, ordinalPositions[ordinalPositions.length - 1]), true), 1); // #3339
                // Set the slope and offset of the values compared to the
                // indices in the ordinal positions
                axis.ordinalSlope = slope = (max - min) / (maxIndex - minIndex);
                axis.ordinalOffset = min - (minIndex * slope);
            }
            else {
                axis.overscrollPointsRange = pick(axis.closestPointRange, axis.overscrollPointsRange);
                axis.ordinalPositions = axis.ordinalSlope = axis.ordinalOffset =
                    void 0;
            }
        }
        axis.isOrdinal = isOrdinal && useOrdinal; // #3818, #4196, #4926
        axis.groupIntervalFactor = null; // reset for next run
    },
    /**
     * Translate from a linear axis value to the corresponding ordinal axis
     * position. If there are no gaps in the ordinal axis this will be the same.
     * The translated value is the value that the point would have if the axis
     * were linear, using the same min and max.
     *
     * @private
     * @function Highcharts.Axis#val2lin
     *
     * @param {number} val
     *        The axis value.
     *
     * @param {boolean} [toIndex]
     *        Whether to return the index in the ordinalPositions or the new
     *        value.
     *
     * @return {number}
     */
    val2lin: function (val, toIndex) {
        var axis = this, ordinalPositions = axis.ordinalPositions, ret;
        if (!ordinalPositions) {
            ret = val;
        }
        else {
            var ordinalLength = ordinalPositions.length, i, distance, ordinalIndex;
            // first look for an exact match in the ordinalpositions array
            i = ordinalLength;
            while (i--) {
                if (ordinalPositions[i] === val) {
                    ordinalIndex = i;
                    break;
                }
            }
            // if that failed, find the intermediate position between the two
            // nearest values
            i = ordinalLength - 1;
            while (i--) {
                if (val > ordinalPositions[i] || i === 0) { // interpolate
                    // something between 0 and 1
                    distance = (val - ordinalPositions[i]) /
                        (ordinalPositions[i + 1] - ordinalPositions[i]);
                    ordinalIndex = i + distance;
                    break;
                }
            }
            ret = toIndex ?
                ordinalIndex :
                axis.ordinalSlope *
                    (ordinalIndex || 0) +
                    axis.ordinalOffset;
        }
        return ret;
    },
    /**
     * Translate from linear (internal) to axis value.
     *
     * @private
     * @function Highcharts.Axis#lin2val
     *
     * @param {number} val
     *        The linear abstracted value.
     *
     * @param {boolean} [fromIndex]
     *        Translate from an index in the ordinal positions rather than a
     *        value.
     *
     * @return {number}
     */
    lin2val: function (val, fromIndex) {
        var axis = this, ordinalPositions = axis.ordinalPositions, ret;
        // the visible range contains only equally spaced values
        if (!ordinalPositions) {
            ret = val;
        }
        else {
            var ordinalSlope = axis.ordinalSlope, ordinalOffset = axis.ordinalOffset, i = ordinalPositions.length - 1, linearEquivalentLeft, linearEquivalentRight, distance;
            // Handle the case where we translate from the index directly, used
            // only when panning an ordinal axis
            if (fromIndex) {
                if (val < 0) { // out of range, in effect panning to the left
                    val = ordinalPositions[0];
                }
                else if (val > i) { // out of range, panning to the right
                    val = ordinalPositions[i];
                }
                else { // split it up
                    i = Math.floor(val);
                    distance = val - i; // the decimal
                }
                // Loop down along the ordinal positions. When the linear equivalent
                // of i matches an ordinal position, interpolate between the left
                // and right values.
            }
            else {
                while (i--) {
                    linearEquivalentLeft =
                        (ordinalSlope * i) + ordinalOffset;
                    if (val >= linearEquivalentLeft) {
                        linearEquivalentRight =
                            (ordinalSlope *
                                (i + 1)) +
                                ordinalOffset;
                        // something between 0 and 1
                        distance = (val - linearEquivalentLeft) /
                            (linearEquivalentRight - linearEquivalentLeft);
                        break;
                    }
                }
            }
            // If the index is within the range of the ordinal positions, return
            // the associated or interpolated value. If not, just return the
            // value
            return (typeof distance !== 'undefined' &&
                typeof ordinalPositions[i] !== 'undefined' ?
                ordinalPositions[i] + (distance ?
                    distance *
                        (ordinalPositions[i + 1] - ordinalPositions[i]) :
                    0) :
                val);
        }
        return ret;
    },
    /**
     * Get the ordinal positions for the entire data set. This is necessary in
     * chart panning because we need to find out what points or data groups are
     * available outside the visible range. When a panning operation starts, if
     * an index for the given grouping does not exists, it is created and
     * cached. This index is deleted on updated data, so it will be regenerated
     * the next time a panning operation starts.
     *
     * @private
     * @function Highcharts.Axis#getExtendedPositions
     *
     * @return {Array<number>}
     */
    getExtendedPositions: function () {
        var axis = this, chart = axis.chart, grouping = axis.series[0].currentDataGrouping, ordinalIndex = axis.ordinalIndex, key = grouping ?
            grouping.count + grouping.unitName :
            'raw', overscroll = axis.options.overscroll, extremes = axis.getExtremes(), fakeAxis, fakeSeries;
        // If this is the first time, or the ordinal index is deleted by
        // updatedData,
        // create it.
        if (!ordinalIndex) {
            ordinalIndex = axis.ordinalIndex = {};
        }
        if (!ordinalIndex[key]) {
            // Create a fake axis object where the extended ordinal positions
            // are emulated
            fakeAxis = {
                series: [],
                chart: chart,
                getExtremes: function () {
                    return {
                        min: extremes.dataMin,
                        max: extremes.dataMax + overscroll
                    };
                },
                options: {
                    ordinal: true
                },
                val2lin: Axis.prototype.val2lin,
                ordinal2lin: Axis.prototype.ordinal2lin // #6276
            };
            // Add the fake series to hold the full data, then apply processData
            // to it
            axis.series.forEach(function (series) {
                fakeSeries = {
                    xAxis: fakeAxis,
                    xData: series.xData.slice(),
                    chart: chart,
                    destroyGroupedData: noop
                };
                fakeSeries.xData = fakeSeries.xData.concat(axis.getOverscrollPositions());
                fakeSeries.options = {
                    dataGrouping: grouping ? {
                        enabled: true,
                        forced: true,
                        // doesn't matter which, use the fastest
                        approximation: 'open',
                        units: [[
                                grouping.unitName,
                                [grouping.count]
                            ]]
                    } : {
                        enabled: false
                    }
                };
                series.processData.apply(fakeSeries);
                fakeAxis.series.push(fakeSeries);
            });
            // Run beforeSetTickPositions to compute the ordinalPositions
            axis.beforeSetTickPositions.apply(fakeAxis);
            // Cache it
            ordinalIndex[key] = fakeAxis.ordinalPositions;
        }
        return ordinalIndex[key];
    },
    /**
     * Get ticks for an ordinal axis within a range where points don't exist.
     * It is required when overscroll is enabled. We can't base on points,
     * because we may not have any, so we use approximated pointRange and
     * generate these ticks between Axis.dataMax, Axis.dataMax + Axis.overscroll
     * evenly spaced. Used in panning and navigator scrolling.
     *
     * @private
     * @function Highcharts.Axis#getOverscrollPositions
     *
     * @returns {Array<number>}
     *          Generated ticks
     */
    getOverscrollPositions: function () {
        var axis = this, extraRange = axis.options.overscroll, distance = axis.overscrollPointsRange, positions = [], max = axis.dataMax;
        if (defined(distance)) {
            // Max + pointRange because we need to scroll to the last
            positions.push(max);
            while (max <= axis.dataMax + extraRange) {
                max += distance;
                positions.push(max);
            }
        }
        return positions;
    },
    /**
     * Find the factor to estimate how wide the plot area would have been if
     * ordinal gaps were included. This value is used to compute an imagined
     * plot width in order to establish the data grouping interval.
     *
     * A real world case is the intraday-candlestick example. Without this
     * logic, it would show the correct data grouping when viewing a range
     * within each day, but once moving the range to include the gap between two
     * days, the interval would include the cut-away night hours and the data
     * grouping would be wrong. So the below method tries to compensate by
     * identifying the most common point interval, in this case days.
     *
     * An opposite case is presented in issue #718. We have a long array of
     * daily data, then one point is appended one hour after the last point. We
     * expect the data grouping not to change.
     *
     * In the future, if we find cases where this estimation doesn't work
     * optimally, we might need to add a second pass to the data grouping logic,
     * where we do another run with a greater interval if the number of data
     * groups is more than a certain fraction of the desired group count.
     *
     * @private
     * @function Highcharts.Axis#getGroupIntervalFactor
     *
     * @param {number} xMin
     *
     * @param {number} xMax
     *
     * @param {Highcharts.Series} series
     *
     * @return {number}
     */
    getGroupIntervalFactor: function (xMin, xMax, series) {
        var i, processedXData = series.processedXData, len = processedXData.length, distances = [], median, groupIntervalFactor = this.groupIntervalFactor;
        // Only do this computation for the first series, let the other inherit
        // it (#2416)
        if (!groupIntervalFactor) {
            // Register all the distances in an array
            for (i = 0; i < len - 1; i++) {
                distances[i] =
                    processedXData[i + 1] - processedXData[i];
            }
            // Sort them and find the median
            distances.sort(function (a, b) {
                return a - b;
            });
            median = distances[Math.floor(len / 2)];
            // Compensate for series that don't extend through the entire axis
            // extent. #1675.
            xMin = Math.max(xMin, processedXData[0]);
            xMax = Math.min(xMax, processedXData[len - 1]);
            this.groupIntervalFactor = groupIntervalFactor =
                (len * median) / (xMax - xMin);
        }
        // Return the factor needed for data grouping
        return groupIntervalFactor;
    },
    /**
     * Make the tick intervals closer because the ordinal gaps make the ticks
     * spread out or cluster.
     *
     * @private
     * @function Highcharts.Axis#postProcessTickInterval
     *
     * @param {number} tickInterval
     *
     * @return {number}
     */
    postProcessTickInterval: function (tickInterval) {
        // Problem: https://jsfiddle.net/highcharts/FQm4E/1/
        // This is a case where this algorithm doesn't work optimally. In this
        // case, the tick labels are spread out per week, but all the gaps
        // reside within weeks. So we have a situation where the labels are
        // courser than the ordinal gaps, and thus the tick interval should not
        // be altered
        var ordinalSlope = this.ordinalSlope, ret;
        if (ordinalSlope) {
            if (!this.options.breaks) {
                ret = tickInterval / (ordinalSlope / this.closestPointRange);
            }
            else {
                ret = this.closestPointRange || tickInterval; // #7275
            }
        }
        else {
            ret = tickInterval;
        }
        return ret;
    }
});
// Record this to prevent overwriting by broken-axis module (#5979)
Axis.prototype.ordinal2lin = Axis.prototype.val2lin;
// Extending the Chart.pan method for ordinal axes
addEvent(Chart, 'pan', function (e) {
    var chart = this, xAxis = chart.xAxis[0], overscroll = xAxis.options.overscroll, chartX = e.originalEvent.chartX, panning = chart.options.chart &&
        chart.options.chart.panning, runBase = false;
    if (panning &&
        panning.type !== 'y' &&
        xAxis.options.ordinal &&
        xAxis.series.length) {
        var mouseDownX = chart.mouseDownX, extremes = xAxis.getExtremes(), dataMax = extremes.dataMax, min = extremes.min, max = extremes.max, trimmedRange, hoverPoints = chart.hoverPoints, closestPointRange = xAxis.closestPointRange || xAxis.overscrollPointsRange, pointPixelWidth = (xAxis.translationSlope *
            (xAxis.ordinalSlope || closestPointRange)), 
        // how many ordinal units did we move?
        movedUnits = (mouseDownX - chartX) / pointPixelWidth, 
        // get index of all the chart's points
        extendedAxis = { ordinalPositions: xAxis.getExtendedPositions() }, ordinalPositions, searchAxisLeft, lin2val = xAxis.lin2val, val2lin = xAxis.val2lin, searchAxisRight;
        // we have an ordinal axis, but the data is equally spaced
        if (!extendedAxis.ordinalPositions) {
            runBase = true;
        }
        else if (Math.abs(movedUnits) > 1) {
            // Remove active points for shared tooltip
            if (hoverPoints) {
                hoverPoints.forEach(function (point) {
                    point.setState();
                });
            }
            if (movedUnits < 0) {
                searchAxisLeft = extendedAxis;
                searchAxisRight = xAxis.ordinalPositions ? xAxis : extendedAxis;
            }
            else {
                searchAxisLeft = xAxis.ordinalPositions ? xAxis : extendedAxis;
                searchAxisRight = extendedAxis;
            }
            // In grouped data series, the last ordinal position represents the
            // grouped data, which is to the left of the real data max. If we
            // don't compensate for this, we will be allowed to pan grouped data
            // series passed the right of the plot area.
            ordinalPositions = searchAxisRight.ordinalPositions;
            if (dataMax >
                ordinalPositions[ordinalPositions.length - 1]) {
                ordinalPositions.push(dataMax);
            }
            // Get the new min and max values by getting the ordinal index for
            // the current extreme, then add the moved units and translate back
            // to values. This happens on the extended ordinal positions if the
            // new position is out of range, else it happens on the current x
            // axis which is smaller and faster.
            chart.fixedRange = max - min;
            trimmedRange = xAxis.toFixedRange(null, null, lin2val.apply(searchAxisLeft, [
                val2lin.apply(searchAxisLeft, [min, true]) + movedUnits,
                true // translate from index
            ]), lin2val.apply(searchAxisRight, [
                val2lin.apply(searchAxisRight, [max, true]) + movedUnits,
                true // translate from index
            ]));
            // Apply it if it is within the available data range
            if (trimmedRange.min >= Math.min(extremes.dataMin, min) &&
                trimmedRange.max <= Math.max(dataMax, max) + overscroll) {
                xAxis.setExtremes(trimmedRange.min, trimmedRange.max, true, false, { trigger: 'pan' });
            }
            chart.mouseDownX = chartX; // set new reference for next run
            css(chart.container, { cursor: 'move' });
        }
    }
    else {
        runBase = true;
    }
    // revert to the linear chart.pan version
    if (runBase || (panning && /y/.test(panning.type))) {
        if (overscroll) {
            xAxis.max = xAxis.dataMax + overscroll;
        }
    }
    else {
        e.preventDefault();
    }
});
addEvent(Axis, 'foundExtremes', function () {
    var axis = this;
    if (axis.isXAxis &&
        defined(axis.options.overscroll) &&
        axis.max === axis.dataMax &&
        (
        // Panning is an execption,
        // We don't want to apply overscroll when panning over the dataMax
        !axis.chart.mouseIsDown ||
            axis.isInternal) && (
    // Scrollbar buttons are the other execption:
    !axis.eventArgs ||
        axis.eventArgs && axis.eventArgs.trigger !== 'navigator')) {
        axis.max += axis.options.overscroll;
        // Live data and buttons require translation for the min:
        if (!axis.isInternal && defined(axis.userMin)) {
            axis.min += axis.options.overscroll;
        }
    }
});
// For ordinal axis, that loads data async, redraw axis after data is loaded.
// If we don't do that, axis will have the same extremes as previously, but
// ordinal positions won't be calculated. See #10290
addEvent(Axis, 'afterSetScale', function () {
    var axis = this;
    if (axis.horiz && !axis.isDirty) {
        axis.isDirty = axis.isOrdinal &&
            axis.chart.navigator &&
            !axis.chart.navigator.adaptToUpdatedData;
    }
});
