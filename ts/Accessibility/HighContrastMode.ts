/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Handling for Windows High Contrast Mode.
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

import type Accessibility from './Accessibility';
import type ColorType from '../Core/Color/ColorType';
import type SeriesOptions from '../Core/Series/SeriesOptions';

import H from '../Core/Globals.js';
const {
    doc,
    isMS,
    win
} = H;
import { merge, pick } from '../Shared/Utilities.js';

const systemColorKeywords = new Set([
    'accentcolor',
    'accentcolortext',
    'activetext',
    'buttonborder',
    'buttonface',
    'buttontext',
    'canvas',
    'canvastext',
    'currentcolor',
    'field',
    'fieldtext',
    'graytext',
    'highlight',
    'highlighttext',
    'inherit',
    'initial',
    'linktext',
    'mark',
    'marktext',
    'none',
    'selecteditem',
    'selecteditemtext',
    'transparent',
    'unset',
    'visitedtext',
    'window',
    'windowtext'
]);

function isAuthorColor(color?: unknown): boolean {
    return (
        typeof color === 'string' &&
        !systemColorKeywords.has(color.toLowerCase())
    );
}

/* *
 *
 *  Declarations
 *
 * */

interface HighContrastState {
    active?: boolean;
    applying?: boolean;
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

function hasAuthorDefinedSeriesColors(theme: AnyRecord): boolean {
    if (theme.colors?.some(isAuthorColor)) {
        return true;
    }

    const plotOptions = theme.plotOptions || {};

    return Object.keys(plotOptions).some((seriesType): boolean => {
        const seriesOptions = plotOptions[seriesType] || {};

        return (
            isAuthorColor(seriesOptions.color) ||
            isAuthorColor(seriesOptions.fillColor) ||
            isAuthorColor(seriesOptions.lineColor) ||
            isAuthorColor(seriesOptions.borderColor) ||
            isAuthorColor(seriesOptions.marker?.fillColor) ||
            isAuthorColor(seriesOptions.marker?.lineColor)
        );
    });
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
    // We might want to add additional functionality here in the future for
    // storing the old state so that we can reset the theme if HC mode is
    // disabled. For now, the user will have to reload the page.

    const highContrastState = chart.highContrastState || (
        chart.highContrastState = {}
    );

    highContrastState.active = true;
    highContrastState.applying = true;

    try {
        // Apply theme to chart
        const theme: AnyRecord = chart.options.accessibility.highContrastTheme,
            userTheme: AnyRecord =
                chart.userOptions.accessibility?.highContrastTheme || {},
            preserveAuthorColors = hasAuthorDefinedSeriesColors(userTheme);

        chart.update(theme, false);

        if (preserveAuthorColors) {
            chart.renderer.box.style.setProperty(
                'forced-color-adjust',
                'none'
            );
        }

        const customColors = userTheme.colors,
            hasCustomColors = !!customColors?.length,
            defaultPlotOpts = theme.plotOptions?.series || {},
            userDefaultPlotOpts = userTheme.plotOptions?.series || {};

        // Force series colors (plotOptions is not enough)
        chart.series.forEach(function (s): void {
            const plotOpts = merge(
                    defaultPlotOpts,
                    theme.plotOptions?.[s.type]
                ),
                userPlotOpts = merge(
                    userDefaultPlotOpts,
                    userTheme.plotOptions?.[s.type]
                ),
                colorIndex = pick(s.colorIndex, 0),
                isFilledLineSeries = !!(s.graph && (s as AnyRecord).area),
                seriesColor = hasCustomColors ?
                    customColors[colorIndex % customColors.length] :
                    pick(
                        userPlotOpts.color,
                        userPlotOpts.lineColor,
                        plotOpts.color,
                        plotOpts.lineColor,
                        'windowText'
                    ),
                fillColor = hasCustomColors ?
                    customColors[colorIndex % customColors.length] :
                    pick(
                        userPlotOpts.fillColor,
                        userPlotOpts.color,
                        plotOpts.fillColor,
                        plotOpts.color,
                        'window'
                    ),
                borderColor = pick(
                    userPlotOpts.borderColor,
                    plotOpts.borderColor,
                    'windowText'
                ),
                lineColor = hasCustomColors ?
                    (
                        isFilledLineSeries ?
                            pick(
                                userPlotOpts.lineColor,
                                plotOpts.lineColor,
                                borderColor
                            ) :
                            seriesColor
                    ) :
                    pick(
                        userPlotOpts.lineColor,
                        userPlotOpts.color,
                        plotOpts.lineColor,
                        seriesColor
                    ),
                markerLineColor = hasCustomColors ?
                    (
                        isFilledLineSeries ?
                            lineColor :
                            seriesColor
                    ) :
                    pick(
                        userPlotOpts.marker?.lineColor,
                        userPlotOpts.marker?.fillColor,
                        userPlotOpts.lineColor,
                        userPlotOpts.color,
                        plotOpts.marker?.lineColor,
                        seriesColor
                    ),
                markerLineWidth = (
                    hasCustomColors &&
                    isFilledLineSeries &&
                    userPlotOpts.marker?.lineWidth === void 0
                ) ? 1 : userPlotOpts.marker?.lineWidth;

            const markerOptions: AnyRecord = (
                plotOpts.marker || userPlotOpts.marker
            ) && {
                fillColor: hasCustomColors ?
                    seriesColor :
                    pick(
                        userPlotOpts.marker?.fillColor,
                        userPlotOpts.marker?.lineColor,
                        userPlotOpts.lineColor,
                        userPlotOpts.color,
                        plotOpts.marker?.fillColor,
                        seriesColor
                    ),
                lineColor: markerLineColor
            };

            if (markerOptions && markerLineWidth !== void 0) {
                markerOptions.lineWidth = markerLineWidth;
            }

            const seriesOptions: Partial<SeriesOptions> = {
                color: seriesColor,
                colors: hasCustomColors ?
                    customColors :
                    (pick(userPlotOpts.colors, plotOpts.colors) || [
                        seriesColor
                    ]),
                borderColor,
                fillColor,
                lineColor,
                marker: markerOptions
            };

            s.update(seriesOptions, false);

            if (s.points) {
                // Force point colors if existing
                s.points.forEach(function (p): void {
                    if (p.options && p.options.color) {
                        const pointColor = hasCustomColors ?
                            customColors[
                                pick(p.colorIndex, p.index, 0) %
                                customColors.length
                            ] :
                            seriesColor;

                        p.update({
                            color: pointColor,
                            borderColor
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

/* *
 *
 *  Default Export
 *
 * */

const whcm = {
    isHighContrastModeActive,
    setHighContrastTheme
};

export default whcm;
