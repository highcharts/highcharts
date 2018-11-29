/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from './Globals.js';
import './Utilities.js';
import './Axis.js';
import './Chart.js';
import './Point.js';
import './Series.js';

var addEvent = H.addEvent,
    animate = H.animate,
    Axis = H.Axis,
    Chart = H.Chart,
    createElement = H.createElement,
    css = H.css,
    defined = H.defined,
    erase = H.erase,
    extend = H.extend,
    fireEvent = H.fireEvent,
    isNumber = H.isNumber,
    isObject = H.isObject,
    isArray = H.isArray,
    merge = H.merge,
    objectEach = H.objectEach,
    pick = H.pick,
    Point = H.Point,
    Series = H.Series,
    seriesTypes = H.seriesTypes,
    setAnimation = H.setAnimation,
    splat = H.splat;

// Remove settings that have not changed, to avoid unnecessary rendering or
// computing (#9197)
H.cleanRecursively = function (newer, older) {
    var total = 0,
        removed = 0;
    objectEach(newer, function (val, key) {
        if (isObject(newer[key], true) && older[key]) {
            if (H.cleanRecursively(newer[key], older[key])) {
                delete newer[key];
            }
        } else if (
            !isObject(newer[key]) &&
            newer[key] === older[key]
        ) {
            delete newer[key];
            removed++;
        }
        total++;
    });

    // Return true if all sub nodes are removed
    return total === removed;
};

// Extend the Chart prototype for dynamic methods
extend(Chart.prototype, /** @lends Highcharts.Chart.prototype */ {

    /**
     * Add a series to the chart after render time. Note that this method should
     * never be used when adding data synchronously at chart render time, as it
     * adds expense to the calculations and rendering. When adding data at the
     * same time as the chart is initialized, add the series as a configuration
     * option instead. With multiple axes, the `offset` is dynamically adjusted.
     *
     * @sample highcharts/members/chart-addseries/
     *         Add a series from a button
     * @sample stock/members/chart-addseries/
     *         Add a series in Highstock
     *
     * @function Highcharts.Chart#addSeries
     *
     * @param {Highcharts.SeriesOptions} options
     *        The config options for the series.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @return {Highcharts.Series}
     *         The newly created series object.
     *
     * @fires Highcharts.Chart#event:addSeries
     * @fires Highcharts.Chart#event:afterAddSeries
     */
    addSeries: function (options, redraw, animation) {
        var series,
            chart = this;

        if (options) {
            redraw = pick(redraw, true); // defaults to true

            fireEvent(chart, 'addSeries', { options: options }, function () {
                series = chart.initSeries(options);

                chart.isDirtyLegend = true;
                chart.linkSeries();

                fireEvent(chart, 'afterAddSeries');

                if (redraw) {
                    chart.redraw(animation);
                }
            });
        }

        return series;
    },

    /**
     * Add an axis to the chart after render time. Note that this method should
     * never be used when adding data synchronously at chart render time, as it
     * adds expense to the calculations and rendering. When adding data at the
     * same time as the chart is initialized, add the axis as a configuration
     * option instead.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Chart#addAxis
     *
     * @param {Highcharts.XAxisOptions|Highcharts.YAxisOptions|Highcharts.ZAxisOptions} options
     *        The axis options.
     *
     * @param {boolean} [isX=false]
     *        Whether it is an X axis or a value axis.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=true]
     *        Whether and how to apply animation in the redraw.
     *
     * @return {Highcharts.Axis}
     *         The newly generated Axis object.
     */
    addAxis: function (options, isX, redraw, animation) {
        var key = isX ? 'xAxis' : 'yAxis',
            chartOptions = this.options,
            userOptions = merge(options, {
                index: this[key].length,
                isX: isX
            }),
            axis;

        axis = new Axis(this, userOptions);

        // Push the new axis options to the chart options
        chartOptions[key] = splat(chartOptions[key] || {});
        chartOptions[key].push(userOptions);

        if (pick(redraw, true)) {
            this.redraw(animation);
        }

        return axis;
    },

    /**
     * Dim the chart and show a loading text or symbol. Options for the loading
     * screen are defined in {@link
     * https://api.highcharts.com/highcharts/loading|the loading options}.
     *
     * @sample highcharts/members/chart-hideloading/
     *         Show and hide loading from a button
     * @sample highcharts/members/chart-showloading/
     *         Apply different text labels
     * @sample stock/members/chart-show-hide-loading/
     *         Toggle loading in Highstock
     *
     * @function Highcharts.Chart#showLoading
     *
     * @param {string} str
     *        An optional text to show in the loading label instead of the
     *        default one. The default text is set in
     *        [lang.loading](http://api.highcharts.com/highcharts/lang.loading).
     */
    showLoading: function (str) {
        var chart = this,
            options = chart.options,
            loadingDiv = chart.loadingDiv,
            loadingOptions = options.loading,
            setLoadingSize = function () {
                if (loadingDiv) {
                    css(loadingDiv, {
                        left: chart.plotLeft + 'px',
                        top: chart.plotTop + 'px',
                        width: chart.plotWidth + 'px',
                        height: chart.plotHeight + 'px'
                    });
                }
            };

        // create the layer at the first call
        if (!loadingDiv) {
            chart.loadingDiv = loadingDiv = createElement('div', {
                className: 'highcharts-loading highcharts-loading-hidden'
            }, null, chart.container);

            chart.loadingSpan = createElement(
                'span',
                { className: 'highcharts-loading-inner' },
                null,
                loadingDiv
            );
            addEvent(chart, 'redraw', setLoadingSize); // #1080
        }

        loadingDiv.className = 'highcharts-loading';

        // Update text
        chart.loadingSpan.innerHTML = str || options.lang.loading;

        if (!chart.styledMode) {
            // Update visuals
            css(loadingDiv, extend(loadingOptions.style, {
                zIndex: 10
            }));
            css(chart.loadingSpan, loadingOptions.labelStyle);

            // Show it
            if (!chart.loadingShown) {
                css(loadingDiv, {
                    opacity: 0,
                    display: ''
                });
                animate(loadingDiv, {
                    opacity: loadingOptions.style.opacity || 0.5
                }, {
                    duration: loadingOptions.showDuration || 0
                });
            }
        }

        chart.loadingShown = true;
        setLoadingSize();
    },

    /**
     * Hide the loading layer.
     *
     * @see Highcharts.Chart#showLoading
     *
     * @sample highcharts/members/chart-hideloading/
     *         Show and hide loading from a button
     * @sample stock/members/chart-show-hide-loading/
     *         Toggle loading in Highstock
     *
     * @function Highcharts.Chart#hideLoading
     */
    hideLoading: function () {

        var options = this.options,
            loadingDiv = this.loadingDiv;

        if (loadingDiv) {
            loadingDiv.className =
                'highcharts-loading highcharts-loading-hidden';

            if (!this.styledMode) {
                animate(loadingDiv, {
                    opacity: 0
                }, {
                    duration: options.loading.hideDuration || 100,
                    complete: function () {
                        css(loadingDiv, { display: 'none' });
                    }
                });
            }
        }

        this.loadingShown = false;
    },

    /**
     * These properties cause isDirtyBox to be set to true when updating. Can be
     * extended from plugins.
     */
    propsRequireDirtyBox: [
        'backgroundColor',
        'borderColor',
        'borderWidth',
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'spacing',
        'spacingTop',
        'spacingRight',
        'spacingBottom',
        'spacingLeft',
        'borderRadius',
        'plotBackgroundColor',
        'plotBackgroundImage',
        'plotBorderColor',
        'plotBorderWidth',
        'plotShadow',
        'shadow'
    ],

    /**
     * These properties cause all series to be updated when updating. Can be
     * extended from plugins.
     */
    propsRequireUpdateSeries: [
        'chart.inverted',
        'chart.polar',
        'chart.ignoreHiddenSeries',
        'chart.type',
        'colors',
        'plotOptions',
        'time',
        'tooltip'
    ],

    /**
     * These collections (arrays) implement update() methods with support for
     * one-to-one option.
     */
    collectionsWithUpdate: [
        'xAxis',
        'yAxis',
        'zAxis',
        'series',
        'colorAxis',
        'pane'
    ],

    /**
     * A generic function to update any element of the chart. Elements can be
     * enabled and disabled, moved, re-styled, re-formatted etc.
     *
     * A special case is configuration objects that take arrays, for example
     * [xAxis](https://api.highcharts.com/highcharts/xAxis),
     * [yAxis](https://api.highcharts.com/highcharts/yAxis) or
     * [series](https://api.highcharts.com/highcharts/series). For these
     * collections, an `id` option is used to map the new option set to an
     * existing object. If an existing object of the same id is not found, the
     * corresponding item is updated. So for example, running `chart.update`
     * with a series item without an id, will cause the existing chart's series
     * with the same index in the series array to be updated. When the
     * `oneToOne` parameter is true, `chart.update` will also take care of
     * adding and removing items from the collection. Read more under the
     * parameter description below.
     *
     * See also the
     * [responsive option set](https://api.highcharts.com/highcharts/responsive).
     * Switching between `responsive.rules` basically runs `chart.update` under
     * the hood.
     *
     * @sample highcharts/members/chart-update/
     *         Update chart geometry
     *
     * @function Highcharts.Chart#update
     *
     * @param {Highcharts.Options} options
     *        A configuration object for the new chart options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart.
     *
     * @param {boolean} [oneToOne=false]
     *        When `true`, the `series`, `xAxis` and `yAxis` collections will
     *        be updated one to one, and items will be either added or removed
     *        to match the new updated options. For example, if the chart has
     *        two series and we call `chart.update` with a configuration
     *        containing three series, one will be added. If we call
     *        `chart.update` with one series, one will be removed. Setting an
     *        empty `series` array will remove all series, but leaving out the
     *        `series` property will leave all series untouched. If the series
     *        have id's, the new series options will be matched by id, and the
     *        remaining ones removed.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @fires Highcharts.Chart#event:update
     * @fires Highcharts.Chart#event:afterUpdate
     */
    update: function (options, redraw, oneToOne, animation) {
        var chart = this,
            adders = {
                credits: 'addCredits',
                title: 'setTitle',
                subtitle: 'setSubtitle'
            },
            optionsChart,
            updateAllAxes,
            updateAllSeries,
            newWidth,
            newHeight,
            itemsForRemoval = [];

        fireEvent(chart, 'update', { options: options });

        H.cleanRecursively(options, chart.options);

        // If the top-level chart option is present, some special updates are
        // required
        optionsChart = options.chart;
        if (optionsChart) {

            merge(true, chart.options.chart, optionsChart);

            // Setter function
            if ('className' in optionsChart) {
                chart.setClassName(optionsChart.className);
            }

            if ('reflow' in optionsChart) {
                chart.setReflow(optionsChart.reflow);
            }

            if (
                'inverted' in optionsChart ||
                'polar' in optionsChart ||
                'type' in optionsChart
            ) {
                // Parse options.chart.inverted and options.chart.polar together
                // with the available series.
                chart.propFromSeries();
                updateAllAxes = true;
            }

            if ('alignTicks' in optionsChart) { // #6452
                updateAllAxes = true;
            }

            objectEach(optionsChart, function (val, key) {
                if (
                    chart.propsRequireUpdateSeries.indexOf('chart.' + key) !==
                    -1
                ) {
                    updateAllSeries = true;
                }
                // Only dirty box
                if (chart.propsRequireDirtyBox.indexOf(key) !== -1) {
                    chart.isDirtyBox = true;
                }
            });

            if (!chart.styledMode && 'style' in optionsChart) {
                chart.renderer.setStyle(optionsChart.style);
            }
        }

        // Moved up, because tooltip needs updated plotOptions (#6218)
        if (!chart.styledMode && options.colors) {
            this.options.colors = options.colors;
        }

        if (options.plotOptions) {
            merge(true, this.options.plotOptions, options.plotOptions);
        }

        // Some option stuctures correspond one-to-one to chart objects that
        // have update methods, for example
        // options.credits => chart.credits
        // options.legend => chart.legend
        // options.title => chart.title
        // options.tooltip => chart.tooltip
        // options.subtitle => chart.subtitle
        // options.mapNavigation => chart.mapNavigation
        // options.navigator => chart.navigator
        // options.scrollbar => chart.scrollbar
        objectEach(options, function (val, key) {
            if (chart[key] && typeof chart[key].update === 'function') {
                chart[key].update(val, false);

            // If a one-to-one object does not exist, look for an adder function
            } else if (typeof chart[adders[key]] === 'function') {
                chart[adders[key]](val);
            }

            if (
                key !== 'chart' &&
                chart.propsRequireUpdateSeries.indexOf(key) !== -1
            ) {
                updateAllSeries = true;
            }
        });

        // Setters for collections. For axes and series, each item is referred
        // by an id. If the id is not found, it defaults to the corresponding
        // item in the collection, so setting one series without an id, will
        // update the first series in the chart. Setting two series without
        // an id will update the first and the second respectively (#6019)
        // chart.update and responsive.
        this.collectionsWithUpdate.forEach(function (coll) {
            var indexMap;

            if (options[coll]) {

                // In stock charts, the navigator series are also part of the
                // chart.series array, but those series should not be handled
                // here (#8196).
                if (coll === 'series') {
                    indexMap = [];
                    chart[coll].forEach(function (s, i) {
                        if (!s.options.isInternal) {
                            indexMap.push(pick(s.options.index, i));
                        }
                    });
                }


                splat(options[coll]).forEach(function (newOptions, i) {
                    var item = (
                        defined(newOptions.id) &&
                        chart.get(newOptions.id)
                    ) || chart[coll][indexMap ? indexMap[i] : i];
                    if (item && item.coll === coll) {
                        item.update(newOptions, false);

                        if (oneToOne) {
                            item.touched = true;
                        }
                    }

                    // If oneToOne and no matching item is found, add one
                    if (!item && oneToOne) {
                        if (coll === 'series') {
                            chart.addSeries(newOptions, false)
                                .touched = true;
                        } else if (coll === 'xAxis' || coll === 'yAxis') {
                            chart.addAxis(newOptions, coll === 'xAxis', false)
                                .touched = true;
                        }
                    }

                });

                // Add items for removal
                if (oneToOne) {
                    chart[coll].forEach(function (item) {
                        if (!item.touched && !item.options.isInternal) {
                            itemsForRemoval.push(item);
                        } else {
                            delete item.touched;
                        }
                    });
                }


            }
        });

        itemsForRemoval.forEach(function (item) {
            if (item.remove) {
                item.remove(false);
            }
        });

        if (updateAllAxes) {
            chart.axes.forEach(function (axis) {
                axis.update({}, false);
            });
        }

        // Certain options require the whole series structure to be thrown away
        // and rebuilt
        if (updateAllSeries) {
            chart.series.forEach(function (series) {
                series.update({}, false);
            });
        }

        // For loading, just update the options, do not redraw
        if (options.loading) {
            merge(true, chart.options.loading, options.loading);
        }

        // Update size. Redraw is forced.
        newWidth = optionsChart && optionsChart.width;
        newHeight = optionsChart && optionsChart.height;
        if ((isNumber(newWidth) && newWidth !== chart.chartWidth) ||
                (isNumber(newHeight) && newHeight !== chart.chartHeight)) {
            chart.setSize(newWidth, newHeight, animation);
        } else if (pick(redraw, true)) {
            chart.redraw(animation);
        }

        fireEvent(chart, 'afterUpdate', { options: options });

    },

    /**
     * Shortcut to set the subtitle options. This can also be done from {@link
     * Chart#update} or {@link Chart#setTitle}.
     *
     * @function Highcharts.Chart#setSubtitle
     *
     * @param {Highcharts.SubtitleOptions} options
     *        New subtitle options. The subtitle text itself is set by the
     *        `options.text` property.
     */
    setSubtitle: function (options) {
        this.setTitle(undefined, options);
    }


});

// extend the Point prototype for dynamic methods
extend(Point.prototype, /** @lends Highcharts.Point.prototype */ {
    /**
     * Update point with new options (typically x/y data) and optionally redraw
     * the series.
     *
     * @sample highcharts/members/point-update-column/
     *         Update column value
     * @sample highcharts/members/point-update-pie/
     *         Update pie slice
     * @sample maps/members/point-update/
     *         Update map area value in Highmaps
     *
     * @function Highcharts.Point#update
     *
     * @param {number|object|Array<number|string>|null} options
     *        The point options. Point options are handled as described under
     *        the `series.type.data` item for each series type. For example
     *        for a line series, if options is a single number, the point will
     *        be given that number as the marin y value. If it is an array, it
     *        will be interpreted as x and y values respectively. If it is an
     *        object, advanced options are applied.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is updated. If doing
     *        more operations on the chart, it is best practice to set
     *        `redraw` to false and call `chart.redraw()` after.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @fires Highcharts.Point#event:update
     */
    update: function (options, redraw, animation, runEvent) {
        var point = this,
            series = point.series,
            graphic = point.graphic,
            i,
            chart = series.chart,
            seriesOptions = series.options;

        redraw = pick(redraw, true);

        function update() {

            point.applyOptions(options);

            // Update visuals
            if (point.y === null && graphic) { // #4146
                point.graphic = graphic.destroy();
            }
            if (isObject(options, true)) {
                // Destroy so we can get new elements
                if (graphic && graphic.element) {
                    // "null" is also a valid symbol
                    if (
                        options &&
                        options.marker &&
                        options.marker.symbol !== undefined
                    ) {
                        point.graphic = graphic.destroy();
                    }
                }
                if (options && options.dataLabels && point.dataLabel) { // #2468
                    point.dataLabel = point.dataLabel.destroy();
                }
                if (point.connector) {
                    point.connector = point.connector.destroy(); // #7243
                }
            }

            // record changes in the parallel arrays
            i = point.index;
            series.updateParallelArrays(point, i);

            // Record the options to options.data. If the old or the new config
            // is an object, use point options, otherwise use raw options
            // (#4701, #4916).
            seriesOptions.data[i] = (
                    isObject(seriesOptions.data[i], true) ||
                    isObject(options, true)
                ) ?
                point.options :
                pick(options, seriesOptions.data[i]);

            // redraw
            series.isDirty = series.isDirtyData = true;
            if (!series.fixedBox && series.hasCartesianSeries) { // #1906, #2320
                chart.isDirtyBox = true;
            }

            if (seriesOptions.legendType === 'point') { // #1831, #1885
                chart.isDirtyLegend = true;
            }
            if (redraw) {
                chart.redraw(animation);
            }
        }

        // Fire the event with a default handler of doing the update
        if (runEvent === false) { // When called from setData
            update();
        } else {
            point.firePointEvent('update', { options: options }, update);
        }
    },

    /**
     * Remove a point and optionally redraw the series and if necessary the axes
     *
     * @sample highcharts/plotoptions/series-point-events-remove/
     *         Remove point and confirm
     * @sample highcharts/members/point-remove/
     *         Remove pie slice
     * @sample maps/members/point-remove/
     *         Remove selected points in Highmaps
     *
     * @function Highcharts.Point#remove
     *
     * @param {boolean} redraw
     *        Whether to redraw the chart or wait for an explicit call. When
     *        doing more operations on the chart, for example running
     *        `point.remove()` in a loop, it is best practice to set `redraw`
     *        to false and call `chart.redraw()` after.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=false]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     */
    remove: function (redraw, animation) {
        this.series.removePoint(
            this.series.data.indexOf(this),
            redraw,
            animation
        );
    }
});

// Extend the series prototype for dynamic methods
extend(Series.prototype, /** @lends Series.prototype */ {
    /**
     * Add a point to the series after render time. The point can be added at
     * the end, or by giving it an X value, to the start or in the middle of the
     * series.
     *
     * @sample highcharts/members/series-addpoint-append/
     *         Append point
     * @sample highcharts/members/series-addpoint-append-and-shift/
     *         Append and shift
     * @sample highcharts/members/series-addpoint-x-and-y/
     *         Both X and Y values given
     * @sample highcharts/members/series-addpoint-pie/
     *         Append pie slice
     * @sample stock/members/series-addpoint/
     *         Append 100 points in Highstock
     * @sample stock/members/series-addpoint-shift/
     *         Append and shift in Highstock
     * @sample maps/members/series-addpoint/
     *         Add a point in Highmaps
     *
     * @function Highcharts.Series#addPoint
     *
     * @param {number|object|Array<number|string>|null} options
     *        The point options. If options is a single number, a point with
     *        that y value is appended to the series. If it is an array, it will
     *        be interpreted as x and y values respectively. If it is an
     *        object, advanced options as outlined under `series.data` are
     *        applied.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is added. When adding
     *        more than one point, it is highly recommended that the redraw
     *        option be set to false, and instead {@link Chart#redraw} is
     *        explicitly called after the adding of points is finished.
     *        Otherwise, the chart will redraw after adding each point.
     *
     * @param {boolean} [shift=false]
     *        If true, a point is shifted off the start of the series as one is
     *        appended to the end.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     */
    addPoint: function (options, redraw, shift, animation) {
        var series = this,
            seriesOptions = series.options,
            data = series.data,
            chart = series.chart,
            xAxis = series.xAxis,
            names = xAxis && xAxis.hasNames && xAxis.names,
            dataOptions = seriesOptions.data,
            point,
            isInTheMiddle,
            xData = series.xData,
            i,
            x;

        // Optional redraw, defaults to true
        redraw = pick(redraw, true);

        // Get options and push the point to xData, yData and series.options. In
        // series.generatePoints the Point instance will be created on demand
        // and pushed to the series.data array.
        point = { series: series };
        series.pointClass.prototype.applyOptions.apply(point, [options]);
        x = point.x;

        // Get the insertion point
        i = xData.length;
        if (series.requireSorting && x < xData[i - 1]) {
            isInTheMiddle = true;
            while (i && xData[i - 1] > x) {
                i--;
            }
        }

        // Insert undefined item
        series.updateParallelArrays(point, 'splice', i, 0, 0);
        // Update it
        series.updateParallelArrays(point, i);

        if (names && point.name) {
            names[x] = point.name;
        }
        dataOptions.splice(i, 0, options);

        if (isInTheMiddle) {
            series.data.splice(i, 0, null);
            series.processData();
        }

        // Generate points to be added to the legend (#1329)
        if (seriesOptions.legendType === 'point') {
            series.generatePoints();
        }

        // Shift the first point off the parallel arrays
        if (shift) {
            if (data[0] && data[0].remove) {
                data[0].remove(false);
            } else {
                data.shift();
                series.updateParallelArrays(point, 'shift');

                dataOptions.shift();
            }
        }

        // redraw
        series.isDirty = true;
        series.isDirtyData = true;

        if (redraw) {
            chart.redraw(animation); // Animation is set anyway on redraw, #5665
        }
    },

    /**
     * Remove a point from the series. Unlike the
     * {@link Highcharts.Point#remove} method, this can also be done on a point
     * that is not instanciated because it is outside the view or subject to
     * Highstock data grouping.
     *
     * @sample highcharts/members/series-removepoint/
     *         Remove cropped point
     *
     * @function Highcharts.Series#removePoint
     *
     * @param {number} i
     *        The index of the point in the {@link Highcharts.Series.data|data}
     *        array.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is added. When
     *        removing more than one point, it is highly recommended that the
     *        `redraw` option be set to `false`, and instead {@link
     *        Highcharts.Chart#redraw} is explicitly called after the adding of
     *        points is finished.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
     *        Whether and optionally how the series should be animated.
     *
     * @fires Highcharts.Point#event:remove
     */
    removePoint: function (i, redraw, animation) {

        var series = this,
            data = series.data,
            point = data[i],
            points = series.points,
            chart = series.chart,
            remove = function () {

                if (points && points.length === data.length) { // #4935
                    points.splice(i, 1);
                }
                data.splice(i, 1);
                series.options.data.splice(i, 1);
                series.updateParallelArrays(
                    point || { series: series },
                    'splice',
                    i,
                    1
                );

                if (point) {
                    point.destroy();
                }

                // redraw
                series.isDirty = true;
                series.isDirtyData = true;
                if (redraw) {
                    chart.redraw();
                }
            };

        setAnimation(animation, chart);
        redraw = pick(redraw, true);

        // Fire the event with a default handler of removing the point
        if (point) {
            point.firePointEvent('remove', null, remove);
        } else {
            remove();
        }
    },

    /**
     * Remove a series and optionally redraw the chart.
     *
     * @sample highcharts/members/series-remove/
     *         Remove first series from a button
     *
     * @function Highcharts.Series#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call to
     *        {@link Highcharts.Chart#redraw}.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @param {boolean} [withEvent=true]
     *        Used internally, whether to fire the series `remove` event.
     *
     * @fires Highcharts.Series#event:remove
     */
    remove: function (redraw, animation, withEvent) {
        var series = this,
            chart = series.chart;

        function remove() {

            // Destroy elements
            series.destroy();
            series.remove = null; // Prevent from doing again (#9097)

            // Redraw
            chart.isDirtyLegend = chart.isDirtyBox = true;
            chart.linkSeries();

            if (pick(redraw, true)) {
                chart.redraw(animation);
            }
        }

        // Fire the event with a default handler of removing the point
        if (withEvent !== false) {
            fireEvent(series, 'remove', null, remove);
        } else {
            remove();
        }
    },

    /**
     * Update the series with a new set of options. For a clean and precise
     * handling of new options, all methods and elements from the series are
     * removed, and it is initiated from scratch. Therefore, this method is more
     * performance expensive than some other utility methods like {@link
     * Series#setData} or {@link Series#setVisible}.
     *
     * @sample highcharts/members/series-update/
     *         Updating series options
     * @sample maps/members/series-update/
     *         Update series options in Highmaps
     *
     * @function Highcharts.Series#update
     *
     * @param {Highcharts.SeriesOptions} options
     *        New options that will be merged with the series' existing options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the series is altered. If doing
     *        more operations on the chart, it is a good idea to set redraw to
     *        false and call {@link Chart#redraw} after.
     *
     * @fires Highcharts.Series#event:afterUpdate
     */
    update: function (newOptions, redraw) {

        H.cleanRecursively(newOptions, this.userOptions);

        var series = this,
            chart = series.chart,
            // must use user options when changing type because series.options
            // is merged in with type specific plotOptions
            oldOptions = series.userOptions,
            oldType = series.oldType || series.type,
            newType = (
                newOptions.type ||
                oldOptions.type ||
                chart.options.chart.type
            ),
            proto = seriesTypes[oldType].prototype,
            n,
            groups = [
                'group',
                'markerGroup',
                'dataLabelsGroup'
            ],
            preserve = [
                'navigatorSeries',
                'baseSeries'
            ],

            // Animation must be enabled when calling update before the initial
            // animation has first run. This happens when calling update
            // directly after chart initialization, or when applying responsive
            // rules (#6912).
            animation = series.finishedAnimating && { animation: false },
            allowSoftUpdate = [
                'data',
                'name',
                'turboThreshold'
            ],
            keys = Object.keys(newOptions),
            doSoftUpdate = keys.length > 0;

        // Running Series.update to update the data only is an intuitive usage,
        // so we want to make sure that when used like this, we run the
        // cheaper setData function and allow animation instead of completely
        // recreating the series instance. This includes sideways animation when
        // adding points to the data set. The `name` should also support soft
        // update because the data module sets name and data when setting new
        // data by `chart.update`.
        keys.forEach(function (key) {
            if (allowSoftUpdate.indexOf(key) === -1) {
                doSoftUpdate = false;
            }
        });
        if (doSoftUpdate) {
            if (newOptions.data) {
                this.setData(newOptions.data, false);
            }
            if (newOptions.name) {
                this.setName(newOptions.name, false);
            }
        } else {

            // Make sure preserved properties are not destroyed (#3094)
            preserve = groups.concat(preserve);
            preserve.forEach(function (prop) {
                preserve[prop] = series[prop];
                delete series[prop];
            });

            // Do the merge, with some forced options
            newOptions = merge(oldOptions, animation, {
                index: series.index,
                pointStart: pick(
                    oldOptions.pointStart, // when updating from blank (#7933)
                    series.xData[0] // when updating after addPoint
                )
            }, { data: series.options.data }, newOptions);

            // Destroy the series and delete all properties. Reinsert all
            // methods and properties from the new type prototype (#2270,
            // #3719).
            series.remove(false, null, false);
            for (n in proto) {
                series[n] = undefined;
            }
            if (seriesTypes[newType || oldType]) {
                extend(series, seriesTypes[newType || oldType].prototype);
            } else {
                H.error(17, true, chart);
            }

            // Re-register groups (#3094) and other preserved properties
            preserve.forEach(function (prop) {
                series[prop] = preserve[prop];
            });

            series.init(chart, newOptions);

            // Update the Z index of groups (#3380, #7397)
            if (newOptions.zIndex !== oldOptions.zIndex) {
                groups.forEach(function (groupName) {
                    if (series[groupName]) {
                        series[groupName].attr({
                            zIndex: newOptions.zIndex
                        });
                    }
                });
            }


            series.oldType = oldType;
            chart.linkSeries(); // Links are lost in series.remove (#3028)

        }
        fireEvent(this, 'afterUpdate');

        if (pick(redraw, true)) {
            chart.redraw(doSoftUpdate ? undefined : false);
        }
    },

    /**
     * Used from within series.update
     *
     * @private
     * @function Highcharts.Series#setName
     *
     * @param {string} name
     */
    setName: function (name) {
        this.name = this.options.name = this.userOptions.name = name;
        this.chart.isDirtyLegend = true;
    }
});

// Extend the Axis.prototype for dynamic methods
extend(Axis.prototype, /** @lends Highcharts.Axis.prototype */ {

    /**
     * Update an axis object with a new set of options. The options are merged
     * with the existing options, so only new or altered options need to be
     * specified.
     *
     * @sample highcharts/members/axis-update/
     *         Axis update demo
     *
     * @function Highcharts.Axis#update
     *
     * @param {Highcharts.XAxisOptions|Highcharts.YAxisOptions|Highcharts.ZAxisOptions} options
     *        The new options that will be merged in with existing options on
     *        the axis.
     */
    update: function (options, redraw) {
        var chart = this.chart,
            newEvents = ((options && options.events) || {});

        options = merge(this.userOptions, options);

        // Color Axis is not an array,
        // This change is applied in the ColorAxis wrapper
        if (chart.options[this.coll].indexOf) {
            // Don't use this.options.index,
            // StockChart has Axes in navigator too
            chart.options[this.coll][
                chart.options[this.coll].indexOf(this.userOptions)
            ] = options;
        }

        // Remove old events, if no new exist (#8161)
        objectEach(chart.options[this.coll].events, function (fn, ev) {
            if (typeof newEvents[ev] === 'undefined') {
                newEvents[ev] = undefined;
            }
        });

        this.destroy(true);
        this.init(chart, extend(options, { events: newEvents }));

        chart.isDirtyBox = true;
        if (pick(redraw, true)) {
            chart.redraw();
        }
    },

    /**
     * Remove the axis from the chart.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Axis#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart following the remove.
     */
    remove: function (redraw) {
        var chart = this.chart,
            key = this.coll, // xAxis or yAxis
            axisSeries = this.series,
            i = axisSeries.length;

        // Remove associated series (#2687)
        while (i--) {
            if (axisSeries[i]) {
                axisSeries[i].remove(false);
            }
        }

        // Remove the axis
        erase(chart.axes, this);
        erase(chart[key], this);

        if (isArray(chart.options[key])) {
            chart.options[key].splice(this.options.index, 1);
        } else { // color axis, #6488
            delete chart.options[key];
        }

        chart[key].forEach(function (axis, i) { // Re-index, #1706, #8075
            axis.options.index = axis.userOptions.index = i;
        });
        this.destroy();
        chart.isDirtyBox = true;

        if (pick(redraw, true)) {
            chart.redraw();
        }
    },

    /**
     * Update the axis title by options after render time.
     *
     * @sample highcharts/members/axis-settitle/
     *         Set a new Y axis title
     *
     * @function Highcharts.Axis#setTitle
     *
     * @param {Highcharts.XAxisTitleOptions|Highcharts.YAxisTitleOptions|Highcharts.ZAxisTitleOptions} titleOptions
     *        The additional title options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after setting the title.
     */
    setTitle: function (titleOptions, redraw) {
        this.update({ title: titleOptions }, redraw);
    },

    /**
     * Set new axis categories and optionally redraw.
     *
     * @sample highcharts/members/axis-setcategories/
     *         Set categories by click on a button
     *
     * @function Highcharts.Axis#setCategories
     *
     * @param {Array<string>} categories
     *        The new categories.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart.
     */
    setCategories: function (categories, redraw) {
        this.update({ categories: categories }, redraw);
    }

});
