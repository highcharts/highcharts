/* *
 *
 *  Highcharts Drilldown module
 *
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type Axis from '../../Core/Axis/Axis';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type { BreadcrumbOptions } from '../Breadcrumbs/BreadcrumbsOptions';
import type Chart from '../../Core/Chart/Chart';
import type ColorType from '../../Core/Color/ColorType';
import type DrilldownOptions from './DrilldownOptions';
import type Options from '../../Core/Options';
import type MapPointType from '../../Series/Map/MapPoint.js';
import type MapSeriesType from '../../Series/Map/MapSeries.js';
import type Point from '../../Core/Series/Point';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type {
    SeriesTypeOptions,
    SeriesTypeRegistry
} from '../../Core/Series/SeriesType';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type Tick from '../../Core/Axis/Tick';

import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import DrilldownDefaults from './DrilldownDefaults.js';
import DrilldownSeries from './DrilldownSeries.js';
import U from '../../Core/Utilities.js';
import { extend, objectEach } from '../../Shared/Utilities';
const {
    addEvent,
    defined,
    diffObjects,
    fireEvent,
    merge,
    pick,
    removeEvent,
    syncTimeout
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisBase' {
    interface AxisBase {
        /** @internal */
        ddPoints?: Record<string, Array<(false|Point)>>;

        /** @internal */
        oldPos?: number;

        /**
         * Drill down to a given category. This is the same as clicking on an
         * axis label. If multiple series with drilldown are present, all will
         * drill down to the given category.
         *
         * See also `Point.doDrilldown` for drilling down on a single point
         * instance.
         *
         * @function Highcharts.Axis#drilldownCategory
         *
         * @sample highcharts/drilldown/programmatic
         *         Programmatic drilldown
         *
         * @param {number} x
         *        The index of the category
         * @param {global.MouseEvent} [originalEvent]
         *        The original event, used internally.
         *
         * @requires modules/drilldown
         */
        drilldownCategory(x: number, originalEvent?: MouseEvent): void;

        /**
         * Return drillable points for this specific X value.
         *
         * @internal
         * @function Highcharts.Axis#getDDPoints
         * @param {number} x
         *        Tick position
         * @return {Array<(false|Highcharts.Point)>}
         *         Drillable points
         */
        getDDPoints(x: number): Array<(false|Point)>;
    }
}

/** @internal */
declare module '../../Core/Axis/TickBase' {
    interface TickBase {
        drillable(): void;
    }
}

declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        /** @internal */
        ddDupes?: Array<string>;

        /** @internal */
        drilldownLevels?: Array<Drilldown.LevelObject>;

        /** @internal */
        drillUpButton?: SVGElement;

        /**
         * Add a series to the chart as drilldown from a specific point in the
         * parent series. This method is used for async drilldown, when clicking
         * a point in a series should result in loading and displaying a more
         * high-resolution series. When not async, the setup is simpler using
         * the [drilldown.series](https://api.highcharts.com/highcharts/drilldown.series)
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
         *
         * @requires modules/drilldown
         */
        addSeriesAsDrilldown(
            point: Point,
            options: SeriesTypeOptions
        ): void;

        /** @internal */
        addSingleSeriesAsDrilldown(
            point: Point,
            ddOptions: SeriesTypeOptions
        ): void;

        /** @internal */
        applyDrilldown(): void;

        /**
         * When the chart is drilled down to a child series, calling
         * `chart.drillUp()` will drill up to the parent series.
         *
         * @function Highcharts.Chart#drillUp
         *
         * @sample highcharts/drilldown/programmatic
         *         Programmatic drilldown
         *
         * @requires modules/drilldown
         */
        drillUp(isMultipleDrillUp?: boolean): void;
    }
}

declare module '../../Core/Options' {
    interface Options {
        /**
         * Options for drill down, the concept of inspecting increasingly high
         * resolution data through clicking on chart items like columns or pie
         * slices.
         *
         * @sample {highcharts} highcharts/series-organization/drilldown
         *         Organization chart drilldown
         *
         * @product      highcharts highmaps
         * @requires     modules/drilldown
         * @optionparent drilldown
         */
        drilldown?: DrilldownOptions;
    }
    interface LangOptions {
        /**
         * Drill up button is deprecated since Highcharts v9.3.2. Use
         * [drilldown.breadcrumbs](#drilldown.breadcrumbs) instead.
         *
         * The text for the button that appears when drilling down, linking back
         * to the parent series. The parent series' name is inserted for
         * `{series.name}`.
         *
         * @deprecated 9.3.2
         * @since    3.0.8
         * @product  highcharts highmaps
         * @requires modules/drilldown
         * @apioption lang.drillUpText
         */
        drillUpText?: string;
    }
}

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        /**
         * The `id` of a series in the [drilldown.series](#drilldown.series)
         * array to use for a drilldown for this point.
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
        drilldown?: string;
    }
}


declare module '../../Core/Renderer/SVG/SVGElementBase' {
    interface SVGElementBase {
        /**
         * A general fadeIn method.
         *
         * @requires modules/drilldown
         *
         * @function Highcharts.SVGElement#fadeIn
         *
         * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
         * The animation options for the element fade.
         */
        fadeIn(animation?: (boolean|Partial<AnimationOptions>)): void;
    }
}

/* *
 *
 *  Variables
 *
 * */

let ddSeriesId = 1;

/* *
 *
 *  Functions
 *
 * */

/**
 * Drill down to a given category. This is the same as clicking on an axis
 * label. If multiple series with drilldown are present, all will drill down to
 * the given category.
 *
 * See also `Point.doDrilldown` for drilling down on a single point instance.
 *
 * @function Highcharts.Axis#drilldownCategory
 *
 * @sample highcharts/drilldown/programmatic
 *         Programmatic drilldown
 *
 * @param {number} x
 *        The index of the category
 * @param {global.MouseEvent} [originalEvent]
 *        The original event, used internally.
 *
 * @requires modules/drilldown
 */
function axisDrilldownCategory(
    this: Axis,
    x: number,
    originalEvent?: MouseEvent
): void {
    this.getDDPoints(x).forEach(function (point): void {
        if (
            point &&
            point.series &&
            point.series.visible &&
            point.runDrilldown
        ) { // #3197
            point.runDrilldown(true, x, originalEvent);
        }
    });
    this.chart.applyDrilldown();
}

/**
 * Return drillable points for this specific X value.
 *
 * @internal
 * @function Highcharts.Axis#getDDPoints
 * @param {number} x
 *        Tick position
 * @return {Array<(false|Highcharts.Point)>}
 *         Drillable points
 */
function axisGetDDPoints(
    this: Axis,
    x: number
): Array<(false|Point)> {
    return (this.ddPoints && this.ddPoints[x] || []);
}

/**
 * This method creates an array of arrays containing a level number
 * with the corresponding series/point.
 *
 * @internal
 * @param {Highcharts.Chart} chart
 *        Highcharts Chart object.
 * @return {Array<Breadcrumbs.BreadcrumbOptions>}
 * List for Highcharts Breadcrumbs.
 */
function createBreadcrumbsList(
    chart: Chart
): Array<BreadcrumbOptions> {
    const list: Array<BreadcrumbOptions> = [],
        drilldownLevels = chart.drilldownLevels;

    // The list is based on drilldown levels from the chart object
    if (drilldownLevels && drilldownLevels.length) {
        // Add the initial series as the first element.
        if (!list[0]) {
            list.push({
                level: 0,
                levelOptions: drilldownLevels[0].seriesOptions
            });
        }

        drilldownLevels.forEach(function (level): void {
            const lastBreadcrumb = list[list.length - 1];

            // If level is already added to breadcrumbs list,
            // don't add it again- drilling categories
            // + 1 because of the wrong levels numeration
            // in drilldownLevels array.
            if (level.levelNumber + 1 > lastBreadcrumb.level) {
                list.push({
                    level: level.levelNumber + 1,
                    levelOptions: merge({
                        name: level.lowerSeries.name
                    }, level.pointOptions)
                });
            }
        });
    }
    return list;
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class ChartAdditions {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Drilldown.ChartComposition
    ) {
        this.chart = chart;
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart: Drilldown.ChartComposition;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add a series to the chart as drilldown from a specific point in the
     * parent series. This method is used for async drilldown, when clicking a
     * point in a series should result in loading and displaying a more
     * high-resolution series. When not async, the setup is simpler using the
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
     *
     * @requires modules/drilldown
     */
    public addSeriesAsDrilldown(
        this: (this|Drilldown.ChartComposition),
        point: Point,
        options: SeriesTypeOptions
    ): void {
        const chart = (
            (this as this).chart ||
            (this as Drilldown.ChartComposition)
        );

        fireEvent(this, 'addSeriesAsDrilldown', { seriesOptions: options });

        if (chart.mapView) {
            // Stop hovering while drilling down
            point.series.isDrilling = true;

            chart.series.forEach((series): void => {
                // Stop duplicating and overriding animations
                series.options.inactiveOtherPoints = true;

                // Hide and disable dataLabels
                series.dataLabelsGroups?.forEach((g): void => g?.destroy());
                series.dataLabelsGroups = [];
            });

            // #18925 map zooming is not working with geoJSON maps
            if (
                chart.options.drilldown &&
                !chart.mapView.projection.hasGeoProjection &&
                DrilldownDefaults
            ) {
                const userDrilldown = diffObjects(
                    chart.options.drilldown,
                    DrilldownDefaults
                );

                // Set mapZooming to false if user didn't set any in chart
                // config
                if (!defined(userDrilldown.mapZooming)) {
                    chart.options.drilldown.mapZooming = false;
                }
            }

            if (
                chart.options.drilldown &&
                chart.options.drilldown.animation &&
                chart.options.drilldown.mapZooming
            ) {
                // First zoomTo then crossfade series
                chart.mapView.allowTransformAnimation = true;

                const animOptions =
                    animObject(chart.options.drilldown.animation);

                if (typeof animOptions !== 'boolean') {
                    const userComplete = animOptions.complete,
                        drilldownComplete = function (
                            obj?: { applyDrilldown?: boolean }
                        ): void {
                            if (obj && obj.applyDrilldown && chart.mapView) {
                                chart
                                    .addSingleSeriesAsDrilldown(point, options);
                                chart.applyDrilldown();
                                chart.mapView.allowTransformAnimation = false;
                            }
                        };
                    animOptions.complete =
                        function (): void {
                            if (userComplete) {
                                userComplete.apply(this, arguments);
                            }
                            drilldownComplete.apply(this, arguments);
                        };
                }

                (point as MapPointType).zoomTo(animOptions);

            } else {
                chart.addSingleSeriesAsDrilldown(point, options);
                chart.applyDrilldown();
            }
        } else {
            chart.addSingleSeriesAsDrilldown(point, options);
            chart.applyDrilldown();
        }
    }

    /** @internal */
    public addSingleSeriesAsDrilldown(
        this: (this|Drilldown.ChartComposition),
        point: Point,
        ddOptions: SeriesTypeOptions
    ): void {
        const chart = (
                (this as this).chart ||
                (this as Drilldown.ChartComposition)
            ),
            oldSeries = point.series,
            xAxis = oldSeries.xAxis,
            yAxis = oldSeries.yAxis,
            colorProp: SeriesOptions = chart.styledMode ?
                { colorIndex: pick(point.colorIndex, oldSeries.colorIndex) } :
                { color: point.color || oldSeries.color },
            levelNumber = oldSeries.options._levelNumber || 0;

        if (!chart.drilldownLevels) {
            chart.drilldownLevels = [];
        }

        ddOptions = extend(extend<SeriesOptions>({
            _ddSeriesId: ddSeriesId++
        }, colorProp), ddOptions);

        let levelSeries: Array<Series> = [],
            levelSeriesOptions: Array<SeriesOptions> = [],
            last: (Drilldown.LevelObject|undefined);

        // See if we can reuse the registered series from last run
        last = chart.drilldownLevels[chart.drilldownLevels.length - 1];
        if (last && last.levelNumber !== levelNumber) {
            last = void 0;
        }

        // Record options for all current series
        oldSeries.chart.series.forEach((series): void => {
            if (series.xAxis === xAxis) {
                series.options._ddSeriesId =
                    series.options._ddSeriesId || ddSeriesId++;
                series.options.colorIndex = series.colorIndex;
                series.options._levelNumber =
                    series.options._levelNumber || levelNumber; // #3182

                if (last) {
                    levelSeries = last.levelSeries;
                    levelSeriesOptions = last.levelSeriesOptions;
                } else {
                    levelSeries.push(series);

                    // (#10597)
                    series.purgedOptions = merge<SeriesTypeOptions>({
                        _ddSeriesId: series.options._ddSeriesId,
                        _levelNumber: series.options._levelNumber,
                        selected: series.options.selected
                    }, series.userOptions);

                    levelSeriesOptions.push(series.purgedOptions);
                }
            }
        });

        // Add a record of properties for each drilldown level
        const level = extend<Drilldown.LevelObject>({
            levelNumber: levelNumber,
            seriesOptions: oldSeries.options,
            seriesPurgedOptions: oldSeries.purgedOptions as any,
            levelSeriesOptions: levelSeriesOptions,
            levelSeries: levelSeries,
            shapeArgs: point.shapeArgs,
            // No graphic in line series with markers disabled
            bBox: point.graphic ? point.graphic.getBBox() : {},
            color: point.isNull ? 'rgba(0,0,0,0)' : colorProp.color,
            lowerSeriesOptions: ddOptions,
            pointOptions: point.options,
            pointIndex: point.index,
            oldExtremes: {
                xMin: xAxis && xAxis.userMin,
                xMax: xAxis && xAxis.userMax,
                yMin: yAxis && yAxis.userMin,
                yMax: yAxis && yAxis.userMax
            },
            resetZoomButton: last && last.levelNumber === levelNumber ?
                void 0 : chart.resetZoomButton as any
        } as any, colorProp);

        // Push it to the lookup array
        chart.drilldownLevels.push(level);

        // Reset names to prevent extending (#6704)
        if (xAxis && xAxis.names) {
            xAxis.names.length = 0;
        }

        const newSeries = level.lowerSeries = chart.addSeries(ddOptions, false);
        newSeries.options._levelNumber = levelNumber + 1;
        if (xAxis) {
            xAxis.oldPos = xAxis.pos;
            xAxis.userMin = xAxis.userMax = null as any;
            yAxis.userMin = yAxis.userMax = null as any;
        }
        newSeries.isDrilling = true;

        // Run fancy cross-animation on supported and equal types
        if (oldSeries.type === newSeries.type) {
            newSeries.animate = (newSeries.animateDrilldown || noop);
            newSeries.options.animation = true;
        }
    }

    public applyDrilldown(
        this: (this|Drilldown.ChartComposition)
    ): void {
        const chart = (
                (this as this).chart ||
                (this as Drilldown.ChartComposition)
            ),
            drilldownLevels = chart.drilldownLevels;

        let levelToRemove: (number|undefined);

        if (drilldownLevels && drilldownLevels.length > 0) {
            // #3352, async loading
            levelToRemove =
                drilldownLevels[drilldownLevels.length - 1].levelNumber;
            chart.hasCartesianSeries = drilldownLevels.some(
                (level): boolean => level.lowerSeries.isCartesian // #19725
            );
            (chart.drilldownLevels || []).forEach((level): void => {

                if (
                    chart.mapView &&
                    chart.options.drilldown &&
                    chart.options.drilldown.mapZooming
                ) {
                    chart.redraw();
                    level.lowerSeries.isDrilling = false;
                    chart.mapView.fitToBounds(
                        (level.lowerSeries as MapSeriesType).bounds
                    );
                    level.lowerSeries.isDrilling = true;
                }

                if (level.levelNumber === levelToRemove) {
                    level.levelSeries.forEach((series): void => {
                        // Not removed, not added as part of a multi-series
                        // drilldown
                        if (!chart.mapView) {
                            if (
                                series.options &&
                                series.options._levelNumber === levelToRemove
                            ) {
                                series.remove(false);
                            }

                        // Deal with asonchrynous removing of map series
                        // after zooming into
                        } else if (
                            series.options &&
                            series.options._levelNumber === levelToRemove &&
                            series.group
                        ) {
                            let animOptions: (
                                boolean|Partial<AnimationOptions>|undefined
                            ) = {};

                            if (chart.options.drilldown) {
                                animOptions = chart.options.drilldown.animation;
                            }

                            series.group.animate({
                                opacity: 0
                            },
                            animOptions,
                            (): void => {
                                series.remove(false);
                                // If it is the last series
                                if (
                                    !(level.levelSeries.filter(
                                        (el): number => Object.keys(el).length
                                    )).length
                                ) {
                                    // We have a reset zoom button. Hide it and
                                    // detach it from the chart. It is
                                    // preserved to the layer config above.
                                    if (chart.resetZoomButton) {
                                        chart.resetZoomButton.hide();
                                        delete chart.resetZoomButton;
                                    }

                                    chart.pointer?.reset();

                                    fireEvent(chart, 'afterDrilldown');

                                    if (chart.mapView) {
                                        chart.series.forEach((series): void => {
                                            series.isDirtyData = true;
                                            series.isDrilling = false;
                                        });
                                        chart.mapView
                                            .fitToBounds(void 0, void 0);
                                        chart.mapView.allowTransformAnimation =
                                            true; // #20857
                                    }
                                    fireEvent(chart, 'afterApplyDrilldown');
                                }
                            });
                        }
                    });
                }
            });
        }

        if (!chart.mapView) {
            // We have a reset zoom button. Hide it and detach it from the
            // chart. It is preserved to the layer config above.
            if (chart.resetZoomButton) {
                chart.resetZoomButton.hide();
                delete chart.resetZoomButton;
            }

            chart.pointer?.reset();

            fireEvent(chart, 'afterDrilldown');

            // Axes shouldn't be visible after drilling into non-cartesian
            // (#19725)
            if (!chart.hasCartesianSeries) {
                chart.axes.forEach((axis): void => {
                    axis.destroy(true);
                    axis.init(chart, merge(axis.userOptions, axis.options));
                });
            }

            chart.redraw();
            fireEvent(chart, 'afterApplyDrilldown');
        }
    }

    /**
     * When the chart is drilled down to a child series, calling
     * `chart.drillUp()` will drill up to the parent series.
     *
     * @function Highcharts.Chart#drillUp
     *
     * @sample highcharts/drilldown/programmatic
     *         Programmatic drilldown
     *
     * @requires modules/drilldown
     */
    public drillUp(
        this: (this|Drilldown.ChartComposition),
        isMultipleDrillUp?: boolean
    ): void {
        const chart = (
            (this as this).chart ||
            (this as Drilldown.ChartComposition)
        );

        if (!chart.drilldownLevels || chart.drilldownLevels.length === 0) {
            return;
        }

        fireEvent(chart, 'beforeDrillUp');

        const drilldownLevels = chart.drilldownLevels as any,
            levelNumber =
                drilldownLevels[drilldownLevels.length - 1].levelNumber,
            chartSeries = chart.series,
            drilldownLevelsNumber = (chart.drilldownLevels as any).length,
            addSeries = (
                seriesOptions: SeriesOptions,
                oldSeries: Series
            ): (Series|undefined) => {
                let addedSeries;

                chartSeries.forEach((series): void => {
                    if (
                        series.options._ddSeriesId ===
                            seriesOptions._ddSeriesId
                    ) {
                        addedSeries = series;
                    }
                });

                addedSeries =
                    addedSeries || chart.addSeries(seriesOptions, false);
                if (
                    addedSeries.type === oldSeries.type &&
                    addedSeries.animateDrillupTo
                ) {
                    addedSeries.animate = addedSeries.animateDrillupTo;
                }

                if (seriesOptions === level.seriesPurgedOptions) {
                    return addedSeries;
                }
            },
            removeSeries = (oldSeries: Series): void => {
                oldSeries.remove(false);
                chart.series.forEach((series): void => {
                    // Ensures to redraw series to get correct colors
                    if (series.colorAxis) {
                        series.isDirtyData = true;
                    }
                    series.options.inactiveOtherPoints = false;
                });
                chart.redraw();
            };

        let i = drilldownLevels.length,
            seriesI: number,
            level: Drilldown.LevelObject,
            oldExtremes: Record<string, (number|undefined)>;

        // Reset symbol and color counters after every drill-up. (#19134)
        chart.symbolCounter = chart.colorCounter = 0;

        while (i--) {

            let oldSeries: Series,
                newSeries: Series | undefined;

            level = drilldownLevels[i];
            if (level.levelNumber === levelNumber) {
                drilldownLevels.pop();

                // Get the lower series by reference or id
                oldSeries = level.lowerSeries;
                if (!oldSeries.chart) { // #2786
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

                // Overcome problems with minRange (#2898)
                oldSeries.dataTable.setColumn('x', []);

                // Reset the names to start new series from the beginning.
                // Do it once to preserve names when multiple
                // series are added for the same axis, #16135.
                if (
                    oldSeries.xAxis &&
                    oldSeries.xAxis.names &&
                    (
                        drilldownLevelsNumber === 0 ||
                        i === drilldownLevelsNumber - 1
                    )
                ) {
                    oldSeries.xAxis.names.length = 0;
                }

                level.levelSeriesOptions.forEach((el): void => {
                    const addedSeries = addSeries(el, oldSeries);
                    if (addedSeries) {
                        newSeries = addedSeries;
                    }
                });

                fireEvent(chart, 'drillup', {
                    seriesOptions: level.seriesPurgedOptions ||
                        level.seriesOptions
                });

                if (newSeries) {
                    if (newSeries.type === oldSeries.type) {
                        newSeries.drilldownLevel = level;
                        newSeries.options.animation =
                            (chart.options.drilldown as any).animation;
                        // #2919
                        if (oldSeries.animateDrillupFrom && oldSeries.chart) {
                            oldSeries.animateDrillupFrom(level);
                        }
                    }
                    newSeries.options._levelNumber = levelNumber;
                }

                const seriesToRemove = oldSeries;
                // Cannot access variable changed in loop
                if (!chart.mapView) {
                    seriesToRemove.remove(false);
                }

                // Reset the zoom level of the upper series
                if (newSeries && newSeries.xAxis) {
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
                }

                if (!chart.mapView) {
                    fireEvent(chart, 'afterDrillUp');
                } else {
                    const shouldAnimate = level.levelNumber === levelNumber &&
                        isMultipleDrillUp,
                        zoomingDrill = chart.options.drilldown &&
                        chart.options.drilldown.animation &&
                        chart.options.drilldown.mapZooming;

                    if (shouldAnimate) {
                        oldSeries.remove(false);
                    } else {
                        // Hide and disable dataLabels
                        oldSeries.dataLabelsGroups?.forEach((g): void => {
                            g?.destroy();
                        });
                        oldSeries.dataLabelsGroups = [];

                        if (chart.mapView && newSeries) {
                            if (zoomingDrill) {
                                // Stop hovering while drilling down
                                oldSeries.isDrilling = true;
                                newSeries.isDrilling = true;
                                chart.redraw(false);
                                // Fit to previous bounds
                                chart.mapView.fitToBounds(
                                    (oldSeries as any).bounds,
                                    void 0,
                                    true,
                                    false
                                );
                            }

                            chart.mapView.allowTransformAnimation = true;

                            fireEvent(chart, 'afterDrillUp', {
                                seriesOptions:
                                    newSeries ? newSeries.userOptions : void 0
                            });

                            if (zoomingDrill) {
                                // Fit to natural bounds
                                chart.mapView.setView(
                                    void 0,
                                    pick(chart.mapView.minZoom, 1),
                                    true,
                                    {
                                        complete: function (): void {
                                            // Fire it only on complete in this
                                            // place (once)
                                            if (
                                                Object.prototype.hasOwnProperty
                                                    .call(this, 'complete')
                                            ) {
                                                removeSeries(oldSeries);
                                            }
                                        }
                                    }
                                );
                                newSeries._hasTracking = false;
                            } else {
                                // When user don't want to zoom into region only
                                // fade out
                                chart.mapView.allowTransformAnimation = false;
                                if (oldSeries.group) {
                                    oldSeries.group.animate({
                                        opacity: 0
                                    },
                                    (chart.options.drilldown as any).animation,
                                    (): void => {
                                        removeSeries(oldSeries);
                                        if (chart.mapView) {
                                            chart.mapView
                                                .allowTransformAnimation = true;
                                        }
                                    });
                                } else {
                                    removeSeries(oldSeries);
                                    chart.mapView
                                        .allowTransformAnimation = true;
                                }
                            }

                            newSeries.isDrilling = false;
                        }
                    }
                }
            }
        }

        if (!chart.mapView && !isMultipleDrillUp) {
            chart.redraw();
        }

        if (chart.ddDupes) {
            chart.ddDupes.length = 0; // #3315
        } // #8324
        // Fire a once-off event after all series have been
        // drilled up (#5158)
        fireEvent(chart, 'drillupall');
    }

    /**
     * A function to fade in a group. First, the element is being hidden, then,
     * using `opactiy`, is faded in. Used for example by `dataLabelsGroup` where
     * simple SVGElement.fadeIn() is not enough, because of other features (e.g.
     * InactiveState) using `opacity` to fadeIn/fadeOut.
     *
     * @requires modules/drilldown
     *
     * @internal
     * @param {SVGElement} [group]
     *        The SVG element to be faded in.
     */
    public fadeInGroup(
        group?: SVGElement
    ): void {
        const chart = this.chart,
            animationOptions = animObject(
                (chart.options.drilldown as any).animation
            );

        if (group) {
            group.hide();

            syncTimeout(
                (): void => {
                    // Make sure neither group nor chart were destroyed
                    if (group && group.added) {
                        group.fadeIn();
                    }
                },
                Math.max(animationOptions.duration - 50, 0)
            );
        }
    }

    /**
     * Update function to be called internally from Chart.update (#7600, #12855)
     * @internal
     */
    public update(
        options: Partial<DrilldownOptions>,
        redraw?: boolean
    ): void {
        const chart = this.chart;

        merge(true, chart.options.drilldown, options);

        if (pick(redraw, true)) {
            chart.redraw();
        }
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace Drilldown {

    /* *
     *
     *  Declarations
     *
     * */

    /** @internal */
    export declare class ChartComposition extends Chart {
        drilldown?: ChartAdditions;
    }

    /**
     * The event arguments when a drilldown point is clicked.
     *
     * @interface Highcharts.DrilldownEventObject
     */
    export interface DrilldownEventObject {
        /**
         * If a category label was clicked, which index.
         * @name Highcharts.DrilldownEventObject#category
         * @type {number|undefined}
         */
        category?: number;

        /** @internal */
        defaultPrevented?: boolean;

        /**
         * The original browser event (usually click) that triggered the
         * drilldown.
         *
         * @name Highcharts.DrilldownEventObject#originalEvent
         * @type {global.Event|undefined}
         */
        originalEvent?: Event;

        /**
         * The originating point.
         *
         * @name Highcharts.DrilldownEventObject#point
         * @type {Highcharts.Point}
         */
        point: Point;

        /**
         * If a category label was clicked, this array holds all points
         * corresponding to the category. Otherwise it is set to false.
         *
         * @name Highcharts.DrilldownEventObject#points
         * @type {boolean|Array<Highcharts.Point>|undefined}
         */
        points?: Array<(boolean|Point)>;

        /**
         * Prevents the default behavior of the event.
         *
         * @name Highcharts.DrilldownEventObject#preventDefault
         * @type {Function}
         */
        preventDefault: Function;

        /**
         * Options for the new series. If the event is utilized for async
         * drilldown, the seriesOptions are not added, but rather loaded async.
         *
         * @name Highcharts.DrilldownEventObject#seriesOptions
         * @type {Highcharts.SeriesOptionsType|undefined}
         */
        seriesOptions?: SeriesTypeOptions;

        /**
         * The event target.
         *
         * @name Highcharts.DrilldownEventObject#target
         * @type {Highcharts.Chart}
         */
        target: Chart;

        /**
         * The event type.
         *
         * @name Highcharts.DrilldownEventObject#type
         * @type {"drilldown"}
         */
        type: 'drilldown';
    }

    /**
     * The event arguments when all the series have been drilled up.
     *
     * @interface Highcharts.DrillupAllEventObject
     */
    export interface DrillupAllEventObject {
        /**
        * Prevents the default behavior of the event.
        *
        * @name Highcharts.DrillupAllEventObject#preventDefault
        * @type {Function}
        */
        preventDefault: Function;

        /**
        * The event target.
        *
        * @name Highcharts.DrillupAllEventObject#target
        * @type {Highcharts.Chart}
        */
        target: Chart;

        /**
        * The event type.
        *
        * @name Highcharts.DrillupAllEventObject#type
        * @type {"drillupall"}
        */
        type: 'drillupall';
    }

    /**
     * The event arguments when drilling up from a drilldown series.
     *
     * @interface Highcharts.DrillupEventObject
     */
    export interface DrillupEventObject {
        /**
         * Prevents the default behavior of the event.
         *
         * @name Highcharts.DrillupEventObject#preventDefault
         * @type {Function}
         */
        preventDefault: Function;

        /**
        * Options for the new series.
        *
        * @name Highcharts.DrillupEventObject#seriesOptions
        * @type {Highcharts.SeriesOptionsType|undefined}
        */
        seriesOptions?: SeriesTypeOptions;

        /**
        * The event target.
        *
        * @name Highcharts.DrillupEventObject#target
        * @type {Highcharts.Chart}
        */
        target: Chart;

        /**
        * The event type.
        *
        * @name Highcharts.DrillupEventObject#type
        * @type {"drillup"}
        */
        type: 'drillup';
    }

    /** @internal */
    export interface LevelObject {
        bBox: (BBoxObject|Record<string, undefined>);
        color?: ColorType;
        colorIndex?: number;
        levelNumber: number;
        levelSeries: Array<Series>;
        levelSeriesOptions: Array<SeriesOptions>;
        lowerSeries: Series;
        lowerSeriesOptions: SeriesOptions;
        oldExtremes: Record<string, (number|undefined)>;
        pointIndex: number;
        pointOptions: (PointOptions|PointShortOptions);
        seriesOptions: SeriesOptions;
        seriesPurgedOptions: SeriesOptions;
        shapeArgs?: SVGAttributes;
        resetZoomButton: SVGElement;
    }

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    export function compose(
        AxisClass: typeof Axis,
        ChartClass: typeof Chart,
        highchartsDefaultOptions: Options,
        SeriesClass: typeof Series,
        seriesTypes: SeriesTypeRegistry,
        SVGRendererClass: typeof SVGRenderer,
        TickClass: typeof Tick
    ): void {
        DrilldownSeries.compose(SeriesClass, seriesTypes);

        const DrilldownChart = ChartClass as typeof ChartComposition,
            chartProto = DrilldownChart.prototype;

        if (!chartProto.drillUp) {
            const SVGElementClass = SVGRendererClass.prototype.Element,
                addonProto = ChartAdditions.prototype,
                axisProto = AxisClass.prototype,
                elementProto = SVGElementClass.prototype,
                tickProto = TickClass.prototype;

            axisProto.drilldownCategory = axisDrilldownCategory;
            axisProto.getDDPoints = axisGetDDPoints;

            Breadcrumbs.compose(ChartClass, highchartsDefaultOptions);

            addEvent(Breadcrumbs, 'up', onBreadcrumbsUp);

            chartProto.addSeriesAsDrilldown = addonProto.addSeriesAsDrilldown;
            chartProto.addSingleSeriesAsDrilldown =
                addonProto.addSingleSeriesAsDrilldown;
            chartProto.applyDrilldown = addonProto.applyDrilldown;
            chartProto.drillUp = addonProto.drillUp;

            addEvent(DrilldownChart, 'afterDrilldown', onChartAfterDrilldown);
            addEvent(DrilldownChart, 'afterDrillUp', onChartAfterDrillUp);
            addEvent(DrilldownChart, 'afterInit', onChartAfterInit);
            addEvent(DrilldownChart, 'drillup', onChartDrillup);
            addEvent(DrilldownChart, 'drillupall', onChartDrillupall);
            addEvent(DrilldownChart, 'render', onChartRender);
            addEvent(DrilldownChart, 'update', onChartUpdate);

            highchartsDefaultOptions.drilldown = DrilldownDefaults;

            elementProto.fadeIn = svgElementFadeIn;

            tickProto.drillable = tickDrillable;
        }
    }

    /** @internal */
    function onBreadcrumbsUp(
        this: Breadcrumbs,
        e: AnyRecord
    ): void {
        const chart = this.chart,
            drillUpsNumber = this.getLevel() - e.newLevel;

        let isMultipleDrillUp = drillUpsNumber > 1;

        for (let i = 0; i < drillUpsNumber; i++) {
            if (i === drillUpsNumber - 1) {
                isMultipleDrillUp = false;
            }
            chart.drillUp(isMultipleDrillUp);
        }

    }

    /** @internal */
    function onChartAfterDrilldown(
        this: ChartComposition
    ): void {
        const chart = this,
            drilldownOptions = chart.options.drilldown,
            breadcrumbsOptions =
                drilldownOptions && drilldownOptions.breadcrumbs;

        if (!chart.breadcrumbs) {
            chart.breadcrumbs = new Breadcrumbs(chart, breadcrumbsOptions);
        }

        chart.breadcrumbs.updateProperties(createBreadcrumbsList(chart));

    }

    /** @internal */
    function onChartAfterDrillUp(
        this: ChartComposition
    ): void {
        const chart = this;

        if (chart.breadcrumbs) {
            chart.breadcrumbs.updateProperties(createBreadcrumbsList(chart));
        }
    }


    /**
     * Add update function to be called internally from Chart.update (#7600,
     * #12855)
     * @internal
     */
    function onChartAfterInit(
        this: ChartComposition
    ): void {
        this.drilldown = new ChartAdditions(this);
    }

    /** @internal */
    function onChartDrillup(
        this: ChartComposition
    ): void {
        const chart = this;

        if (chart.resetZoomButton) {
            chart.resetZoomButton = chart.resetZoomButton.destroy();
        }
    }

    /** @internal */
    function onChartDrillupall(
        this: ChartComposition
    ): void {
        const chart = this;

        if (chart.resetZoomButton) {
            chart.showResetZoom();
        }
    }

    /** @internal */
    function onChartRender(
        this: ChartComposition
    ): void {
        (this.xAxis || []).forEach((axis): void => {
            axis.ddPoints = {};
            axis.series.forEach((series): void => {
                const xData = series.getColumn('x'),
                    points = series.points;

                for (let i = 0, iEnd = xData.length, p; i < iEnd; i++) {
                    p = (series.options.data as any)[i];

                    // The `drilldown` property can only be set on an array or an
                    // object
                    if (typeof p !== 'number') {

                        // Convert array to object (#8008)
                        p = series.pointClass.prototype.optionsToObject
                            .call({ series: series }, p);

                        if (p.drilldown) {
                            if (!(axis.ddPoints as any)[xData[i]]) {
                                (axis.ddPoints as any)[xData[i]] = [];
                            }

                            const index = i - (series.cropStart || 0);

                            (axis.ddPoints as any)[xData[i]].push(
                                points && index >= 0 && index < points.length ?
                                    points[index] :
                                    true
                            );
                        }
                    }
                }
            });

            // Add drillability to ticks, and always keep it drillability
            // updated (#3951)
            objectEach(axis.ticks, (tick): void => tick.drillable());
        });
    }

    /** @internal */
    function onChartUpdate(
        this: ChartComposition,
        e: { options: Options }
    ): void {
        const breadcrumbs = this.breadcrumbs,
            breadcrumbOptions =
                e.options.drilldown && e.options.drilldown.breadcrumbs;

        if (breadcrumbs && breadcrumbOptions) {
            breadcrumbs.update(breadcrumbOptions);
        }
    }

    /**
     * A general fadeIn method.
     *
     * @requires modules/drilldown
     *
     * @function Highcharts.SVGElement#fadeIn
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     * The animation options for the element fade.
     */
    function svgElementFadeIn(
        this: SVGElement,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const elem = this;
        elem
            .attr({
                opacity: 0.1,
                visibility: 'inherit'
            })
            .animate({
                opacity: pick(elem.newOpacity, 1) // `newOpacity` used in maps
            }, animation || {
                duration: 250
            });
    }

    /**
     * Make a tick label drillable, or remove drilling on update.
     * @internal
     */
    function tickDrillable(
        this: Tick
    ): void {
        const pos = this.pos,
            label = this.label,
            axis = this.axis,
            isDrillable = axis.coll === 'xAxis' && axis.getDDPoints,
            ddPointsX = isDrillable && axis.getDDPoints(pos),
            styledMode = axis.chart.styledMode;

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

                label.removeOnDrillableClick = addEvent(
                    label.element,
                    'click',
                    function (e: MouseEvent): void {
                        e.preventDefault();
                        axis.drilldownCategory(pos, e);
                    }
                );

                if (!styledMode && axis.chart.options.drilldown) {
                    label.css(
                        axis.chart.options.drilldown.activeAxisLabelStyle || {}
                    );
                }

            } else if (
                label &&
                label.drillable && label.removeOnDrillableClick
            ) {
                if (!styledMode) {
                    label.styles = {}; // Reset for full overwrite of styles
                    label.element.removeAttribute('style'); // #17933
                    label.css(label.basicStyles);
                }

                label.removeOnDrillableClick(); // #3806
                label.removeClass('highcharts-drilldown-axis-label');
            }
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Drilldown;

/* *
 *
 *  API Declarations
 *
 * */

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
 *//**
 * If a category label was clicked, which index.
 * @name Highcharts.DrilldownEventObject#category
 * @type {number|undefined}
 *//**
 * The original browser event (usually click) that triggered the drilldown.
 * @name Highcharts.DrilldownEventObject#originalEvent
 * @type {global.Event|undefined}
 *//**
 * Prevents the default behavior of the event.
 * @name Highcharts.DrilldownEventObject#preventDefault
 * @type {Function}
 *//**
 * The originating point.
 * @name Highcharts.DrilldownEventObject#point
 * @type {Highcharts.Point}
 *//**
 * If a category label was clicked, this array holds all points corresponding to
 * the category. Otherwise it is set to false.
 * @name Highcharts.DrilldownEventObject#points
 * @type {boolean|Array<Highcharts.Point>|undefined}
 *//**
 * Options for the new series. If the event is utilized for async drilldown, the
 * seriesOptions are not added, but rather loaded async.
 * @name Highcharts.DrilldownEventObject#seriesOptions
 * @type {Highcharts.SeriesOptionsType|undefined}
 *//**
 * The event target.
 * @name Highcharts.DrilldownEventObject#target
 * @type {Highcharts.Chart}
 *//**
 * The event type.
 * @name Highcharts.DrilldownEventObject#type
 * @type {"drilldown"}
 */

/**
 * This gets fired after all the series have been drilled up. This is especially
 * useful in a chart with multiple drilldown series.
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
 *//**
 * Prevents the default behavior of the event.
 * @name Highcharts.DrillupAllEventObject#preventDefault
 * @type {Function}
 *//**
 * The event target.
 * @name Highcharts.DrillupAllEventObject#target
 * @type {Highcharts.Chart}
 *//**
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
 *//**
 * Prevents the default behavior of the event.
 * @name Highcharts.DrillupEventObject#preventDefault
 * @type {Function}
 *//**
 * Options for the new series.
 * @name Highcharts.DrillupEventObject#seriesOptions
 * @type {Highcharts.SeriesOptionsType|undefined}
 *//**
 * The event target.
 * @name Highcharts.DrillupEventObject#target
 * @type {Highcharts.Chart}
 *//**
 * The event type.
 * @name Highcharts.DrillupEventObject#type
 * @type {"drillup"}
 */

''; // Keeps doclets above in JS file
