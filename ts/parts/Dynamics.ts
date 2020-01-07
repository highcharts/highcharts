/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            touched?: boolean;
            remove(redraw?: boolean): void;
            setCategories(categories: Array<string>, redraw?: boolean): void;
            setTitle(titleOptions: AxisTitleOptions, redraw?: boolean): void;
            update(options: AxisOptions, redraw?: boolean): void;
        }
        interface Chart {
            collectionsWithUpdate: Array<string>;
            collectionsWithInit: Dictionary<[Function, Array<any>?]>;
            loadingDiv?: HTMLDOMElement;
            loadingShown?: boolean;
            loadingSpan?: HTMLDOMElement;
            propsRequireDirtyBox: Array<string>;
            propsRequireReflow: Array<string>;
            propsRequireUpdateSeries: Array<string>;
            addAxis(
                options: AxisOptions,
                isX?: boolean,
                redraw?: boolean,
                animation?: boolean
            ): Axis;
            addColorAxis(
                options: AxisOptions,
                redraw?: boolean,
                animation?: boolean
            ): Axis;
            createAxis(
                type: string,
                options: CreateAxisOptionsObject
            ): Axis|ColorAxis;
            addSeries(
                options: SeriesOptionsType,
                redraw?: boolean,
                animation?: (boolean|AnimationOptionsObject)
            ): Series;
            setSubtitle(options: SubtitleOptions): void;
            hideLoading(): void;
            showLoading(str?: string): void;
            update(
                options: Options,
                redraw?: boolean,
                oneToOne?: boolean,
                animation?: (boolean|AnimationOptionsObject)
            ): void;
        }
        interface ChartAfterUpdateEventObject {
            animation: (boolean|AnimationOptionsObject);
            options: Options;
            redraw: boolean;
        }
        interface CreateAxisOptionsObject {
            animation: undefined | boolean | AnimationOptionsObject;
            axis: AxisOptions | ColorAxisOptions;
            redraw: undefined | boolean;
        }
        interface Point {
            touched?: boolean;
            remove(
                redraw?: boolean,
                animation?: (boolean|AnimationOptionsObject)
            ): void;
            update(
                options: PointOptionsType,
                redraw?: boolean,
                animation?: (boolean|AnimationOptionsObject),
                runEvent?: boolean
            ): void;
        }
        interface Series {
            initialType?: string;
            touched?: boolean;
            addPoint(
                options: PointOptionsType,
                redraw?: boolean,
                shift?: boolean,
                animation?: (boolean|AnimationOptionsObject),
                withEvent?: boolean
            ): void;
            remove(
                redraw?: boolean,
                animation?: (boolean|AnimationOptionsObject),
                withEvent?: boolean,
                keepEvents?: boolean
            ): void;
            removePoint(
                i: number,
                redraw?: boolean,
                animation?: (boolean|AnimationOptionsObject)
            ): void;
            setName(name: string): void;
            update(options: SeriesOptionsType, redraw?: boolean): void;
        }
        interface XAxisOptions {
            index?: number;
        }
        function cleanRecursively<T>(newer: T, older: unknown): T;
    }
}


import U from './Utilities.js';
const {
    defined,
    erase,
    extend,
    isArray,
    isNumber,
    isObject,
    isString,
    objectEach,
    pick,
    relativeLength,
    setAnimation,
    splat
} = U;

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
    fireEvent = H.fireEvent,
    merge = H.merge,
    Point = H.Point,
    Series = H.Series,
    seriesTypes = H.seriesTypes;

/* eslint-disable valid-jsdoc */

/**
 * Remove settings that have not changed, to avoid unnecessary rendering or
 * computing (#9197).
 * @private
 */
H.cleanRecursively = function<T> (newer: T, older: unknown): T {
    var result = {} as T;

    objectEach(newer, function (val: unknown, key: (number|string)): void {
        var ob;

        // Dive into objects (except DOM nodes)
        if (
            isObject((newer as any)[key], true) &&
            !(newer as any).nodeType && // #10044
            (older as any)[key]
        ) {
            ob = H.cleanRecursively(
                (newer as any)[key],
                (older as any)[key]
            );
            if (Object.keys(ob).length) {
                (result as any)[key] = ob;
            }

        // Arrays, primitives and DOM nodes are copied directly
        } else if (
            isObject((newer as any)[key]) ||
            (newer as any)[key] !== (older as any)[key]
        ) {
            (result as any)[key] = (newer as any)[key];
        }
    });

    return result;
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
     * @param {Highcharts.SeriesOptionsType} options
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
    addSeries: function (
        this: Highcharts.Chart,
        options: Highcharts.SeriesOptionsType,
        redraw?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject)
    ): Highcharts.Series {
        var series: (Highcharts.Series|undefined),
            chart = this;

        if (options) { // <- not necessary
            redraw = pick(redraw, true); // defaults to true

            fireEvent(
                chart,
                'addSeries',
                { options: options },
                function (): void {
                    series = chart.initSeries(options);

                    chart.isDirtyLegend = true;
                    chart.linkSeries();

                    if (series.enabledDataSorting) {
                        // We need to call `setData` after `linkSeries`
                        series.setData(options.data as any, false);
                    }

                    fireEvent(chart, 'afterAddSeries', { series: series });

                    if (redraw) {
                        chart.redraw(animation);
                    }
                }
            );
        }

        return series as any;
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
     * @param {Highcharts.AxisOptions} options
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
    addAxis: function (
        this: Highcharts.Chart,
        options: Highcharts.AxisOptions,
        isX?: boolean,
        redraw?: boolean,
        animation?: boolean
    ): Highcharts.Axis {
        return this.createAxis(
            isX ? 'xAxis' : 'yAxis',
            { axis: options, redraw: redraw, animation: animation }
        );
    },

    /**
     * Add a color axis to the chart after render time. Note that this method
     * should never be used when adding data synchronously at chart render time,
     * as it adds expense to the calculations and rendering. When adding data at
     * the same time as the chart is initialized, add the axis as a
     * configuration option instead.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Chart#addColorAxis
     *
     * @param {Highcharts.ColorAxisOptions} options
     *        The axis options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=true]
     *        Whether and how to apply animation in the redraw.
     *
     * @return {Highcharts.ColorAxis}
     *         The newly generated Axis object.
     */
    addColorAxis: function (
        this: Highcharts.Chart,
        options: Highcharts.ColorAxisOptions,
        redraw?: boolean,
        animation?: boolean
    ): Highcharts.Axis {
        return this.createAxis(
            'colorAxis',
            { axis: options, redraw: redraw, animation: animation }
        );
    },

    /**
     * Factory for creating different axis types.
     *
     * @private
     * @function Highcharts.Chart#createAxis
     *
     * @param {string} type
     *        An axis type.
     *
     * @param {...Array<*>} arguments
     *        All arguments for the constructor.
     *
     * @return {Highcharts.Axis | Highcharts.ColorAxis}
     *         The newly generated Axis object.
     */
    createAxis: function (
        this: Highcharts.Chart,
        type: string,
        options: Highcharts.CreateAxisOptionsObject
    ): Highcharts.Axis {
        var chartOptions = this.options,
            isColorAxis = type === 'colorAxis',
            axisOptions = options.axis,
            redraw = options.redraw,
            animation = options.animation,
            userOptions = merge(axisOptions, {
                index: (this as any)[type].length,
                isX: type === 'xAxis'
            }),
            axis;

        if (isColorAxis) {
            axis = new H.ColorAxis(this, userOptions);

        } else {
            axis = new Axis(this, userOptions);
        }

        // Push the new axis options to the chart options
        (chartOptions as any)[type] = splat((chartOptions as any)[type] || {});
        (chartOptions as any)[type].push(userOptions);

        if (isColorAxis) {
            this.isDirtyLegend = true;

            // Clear before 'bindAxes' (#11924)
            this.axes.forEach(function (axis: Highcharts.Axis): void {
                axis.series = [];
            });

            this.series.forEach(function (series: Highcharts.Series): void {
                series.bindAxes();
                series.isDirtyData = true;
            });
        }

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
     * @param {string} [str]
     *        An optional text to show in the loading label instead of the
     *        default one. The default text is set in
     *        [lang.loading](http://api.highcharts.com/highcharts/lang.loading).
     *
     * @return {void}
     */
    showLoading: function (this: Highcharts.Chart, str?: string): void {
        var chart = this,
            options = chart.options,
            loadingDiv = chart.loadingDiv,
            loadingOptions = options.loading,
            setLoadingSize = function (): void {
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
            }, null as any, chart.container);

            chart.loadingSpan = createElement(
                'span',
                { className: 'highcharts-loading-inner' },
                null as any,
                loadingDiv
            );
            addEvent(chart, 'redraw', setLoadingSize); // #1080
        }

        loadingDiv.className = 'highcharts-loading';

        // Update text
        (chart.loadingSpan as any).innerHTML =
            pick(str, (options.lang as any).loading, '');

        if (!chart.styledMode) {
            // Update visuals
            css(loadingDiv, extend((loadingOptions as any).style, {
                zIndex: 10
            }));
            css((chart.loadingSpan as any), (loadingOptions as any).labelStyle);

            // Show it
            if (!chart.loadingShown) {
                css(loadingDiv, {
                    opacity: 0,
                    display: ''
                });
                animate(loadingDiv, {
                    opacity: (loadingOptions as any).style.opacity || 0.5
                }, {
                    duration: (loadingOptions as any).showDuration || 0
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
     *
     * @return {void}
     */
    hideLoading: function (this: Highcharts.Chart): void {

        var options = this.options,
            loadingDiv = this.loadingDiv;

        if (loadingDiv) {
            loadingDiv.className =
                'highcharts-loading highcharts-loading-hidden';

            if (!this.styledMode) {
                animate(loadingDiv, {
                    opacity: 0
                }, {
                    duration: (options.loading as any).hideDuration || 100,
                    complete: function (): void {
                        css(loadingDiv as any, { display: 'none' });
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
        'borderRadius',
        'plotBackgroundColor',
        'plotBackgroundImage',
        'plotBorderColor',
        'plotBorderWidth',
        'plotShadow',
        'shadow'
    ],

    /**
     * These properties require a full reflow of chart elements, best
     * implemented through running `Chart.setSize` internally (#8190).
     * @type {Array}
     */
    propsRequireReflow: [
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'spacing',
        'spacingTop',
        'spacingRight',
        'spacingBottom',
        'spacingLeft'
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
        'series'
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
     * Note that when changing series data, `chart.update` may mutate the passed
     * data options.
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
     *        When `true`, the `series`, `xAxis`, `yAxis` and `annotations`
     *        collections will be updated one to one, and items will be either
     *        added or removed to match the new updated options. For example,
     *        if the chart has two series and we call `chart.update` with a
     *        configuration containing three series, one will be added. If we
     *        call `chart.update` with one series, one will be removed. Setting
     *        an empty `series` array will remove all series, but leaving out
     *        the`series` property will leave all series untouched. If the
     *        series have id's, the new series options will be matched by id,
     *        and the remaining ones removed.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @return {void}
     *
     * @fires Highcharts.Chart#event:update
     * @fires Highcharts.Chart#event:afterUpdate
     */
    update: function (
        this: Highcharts.Chart,
        options: Highcharts.Options,
        redraw?: boolean,
        oneToOne?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject)
    ): void {
        var chart = this,
            adders = {
                credits: 'addCredits',
                title: 'setTitle',
                subtitle: 'setSubtitle',
                caption: 'setCaption'
            } as Highcharts.Dictionary<string>,
            optionsChart,
            updateAllAxes,
            updateAllSeries,
            newWidth,
            newHeight,
            runSetSize,
            isResponsiveOptions = options.isResponsiveOptions,
            itemsForRemoval = [] as Array<string>;

        fireEvent(chart, 'update', { options: options });

        // If there are responsive rules in action, undo the responsive rules
        // before we apply the updated options and replay the responsive rules
        // on top from the chart.redraw function (#9617).
        if (!isResponsiveOptions) {
            chart.setResponsive(false, true);
        }

        options = H.cleanRecursively(options, chart.options);

        merge(true, chart.userOptions, options);

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

            objectEach(optionsChart, function (val: any, key: string): void {
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
                // Chart setSize
                if (
                    !isResponsiveOptions &&
                    chart.propsRequireReflow.indexOf(key) !== -1
                ) {
                    runSetSize = true;
                }
            });

            if (!chart.styledMode && 'style' in optionsChart) {
                chart.renderer.setStyle(optionsChart.style as any);
            }
        }

        // Moved up, because tooltip needs updated plotOptions (#6218)
        if (!chart.styledMode && options.colors) {
            this.options.colors = options.colors;
        }

        if (options.plotOptions) {
            merge(true, this.options.plotOptions, options.plotOptions);
        }

        // Maintaining legacy global time. If the chart is instanciated first
        // with global time, then updated with time options, we need to create a
        // new Time instance to avoid mutating the global time (#10536).
        if (options.time && this.time === H.time) {
            this.time = new H.Time(options.time);
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
        objectEach(options, function (
            val: Highcharts.Dictionary<any>,
            key: string
        ): void {
            if ((chart as any)[key] &&
                typeof (chart as any)[key].update === 'function'
            ) {
                (chart as any)[key].update(val, false);

            // If a one-to-one object does not exist, look for an adder function
            } else if (typeof (chart as any)[adders[key]] === 'function') {
                (chart as any)[adders[key]](val);
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
        this.collectionsWithUpdate.forEach(function (coll: string): void {
            var indexMap: Array<number>;

            if ((options as any)[coll]) {

                // In stock charts, the navigator series are also part of the
                // chart.series array, but those series should not be handled
                // here (#8196).
                if (coll === 'series') {
                    indexMap = [];
                    chart[coll].forEach(function (
                        s: Highcharts.Series,
                        i: number
                    ): void {
                        if (!s.options.isInternal) {
                            indexMap.push(pick(s.options.index, i));
                        }
                    });
                }


                splat((options as any)[coll]).forEach(function (
                    newOptions: Highcharts.Dictionary<any>,
                    i: number
                ): void {
                    var item = (
                        defined(newOptions.id) &&
                        chart.get(newOptions.id)
                    ) || (chart as any)[coll][indexMap ? indexMap[i] : i];

                    if (item && item.coll === coll) {
                        item.update(newOptions, false);

                        if (oneToOne) {
                            item.touched = true;
                        }
                    }

                    // If oneToOne and no matching item is found, add one
                    if (!item && oneToOne && chart.collectionsWithInit[coll]) {
                        chart.collectionsWithInit[coll][0].apply(
                            chart,
                            // [newOptions, ...extraArguments, redraw=false]
                            [
                                newOptions
                            ].concat(
                                // Not all initializers require extra args
                                chart.collectionsWithInit[coll][1] || []
                            ).concat([
                                false
                            ])
                        ).touched = true;
                    }

                });

                // Add items for removal
                if (oneToOne) {
                    (chart as any)[coll].forEach(function (item: any): void {
                        if (!item.touched && !item.options.isInternal) {
                            itemsForRemoval.push(item);
                        } else {
                            delete item.touched;
                        }
                    });
                }


            }
        });

        itemsForRemoval.forEach(function (item: any): void {
            if (item.remove) {
                item.remove(false);
            }
        });

        if (updateAllAxes) {
            chart.axes.forEach(function (axis: Highcharts.Axis): void {
                axis.update({}, false);
            });
        }

        // Certain options require the whole series structure to be thrown away
        // and rebuilt
        if (updateAllSeries) {
            chart.getSeriesOrderByLinks().forEach(function (
                series: Highcharts.Series
            ): void {
                // Avoid removed navigator series
                if (series.chart) {
                    series.update({}, false);
                }
            }, this);
        }

        // For loading, just update the options, do not redraw
        if (options.loading) {
            merge(true, chart.options.loading, options.loading);
        }

        // Update size. Redraw is forced.
        newWidth = optionsChart && optionsChart.width;
        newHeight = optionsChart && optionsChart.height;
        if (isString(newHeight)) {
            newHeight = relativeLength(
                newHeight as string,
                (newWidth as string) || (chart.chartWidth as any)
            );
        }

        if (
            // In this case, run chart.setSize with newWidth and newHeight which
            // are undefined, only for reflowing chart elements because margin
            // or spacing has been set (#8190)
            runSetSize ||

            // In this case, the size is actually set
            (isNumber(newWidth) && newWidth !== chart.chartWidth) ||
            (isNumber(newHeight) && newHeight !== chart.chartHeight)
        ) {
            chart.setSize(newWidth as number, newHeight as number, animation);
        } else if (pick(redraw, true)) {
            chart.redraw(animation);
        }

        fireEvent(chart, 'afterUpdate', {
            options: options,
            redraw: redraw,
            animation: animation
        });

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
     *
     * @return {void}
     */
    setSubtitle: function (
        this: Highcharts.Chart,
        options: Highcharts.SubtitleOptions,
        redraw?: boolean
    ): void {
        this.applyDescription('subtitle', options);
        this.layOutTitles(redraw);
    },

    /**
     * Set the caption options. This can also be done from {@link
     * Chart#update}.
     *
     * @function Highcharts.Chart#setCaption
     *
     * @param {Highcharts.CaptionOptions} options
     *        New caption options. The caption text itself is set by the
     *        `options.text` property.
     *
     * @return {void}
     */
    setCaption: function (
        this: Highcharts.Chart,
        options: Highcharts.CaptionOptions,
        redraw?: boolean
    ): void {
        this.applyDescription('caption', options);
        this.layOutTitles(redraw);
    }

});

/**
 * These collections (arrays) implement `Chart.addSomethig` method used in
 * chart.update() to create new object in the collection. Equivalent for
 * deleting is resolved by simple `Somethig.remove()`.
 *
 * Note: We need to define these references after initializers are bound to
 * chart's prototype.
 */
Chart.prototype.collectionsWithInit = {
    // collectionName: [ initializingMethod, [extraArguments] ]
    xAxis: [Chart.prototype.addAxis, [true]],
    yAxis: [Chart.prototype.addAxis, [false]],
    series: [Chart.prototype.addSeries]
};

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
     * @param {Highcharts.PointOptionsType} options
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
     * @return {void}
     *
     * @fires Highcharts.Point#event:update
     */
    update: function (
        this: Highcharts.Point,
        options: Highcharts.PointOptionsType,
        redraw?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject),
        runEvent?: boolean
    ): void {
        var point = this,
            series = point.series,
            graphic = point.graphic,
            i: number,
            chart = series.chart,
            seriesOptions = series.options;

        redraw = pick(redraw, true);

        /**
         * @private
         */
        function update(): void {

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
                        (options as any).marker &&
                        typeof (options as any).marker.symbol !== 'undefined'
                    ) {
                        point.graphic = graphic.destroy();
                    }
                }
                if (options && (options as any).dataLabels && point.dataLabel) {
                    point.dataLabel = point.dataLabel.destroy(); // #2468
                }
                if (point.connector) {
                    point.connector = point.connector.destroy(); // #7243
                }
            }

            // record changes in the parallel arrays
            i = point.index as any;
            series.updateParallelArrays(point, i);

            // Record the options to options.data. If the old or the new config
            // is an object, use point options, otherwise use raw options
            // (#4701, #4916).
            (seriesOptions.data as any)[i] = (
                isObject((seriesOptions.data as any)[i], true) ||
                    isObject(options, true)
            ) ?
                point.options :
                pick(options, (seriesOptions.data as any)[i]);

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
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call. When
     *        doing more operations on the chart, for example running
     *        `point.remove()` in a loop, it is best practice to set `redraw`
     *        to false and call `chart.redraw()` after.
     *
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=false]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @return {void}
     */
    remove: function (
        this: Highcharts.Point,
        redraw?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject)
    ): void {
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
     * @param {Highcharts.PointOptionsType} options
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
     *
     * @param {boolean} [withEvent=true]
     *        Used internally, whether to fire the series `addPoint` event.
     *
     * @return {void}
     *
     * @fires Highcharts.Series#event:addPoint
     */
    addPoint: function (
        this: Highcharts.Series,
        options: Highcharts.PointOptionsType,
        redraw?: boolean,
        shift?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject),
        withEvent?: boolean
    ): void {
        var series = this,
            seriesOptions = series.options,
            data = series.data,
            chart = series.chart,
            xAxis = series.xAxis,
            names = xAxis && xAxis.hasNames && xAxis.names,
            dataOptions = seriesOptions.data,
            point: Highcharts.Point,
            xData = series.xData as any,
            isInTheMiddle,
            i: number,
            x: (number|null);

        // Optional redraw, defaults to true
        redraw = pick(redraw, true);

        // Get options and push the point to xData, yData and series.options. In
        // series.generatePoints the Point instance will be created on demand
        // and pushed to the series.data array.
        point = { series: series } as any;
        series.pointClass.prototype.applyOptions.apply(point, [options]);
        x = point.x;

        // Get the insertion point
        i = xData.length;
        if (series.requireSorting && (x as any) < xData[i - 1]) {
            isInTheMiddle = true;
            while (i && xData[i - 1] > (x as any)) {
                i--;
            }
        }

        // Insert undefined item
        (series.updateParallelArrays as any)(point, 'splice', i, 0, 0);
        // Update it
        series.updateParallelArrays(point as any, i);

        if (names && point.name) {
            names[x as any] = point.name;
        }
        (dataOptions as any).splice(i, 0, options);

        if (isInTheMiddle) {
            series.data.splice(i, 0, null as any);
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
                series.updateParallelArrays(point as any, 'shift');

                (dataOptions as any).shift();
            }
        }

        // Fire event
        if (withEvent !== false) {
            fireEvent(series, 'addPoint', { point: point });
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
     * @return {void}
     *
     * @fires Highcharts.Point#event:remove
     */
    removePoint: function (
        this: Highcharts.Series,
        i: number,
        redraw?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject)
    ): void {

        var series = this,
            data = series.data,
            point = data[i],
            points = series.points,
            chart = series.chart,
            remove = function (): void {

                if (points && points.length === data.length) { // #4935
                    points.splice(i, 1);
                }
                data.splice(i, 1);
                (series.options.data as any).splice(i, 1);
                (series.updateParallelArrays as any)(
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
            point.firePointEvent('remove', null as any, remove);
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
     * @return {void}
     *
     * @fires Highcharts.Series#event:remove
     */
    remove: function (
        this: Highcharts.Series,
        redraw?: boolean,
        animation?: (boolean|Highcharts.AnimationOptionsObject),
        withEvent?: boolean,
        keepEvents?: boolean
    ): void {
        var series = this,
            chart = series.chart;

        /**
         * @private
         */
        function remove(): void {

            // Destroy elements
            series.destroy(keepEvents);
            (series as any).remove = null; // Prevent from doing again (#9097)

            // Redraw
            chart.isDirtyLegend = chart.isDirtyBox = true;
            chart.linkSeries();

            if (pick(redraw, true)) {
                chart.redraw(animation);
            }
        }

        // Fire the event with a default handler of removing the point
        if (withEvent !== false) {
            fireEvent(series, 'remove', null as any, remove);
        } else {
            remove();
        }
    },

    /**
     * Update the series with a new set of options. For a clean and precise
     * handling of new options, all methods and elements from the series are
     * removed, and it is initialized from scratch. Therefore, this method is
     * more performance expensive than some other utility methods like {@link
     * Series#setData} or {@link Series#setVisible}.
     *
     * Note that `Series.update` may mutate the passed `data` options.
     *
     * @sample highcharts/members/series-update/
     *         Updating series options
     * @sample maps/members/series-update/
     *         Update series options in Highmaps
     *
     * @function Highcharts.Series#update
     *
     * @param {Highcharts.SeriesOptionsType} options
     *        New options that will be merged with the series' existing options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the series is altered. If doing
     *        more operations on the chart, it is a good idea to set redraw to
     *        false and call {@link Chart#redraw} after.
     *
     * @return {void}
     *
     * @fires Highcharts.Series#event:update
     * @fires Highcharts.Series#event:afterUpdate
     */
    update: function (
        this: Highcharts.Series,
        options: Highcharts.SeriesOptionsType,
        redraw?: boolean
    ): void {

        options = H.cleanRecursively(options, this.userOptions);

        fireEvent(this, 'update', { options: options });

        var series = this,
            chart = series.chart,
            // must use user options when changing type because series.options
            // is merged in with type specific plotOptions
            oldOptions = series.userOptions,
            seriesOptions: Highcharts.SeriesOptions,
            initialType = series.initialType || series.type,
            newType = (
                options.type ||
                oldOptions.type ||
                (chart.options.chart as any).type
            ),
            keepPoints = !(
                // Indicators, histograms etc recalculate the data. It should be
                // possible to omit this.
                this.hasDerivedData ||
                // Changes to data grouping requires new points in new groups
                options.dataGrouping ||
                // New type requires new point classes
                (newType && newType !== this.type) ||
                // New options affecting how the data points are built
                typeof options.pointStart !== 'undefined' ||
                options.pointInterval ||
                options.pointIntervalUnit ||
                options.keys
            ),
            initialSeriesProto = seriesTypes[initialType].prototype,
            n,
            groups = [
                'group',
                'markerGroup',
                'dataLabelsGroup',
                'transformGroup'
            ],
            preserve = [
                'eventOptions',
                'navigatorSeries',
                'baseSeries'
            ],

            // Animation must be enabled when calling update before the initial
            // animation has first run. This happens when calling update
            // directly after chart initialization, or when applying responsive
            // rules (#6912).
            animation = series.finishedAnimating && { animation: false },
            kinds = {} as Highcharts.Dictionary<number>;

        if (keepPoints) {
            preserve.push(
                'data',
                'isDirtyData',
                'points',
                'processedXData',
                'processedYData',
                'xIncrement',
                '_hasPointMarkers',
                '_hasPointLabels',

                // Map specific, consider moving it to series-specific preserve-
                // properties (#10617)
                'mapMap',
                'mapData',
                'minY',
                'maxY',
                'minX',
                'maxX'
            );
            if (options.visible !== false) {
                preserve.push('area', 'graph');
            }
            series.parallelArrays.forEach(function (key: string): void {
                preserve.push(key + 'Data');
            });

            if (options.data) {
                // setData uses dataSorting options so we need to update them
                // earlier
                if (options.dataSorting) {
                    extend(series.options.dataSorting, options.dataSorting);
                }
                this.setData(options.data, false);
            }
        }

        // Do the merge, with some forced options
        options = merge(oldOptions, animation as any, {
            // When oldOptions.index is null it should't be cleared.
            // Otherwise navigator series will have wrong indexes (#10193).
            index: typeof oldOptions.index === 'undefined' ?
                series.index : oldOptions.index,
            pointStart: pick(
                // when updating from blank (#7933)
                oldOptions.pointStart,
                // when updating after addPoint
                (series.xData as any)[0]
            )
        }, (!keepPoints && { data: series.options.data }) as any, options);

        // Merge does not merge arrays, but replaces them. Since points were
        // updated, `series.options.data` has correct merged options, use it:
        if (keepPoints && options.data) {
            options.data = series.options.data;
        }

        // Make sure preserved properties are not destroyed (#3094)
        preserve = groups.concat(preserve);
        preserve.forEach(function (prop: string): void {
            (preserve as any)[prop] = (series as any)[prop];
            delete (series as any)[prop];
        });

        // Destroy the series and delete all properties. Reinsert all
        // methods and properties from the new type prototype (#2270,
        // #3719).
        series.remove(false, null as any, false, true);
        for (n in initialSeriesProto) { // eslint-disable-line guard-for-in
            (series as any)[n] = void 0;
        }
        if (seriesTypes[newType || initialType]) {
            extend(series, seriesTypes[newType || initialType].prototype);
        } else {
            H.error(
                17,
                true,
                chart,
                { missingModuleFor: (newType || initialType) }
            );
        }

        // Re-register groups (#3094) and other preserved properties
        preserve.forEach(function (prop: string): void {
            (series as any)[prop] = (preserve as any)[prop];
        });

        series.init(chart, options);

        // Remove particular elements of the points. Check `series.options`
        // because we need to consider the options being set on plotOptions as
        // well.
        if (keepPoints && this.points) {
            seriesOptions = series.options;
            // What kind of elements to destroy
            if (seriesOptions.visible === false) {
                kinds.graphic = 1;
                kinds.dataLabel = 1;
            } else if (!series._hasPointLabels) {
                const { marker, dataLabels } = seriesOptions;
                if (
                    marker && (
                        marker.enabled === false ||
                        'symbol' in marker // #10870
                    )
                ) {
                    kinds.graphic = 1;
                }
                if (
                    dataLabels &&
                    (dataLabels as any).enabled === false
                ) {
                    kinds.dataLabel = 1;
                }
            }
            this.points.forEach(function (point: Highcharts.Point): void {
                if (point && point.series) {
                    point.resolveColor();
                    // Destroy elements in order to recreate based on updated
                    // series options.
                    if (Object.keys(kinds).length) {
                        point.destroyElements(kinds);
                    }
                    if (
                        seriesOptions.showInLegend === false &&
                        point.legendItem
                    ) {
                        chart.legend.destroyItem(point);
                    }
                }
            }, this);
        }

        // Update the Z index of groups (#3380, #7397)
        if (options.zIndex !== oldOptions.zIndex) {
            groups.forEach(function (groupName: string): void {
                if ((series as any)[groupName]) {
                    (series as any)[groupName].attr({
                        zIndex: options.zIndex
                    });
                }
            });
        }


        series.initialType = initialType;
        chart.linkSeries(); // Links are lost in series.remove (#3028)


        fireEvent(this, 'afterUpdate');

        if (pick(redraw, true)) {
            chart.redraw(keepPoints ? void 0 : false);
        }
    },

    /**
     * Used from within series.update
     *
     * @private
     * @function Highcharts.Series#setName
     *
     * @param {string} name
     *
     * @return {void}
     */
    setName: function (this: Highcharts.Series, name: string): void {
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
     * @param {Highcharts.AxisOptions} options
     *        The new options that will be merged in with existing options on
     *        the axis.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the axis is altered. If doing
     *        more operations on the chart, it is a good idea to set redraw to
     *        false and call {@link Chart#redraw} after.
     *
     * @return {void}
     */
    update: function (
        this: Highcharts.Axis,
        options: Highcharts.AxisOptions,
        redraw?: boolean
    ): void {
        var chart = this.chart,
            newEvents = ((options && options.events) || {});

        options = merge(this.userOptions, options);

        // Color Axis is not an array,
        // This change is applied in the ColorAxis wrapper
        if ((chart.options as any)[this.coll].indexOf) {
            // Don't use this.options.index,
            // StockChart has Axes in navigator too
            (chart.options as any)[this.coll][
                (chart.options as any)[this.coll].indexOf(this.userOptions)
            ] = options;
        }

        // Remove old events, if no new exist (#8161)
        objectEach(
            (chart.options as any)[this.coll].events,
            function (fn: Function, ev: string): void {
                if (typeof (newEvents as any)[ev] === 'undefined') {
                    (newEvents as any)[ev] = void 0;
                }
            }
        );

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
     *
     * @return {void}
     */
    remove: function (this: Highcharts.Axis, redraw?: boolean): void {
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
        erase((chart as any)[key], this);

        if (isArray((chart.options as any)[key])) {
            (chart.options as any)[key].splice(this.options.index, 1);
        } else { // color axis, #6488
            delete (chart.options as any)[key];
        }

        (chart as any)[key].forEach(function (
            axis: Highcharts.Axis,
            i: number
        ): void {
            // Re-index, #1706, #8075
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
     * @param {Highcharts.AxisTitleOptions} titleOptions
     *        The additional title options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after setting the title.
     *
     * @return {void}
     */
    setTitle: function (
        this: Highcharts.Axis,
        titleOptions: Highcharts.AxisTitleOptions,
        redraw?: boolean
    ): void {
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
     *
     * @return {void}
     */
    setCategories: function (
        this: Highcharts.Axis,
        categories: Array<string>,
        redraw?: boolean
    ): void {
        this.update({ categories: categories }, redraw);
    }

});
