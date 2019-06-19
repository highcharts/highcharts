/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Handling for Windows High Contrast Mode.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';

var isMS = H.isMS,
    win = H.win,
    doc = win.document;

var whcm = {

    /**
     * Detect WHCM in the browser.
     *
     * @function Highcharts#isHighContrastModeActive
     * @private
     * @return {boolean} Returns true if the browser is in High Contrast mode.
     */
    isHighContrastModeActive: function () {
        if (
            win.matchMedia &&
            isMS &&
            /Edge\/\d./i.test(win.navigator.userAgent)
        ) {
            // Use media query for Edge
            return win.matchMedia('(-ms-high-contrast: active)').matches;
        }
        if (isMS && win.getComputedStyle) {
            // Test BG image for IE
            var testDiv = doc.createElement('div');
            testDiv.style.backgroundImage = 'url(#)';
            doc.body.appendChild(testDiv);
            var bi = (
                testDiv.currentStyle || win.getComputedStyle(testDiv)
            ).backgroundImage;
            doc.body.removeChild(testDiv);
            return bi === 'none';
        }
        // Not used for other browsers
        return false;
    },

    /**
     * Force high contrast theme for the chart. The default theme is defined in
     * a separate file.
     *
     * @function Highcharts#setHighContrastTheme
     * @private
     * @param {Highcharts.Chart} chart The chart to set the theme of.
     */
    setHighContrastTheme: function (chart) {
        // We might want to add additional functionality here in the future for
        // storing the old state so that we can reset the theme if HC mode is
        // disabled. For now, the user will have to reload the page.

        chart.highContrastModeActive = true;

        // Apply theme to chart
        var theme = chart.options.accessibility.highContrastTheme;
        chart.update(theme, false);

        // Force series colors (plotOptions is not enough)
        chart.series.forEach(function (s) {
            var plotOpts = theme.plotOptions[s.type] || {};
            s.update({
                color: plotOpts.color || 'windowText',
                colors: [plotOpts.color || 'windowText'],
                borderColor: plotOpts.borderColor || 'window'
            });

            // Force point colors if existing
            s.points.forEach(function (p) {
                if (p.options && p.options.color) {
                    p.update({
                        color: plotOpts.color || 'windowText',
                        borderColor: plotOpts.borderColor || 'window'
                    }, false);
                }
            });
        });

        // The redraw for each series and after is required for 3D pie
        // (workaround)
        chart.redraw();
    }

};

export default whcm;
