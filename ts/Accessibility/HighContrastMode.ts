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

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Chart/ChartBase'{
    interface ChartBase {
        highContrastModeActive?: boolean;
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

    chart.highContrastModeActive = true;

    // Apply theme to chart
    const theme: AnyRecord = (
        chart.options.accessibility.highContrastTheme
    );

    chart.update(theme, false);

    const customColors = theme.colors,
        hasCustomColors = customColors?.length > 1,
        defaultPlotOpts = theme.plotOptions?.series || {};

    // Force series colors (plotOptions is not enough)
    chart.series.forEach(function (s): void {
        const plotOpts = merge(defaultPlotOpts, theme.plotOptions?.[s.type]),
            colorIndex = pick(s.colorIndex, 0),
            seriesColor = hasCustomColors ?
                customColors[colorIndex % customColors.length] :
                pick(plotOpts.color, plotOpts.lineColor, 'windowText'),
            fillColor = hasCustomColors ?
                customColors[colorIndex % customColors.length] :
                pick(plotOpts.fillColor, plotOpts.color, 'window'),
            borderColor = pick(plotOpts.borderColor, 'windowText');

        const seriesOptions: Partial<SeriesOptions> = {
            color: seriesColor,
            colors: hasCustomColors ?
                customColors :
                (plotOpts.colors || [seriesColor]),
            borderColor,
            fillColor,
            lineColor: hasCustomColors ?
                seriesColor :
                pick(plotOpts.lineColor, seriesColor),
            marker: plotOpts.marker && {
                fillColor: hasCustomColors ?
                    seriesColor :
                    pick(plotOpts.marker.fillColor, seriesColor),
                lineColor: hasCustomColors ?
                    seriesColor :
                    pick(plotOpts.marker.lineColor, seriesColor)
            }
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
