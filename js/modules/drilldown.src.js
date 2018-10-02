/**
 * Highcharts Drilldown module
 *
 * Author: Torstein Honsi
 * License: www.highcharts.com/license
 *
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/ColumnSeries.js';
import '../parts/Tick.js';

var animObject = H.animObject,
    noop = H.noop,
    color = H.color,
    defaultOptions = H.defaultOptions,
    each = H.each,
    extend = H.extend,
    format = H.format,
    objectEach = H.objectEach,
    pick = H.pick,
    Chart = H.Chart,
    seriesTypes = H.seriesTypes,
    PieSeries = seriesTypes.pie,
    ColumnSeries = seriesTypes.column,
    Tick = H.Tick,
    fireEvent = H.fireEvent,
    inArray = H.inArray,
    ddSeriesId = 1;

// Add language
extend(defaultOptions.lang, {
    /**
     * The text for the button that appears when drilling down, linking
     * back to the parent series. The parent series' name is inserted for
     * `{series.name}`.
     *
     * @type {String}
     * @default Back to {series.name}
     * @since 3.0.8
     * @product highcharts highmaps
     * @apioption lang.drillUpText
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
 * ](code.highcharts.com/modules/drilldown.js).
 *
 * @type {Object}
 * @optionparent drilldown
 */
defaultOptions.drilldown = {

    /**
     * When this option is false, clicking a single point will drill down
     * all points in the same category, equivalent to clicking the X axis
     * label.
     *
     * @type {Boolean}
     * @sample {highcharts} highcharts/drilldown/allowpointdrilldown-false/
     *         Don't allow point drilldown
     * @default true
     * @since 4.1.7
     * @product highcharts
     * @apioption drilldown.allowPointDrilldown
     */

    /**
     * An array of series configurations for the drill down. Each series
     * configuration uses the same syntax as the [series](#series) option
     * set. These drilldown series are hidden by default. The drilldown
     * series is linked to the parent series' point by its `id`.
     *
     * @type {Array<Object>}
     * @since 3.0.8
     * @product highcharts highmaps
     * @apioption drilldown.series
     */

    /*= if (build.classic) { =*/

    /**
     * Additional styles to apply to the X axis label for a point that
     * has drilldown data. By default it is underlined and blue to invite
     * to interaction.
     *
     * @type {CSSObject}
     * @see     In styled mode, active label styles can be set with the
     *          `.highcharts-drilldown-axis-label` class.
     * @sample  {highcharts} highcharts/drilldown/labels/ Label styles
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since 3.0.8
     * @product highcharts highmaps
     */
    activeAxisLabelStyle: {
        cursor: 'pointer',
        color: '${palette.highlightColor100}',
        fontWeight: 'bold',
        textDecoration: 'underline'
    },

    /**
     * Additional styles to apply to the data label of a point that has
     * drilldown data. By default it is underlined and blue to invite to
     * interaction.
     *
     * @type {CSSObject}
     * @see In styled mode, active data label styles can be applied with
     * the `.highcharts-drilldown-data-label` class.
     * @sample {highcharts} highcharts/drilldown/labels/ Label styles
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since 3.0.8
     * @product highcharts highmaps
     */
    activeDataLabelStyle: {
        cursor: 'pointer',
        color: '${palette.highlightColor100}',
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    /*= } =*/

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
     * <dl>
     *
     * <dt>duration</dt>
     *
     * <dd>The duration of the animation in milliseconds.</dd>
     *
     * <dt>easing</dt>
     *
     * <dd>A string reference to an easing function set on the `Math` object.
     * See [the easing demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
     * animation-easing/).</dd>
     *
     * </dl>
     *
     * @type {Boolean|AnimationOptions}
     * @since 3.0.8
     * @product highcharts highmaps
     */
    animation: {

        /**
         * Duration for the drilldown animation.
         * @default 500
         */
        duration: 500
    },

    /**
     * Options for the drill up button that appears when drilling down
     * on a series. The text for the button is defined in
     * [lang.drillUpText](#lang.drillUpText).
     *
     * @type {Object}
     * @sample {highcharts} highcharts/drilldown/drillupbutton/ Drill up button
     * @sample {highmaps} highcharts/drilldown/drillupbutton/ Drill up button
     * @since 3.0.8
     * @product highcharts highmaps
     */
    drillUpButton: {
        /**
         * What box to align the button to. Can be either `plotBox` or
         * `spacingBox`.
         *
         * @type {String}
         * @default plotBox
         * @validvalue ["plotBox", "spacingBox"]
         * @since 3.0.8
         * @product highcharts highmaps
         * @apioption drilldown.drillUpButton.relativeTo
         */

        /**
         * A collection of attributes for the button. The object takes SVG
         * attributes like `fill`, `stroke`, `stroke-width` or `r`, the border
         * radius. The theme also supports `style`, a collection of CSS
         * properties for the text. Equivalent attributes for the hover state
         * are given in `theme.states.hover`.
         *
         * @type {Object}
         * @see    In styled mode, drill-up button styles can be applied with
         *         the `.highcharts-drillup-button` class.
         * @sample {highcharts} highcharts/drilldown/drillupbutton/
         *         Button theming
         * @sample {highmaps} highcharts/drilldown/drillupbutton/
         *         Button theming
         * @since 3.0.8
         * @product highcharts highmaps
         * @apioption drilldown.drillUpButton.theme
         */

        /**
         * Positioning options for the button within the `relativeTo` box.
         * Available properties are `x`, `y`, `align` and `verticalAlign`.
         *
         * @type {Object}
         * @since 3.0.8
         * @product highcharts highmaps
         */
        position: {

            /**
             * Vertical alignment of the button.
             *
             * @type {String}
             * @default top
             * @validvalue ["top", "middle", "bottom"]
             * @product highcharts highmaps
             * @apioption drilldown.drillUpButton.position.verticalAlign
             */

            /**
             * Horizontal alignment.
             * @validvalue ["left", "center", "right"]
             * @type {String}
             */
            align: 'right',

            /**
             * The X offset of the button.
             * @type {Number}
             */
            x: -10,

            /**
             * The Y offset of the button.
             * @type {Number}
             */
            y: 10
        }
    }
};



/**
 * Fires when a drilldown point is clicked, before the new series is
 * added. This event is also utilized for async drilldown, where the
 * seriesOptions are not added by option, but rather loaded async. Note
 * that when clicking a category label to trigger multiple series drilldown,
 * one `drilldown` event is triggered per point in the category.
 *
 * Event arguments:
 *
 * <dl>
 *
 * <dt>`category`</dt>
 *
 * <dd>If a category label was clicked, which index.</dd>
 *
 * <dt>`point`</dt>
 *
 * <dd>The originating point.</dd>
 *
 * <dt>`originalEvent`</dt>
 *
 * <dd>The original browser event (usually click) that triggered the
 * drilldown.</dd>
 *
 * <dt>`points`</dt>
 *
 * <dd>If a category label was clicked, this array holds all points
 * corresponing to the category.</dd>
 *
 * <dt>`seriesOptions`</dt>
 *
 * <dd>Options for the new series</dd>
 *
 * </dl>
 *
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/drilldown/async/ Async drilldown
 * @since 3.0.8
 * @product highcharts highmaps
 * @apioption chart.events.drilldown
 */

 /**
 * Fires when drilling up from a drilldown series.
 *
 * @type {Function}
 * @context Chart
 * @since 3.0.8
 * @product highcharts highmaps
 * @apioption chart.events.drillup
 */

/**
 * In a chart with multiple drilldown series, this event fires after
 * all the series have been drilled up.
 *
 * @type {Function}
 * @context Chart
 * @since 4.2.4
 * @product highcharts highmaps
 * @apioption chart.events.drillupall
 */

/**
 * The `id` of a series in the [drilldown.series](#drilldown.series)
 * array to use for a drilldown for this point.
 *
 * @type {String}
 * @sample {highcharts} highcharts/drilldown/basic/ Basic drilldown
 * @since 3.0.8
 * @product highcharts
 * @apioption series.line.data.drilldown
 */

/**
 * A general fadeIn method
 */
H.SVGRenderer.prototype.Element.prototype.fadeIn = function (animation) {
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
 * When not async, the setup is simpler using the {@link
 * https://api.highcharts.com/highcharts/drilldown.series|drilldown.series}
 * options structure.
 *
 * @memberof Highcharts.Chart
 * @function #addSeriesAsDrilldown
 *
 * @param  {Highcharts.Point} point
 *         The point from which the drilldown will start.
 * @param  {SeriesOptions} options
 *         The series options for the new, detailed series.
 *
 * @sample highcharts/drilldown/async/ Async drilldown
 */
Chart.prototype.addSeriesAsDrilldown = function (point, options) {
    this.addSingleSeriesAsDrilldown(point, options);
    this.applyDrilldown();
};
Chart.prototype.addSingleSeriesAsDrilldown = function (point, ddOptions) {
    var oldSeries = point.series,
        xAxis = oldSeries.xAxis,
        yAxis = oldSeries.yAxis,
        newSeries,
        pointIndex,
        levelSeries = [],
        levelSeriesOptions = [],
        level,
        levelNumber,
        last,
        colorProp;


    /*= if (build.classic) { =*/
    colorProp = { color: point.color || oldSeries.color };
    /*= } else { =*/
    colorProp = { colorIndex: pick(point.colorIndex, oldSeries.colorIndex) };
    /*= } =*/

    if (!this.drilldownLevels) {
        this.drilldownLevels = [];
    }

    levelNumber = oldSeries.options._levelNumber || 0;

    // See if we can reuse the registered series from last run
    last = this.drilldownLevels[this.drilldownLevels.length - 1];
    if (last && last.levelNumber !== levelNumber) {
        last = undefined;
    }

    ddOptions = extend(extend({
        _ddSeriesId: ddSeriesId++
    }, colorProp), ddOptions);
    pointIndex = inArray(point, oldSeries.points);

    // Record options for all current series
    each(oldSeries.chart.series, function (series) {
        if (series.xAxis === xAxis && !series.isDrilling) {
            series.options._ddSeriesId =
                series.options._ddSeriesId || ddSeriesId++;
            series.options._colorIndex = series.userOptions._colorIndex;
            series.options._levelNumber =
                series.options._levelNumber || levelNumber; // #3182

            if (last) {
                levelSeries = last.levelSeries;
                levelSeriesOptions = last.levelSeriesOptions;
            } else {
                levelSeries.push(series);
                levelSeriesOptions.push(series.options);
            }
        }
    });

    // Add a record of properties for each drilldown level
    level = extend({
        levelNumber: levelNumber,
        seriesOptions: oldSeries.options,
        levelSeriesOptions: levelSeriesOptions,
        levelSeries: levelSeries,
        shapeArgs: point.shapeArgs,
        // no graphic in line series with markers disabled
        bBox: point.graphic ? point.graphic.getBBox() : {},
        color: point.isNull ? new H.Color(color).setOpacity(0).get() : color,
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
    var drilldownLevels = this.drilldownLevels,
        levelToRemove;

    if (drilldownLevels && drilldownLevels.length > 0) { // #3352, async loading
        levelToRemove = drilldownLevels[drilldownLevels.length - 1].levelNumber;
        each(this.drilldownLevels, function (level) {
            if (level.levelNumber === levelToRemove) {
                each(level.levelSeries, function (series) {
                    // Not removed, not added as part of a multi-series
                    // drilldown
                    if (
                        series.options &&
                        series.options._levelNumber === levelToRemove
                    ) {
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
};

Chart.prototype.getDrilldownBackText = function () {
    var drilldownLevels = this.drilldownLevels,
        lastLevel;
    if (drilldownLevels && drilldownLevels.length > 0) { // #3352, async loading
        lastLevel = drilldownLevels[drilldownLevels.length - 1];
        lastLevel.series = lastLevel.seriesOptions;
        return format(this.options.lang.drillUpText, lastLevel);
    }

};

Chart.prototype.showDrillUpButton = function () {
    var chart = this,
        backText = this.getDrilldownBackText(),
        buttonOptions = chart.options.drilldown.drillUpButton,
        attr,
        states;


    if (!this.drillUpButton) {
        attr = buttonOptions.theme;
        states = attr && attr.states;

        this.drillUpButton = this.renderer.button(
            backText,
            null,
            null,
            function () {
                chart.drillUp();
            },
            attr,
            states && states.hover,
            states && states.select
        )
        .addClass('highcharts-drillup-button')
        .attr({
            align: buttonOptions.position.align,
            zIndex: 7
        })
        .add()
        .align(
            buttonOptions.position,
            false,
            buttonOptions.relativeTo || 'plotBox'
        );
    } else {
        this.drillUpButton.attr({
            text: backText
        })
        .align();
    }
};

/**
 * When the chart is drilled down to a child series, calling `chart.drillUp()`
 * will drill up to the parent series. Requires the drilldown module.
 *
 * @function drillUp
 * @memberof Highcharts.Chart
 */
Chart.prototype.drillUp = function () {
    if (!this.drilldownLevels || this.drilldownLevels.length === 0) {
        return;
    }

    var chart = this,
        drilldownLevels = chart.drilldownLevels,
        levelNumber = drilldownLevels[drilldownLevels.length - 1].levelNumber,
        i = drilldownLevels.length,
        chartSeries = chart.series,
        seriesI,
        level,
        oldSeries,
        newSeries,
        oldExtremes,
        addSeries = function (seriesOptions) {
            var addedSeries;
            each(chartSeries, function (series) {
                if (series.options._ddSeriesId === seriesOptions._ddSeriesId) {
                    addedSeries = series;
                }
            });

            addedSeries = addedSeries || chart.addSeries(seriesOptions, false);
            if (
                addedSeries.type === oldSeries.type &&
                addedSeries.animateDrillupTo
            ) {
                addedSeries.animate = addedSeries.animateDrillupTo;
            }
            if (seriesOptions === level.seriesOptions) {
                newSeries = addedSeries;
            }
        };

    while (i--) {

        level = drilldownLevels[i];
        if (level.levelNumber === levelNumber) {
            drilldownLevels.pop();

            // Get the lower series by reference or id
            oldSeries = level.lowerSeries;
            if (!oldSeries.chart) {  // #2786
                seriesI = chartSeries.length; // #2919
                while (seriesI--) {
                    if (
                        chartSeries[seriesI].options.id ===
                            level.lowerSeriesOptions.id &&
                        chartSeries[seriesI].options._levelNumber ===
                            levelNumber + 1
                    ) { // #3867
                        oldSeries = chartSeries[seriesI];
                        break;
                    }
                }
            }
            oldSeries.xData = []; // Overcome problems with minRange (#2898)

            each(level.levelSeriesOptions, addSeries);

            fireEvent(chart, 'drillup', { seriesOptions: level.seriesOptions });

            if (newSeries.type === oldSeries.type) {
                newSeries.drilldownLevel = level;
                newSeries.options.animation = chart.options.drilldown.animation;

                if (oldSeries.animateDrillupFrom && oldSeries.chart) { // #2919
                    oldSeries.animateDrillupFrom(level);
                }
            }
            newSeries.options._levelNumber = levelNumber;

            oldSeries.remove(false);

            // Reset the zoom level of the upper series
            if (newSeries.xAxis) {
                oldExtremes = level.oldExtremes;
                newSeries.xAxis.setExtremes(
                    oldExtremes.xMin,
                    oldExtremes.xMax,
                    false
                );
                newSeries.yAxis.setExtremes(
                    oldExtremes.yMin,
                    oldExtremes.yMax,
                    false
                );
            }

            // We have a resetZoomButton tucked away for this level. Attatch
            // it to the chart and show it.
            if (level.resetZoomButton) {
                chart.resetZoomButton = level.resetZoomButton;
                chart.resetZoomButton.show();
            }
        }
    }

    // Fire a once-off event after all series have been drilled up (#5158)
    fireEvent(chart, 'drillupall');

    this.redraw();

    if (this.drilldownLevels.length === 0) {
        this.drillUpButton = this.drillUpButton.destroy();
    } else {
        this.drillUpButton.attr({
            text: this.getDrilldownBackText()
        })
        .align();
    }

    this.ddDupes.length = []; // #3315
};

// Add update function to be called internally from Chart.update (#7600)
Chart.prototype.callbacks.push(function () {
    var chart = this;
    chart.drilldown = {
        update: function (options, redraw) {
            H.merge(true, chart.options.drilldown, options);
            if (pick(redraw, true)) {
                chart.redraw();
            }
        }
    };
});

// Don't show the reset button if we already are displaying the drillUp button.
H.addEvent(Chart, 'beforeShowResetZoom', function () {
    if (this.drillUpButton) {
        return false;
    }
});
H.addEvent(Chart, 'render', function setDDPoints() {
    each(this.xAxis || [], function (axis) {
        axis.ddPoints = {};
        each(axis.series, function (series) {
            var i,
                xData = series.xData || [],
                points = series.points,
                p;

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
 * moved into place
 */
ColumnSeries.prototype.animateDrillupTo = function (init) {
    if (!init) {
        var newSeries = this,
            level = newSeries.drilldownLevel;

        // First hide all items before animating in again
        each(this.points, function (point) {
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
        H.syncTimeout(function () {
            if (newSeries.points) { // May be destroyed in the meantime, #3389
                each(newSeries.points, function (point, i) {
                    // Fade in other points
                    var verb =
                        i === (level && level.pointIndex) ? 'show' : 'fadeIn',
                        inherit = verb === 'show' ? true : undefined,
                        dataLabel = point.dataLabel;


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

        // Reset
        this.animate = noop;
    }

};

ColumnSeries.prototype.animateDrilldown = function (init) {
    var series = this,
        drilldownLevels = this.chart.drilldownLevels,
        animateFrom,
        animationOptions = animObject(this.chart.options.drilldown.animation),
        xAxis = this.xAxis;

    if (!init) {
        each(drilldownLevels, function (level) {
            if (
                series.options._ddSeriesId ===
                    level.lowerSeriesOptions._ddSeriesId
            ) {
                animateFrom = level.shapeArgs;
                /*= if (build.classic) { =*/
                // Add the point colors to animate from
                animateFrom.fill = level.color;
                /*= } =*/
            }
        });

        animateFrom.x += (pick(xAxis.oldPos, xAxis.pos) - xAxis.pos);

        each(this.points, function (point) {
            var animateTo = point.shapeArgs;

            /*= if (build.classic) { =*/
            // Add the point colors to animate to
            animateTo.fill = point.color;
            /*= } =*/

            if (point.graphic) {
                point.graphic
                    .attr(animateFrom)
                    .animate(
                        extend(
                            point.shapeArgs,
                            { fill: point.color || series.color }
                        ),
                        animationOptions
                    );
            }
            if (point.dataLabel) {
                point.dataLabel.fadeIn(animationOptions);
            }
        });
        this.animate = null;
    }

};

/**
 * When drilling up, pull out the individual point graphics from the lower
 * series and animate them into the origin point in the upper series.
 */
ColumnSeries.prototype.animateDrillupFrom = function (level) {
    var animationOptions = animObject(this.chart.options.drilldown.animation),
        group = this.group,
        // For 3d column series all columns are added to one group
        // so we should not delete the whole group. #5297
        removeGroup = group !== this.chart.columnGroup,
        series = this;

    // Cancel mouse events on the series group (#2787)
    each(series.trackerGroups, function (key) {
        if (series[key]) { // we don't always have dataLabelsGroup
            series[key].on('mouseover');
        }
    });

    if (removeGroup) {
        delete this.group;
    }

    each(this.points, function (point) {
        var graphic = point.graphic,
            animateTo = level.shapeArgs,
            complete = function () {
                graphic.destroy();
                if (group && removeGroup) {
                    group = group.destroy();
                }
            };

        if (graphic) {

            delete point.graphic;

            /*= if (build.classic) { =*/
            animateTo.fill = level.color;
            /*= } =*/

            if (animationOptions.duration) {
                graphic.animate(
                    animateTo,
                    H.merge(animationOptions, { complete: complete })
                );
            } else {
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
            var level = this.chart.drilldownLevels[
                    this.chart.drilldownLevels.length - 1
                ],
                animationOptions = this.chart.options.drilldown.animation,
                animateFrom = level.shapeArgs,
                start = animateFrom.start,
                angle = animateFrom.end - start,
                startAngle = angle / this.points.length;

            if (!init) {
                each(this.points, function (point, i) {
                    var animateTo = point.shapeArgs;

                    /*= if (build.classic) { =*/
                    animateFrom.fill = level.color;
                    animateTo.fill = point.color;
                    /*= } =*/

                    if (point.graphic) {
                        point.graphic
                            .attr(H.merge(animateFrom, {
                                start: start + i * startAngle,
                                end: start + (i + 1) * startAngle
                            }))[animationOptions ? 'animate' : 'attr'](
                                animateTo,
                                animationOptions
                            );
                    }
                });
                this.animate = null;
            }
        }
    });
}

H.Point.prototype.doDrilldown = function (
    _holdRedraw,
    category,
    originalEvent
) {
    var series = this.series,
        chart = series.chart,
        drilldown = chart.options.drilldown,
        i = (drilldown.series || []).length,
        seriesOptions;

    if (!chart.ddDupes) {
        chart.ddDupes = [];
    }

    while (i-- && !seriesOptions) {
        if (
            drilldown.series[i].id === this.drilldown &&
            inArray(this.drilldown, chart.ddDupes) === -1
        ) {
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
        points: (
            category !== undefined &&
            this.series.xAxis.getDDPoints(category).slice(0)
        )
    }, function (e) {
        var chart = e.point.series && e.point.series.chart,
            seriesOptions = e.seriesOptions;
        if (chart && seriesOptions) {
            if (_holdRedraw) {
                chart.addSingleSeriesAsDrilldown(e.point, seriesOptions);
            } else {
                chart.addSeriesAsDrilldown(e.point, seriesOptions);
            }
        }
    });


};

/**
 * Drill down to a given category. This is the same as clicking on an axis
 * label.
 */
H.Axis.prototype.drilldownCategory = function (x, e) {
    objectEach(this.getDDPoints(x), function (point) {
        if (
            point &&
            point.series &&
            point.series.visible &&
            point.doDrilldown
        ) { // #3197
            point.doDrilldown(true, x, e);
        }
    });
    this.chart.applyDrilldown();
};

/**
 * Return drillable points for this specific X value
 */
H.Axis.prototype.getDDPoints = function (x) {
    return this.ddPoints && this.ddPoints[x];
};


/**
 * Make a tick label drillable, or remove drilling on update
 */
Tick.prototype.drillable = function () {
    var pos = this.pos,
        label = this.label,
        axis = this.axis,
        isDrillable = axis.coll === 'xAxis' && axis.getDDPoints,
        ddPointsX = isDrillable && axis.getDDPoints(pos);

    if (isDrillable) {
        if (label && ddPointsX && ddPointsX.length) {
            label.drillable = true;

            /*= if (build.classic) { =*/
            if (!label.basicStyles) {
                label.basicStyles = H.merge(label.styles);
            }
            /*= } =*/

            label
                .addClass('highcharts-drilldown-axis-label')
                /*= if (build.classic) { =*/
                .css(axis.chart.options.drilldown.activeAxisLabelStyle)
                /*= } =*/
                .on('click', function (e) {
                    axis.drilldownCategory(pos, e);
                });

        } else if (label && label.drillable) {

            /*= if (build.classic) { =*/
            label.styles = {}; // reset for full overwrite of styles
            label.css(label.basicStyles);
            /*= } =*/

            label.on('click', null); // #3806
            label.removeClass('highcharts-drilldown-axis-label');
        }
    }
};


/**
 * On initialization of each point, identify its label and make it clickable.
 * Also, provide a list of points associated to that label.
 */
H.addEvent(H.Point, 'afterInit', function () {
    var point = this,
        series = point.series;

    if (point.drilldown) {

        // Add the click event to the point
        H.addEvent(point, 'click', function (e) {
            if (
                series.xAxis &&
                series.chart.options.drilldown.allowPointDrilldown === false
            ) {
                series.xAxis.drilldownCategory(point.x, e); // #5822, x changed
            } else {
                point.doDrilldown(undefined, undefined, e);
            }
        });

    }

    return point;
});

H.addEvent(H.Series, 'afterDrawDataLabels', function () {
    var css = this.chart.options.drilldown.activeDataLabelStyle,
        renderer = this.chart.renderer;

    each(this.points, function (point) {
        var dataLabelsOptions = point.options.dataLabels,
            pointCSS = pick(
                point.dlOptions,
                dataLabelsOptions && dataLabelsOptions.style,
                {}
            );

        if (point.drilldown && point.dataLabel) {
            /*= if (build.classic) { =*/
            if (css.color === 'contrast') {
                pointCSS.color = renderer.getContrast(
                    point.color || this.color
                );
            }
            /*= } =*/
            if (dataLabelsOptions && dataLabelsOptions.color) {
                pointCSS.color = dataLabelsOptions.color;
            }
            point.dataLabel
                .addClass('highcharts-drilldown-data-label');

            /*= if (build.classic) { =*/
            point.dataLabel
                .css(css)
                .css(pointCSS);
            /*= } =*/
        }
    }, this);
});


var applyCursorCSS = function (element, cursor, addClass) {
    element[addClass ? 'addClass' : 'removeClass'](
        'highcharts-drilldown-point'
    );

    /*= if (build.classic) { =*/
    element.css({ cursor: cursor });
    /*= } =*/
};

// Mark the trackers with a pointer
H.addEvent(H.Series, 'afterDrawTracker', function () {
    each(this.points, function (point) {
        if (point.drilldown && point.graphic) {
            applyCursorCSS(point.graphic, 'pointer', true);
        }
    });
});


H.addEvent(H.Point, 'afterSetState', function () {
    if (this.drilldown && this.series.halo && this.state === 'hover') {
        applyCursorCSS(this.series.halo, 'pointer', true);
    } else if (this.series.halo) {
        applyCursorCSS(this.series.halo, 'auto', false);
    }
});
