/* *
 *
 *  Copyright (c) 2019-2020 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, error = U.error, getOptions = U.getOptions, isArray = U.isArray, isNumber = U.isNumber, pick = U.pick, wrap = U.wrap;
import '../../Core/Series/Series.js';
import '../../Core/Options.js';
import '../../Core/Interaction.js';
import butils from './BoostUtils.js';
import boostable from './Boostables.js';
import boostableMap from './BoostableMap.js';
var boostEnabled = butils.boostEnabled, shouldForceChartSeriesBoosting = butils.shouldForceChartSeriesBoosting, Series = H.Series, seriesTypes = H.seriesTypes, plotOptions = getOptions().plotOptions;
/**
 * Returns true if the chart is in series boost mode.
 *
 * @function Highcharts.Chart#isChartSeriesBoosting
 *
 * @param {Highcharts.Chart} chart
 *        the chart to check
 *
 * @return {boolean}
 *         true if the chart is in series boost mode
 */
Chart.prototype.isChartSeriesBoosting = function () {
    var isSeriesBoosting, threshold = pick(this.options.boost && this.options.boost.seriesThreshold, 50);
    isSeriesBoosting = threshold <= this.series.length ||
        shouldForceChartSeriesBoosting(this);
    return isSeriesBoosting;
};
/* eslint-disable valid-jsdoc */
/**
 * Get the clip rectangle for a target, either a series or the chart. For the
 * chart, we need to consider the maximum extent of its Y axes, in case of
 * Highstock panes and navigator.
 *
 * @private
 * @function Highcharts.Chart#getBoostClipRect
 *
 * @param {Highcharts.Chart} target
 *
 * @return {Highcharts.BBoxObject}
 */
Chart.prototype.getBoostClipRect = function (target) {
    var clipBox = {
        x: this.plotLeft,
        y: this.plotTop,
        width: this.plotWidth,
        height: this.plotHeight
    };
    if (target === this) {
        this.yAxis.forEach(function (yAxis) {
            clipBox.y = Math.min(yAxis.pos, clipBox.y);
            clipBox.height = Math.max(yAxis.pos - this.plotTop + yAxis.len, clipBox.height);
        }, this);
    }
    return clipBox;
};
/**
 * Return a full Point object based on the index.
 * The boost module uses stripped point objects for performance reasons.
 *
 * @function Highcharts.Series#getPoint
 *
 * @param {object|Highcharts.Point} boostPoint
 *        A stripped-down point object
 *
 * @return {Highcharts.Point}
 *         A Point object as per https://api.highcharts.com/highcharts#Point
 */
Series.prototype.getPoint = function (boostPoint) {
    var point = boostPoint, xData = (this.xData || this.options.xData || this.processedXData ||
        false);
    if (boostPoint && !(boostPoint instanceof this.pointClass)) {
        point = (new this.pointClass()).init(// eslint-disable-line new-cap
        this, this.options.data[boostPoint.i], xData ? xData[boostPoint.i] : void 0);
        point.category = pick(this.xAxis.categories ?
            this.xAxis.categories[point.x] :
            point.x, // @todo simplify
        point.x);
        point.dist = boostPoint.dist;
        point.distX = boostPoint.distX;
        point.plotX = boostPoint.plotX;
        point.plotY = boostPoint.plotY;
        point.index = boostPoint.i;
        point.isInside = this.isPointInside(boostPoint);
    }
    return point;
};
/* eslint-disable no-invalid-this */
// Return a point instance from the k-d-tree
wrap(Series.prototype, 'searchPoint', function (proceed) {
    return this.getPoint(proceed.apply(this, [].slice.call(arguments, 1)));
});
// For inverted series, we need to swap X-Y values before running base methods
wrap(Point.prototype, 'haloPath', function (proceed) {
    var halo, point = this, series = point.series, chart = series.chart, plotX = point.plotX, plotY = point.plotY, inverted = chart.inverted;
    if (series.isSeriesBoosting && inverted) {
        point.plotX = series.yAxis.len - plotY;
        point.plotY = series.xAxis.len - plotX;
    }
    halo = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    if (series.isSeriesBoosting && inverted) {
        point.plotX = plotX;
        point.plotY = plotY;
    }
    return halo;
});
wrap(Series.prototype, 'markerAttribs', function (proceed, point) {
    var attribs, series = this, chart = series.chart, plotX = point.plotX, plotY = point.plotY, inverted = chart.inverted;
    if (series.isSeriesBoosting && inverted) {
        point.plotX = series.yAxis.len - plotY;
        point.plotY = series.xAxis.len - plotX;
    }
    attribs = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    if (series.isSeriesBoosting && inverted) {
        point.plotX = plotX;
        point.plotY = plotY;
    }
    return attribs;
});
/*
 * Extend series.destroy to also remove the fake k-d-tree points (#5137).
 * Normally this is handled by Series.destroy that calls Point.destroy,
 * but the fake search points are not registered like that.
 */
addEvent(Series, 'destroy', function () {
    var series = this, chart = series.chart;
    if (chart.markerGroup === series.markerGroup) {
        series.markerGroup = null;
    }
    if (chart.hoverPoints) {
        chart.hoverPoints = chart.hoverPoints.filter(function (point) {
            return point.series === series;
        });
    }
    if (chart.hoverPoint && chart.hoverPoint.series === series) {
        chart.hoverPoint = null;
    }
});
/*
 * Do not compute extremes when min and max are set.
 * If we use this in the core, we can add the hook
 * to hasExtremes to the methods directly.
 */
wrap(Series.prototype, 'getExtremes', function (proceed) {
    if (!this.isSeriesBoosting || (!this.hasExtremes || !this.hasExtremes())) {
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
    return {};
});
/*
 * Override a bunch of methods the same way. If the number of points is
 * below the threshold, run the original method. If not, check for a
 * canvas version or do nothing.
 *
 * Note that we're not overriding any of these for heatmaps.
 */
[
    'translate',
    'generatePoints',
    'drawTracker',
    'drawPoints',
    'render'
].forEach(function (method) {
    /**
     * @private
     */
    function branch(proceed) {
        var letItPass = this.options.stacking &&
            (method === 'translate' || method === 'generatePoints');
        if (!this.isSeriesBoosting ||
            letItPass ||
            !boostEnabled(this.chart) ||
            this.type === 'heatmap' ||
            this.type === 'treemap' ||
            !boostableMap[this.type] ||
            this.options.boostThreshold === 0) {
            proceed.call(this);
            // If a canvas version of the method exists, like renderCanvas(), run
        }
        else if (this[method + 'Canvas']) {
            this[method + 'Canvas']();
        }
    }
    wrap(Series.prototype, method, branch);
    // A special case for some types - their translate method is already wrapped
    if (method === 'translate') {
        [
            'column',
            'bar',
            'arearange',
            'columnrange',
            'heatmap',
            'treemap'
        ].forEach(function (type) {
            if (seriesTypes[type]) {
                wrap(seriesTypes[type].prototype, method, branch);
            }
        });
    }
});
// If the series is a heatmap or treemap, or if the series is not boosting
// do the default behaviour. Otherwise, process if the series has no extremes.
wrap(Series.prototype, 'processData', function (proceed) {
    var series = this, dataToMeasure = this.options.data, firstPoint;
    /**
     * Used twice in this function, first on this.options.data, the second
     * time it runs the check again after processedXData is built.
     * @private
     * @todo Check what happens with data grouping
     */
    function getSeriesBoosting(data) {
        return series.chart.isChartSeriesBoosting() || ((data ? data.length : 0) >=
            (series.options.boostThreshold || Number.MAX_VALUE));
    }
    if (boostEnabled(this.chart) && boostableMap[this.type]) {
        // If there are no extremes given in the options, we also need to
        // process the data to read the data extremes. If this is a heatmap, do
        // default behaviour.
        if (!getSeriesBoosting(dataToMeasure) || // First pass with options.data
            this.type === 'heatmap' ||
            this.type === 'treemap' ||
            this.options.stacking || // processedYData for the stack (#7481)
            !this.hasExtremes ||
            !this.hasExtremes(true)) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            dataToMeasure = this.processedXData;
        }
        // Set the isBoosting flag, second pass with processedXData to see if we
        // have zoomed.
        this.isSeriesBoosting = getSeriesBoosting(dataToMeasure);
        // Enter or exit boost mode
        if (this.isSeriesBoosting) {
            // Force turbo-mode:
            firstPoint = this.getFirstValidPoint(this.options.data);
            if (!isNumber(firstPoint) && !isArray(firstPoint)) {
                error(12, false, this.chart);
            }
            this.enterBoost();
        }
        else if (this.exitBoost) {
            this.exitBoost();
        }
        // The series type is not boostable
    }
    else {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});
addEvent(Series, 'hide', function () {
    if (this.canvas && this.renderTarget) {
        if (this.ogl) {
            this.ogl.clear();
        }
        this.boostClear();
    }
});
/**
 * Enter boost mode and apply boost-specific properties.
 *
 * @function Highcharts.Series#enterBoost
 */
Series.prototype.enterBoost = function () {
    this.alteredByBoost = [];
    // Save the original values, including whether it was an own property or
    // inherited from the prototype.
    ['allowDG', 'directTouch', 'stickyTracking'].forEach(function (prop) {
        this.alteredByBoost.push({
            prop: prop,
            val: this[prop],
            own: Object.hasOwnProperty.call(this, prop)
        });
    }, this);
    this.allowDG = false;
    this.directTouch = false;
    this.stickyTracking = true;
    // Prevent animation when zooming in on boosted series(#13421).
    this.finishedAnimating = true;
    // Hide series label if any
    if (this.labelBySeries) {
        this.labelBySeries = this.labelBySeries.destroy();
    }
};
/**
 * Exit from boost mode and restore non-boost properties.
 *
 * @function Highcharts.Series#exitBoost
 */
Series.prototype.exitBoost = function () {
    // Reset instance properties and/or delete instance properties and go back
    // to prototype
    (this.alteredByBoost || []).forEach(function (setting) {
        if (setting.own) {
            this[setting.prop] = setting.val;
        }
        else {
            // Revert to prototype
            delete this[setting.prop];
        }
    }, this);
    // Clear previous run
    if (this.boostClear) {
        this.boostClear();
    }
};
/**
 * @private
 * @function Highcharts.Series#hasExtremes
 *
 * @param {boolean} checkX
 *
 * @return {boolean}
 */
Series.prototype.hasExtremes = function (checkX) {
    var options = this.options, data = options.data, xAxis = this.xAxis && this.xAxis.options, yAxis = this.yAxis && this.yAxis.options, colorAxis = this.colorAxis && this.colorAxis.options;
    return data.length > (options.boostThreshold || Number.MAX_VALUE) &&
        // Defined yAxis extremes
        isNumber(yAxis.min) &&
        isNumber(yAxis.max) &&
        // Defined (and required) xAxis extremes
        (!checkX ||
            (isNumber(xAxis.min) && isNumber(xAxis.max))) &&
        // Defined (e.g. heatmap) colorAxis extremes
        (!colorAxis ||
            (isNumber(colorAxis.min) && isNumber(colorAxis.max)));
};
/**
 * If implemented in the core, parts of this can probably be
 * shared with other similar methods in Highcharts.
 *
 * @function Highcharts.Series#destroyGraphics
 */
Series.prototype.destroyGraphics = function () {
    var series = this, points = this.points, point, i;
    if (points) {
        for (i = 0; i < points.length; i = i + 1) {
            point = points[i];
            if (point && point.destroyElements) {
                point.destroyElements(); // #7557
            }
        }
    }
    ['graph', 'area', 'tracker'].forEach(function (prop) {
        if (series[prop]) {
            series[prop] = series[prop].destroy();
        }
    });
};
// Set default options
boostable.forEach(function (type) {
    if (plotOptions[type]) {
        plotOptions[type].boostThreshold = 5000;
        plotOptions[type].boostData = [];
        seriesTypes[type].prototype.fillOpacity = true;
    }
});
