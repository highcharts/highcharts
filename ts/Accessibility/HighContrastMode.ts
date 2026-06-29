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
import type PointOptions from '../Core/Series/PointOptions';
import type SeriesOptions from '../Core/Series/SeriesOptions';

import H from '../Core/Globals.js';
const {
    doc,
    isMS,
    win
} = H;
import {
    diffObjects
} from '../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

interface HighContrastState {
    active?: boolean;
    applying?: boolean;
    restore?: {
        chartOptions: Partial<Options>;
        pointOptions: Array<Array<PointRestoreOptions>>;
        seriesOptions: Array<AnyRecord>;
    };
    mediaQueryList?: MediaQueryList;
    removeMediaQueryListener?: Function;
}

type PointRestoreOptions = Partial<PointOptions>|undefined;

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
    return win.matchMedia && win.matchMedia('(forced-colors: active)').matches;
}

/**
 * Get the state storage for the chart.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to get state for.
 * @return {Highcharts.Dictionary<*>} The state object.
 */
function getHighContrastState(
    chart: Accessibility.ChartComposition
): HighContrastState {
    return chart.highContrastState || (
        chart.highContrastState = {}
    );
}

/**
 * Store chart, series and point options before high contrast overrides them.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to store options for.
 * @param {Highcharts.Options} theme The high contrast theme.
 * @return {void}
 */
function storeRestoreOptions(
    chart: Accessibility.ChartComposition,
    theme: AnyRecord
): void {
    const highContrastState = getHighContrastState(chart);

    if (highContrastState.restore) {
        return;
    }

    highContrastState.restore = {
        chartOptions: diffObjects(
            theme,
            chart.options,
            true,
            chart.collectionsWithUpdate
        ),
        pointOptions: chart.series.map(
            (series): PointRestoreOptions[] => {
                const points = series.points || [];

                return points.map((point): PointRestoreOptions => {
                    if (point.options?.color) {
                        return {
                            borderColor: (
                                point.options as AnyRecord
                            ).borderColor,
                            color: point.options.color
                        };
                    }

                    return void 0;
                });
            }
        ),
        seriesOptions: chart.series.map((series): AnyRecord => ({
            borderColor: series.userOptions.borderColor,
            color: series.userOptions.color,
            colors: series.userOptions.colors,
            fillColor: series.userOptions.fillColor
        }))
    };
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
    highContrastState.applying = true;

    try {
        // Apply theme to chart
        const theme: AnyRecord = (
            chart.options.accessibility.highContrastTheme
        );

        storeRestoreOptions(chart, theme);

        chart.update(theme, false);

        const hasCustomColors = theme.colors?.length > 1;

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

            s.update(seriesOptions, false);

            if (s.points) {
                // Force point colors if existing
                s.points.forEach(function (p): void {
                    if (p.options && p.options.color) {
                        p.update({
                            color: plotOpts.color || 'windowText',
                            borderColor: plotOpts.borderColor || 'window'
                        }, false);
                    }
                });
            }
        });

        // The redraw for each series and after is required for 3D pie
        // (workaround)
        chart.redraw();
    } finally {
        delete highContrastState.applying;
    }
}

/**
 * Reset the chart options that were overridden by the high contrast theme.
 *
 * @private
 * @param {Highcharts.AccessibilityChart} chart The chart to reset.
 * @return {void}
 */
function unsetHighContrastTheme(
    chart: Accessibility.ChartComposition
): void {
    const highContrastState = getHighContrastState(chart),
        restore = highContrastState.restore;

    if (!restore) {
        highContrastState.active = false;
        return;
    }

    highContrastState.active = false;
    highContrastState.applying = true;

    try {
        chart.update(restore.chartOptions, false);

        chart.series.forEach(function (series, seriesIndex): void {
            const seriesOptions = restore.seriesOptions[seriesIndex];

            if (seriesOptions) {
                series.update(seriesOptions, false);
            }

            if (series.points) {
                series.points.forEach(function (point, pointIndex): void {
                    const pointOptions = restore.pointOptions[seriesIndex]?.[
                        pointIndex
                    ];

                    if (pointOptions) {
                        point.update(pointOptions, false);
                    }
                });
            }
        });

        chart.redraw();
    } finally {
        delete highContrastState.applying;
        delete highContrastState.restore;
    }
}

/**
 * Get the forced-colors media query list.
 *
 * @private
 * @return {MediaQueryList|undefined} The media query list if supported.
 */
function getForcedColorsQuery(): (MediaQueryList|undefined) {
    return win.matchMedia && win.matchMedia('(forced-colors: active)');
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
        delete highContrastState.mediaQueryList;
    }
}

/**
 * Add a forced-colors media query listener for auto high contrast mode.
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

    const mediaQueryList = getForcedColorsQuery();

    if (!mediaQueryList) {
        return;
    }

    const onChange = function (): void {
        const accessibility = chart.accessibility;

        if (accessibility && !accessibility.zombie) {
            accessibility.update();
        }
    };

    if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', onChange);
        highContrastState.removeMediaQueryListener = function (): void {
            mediaQueryList.removeEventListener('change', onChange);
        };
    } else if (mediaQueryList.addListener) {
        mediaQueryList.addListener(onChange);
        highContrastState.removeMediaQueryListener = function (): void {
            mediaQueryList.removeListener(onChange);
        };
    }

    highContrastState.mediaQueryList = mediaQueryList;
}

/**
 * Apply or reset the high contrast theme according to the current mode.
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

    if (highContrastState.applying) {
        return;
    }

    if (highContrastMode === false) {
        removeHighContrastModeListener(chart);

        if (highContrastState.active) {
            unsetHighContrastTheme(chart);
        }

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
        unsetHighContrastTheme(chart);
    }
}

/* *
 *
 *  Default Export
 *
 * */

const whcm = {
    removeHighContrastModeListener,
    isHighContrastModeActive,
    setHighContrastTheme,
    unsetHighContrastTheme,
    updateHighContrastMode
};

export default whcm;
