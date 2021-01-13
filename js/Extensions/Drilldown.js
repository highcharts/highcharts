/* *
 *
 *  Highcharts Drilldown module
 *
 *  Author: Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import A from '../Core/Animation/AnimationUtilities.js';
var animObject = A.animObject;
import Axis from '../Core/Axis/Axis.js';
import Chart from '../Core/Chart/Chart.js';
import Color from '../Core/Color/Color.js';
import ColumnSeries from '../Series/Column/ColumnSeries.js';
import H from '../Core/Globals.js';
var noop = H.noop;
import O from '../Core/Options.js';
var defaultOptions = O.defaultOptions;
import palette from '../Core/Color/Palette.js';
import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
var seriesTypes = SeriesRegistry.seriesTypes;
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import Tick from '../Core/Axis/Tick.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, removeEvent = U.removeEvent, extend = U.extend, fireEvent = U.fireEvent, format = U.format, merge = U.merge, objectEach = U.objectEach, pick = U.pick, syncTimeout = U.syncTimeout;
/**
 * Gets fired when a drilldown point is clicked, before the new series is added.
 * Note that when clicking a category label to trigger multiple series
 * drilldown, one `drilldown` event is triggered per point in the category.
 *
 * @callback Highcharts.DrilldownCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrilldownEventObject} e
 *        The drilldown event.
 */
/**
 * The event arguments when a drilldown point is clicked.
 *
 * @interface Highcharts.DrilldownEventObject
 */ /**
* If a category label was clicked, which index.
* @name Highcharts.DrilldownEventObject#category
* @type {number|undefined}
*/ /**
* The original browser event (usually click) that triggered the drilldown.
* @name Highcharts.DrilldownEventObject#originalEvent
* @type {global.Event|undefined}
*/ /**
* Prevents the default behaviour of the event.
* @name Highcharts.DrilldownEventObject#preventDefault
* @type {Function}
*/ /**
* The originating point.
* @name Highcharts.DrilldownEventObject#point
* @type {Highcharts.Point}
*/ /**
* If a category label was clicked, this array holds all points corresponding to
* the category. Otherwise it is set to false.
* @name Highcharts.DrilldownEventObject#points
* @type {boolean|Array<Highcharts.Point>|undefined}
*/ /**
* Options for the new series. If the event is utilized for async drilldown, the
* seriesOptions are not added, but rather loaded async.
* @name Highcharts.DrilldownEventObject#seriesOptions
* @type {Highcharts.SeriesOptionsType|undefined}
*/ /**
* The event target.
* @name Highcharts.DrilldownEventObject#target
* @type {Highcharts.Chart}
*/ /**
* The event type.
* @name Highcharts.DrilldownEventObject#type
* @type {"drilldown"}
*/
/**
 * This gets fired after all the series have been drilled up. This is especially
 * usefull in a chart with multiple drilldown series.
 *
 * @callback Highcharts.DrillupAllCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrillupAllEventObject} e
 *        The final drillup event.
 */
/**
 * The event arguments when all the series have been drilled up.
 *
 * @interface Highcharts.DrillupAllEventObject
 */ /**
* Prevents the default behaviour of the event.
* @name Highcharts.DrillupAllEventObject#preventDefault
* @type {Function}
*/ /**
* The event target.
* @name Highcharts.DrillupAllEventObject#target
* @type {Highcharts.Chart}
*/ /**
* The event type.
* @name Highcharts.DrillupAllEventObject#type
* @type {"drillupall"}
*/
/**
 * Gets fired when drilling up from a drilldown series.
 *
 * @callback Highcharts.DrillupCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrillupEventObject} e
 *        The drillup event.
 */
/**
 * The event arguments when drilling up from a drilldown series.
 *
 * @interface Highcharts.DrillupEventObject
 */ /**
* Prevents the default behaviour of the event.
* @name Highcharts.DrillupEventObject#preventDefault
* @type {Function}
*/ /**
* Options for the new series.
* @name Highcharts.DrillupEventObject#seriesOptions
* @type {Highcharts.SeriesOptionsType|undefined}
*/ /**
* The event target.
* @name Highcharts.DrillupEventObject#target
* @type {Highcharts.Chart}
*/ /**
* The event type.
* @name Highcharts.DrillupEventObject#type
* @type {"drillup"}
*/
import '../Series/Column/ColumnSeries.js';
var PieSeries = seriesTypes.pie, ddSeriesId = 1;
// Add language
extend(defaultOptions.lang, 
/**
 * @optionparent lang
 */
{
    /**
     * The text for the button that appears when drilling down, linking back
     * to the parent series. The parent series' name is inserted for
     * `{series.name}`.
     *
     * @since    3.0.8
     * @product  highcharts highmaps
     * @requires modules/drilldown
     *
     * @private
     */
    drillUpText: '◁ Back to {series.name}'
});
/**
 * Options for drill down, the concept of inspecting increasingly high
 * resolution data through clicking on chart items like columns or pie slices.
 *
 * The drilldown feature requires the drilldown.js file to be loaded,
 * found in the modules directory of the download package, or online at
 * [code.highcharts.com/modules/drilldown.js
 * ](https://code.highcharts.com/modules/drilldown.js).
 *
 * @product      highcharts highmaps
 * @requires     modules/drilldown
 * @optionparent drilldown
 * @sample {highcharts} highcharts/series-organization/drilldown
 *         Organization chart drilldown
 */
defaultOptions.drilldown = {
    /**
     * When this option is false, clicking a single point will drill down
     * all points in the same category, equivalent to clicking the X axis
     * label.
     *
     * @sample {highcharts} highcharts/drilldown/allowpointdrilldown-false/
     *         Don't allow point drilldown
     *
     * @type      {boolean}
     * @default   true
     * @since     4.1.7
     * @product   highcharts
     * @apioption drilldown.allowPointDrilldown
     */
    /**
     * An array of series configurations for the drill down. Each series
     * configuration uses the same syntax as the [series](#series) option set.
     * These drilldown series are hidden by default. The drilldown series is
     * linked to the parent series' point by its `id`.
     *
     * @type      {Array<Highcharts.SeriesOptionsType>}
     * @since     3.0.8
     * @product   highcharts highmaps
     * @apioption drilldown.series
     */
    /**
     * Additional styles to apply to the X axis label for a point that
     * has drilldown data. By default it is underlined and blue to invite
     * to interaction.
     *
     * In styled mode, active label styles can be set with the
     * `.highcharts-drilldown-axis-label` class.
     *
     * @sample {highcharts} highcharts/drilldown/labels/
     *         Label styles
     *
     * @type    {Highcharts.CSSObject}
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since   3.0.8
     * @product highcharts highmaps
     */
    activeAxisLabelStyle: {
        /** @ignore-option */
        cursor: 'pointer',
        /** @ignore-option */
        color: palette.highlightColor100,
        /** @ignore-option */
        fontWeight: 'bold',
        /** @ignore-option */
        textDecoration: 'underline'
    },
    /**
     * Additional styles to apply to the data label of a point that has
     * drilldown data. By default it is underlined and blue to invite to
     * interaction.
     *
     * In styled mode, active data label styles can be applied with the
     * `.highcharts-drilldown-data-label` class.
     *
     * @sample {highcharts} highcharts/drilldown/labels/
     *         Label styles
     *
     * @type    {Highcharts.CSSObject}
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since   3.0.8
     * @product highcharts highmaps
     */
    activeDataLabelStyle: {
        cursor: 'pointer',
        color: palette.highlightColor100,
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    /**
     * Set the animation for all drilldown animations. Animation of a drilldown
     * occurs when drilling between a column point and a column series,
     * or a pie slice and a full pie series. Drilldown can still be used
     * between series and points of different types, but animation will
     * not occur.
     *
     * The animation can either be set as a boolean or a configuration
     * object. If `true`, it will use the 'swing' jQuery easing and a duration
     * of 500 ms. If used as a configuration object, the following properties
     * are supported:
     *
     * - `duration`: The duration of the animation in milliseconds.
     *
     * - `easing`: A string reference to an easing function set on the `Math`
     *   object. See
     *   [the easing demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-animation-easing/).
     *
     * @type    {boolean|Partial<Highcharts.AnimationOptionsObject>}
     * @since   3.0.8
     * @product highcharts highmaps
     */
    animation: {
        /** @internal */
        duration: 500
    },
    /**
     * Options for the drill up button that appears when drilling down on a
     * series. The text for the button is defined in
     * [lang.drillUpText](#lang.drillUpText).
     *
     * @sample {highcharts} highcharts/drilldown/drillupbutton/
     *         Drill up button
     * @sample {highmaps} highcharts/drilldown/drillupbutton/
     *         Drill up button
     *
     * @since   3.0.8
     * @product highcharts highmaps
     */
    drillUpButton: {
        /**
         * What box to align the button to. Can be either `plotBox` or
         * `spacingBox`.
         *
         * @type       {Highcharts.ButtonRelativeToValue}
         * @default    plotBox
         * @since      3.0.8
         * @product    highcharts highmaps
         * @apioption  drilldown.drillUpButton.relativeTo
         */
        /**
         * A collection of attributes for the button. The object takes SVG
         * attributes like `fill`, `stroke`, `stroke-width` or `r`, the border
         * radius. The theme also supports `style`, a collection of CSS
         * properties for the text. Equivalent attributes for the hover state
         * are given in `theme.states.hover`.
         *
         * In styled mode, drill-up button styles can be applied with the
         * `.highcharts-drillup-button` class.
         *
         * @sample {highcharts} highcharts/drilldown/drillupbutton/
         *         Button theming
         * @sample {highmaps} highcharts/drilldown/drillupbutton/
         *         Button theming
         *
         * @type      {object}
         * @since     3.0.8
         * @product   highcharts highmaps
         * @apioption drilldown.drillUpButton.theme
         */
        /**
         * Positioning options for the button within the `relativeTo` box.
         * Available properties are `x`, `y`, `align` and `verticalAlign`.
         *
         * @type    {Highcharts.AlignObject}
         * @since   3.0.8
         * @product highcharts highmaps
         */
        position: {
            /**
             * Vertical alignment of the button.
             *
             * @type      {Highcharts.VerticalAlignValue}
             * @default   top
             * @product   highcharts highmaps
             * @apioption drilldown.drillUpButton.position.verticalAlign
             */
            /**
             * Horizontal alignment.
             *
             * @type {Highcharts.AlignValue}
             */
            align: 'right',
            /**
             * The X offset of the button.
             */
            x: -10,
            /**
             * The Y offset of the button.
             */
            y: 10
        }
    }
};
/**
 * Fires when a drilldown point is clicked, before the new series is added. This
 * event is also utilized for async drilldown, where the seriesOptions are not
 * added by option, but rather loaded async. Note that when clicking a category
 * label to trigger multiple series drilldown, one `drilldown` event is
 * triggered per point in the category.
 *
 * Event arguments:
 *
 * - `category`: If a category label was clicked, which index.
 *
 * - `originalEvent`: The original browser event (usually click) that triggered
 *   the drilldown.
 *
 * - `point`: The originating point.
 *
 * - `points`: If a category label was clicked, this array holds all points
 *   corresponding to the category.
 *
 * - `seriesOptions`: Options for the new series.
 *
 * @sample {highcharts} highcharts/drilldown/async/
 *         Async drilldown
 *
 * @type      {Highcharts.DrilldownCallbackFunction}
 * @since     3.0.8
 * @product   highcharts highmaps
 * @context   Highcharts.Chart
 * @requires  modules/drilldown
 * @apioption chart.events.drilldown
 */
/**
 * Fires when drilling up from a drilldown series.
 *
 * @type      {Highcharts.DrillupCallbackFunction}
 * @since     3.0.8
 * @product   highcharts highmaps
 * @context   Highcharts.Chart
 * @requires  modules/drilldown
 * @apioption chart.events.drillup
 */
/**
 * In a chart with multiple drilldown series, this event fires after all the
 * series have been drilled up.
 *
 * @type      {Highcharts.DrillupAllCallbackFunction}
 * @since     4.2.4
 * @product   highcharts highmaps
 * @context   Highcharts.Chart
 * @requires  modules/drilldown
 * @apioption chart.events.drillupall
 */
/**
 * The `id` of a series in the [drilldown.series](#drilldown.series) array to
 * use for a drilldown for this point.
 *
 * @sample {highcharts} highcharts/drilldown/basic/
 *         Basic drilldown
 *
 * @type      {string}
 * @since     3.0.8
 * @product   highcharts
 * @requires  modules/drilldown
 * @apioption series.line.data.drilldown
 */
/**
 * A general fadeIn method.
 *
 * @requires module:modules/drilldown
 *
 * @function Highcharts.SVGElement#fadeIn
 *
 * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
 * The animation options for the element fade.
 */
SVGRenderer.prototype.Element.prototype.fadeIn = function (animation) {
    this
        .attr({
        opacity: 0.1,
        visibility: 'inherit'
    })
        .animate({
        opacity: pick(this.newOpacity, 1) // newOpacity used in maps
    }, animation || {
        duration: 250
    });
};
/**
 * Add a series to the chart as drilldown from a specific point in the parent
 * series. This method is used for async drilldown, when clicking a point in a
 * series should result in loading and displaying a more high-resolution series.
 * When not async, the setup is simpler using the
 * [drilldown.series](https://api.highcharts.com/highcharts/drilldown.series)
 * options structure.
 *
 * @sample highcharts/drilldown/async/
 *         Async drilldown
 *
 * @function Highcharts.Chart#addSeriesAsDrilldown
 *
 * @param {Highcharts.Point} point
 * The point from which the drilldown will start.
 *
 * @param {Highcharts.SeriesOptionsType} options
 * The series options for the new, detailed series.
 */
Chart.prototype.addSeriesAsDrilldown = function (point, options) {
    this.addSingleSeriesAsDrilldown(point, options);
    this.applyDrilldown();
};
Chart.prototype.addSingleSeriesAsDrilldown = function (point, ddOptions) {
    var oldSeries = point.series, xAxis = oldSeries.xAxis, yAxis = oldSeries.yAxis, newSeries, pointIndex, levelSeries = [], levelSeriesOptions = [], level, levelNumber, last, colorProp;
    colorProp = this.styledMode ?
        { colorIndex: pick(point.colorIndex, oldSeries.colorIndex) } :
        { color: point.color || oldSeries.color };
    if (!this.drilldownLevels) {
        this.drilldownLevels = [];
    }
    levelNumber = oldSeries.options._levelNumber || 0;
    // See if we can reuse the registered series from last run
    last = this.drilldownLevels[this.drilldownLevels.length - 1];
    if (last && last.levelNumber !== levelNumber) {
        last = void 0;
    }
    ddOptions = extend(extend({
        _ddSeriesId: ddSeriesId++
    }, colorProp), ddOptions);
    pointIndex = oldSeries.points.indexOf(point);
    // Record options for all current series
    oldSeries.chart.series.forEach(function (series) {
        if (series.xAxis === xAxis && !series.isDrilling) {
            series.options._ddSeriesId =
                series.options._ddSeriesId || ddSeriesId++;
            series.options._colorIndex = series.userOptions._colorIndex;
            series.options._levelNumber =
                series.options._levelNumber || levelNumber; // #3182
            if (last) {
                levelSeries = last.levelSeries;
                levelSeriesOptions = last.levelSeriesOptions;
            }
            else {
                levelSeries.push(series);
                // (#10597)
                series.purgedOptions = merge({
                    _ddSeriesId: series.options._ddSeriesId,
                    _levelNumber: series.options._levelNumber,
                    selected: series.options.selected
                }, series.userOptions);
                levelSeriesOptions.push(series.purgedOptions);
            }
        }
    });
    // Add a record of properties for each drilldown level
    level = extend({
        levelNumber: levelNumber,
        seriesOptions: oldSeries.options,
        seriesPurgedOptions: oldSeries.purgedOptions,
        levelSeriesOptions: levelSeriesOptions,
        levelSeries: levelSeries,
        shapeArgs: point.shapeArgs,
        // no graphic in line series with markers disabled
        bBox: point.graphic ? point.graphic.getBBox() : {},
        color: point.isNull ?
            new Color(colorProp.color).setOpacity(0).get() :
            colorProp.color,
        lowerSeriesOptions: ddOptions,
        pointOptions: oldSeries.options.data[pointIndex],
        pointIndex: pointIndex,
        oldExtremes: {
            xMin: xAxis && xAxis.userMin,
            xMax: xAxis && xAxis.userMax,
            yMin: yAxis && yAxis.userMin,
            yMax: yAxis && yAxis.userMax
        },
        resetZoomButton: this.resetZoomButton
    }, colorProp);
    // Push it to the lookup array
    this.drilldownLevels.push(level);
    // Reset names to prevent extending (#6704)
    if (xAxis && xAxis.names) {
        xAxis.names.length = 0;
    }
    newSeries = level.lowerSeries = this.addSeries(ddOptions, false);
    newSeries.options._levelNumber = levelNumber + 1;
    if (xAxis) {
        xAxis.oldPos = xAxis.pos;
        xAxis.userMin = xAxis.userMax = null;
        yAxis.userMin = yAxis.userMax = null;
    }
    // Run fancy cross-animation on supported and equal types
    if (oldSeries.type === newSeries.type) {
        newSeries.animate = newSeries.animateDrilldown || noop;
        newSeries.options.animation = true;
    }
};
Chart.prototype.applyDrilldown = function () {
    var drilldownLevels = this.drilldownLevels, levelToRemove;
    if (drilldownLevels && drilldownLevels.length > 0) { // #3352, async loading
        levelToRemove = drilldownLevels[drilldownLevels.length - 1].levelNumber;
        this.drilldownLevels.forEach(function (level) {
            if (level.levelNumber === levelToRemove) {
                level.levelSeries.forEach(function (series) {
                    // Not removed, not added as part of a multi-series
                    // drilldown
                    if (series.options &&
                        series.options._levelNumber === levelToRemove) {
                        series.remove(false);
                    }
                });
            }
        });
    }
    // We have a reset zoom button. Hide it and detatch it from the chart. It
    // is preserved to the layer config above.
    if (this.resetZoomButton) {
        this.resetZoomButton.hide();
        delete this.resetZoomButton;
    }
    this.pointer.reset();
    this.redraw();
    this.showDrillUpButton();
    fireEvent(this, 'afterDrilldown');
};
Chart.prototype.getDrilldownBackText = function () {
    var drilldownLevels = this.drilldownLevels, lastLevel;
    if (drilldownLevels && drilldownLevels.length > 0) { // #3352, async loading
        lastLevel = drilldownLevels[drilldownLevels.length - 1];
        lastLevel.series = lastLevel.seriesOptions;
        return format(this.options.lang.drillUpText, lastLevel);
    }
};
Chart.prototype.showDrillUpButton = function () {
    var chart = this, backText = this.getDrilldownBackText(), buttonOptions = chart.options.drilldown.drillUpButton, attr, states;
    if (!this.drillUpButton) {
        attr = buttonOptions.theme;
        states = attr && attr.states;
        this.drillUpButton = this.renderer.button(backText, null, null, function () {
            chart.drillUp();
        }, attr, states && states.hover, states && states.select)
            .addClass('highcharts-drillup-button')
            .attr({
            align: buttonOptions.position.align,
            zIndex: 7
        })
            .add()
            .align(buttonOptions.position, false, buttonOptions.relativeTo || 'plotBox');
    }
    else {
        this.drillUpButton.attr({
            text: backText
        })
            .align();
    }
};
/**
 * When the chart is drilled down to a child series, calling `chart.drillUp()`
 * will drill up to the parent series.
 *
 * @requires  modules/drilldown
 *
 * @function Highcharts.Chart#drillUp
 */
Chart.prototype.drillUp = function () {
    if (!this.drilldownLevels || this.drilldownLevels.length === 0) {
        return;
    }
    var chart = this, drilldownLevels = chart.drilldownLevels, levelNumber = drilldownLevels[drilldownLevels.length - 1].levelNumber, i = drilldownLevels.length, chartSeries = chart.series, seriesI, level, oldSeries, newSeries, oldExtremes, addSeries = function (seriesOptions) {
        var addedSeries;
        chartSeries.forEach(function (series) {
            if (series.options._ddSeriesId === seriesOptions._ddSeriesId) {
                addedSeries = series;
            }
        });
        addedSeries = addedSeries || chart.addSeries(seriesOptions, false);
        if (addedSeries.type === oldSeries.type &&
            addedSeries.animateDrillupTo) {
            addedSeries.animate = addedSeries.animateDrillupTo;
        }
        if (seriesOptions === level.seriesPurgedOptions) {
            newSeries = addedSeries;
        }
    };
    while (i--) {
        level = drilldownLevels[i];
        if (level.levelNumber === levelNumber) {
            drilldownLevels.pop();
            // Get the lower series by reference or id
            oldSeries = level.lowerSeries;
            if (!oldSeries.chart) { // #2786
                seriesI = chartSeries.length; // #2919
                while (seriesI--) {
                    if (chartSeries[seriesI].options.id ===
                        level.lowerSeriesOptions.id &&
                        chartSeries[seriesI].options._levelNumber ===
                            levelNumber + 1) { // #3867
                        oldSeries = chartSeries[seriesI];
                        break;
                    }
                }
            }
            oldSeries.xData = []; // Overcome problems with minRange (#2898)
            level.levelSeriesOptions.forEach(addSeries);
            fireEvent(chart, 'drillup', {
                seriesOptions: level.seriesPurgedOptions ||
                    level.seriesOptions
            });
            this.resetZoomButton && this.resetZoomButton.destroy(); // #8095
            if (newSeries.type === oldSeries.type) {
                newSeries.drilldownLevel = level;
                newSeries.options.animation =
                    chart.options.drilldown.animation;
                if (oldSeries.animateDrillupFrom && oldSeries.chart) { // #2919
                    oldSeries.animateDrillupFrom(level);
                }
            }
            newSeries.options._levelNumber = levelNumber;
            oldSeries.remove(false);
            // Reset the zoom level of the upper series
            if (newSeries.xAxis) {
                oldExtremes = level.oldExtremes;
                newSeries.xAxis.setExtremes(oldExtremes.xMin, oldExtremes.xMax, false);
                newSeries.yAxis.setExtremes(oldExtremes.yMin, oldExtremes.yMax, false);
            }
            // We have a resetZoomButton tucked away for this level. Attatch
            // it to the chart and show it.
            if (level.resetZoomButton) {
                chart.resetZoomButton = level.resetZoomButton;
                chart.resetZoomButton.show();
            }
        }
    }
    this.redraw();
    if (this.drilldownLevels.length === 0) {
        this.drillUpButton = this.drillUpButton.destroy();
    }
    else {
        this.drillUpButton.attr({
            text: this.getDrilldownBackText()
        })
            .align();
    }
    this.ddDupes.length = []; // #3315
    // Fire a once-off event after all series have been drilled up (#5158)
    fireEvent(chart, 'drillupall');
};
/* eslint-disable no-invalid-this */
// Add update function to be called internally from Chart.update
// (#7600, #12855)
addEvent(Chart, 'afterInit', function () {
    var chart = this;
    chart.drilldown = {
        update: function (options, redraw) {
            merge(true, chart.options.drilldown, options);
            if (pick(redraw, true)) {
                chart.redraw();
            }
        }
    };
});
// Shift the drillUpButton to make the space for resetZoomButton, #8095.
addEvent(Chart, 'afterShowResetZoom', function () {
    var chart = this, bbox = chart.resetZoomButton && chart.resetZoomButton.getBBox(), buttonOptions = chart.options.drilldown && chart.options.drilldown.drillUpButton;
    if (this.drillUpButton && bbox && buttonOptions && buttonOptions.position && buttonOptions.position.x) {
        this.drillUpButton.align({
            x: buttonOptions.position.x - bbox.width - 10,
            y: buttonOptions.position.y,
            align: buttonOptions.position.align
        }, false, buttonOptions.relativeTo || 'plotBox');
    }
});
addEvent(Chart, 'render', function () {
    (this.xAxis || []).forEach(function (axis) {
        axis.ddPoints = {};
        axis.series.forEach(function (series) {
            var i, xData = series.xData || [], points = series.points, p;
            for (i = 0; i < xData.length; i++) {
                p = series.options.data[i];
                // The `drilldown` property can only be set on an array or an
                // object
                if (typeof p !== 'number') {
                    // Convert array to object (#8008)
                    p = series.pointClass.prototype.optionsToObject
                        .call({ series: series }, p);
                    if (p.drilldown) {
                        if (!axis.ddPoints[xData[i]]) {
                            axis.ddPoints[xData[i]] = [];
                        }
                        axis.ddPoints[xData[i]].push(points ? points[i] : true);
                    }
                }
            }
        });
        // Add drillability to ticks, and always keep it drillability updated
        // (#3951)
        objectEach(axis.ticks, Tick.prototype.drillable);
    });
});
/**
 * When drilling up, keep the upper series invisible until the lower series has
 * moved into place.
 *
 * @private
 * @function Highcharts.ColumnSeries#animateDrillupTo
 * @param {boolean} [init=false]
 * Whether to initialize animation
 */
ColumnSeries.prototype.animateDrillupTo = function (init) {
    if (!init) {
        var newSeries = this, level = newSeries.drilldownLevel;
        // First hide all items before animating in again
        this.points.forEach(function (point) {
            var dataLabel = point.dataLabel;
            if (point.graphic) { // #3407
                point.graphic.hide();
            }
            if (dataLabel) {
                // The data label is initially hidden, make sure it is not faded
                // in (#6127)
                dataLabel.hidden = dataLabel.attr('visibility') === 'hidden';
                if (!dataLabel.hidden) {
                    dataLabel.hide();
                    if (point.connector) {
                        point.connector.hide();
                    }
                }
            }
        });
        // Do dummy animation on first point to get to complete
        syncTimeout(function () {
            if (newSeries.points) { // May be destroyed in the meantime, #3389
                // Unable to drillup with nodes, #13711
                var pointsWithNodes = [];
                newSeries.data.forEach(function (el) {
                    pointsWithNodes.push(el);
                });
                if (newSeries.nodes) {
                    pointsWithNodes = pointsWithNodes.concat(newSeries.nodes);
                }
                pointsWithNodes.forEach(function (point, i) {
                    // Fade in other points
                    var verb = i === (level && level.pointIndex) ? 'show' : 'fadeIn', inherit = verb === 'show' ? true : void 0, dataLabel = point.dataLabel;
                    if (point.graphic) { // #3407
                        point.graphic[verb](inherit);
                    }
                    if (dataLabel && !dataLabel.hidden) { // #6127
                        dataLabel.fadeIn(); // #7384
                        if (point.connector) {
                            point.connector.fadeIn();
                        }
                    }
                });
            }
        }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0));
        // Reset to prototype
        delete this.animate;
    }
};
ColumnSeries.prototype.animateDrilldown = function (init) {
    var series = this, chart = this.chart, drilldownLevels = chart.drilldownLevels, animateFrom, animationOptions = animObject(chart.options.drilldown.animation), xAxis = this.xAxis, styledMode = chart.styledMode;
    if (!init) {
        drilldownLevels.forEach(function (level) {
            if (series.options._ddSeriesId ===
                level.lowerSeriesOptions._ddSeriesId) {
                animateFrom = level.shapeArgs;
                if (!styledMode) {
                    // Add the point colors to animate from
                    animateFrom.fill = level.color;
                }
            }
        });
        animateFrom.x += pick(xAxis.oldPos, xAxis.pos) - xAxis.pos;
        this.points.forEach(function (point) {
            var animateTo = point.shapeArgs;
            if (!styledMode) {
                // Add the point colors to animate to
                animateTo.fill = point.color;
            }
            if (point.graphic) {
                point.graphic
                    .attr(animateFrom)
                    .animate(extend(point.shapeArgs, { fill: point.color || series.color }), animationOptions);
            }
            if (point.dataLabel) {
                point.dataLabel.fadeIn(animationOptions);
            }
        });
        // Reset to prototype
        delete this.animate;
    }
};
/**
 * When drilling up, pull out the individual point graphics from the lower
 * series and animate them into the origin point in the upper series.
 *
 * @private
 * @function Highcharts.ColumnSeries#animateDrillupFrom
 * @param {Highcharts.DrilldownLevelObject} level
 *        Level container
 * @return {void}
 */
ColumnSeries.prototype.animateDrillupFrom = function (level) {
    var animationOptions = animObject(this.chart.options.drilldown.animation), group = this.group, 
    // For 3d column series all columns are added to one group
    // so we should not delete the whole group. #5297
    removeGroup = group !== this.chart.columnGroup, series = this;
    // Cancel mouse events on the series group (#2787)
    series.trackerGroups.forEach(function (key) {
        if (series[key]) { // we don't always have dataLabelsGroup
            series[key].on('mouseover');
        }
    });
    if (removeGroup) {
        delete this.group;
    }
    this.points.forEach(function (point) {
        var graphic = point.graphic, animateTo = level.shapeArgs, complete = function () {
            graphic.destroy();
            if (group && removeGroup) {
                group = group.destroy();
            }
        };
        if (graphic && animateTo) {
            delete point.graphic;
            if (!series.chart.styledMode) {
                animateTo.fill = level.color;
            }
            if (animationOptions.duration) {
                graphic.animate(animateTo, merge(animationOptions, { complete: complete }));
            }
            else {
                graphic.attr(animateTo);
                complete();
            }
        }
    });
};
if (PieSeries) {
    extend(PieSeries.prototype, {
        animateDrillupTo: ColumnSeries.prototype.animateDrillupTo,
        animateDrillupFrom: ColumnSeries.prototype.animateDrillupFrom,
        animateDrilldown: function (init) {
            var level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1], animationOptions = this.chart.options.drilldown.animation;
            if (this.is('item')) {
                animationOptions.duration = 0;
            }
            // Unable to drill down in the horizontal item series #13372
            if (this.center) {
                var animateFrom = level.shapeArgs, start = animateFrom.start, angle = animateFrom.end - start, startAngle = angle / this.points.length, styledMode = this.chart.styledMode;
                if (!init) {
                    this.points.forEach(function (point, i) {
                        var animateTo = point.shapeArgs;
                        if (!styledMode) {
                            animateFrom.fill = level.color;
                            animateTo.fill = point.color;
                        }
                        if (point.graphic) {
                            point.graphic
                                .attr(merge(animateFrom, {
                                start: start + i * startAngle,
                                end: start + (i + 1) * startAngle
                            }))[animationOptions ? 'animate' : 'attr'](animateTo, animationOptions);
                        }
                    });
                    // Reset to prototype
                    delete this.animate;
                }
            }
        }
    });
}
Point.prototype.doDrilldown = function (_holdRedraw, category, originalEvent) {
    var series = this.series, chart = series.chart, drilldown = chart.options.drilldown, i = (drilldown.series || []).length, seriesOptions;
    if (!chart.ddDupes) {
        chart.ddDupes = [];
    }
    while (i-- && !seriesOptions) {
        if (drilldown.series[i].id === this.drilldown &&
            chart.ddDupes.indexOf(this.drilldown) === -1) {
            seriesOptions = drilldown.series[i];
            chart.ddDupes.push(this.drilldown);
        }
    }
    // Fire the event. If seriesOptions is undefined, the implementer can check
    // for  seriesOptions, and call addSeriesAsDrilldown async if necessary.
    fireEvent(chart, 'drilldown', {
        point: this,
        seriesOptions: seriesOptions,
        category: category,
        originalEvent: originalEvent,
        points: (typeof category !== 'undefined' &&
            this.series.xAxis.getDDPoints(category).slice(0))
    }, function (e) {
        var chart = e.point.series && e.point.series.chart, seriesOptions = e.seriesOptions;
        if (chart && seriesOptions) {
            if (_holdRedraw) {
                chart.addSingleSeriesAsDrilldown(e.point, seriesOptions);
            }
            else {
                chart.addSeriesAsDrilldown(e.point, seriesOptions);
            }
        }
    });
};
/**
 * Drill down to a given category. This is the same as clicking on an axis
 * label.
 *
 * @private
 * @function Highcharts.Axis#drilldownCategory
 * @param {number} x
 *        Tick position
 * @param {global.MouseEvent} e
 *        Click event
 */
Axis.prototype.drilldownCategory = function (x, e) {
    this.getDDPoints(x).forEach(function (point) {
        if (point &&
            point.series &&
            point.series.visible &&
            point.doDrilldown) { // #3197
            point.doDrilldown(true, x, e);
        }
    });
    this.chart.applyDrilldown();
};
/**
 * Return drillable points for this specific X value.
 *
 * @private
 * @function Highcharts.Axis#getDDPoints
 * @param {number} x
 *        Tick position
 * @return {Array<(false|Highcharts.Point)>}
 *         Drillable points
 */
Axis.prototype.getDDPoints = function (x) {
    return (this.ddPoints && this.ddPoints[x] || []);
};
/**
 * Make a tick label drillable, or remove drilling on update.
 *
 * @private
 * @function Highcharts.Axis#drillable
 */
Tick.prototype.drillable = function () {
    var pos = this.pos, label = this.label, axis = this.axis, isDrillable = axis.coll === 'xAxis' && axis.getDDPoints, ddPointsX = isDrillable && axis.getDDPoints(pos), styledMode = axis.chart.styledMode;
    if (isDrillable) {
        if (label && ddPointsX && ddPointsX.length) {
            label.drillable = true;
            if (!label.basicStyles && !styledMode) {
                label.basicStyles = merge(label.styles);
            }
            label.addClass('highcharts-drilldown-axis-label');
            // #12656 - avoid duplicate of attach event
            if (label.removeOnDrillableClick) {
                removeEvent(label.element, 'click');
            }
            label.removeOnDrillableClick = addEvent(label.element, 'click', function (e) {
                e.preventDefault();
                axis.drilldownCategory(pos, e);
            });
            if (!styledMode) {
                label.css(axis.chart.options.drilldown.activeAxisLabelStyle);
            }
        }
        else if (label && label.drillable && label.removeOnDrillableClick) {
            if (!styledMode) {
                label.styles = {}; // reset for full overwrite of styles
                label.css(label.basicStyles);
            }
            label.removeOnDrillableClick(); // #3806
            label.removeClass('highcharts-drilldown-axis-label');
        }
    }
};
// On initialization of each point, identify its label and make it clickable.
// Also, provide a list of points associated to that label.
addEvent(Point, 'afterInit', function () {
    var point = this;
    if (point.drilldown && !point.unbindDrilldownClick) {
        // Add the click event to the point
        point.unbindDrilldownClick = addEvent(point, 'click', handlePointClick);
    }
    return point;
});
addEvent(Point, 'update', function (e) {
    var point = this, options = e.options || {};
    if (options.drilldown && !point.unbindDrilldownClick) {
        // Add the click event to the point
        point.unbindDrilldownClick = addEvent(point, 'click', handlePointClick);
    }
    else if (!options.drilldown &&
        options.drilldown !== void 0 &&
        point.unbindDrilldownClick) {
        point.unbindDrilldownClick = point.unbindDrilldownClick();
    }
});
var handlePointClick = function (e) {
    var point = this, series = point.series;
    if (series.xAxis &&
        series.chart.options.drilldown.allowPointDrilldown ===
            false) {
        // #5822, x changed
        series.xAxis.drilldownCategory(point.x, e);
    }
    else {
        point.doDrilldown(void 0, void 0, e);
    }
};
addEvent(Series, 'afterDrawDataLabels', function () {
    var css = this.chart.options.drilldown.activeDataLabelStyle, renderer = this.chart.renderer, styledMode = this.chart.styledMode;
    this.points.forEach(function (point) {
        var dataLabelsOptions = point.options.dataLabels, pointCSS = pick(point.dlOptions, dataLabelsOptions && dataLabelsOptions.style, {});
        if (point.drilldown && point.dataLabel) {
            if (css.color === 'contrast' && !styledMode) {
                pointCSS.color = renderer.getContrast(point.color || this.color);
            }
            if (dataLabelsOptions && dataLabelsOptions.color) {
                pointCSS.color = dataLabelsOptions.color;
            }
            point.dataLabel
                .addClass('highcharts-drilldown-data-label');
            if (!styledMode) {
                point.dataLabel
                    .css(css)
                    .css(pointCSS);
            }
        }
    }, this);
});
var applyCursorCSS = function (element, cursor, addClass, styledMode) {
    element[addClass ? 'addClass' : 'removeClass']('highcharts-drilldown-point');
    if (!styledMode) {
        element.css({ cursor: cursor });
    }
};
// Mark the trackers with a pointer
addEvent(Series, 'afterDrawTracker', function () {
    var styledMode = this.chart.styledMode;
    this.points.forEach(function (point) {
        if (point.drilldown && point.graphic) {
            applyCursorCSS(point.graphic, 'pointer', true, styledMode);
        }
    });
});
addEvent(Point, 'afterSetState', function () {
    var styledMode = this.series.chart.styledMode;
    if (this.drilldown && this.series.halo && this.state === 'hover') {
        applyCursorCSS(this.series.halo, 'pointer', true, styledMode);
    }
    else if (this.series.halo) {
        applyCursorCSS(this.series.halo, 'auto', false, styledMode);
    }
});
// After zooming out, shift the drillUpButton to the previous position, #8095.
addEvent(H.Chart, 'selection', function (event) {
    if (event.resetSelection === true && this.drillUpButton) {
        var buttonOptions = this.options.drilldown && this.options.drilldown.drillUpButton;
        if (buttonOptions && buttonOptions.position) {
            this.drillUpButton.align({
                x: buttonOptions.position.x,
                y: buttonOptions.position.y,
                align: buttonOptions.position.align
            }, false, buttonOptions.relativeTo || 'plotBox');
        }
    }
});
addEvent(H.Chart, 'drillup', function () {
    if (this.resetZoomButton) {
        this.resetZoomButton = this.resetZoomButton.destroy();
    }
});
