/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Handling for Windows High Contrast Mode.
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Accessibility from './Accessibility';
import type { Options } from '../Core/Options';
import type ColorType from '../Core/Color/ColorType';
import type Point from '../Core/Series/Point';
import type {
    PointOptions,
    PointShortOptions
} from '../Core/Series/PointOptions';
import type Series from '../Core/Series/Series';
import type SeriesOptions from '../Core/Series/SeriesOptions';

import H from '../Core/Globals.js';
const {
    doc,
    isMS,
    win
} = H;
import {
    diffObjects,
    find,
    isArray,
    isObject,
    merge,
    objectEach,
    splat
} from '../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * The color options that the high contrast theme overrides directly on series
 * and points, and that therefore have to be remembered in order to be able to
 * restore them.
 */
interface HighContrastColorOptions {
    borderColor?: ColorType;
    color?: ColorType;
    colors?: Array<ColorType>;
    fillColor?: ColorType;
}

interface PointRestore {
    options: HighContrastColorOptions;
    point: Point;
}

interface SeriesRestore {
    options: HighContrastColorOptions;
    points: Array<PointRestore>;
    series: Series;
}

interface HighContrastState {
    // The theme should be in effect
    active?: boolean;
    // The theme is currently merged into the chart options
    applied?: boolean;
    // The theme is being applied or removed right now
    applying?: boolean;
    chartOptions?: Partial<Options>;
    removeMediaQueryListener?: Function;
    seriesRestore?: Array<SeriesRestore>;
    userOptions?: Partial<Options>;
}

declare module '../Core/Chart/ChartBase'{
    interface ChartBase {
        highContrastState?: HighContrastState;
    }
}

declare module '../Core/Series/PointBase' {
    interface PointBase {
        borderColor?: ColorType;
    }
}

/* *
 *
 *  Constants
 *
 * */

const forcedColorsQuery = '(forced-colors: active)';

const seriesColorProps: Array<keyof HighContrastColorOptions> = [
    'borderColor',
    'color',
    'colors',
    'fillColor'
];

const pointColorProps: Array<keyof HighContrastColorOptions> = [
    'borderColor',
    'color'
];

/* *
 *
 *  Functions
 *
 * */

/**
 * Detect WHCM in the browser.
 *
 * @function Highcharts#isHighContrastModeActive
 * @private
 * @return {boolean} Returns true if the browser is in High Contrast mode.
 */
function isHighContrastModeActive(): boolean {
    // Test BG image for IE
    if (isMS && win.getComputedStyle) {
        const testDiv = doc.createElement('div');
        const imageSrc = 'data:image/gif;base64,' +
            'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        testDiv.style.backgroundImage = `url(${imageSrc})`; // #13071
        doc.body.appendChild(testDiv);

        const bi = (
            testDiv.currentStyle as unknown as CSSStyleDeclaration ||
            win.getComputedStyle(testDiv)
        ).backgroundImage;

        doc.body.removeChild(testDiv);

        return bi === 'none';
    }

    // Other browsers use the forced-colors standard
    return win.matchMedia && win.matchMedia(forcedColorsQuery).matches;
}

/**
 * Get the high contrast state storage for a chart, creating it if needed.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to get the state for.
 * @return {Highcharts.HighContrastState} The state object.
 */
function getHighContrastState(
    chart: Accessibility.ChartComposition
): HighContrastState {
    return chart.highContrastState || (
        chart.highContrastState = {}
    );
}

/**
 * Copy the color options that the high contrast theme overrides, so that they
 * can be handed back to `update` later on.
 *
 * @private
 * @param {Highcharts.Dictionary<*>} source Options to copy from.
 * @param {Array<string>} props The option names to copy.
 * @return {Highcharts.HighContrastColorOptions} The copied options.
 */
function copyColorOptions(
    source: AnyRecord,
    props: Array<keyof HighContrastColorOptions>
): HighContrastColorOptions {
    const copied: AnyRecord = {};

    props.forEach((prop): void => {
        copied[prop] = source[prop];
    });

    return copied;
}

/**
 * Overwrite the remembered options with the ones the user explicitly sets, so
 * that changes made while the theme is applied are not rolled back with it.
 *
 * @private
 * @param {Highcharts.HighContrastColorOptions} stored Options to update.
 * @param {Highcharts.Dictionary<*>} newOptions The options from the update.
 * @param {Array<string>} props The option names to consider.
 * @return {void}
 */
function mergeColorOptions(
    stored: HighContrastColorOptions,
    newOptions: AnyRecord,
    props: Array<keyof HighContrastColorOptions>
): void {
    props.forEach((prop): void => {
        if (prop in newOptions) {
            (stored as AnyRecord)[prop] = newOptions[prop];
        }
    });
}

/**
 * Find the remembered options for a series, if we have already stored them.
 *
 * @private
 * @param {Highcharts.HighContrastState} state The chart high contrast state.
 * @param {Highcharts.Series} series The series to look up.
 * @return {Highcharts.HighContrastSeriesRestore|undefined} The stored options.
 */
function findSeriesRestore(
    state: HighContrastState,
    series: Series
): (SeriesRestore|undefined) {
    return find(
        state.seriesRestore || [],
        (entry: SeriesRestore): boolean => entry.series === series
    );
}

/**
 * Find the remembered options for a point, if we have already stored them.
 *
 * @private
 * @param {Array<*>} entries The stored point options for the series.
 * @param {Highcharts.Point} point The point to look up.
 * @return {Highcharts.HighContrastPointRestore|undefined} The stored options.
 */
function findPointRestore(
    entries: Array<PointRestore>,
    point: Point
): (PointRestore|undefined) {
    return find(
        entries,
        (entry: PointRestore): boolean => entry.point === point
    );
}

/**
 * Pick the entries that can safely be handed back from a remembered set of
 * options. An entry is only restored when the value in effect is still the one
 * the theme set, so that changes made in the meantime survive. This also covers
 * the options that are written straight into `chart.options`, the way
 * `Chart#setTitle`, `Legend#update` and `Tooltip#update` do, without having to
 * listen for each of them.
 *
 * @private
 * @param {Highcharts.Dictionary<*>} stored The remembered options.
 * @param {Highcharts.Dictionary<*>} theme The options the theme applied.
 * @param {Highcharts.Dictionary<*>} current The options in effect.
 * @param {Array<string>} [collections] Collections to match item by item.
 * @return {Highcharts.Dictionary<*>} The options to hand back.
 */
function getRestorableOptions(
    stored: AnyRecord,
    theme: AnyRecord,
    current: AnyRecord,
    collections?: Array<string>
): AnyRecord {
    const restorable: AnyRecord = isArray(stored) ? [] : {};

    objectEach(stored, function (storedValue, key): void {
        const themeValue = isArray(storedValue) && collections &&
            collections.indexOf(key) > -1 ?
                // Collections were remembered item by item
                splat(theme[key]) :
                theme[key],
            currentValue = current[key];

        if (isObject(storedValue) && isObject(themeValue)) {
            const nested = getRestorableOptions(
                storedValue,
                themeValue,
                isObject(currentValue) ? currentValue as AnyRecord : {}
            );

            if (Object.keys(nested).length) {
                restorable[key] = nested;
            }
        } else if (currentValue === themeValue) {
            restorable[key] = storedValue;
        }
    });

    return restorable;
}

/**
 * Hand the remembered user options back, removing the keys the theme added.
 * The theme is transient, and should not leave the resolved defaults it was
 * measured against behind in `chart.userOptions`.
 *
 * @private
 * @param {Highcharts.Dictionary<*>} target The user options to write to.
 * @param {Highcharts.Dictionary<*>} source The remembered user options.
 * @param {Array<string>} [collections] Collections to match item by item.
 * @return {void}
 */
function restoreUserOptions(
    target: AnyRecord,
    source: AnyRecord,
    collections?: Array<string>
): void {
    objectEach(source, function (value, key): void {
        // Prototype pollution (#14883)
        if (key === '__proto__' || key === 'constructor') {
            return;
        }

        const targetValue = target[key],
            // Collections are matched item by item, so that the chart and its
            // axes and series keep sharing the same user options objects.
            // Other arrays are handed back as they are.
            matchItems = isArray(value) && isArray(targetValue) &&
                !!collections && collections.indexOf(key) > -1;

        if (matchItems) {
            restoreUserOptions(targetValue, value);

        } else if (isObject(value, true)) {
            const nested: AnyRecord = isObject(targetValue, true) ?
                targetValue :
                {};

            restoreUserOptions(nested, value);

            // Objects that hold nothing the user set are dropped, so that the
            // theme does not leave empty structures behind
            if (Object.keys(nested).length) {
                target[key] = nested;
            } else if (!isArray(target)) {
                delete target[key];
            }

        } else if (value === void 0) {
            delete target[key];

        } else {
            target[key] = value;
        }
    });
}

/**
 * Update the chart without resetting responsive rules. High contrast options
 * are transient and must be applied on top of the current responsive state.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to update.
 * @param {Highcharts.Options} options The transient options to apply.
 * @return {void}
 */
function updateChart(
    chart: Accessibility.ChartComposition,
    options: Partial<Options>
): void {
    chart.update(merge(options, {
        isResponsiveOptions: true
    }), false);

    // The flag only tells `update` to leave the responsive rules alone, and has
    // no business staying behind in the user options
    delete chart.userOptions.isResponsiveOptions;
}

/**
 * Force high contrast theme for the chart. The default theme is defined in
 * a separate file.
 *
 * @function Highcharts#setHighContrastTheme
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to set the theme of.
 * @return {void}
 */
function setHighContrastTheme(
    chart: Accessibility.ChartComposition
): void {
    const highContrastState = getHighContrastState(chart);

    highContrastState.active = true;
    highContrastState.applied = true;
    highContrastState.applying = true;

    try {
        // Apply theme to chart
        const theme: AnyRecord = (
            chart.options.accessibility.highContrastTheme
        );

        // Remember the options the theme is about to override. The theme can be
        // applied more than once before it is removed again, so only the first
        // application is recorded.
        if (!highContrastState.chartOptions) {
            highContrastState.chartOptions = diffObjects(
                theme,
                chart.options,
                true,
                chart.collectionsWithUpdate
            );
            // The same for the user options, which hold only what the user has
            // actually set. They are handed back separately, so that the
            // resolved defaults above do not end up there (#15567).
            highContrastState.userOptions = diffObjects(
                theme,
                chart.userOptions,
                true,
                chart.collectionsWithUpdate
            );
        }

        updateChart(chart, theme);

        const hasCustomColors = theme.colors?.length > 1,
            // Rebuilt on every application, so that series and points that
            // have been removed in the meantime are forgotten.
            seriesRestore: Array<SeriesRestore> = [];

        // Force series colors (plotOptions is not enough)
        chart.series.forEach(function (s): void {
            const plotOpts = theme.plotOptions[s.type] || {};

            const fillColor = hasCustomColors && s.colorIndex !== void 0 ?
                theme.colors[s.colorIndex] :
                plotOpts.color || 'window';

            const seriesOptions: Partial<SeriesOptions> = {
                color: plotOpts.color || 'windowText',
                colors: hasCustomColors ?
                    theme.colors : [plotOpts.color || 'windowText'],
                borderColor: plotOpts.borderColor || 'window',
                fillColor
            };

            // Reuse the options from an earlier application if we have them,
            // so that the original colors are not lost.
            const restore: SeriesRestore = (
                findSeriesRestore(highContrastState, s) || {
                    options: copyColorOptions(s.userOptions, seriesColorProps),
                    points: [],
                    series: s
                }
            );
            const pointsRestore = restore.points;

            restore.points = [];
            seriesRestore.push(restore);

            s.update(seriesOptions, false);

            if (s.points) {
                // Force point colors if existing
                s.points.forEach(function (p): void {
                    if (p.options && p.options.color) {
                        restore.points.push(
                            findPointRestore(pointsRestore, p) || {
                                options: copyColorOptions(
                                    p.options,
                                    pointColorProps
                                ),
                                point: p
                            }
                        );

                        p.update({
                            color: plotOpts.color || 'windowText',
                            borderColor: plotOpts.borderColor || 'window'
                        }, false);
                    }
                });
            }
        });

        highContrastState.seriesRestore = seriesRestore;

        // The redraw for each series and after is required for 3D pie
        // (workaround)
        chart.redraw();
    } finally {
        delete highContrastState.applying;
    }
}

/**
 * Hand the chart back the options that the high contrast theme overrode.
 *
 * @function Highcharts#unsetHighContrastTheme
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to reset.
 * @param {boolean} [redraw=true] Whether to redraw the chart afterwards.
 * @return {void}
 */
function unsetHighContrastTheme(
    chart: Accessibility.ChartComposition,
    redraw: boolean = true
): void {
    const highContrastState = getHighContrastState(chart),
        applied = highContrastState.applied;

    // The theme may already have been rolled back for a pending update, in
    // which case there is nothing to hand back, but the chart is still painted
    // with it and needs the redraw
    if (!applied && !redraw) {
        return;
    }

    highContrastState.applied = false;
    highContrastState.applying = true;

    try {
        if (applied) {
            const theme: AnyRecord = (
                    chart.options.accessibility.highContrastTheme
                ),
                collections = chart.collectionsWithUpdate,
                chartOptions = highContrastState.chartOptions,
                userOptions = highContrastState.userOptions;

            if (chartOptions) {
                updateChart(chart, getRestorableOptions(
                    chartOptions,
                    theme,
                    chart.options,
                    collections
                ));
            }

            // The user options are handed back in full. Anything the user has
            // changed in the meantime has been through `chart.update`, which
            // rolls the theme back first, and is therefore part of the
            // remembered options already.
            if (userOptions) {
                restoreUserOptions(chart.userOptions, userOptions, collections);
            }

            (highContrastState.seriesRestore || []).forEach(
                function (restore): void {
                    const series = restore.series;

                    // The series may have been removed while the theme was
                    // applied
                    if (!series.chart) {
                        return;
                    }

                    series.update(restore.options, false);

                    restore.points.forEach(function (pointRestore): void {
                        if (pointRestore.point.series) {
                            pointRestore.point.update(
                                pointRestore.options,
                                false
                            );
                        }
                    });
                }
            );
        }

        if (redraw) {
            chart.redraw();
        }
    } finally {
        delete highContrastState.applying;
        delete highContrastState.chartOptions;
        delete highContrastState.userOptions;
        delete highContrastState.seriesRestore;
    }
}

/**
 * Remove the forced-colors media query listener for the chart.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to clean up.
 * @return {void}
 */
function removeHighContrastModeListener(
    chart: Accessibility.ChartComposition
): void {
    const highContrastState = chart.highContrastState;

    if (highContrastState?.removeMediaQueryListener) {
        highContrastState.removeMediaQueryListener();
        delete highContrastState.removeMediaQueryListener;
    }
}

/**
 * Add a forced-colors media query listener, so that the chart follows the
 * system setting without a page reload.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to update on changes.
 * @return {void}
 */
function addHighContrastModeListener(
    chart: Accessibility.ChartComposition
): void {
    const highContrastState = getHighContrastState(chart);

    if (highContrastState.removeMediaQueryListener) {
        return;
    }

    const mediaQueryList = win.matchMedia && win.matchMedia(forcedColorsQuery);

    if (!mediaQueryList) {
        return;
    }

    const onChange = (): void => {
        const accessibility = chart.accessibility;

        if (accessibility && !accessibility.zombie) {
            accessibility.update();
        }
    };

    // `addListener` is deprecated, but is the only option in Safari < 14
    if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', onChange);
        highContrastState.removeMediaQueryListener = (): void => {
            mediaQueryList.removeEventListener('change', onChange);
        };
    } else if (mediaQueryList.addListener) {
        mediaQueryList.addListener(onChange);
        highContrastState.removeMediaQueryListener = (): void => {
            mediaQueryList.removeListener(onChange);
        };
    }
}

/**
 * Apply or remove the high contrast theme according to the current options and
 * the state the browser reports. Called on every accessibility update.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to update.
 * @return {void}
 */
function updateHighContrastMode(
    chart: Accessibility.ChartComposition
): void {
    const highContrastState = getHighContrastState(chart),
        highContrastMode = chart.options.accessibility.highContrastMode;

    // Don't interfere while the theme is being applied or removed
    if (highContrastState.applying) {
        return;
    }

    if (highContrastMode === 'auto') {
        addHighContrastModeListener(chart);
    } else {
        removeHighContrastModeListener(chart);
    }

    if (
        highContrastMode === true ||
        (
            highContrastMode === 'auto' &&
            isHighContrastModeActive()
        )
    ) {
        setHighContrastTheme(chart);
    } else if (highContrastState.active) {
        highContrastState.active = false;
        unsetHighContrastTheme(chart);
    }
}

/**
 * Roll back the high contrast theme before a chart update is applied, so that
 * the user options the update is merged into are the original ones. The theme
 * is applied again from the accessibility update that follows the redraw.
 *
 * The rollback runs a `chart.update` of its own, which runs to completion
 * before the update that triggered it starts. Other listeners on the chart
 * `update` event can tell it apart by `chart.highContrastState.applying`.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart being updated.
 * @param {Highcharts.Options} options The options passed to `chart.update`.
 * @return {void}
 */
function onChartUpdate(
    chart: Accessibility.ChartComposition,
    options?: Partial<Options>
): void {
    const highContrastState = chart.highContrastState;

    if (
        highContrastState?.applied &&
        !highContrastState.applying
    ) {
        const currentResponsive = options?.isResponsiveOptions &&
            (chart as AnyRecord).currentResponsive;

        unsetHighContrastTheme(chart, false);

        // Responsive undo options are calculated before `chart.update` fires.
        // Recalculate them against the regular options instead of the active
        // high contrast theme.
        if (currentResponsive) {
            currentResponsive.undoOptions = diffObjects(
                currentResponsive.mergedOptions,
                chart.options,
                true,
                chart.collectionsWithUpdate
            );
            currentResponsive.undoOptions.isResponsiveOptions = true;
        }
    }
}

/**
 * Keep the remembered series colors in sync with user updates, so that turning
 * off high contrast mode does not roll the updates back.
 *
 * @private
 * @param {Highcharts.Series} series The series being updated.
 * @param {Highcharts.SeriesOptions} options The options passed to `update`.
 * @return {void}
 */
function onSeriesUpdate(
    series: Series,
    options?: Partial<SeriesOptions>
): void {
    const highContrastState = series.chart?.highContrastState;

    if (!options || !highContrastState?.applied || highContrastState.applying) {
        return;
    }

    const restore = findSeriesRestore(highContrastState, series);

    if (restore) {
        mergeColorOptions(restore.options, options, seriesColorProps);
    }
}

/**
 * Keep the remembered point colors in sync with user updates.
 *
 * @private
 * @param {Highcharts.Point} point The point being updated.
 * @param {Highcharts.PointOptionsType} options The options passed to `update`.
 * @return {void}
 */
function onPointUpdate(
    point: Point,
    options?: (PointOptions|PointShortOptions)
): void {
    const highContrastState = point.series?.chart?.highContrastState;

    if (!highContrastState?.applied || highContrastState.applying) {
        return;
    }

    const restore = findSeriesRestore(highContrastState, point.series),
        pointRestore = restore && findPointRestore(restore.points, point);

    if (pointRestore && options !== void 0) {
        mergeColorOptions(
            pointRestore.options,
            point.optionsToObject(options),
            pointColorProps
        );
    }
}

/* *
 *
 *  Default Export
 *
 * */

const whcm = {
    isHighContrastModeActive,
    onChartUpdate,
    onPointUpdate,
    onSeriesUpdate,
    removeHighContrastModeListener,
    setHighContrastTheme,
    unsetHighContrastTheme,
    updateHighContrastMode
};

export default whcm;
