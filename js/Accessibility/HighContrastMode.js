/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Handling for Windows High Contrast Mode.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
var doc = H.doc, isMS = H.isMS, win = H.win;
var whcm = {
    /**
     * Detect WHCM in the browser.
     *
     * @function Highcharts#isHighContrastModeActive
     * @private
     * @return {boolean} Returns true if the browser is in High Contrast mode.
     */
    isHighContrastModeActive: function () {
        // Use media query on Edge, but not on IE
        var isEdge = /(Edg)/.test(win.navigator.userAgent);
        if (win.matchMedia && isEdge) {
            return win.matchMedia('(-ms-high-contrast: active)').matches;
        }
        // Test BG image for IE
        if (isMS && win.getComputedStyle) {
            var testDiv = doc.createElement('div');
            var imageSrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            testDiv.style.backgroundImage = "url(" + imageSrc + ")"; // #13071
            doc.body.appendChild(testDiv);
            var bi = (testDiv.currentStyle ||
                win.getComputedStyle(testDiv)).backgroundImage;
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
     * @param {Highcharts.AccessibilityChart} chart The chart to set the theme of.
     * @return {void}
     */
    setHighContrastTheme: function (chart) {
        // We might want to add additional functionality here in the future for
        // storing the old state so that we can reset the theme if HC mode is
        // disabled. For now, the user will have to reload the page.
        chart.highContrastModeActive = true;
        // Apply theme to chart
        var theme = (chart.options.accessibility.highContrastTheme);
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
