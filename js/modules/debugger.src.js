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
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var isNumber = U.isNumber;
var addEvent = H.addEvent, setOptions = H.setOptions, each = H.each;
setOptions({
    /**
     * @optionparent chart
     */
    chart: {
        /**
         * Whether to display errors on the chart. When `false`, the errors will
         * be shown only in the console.
         *
         * @sample highcharts/chart/display-errors/
         *         Show errors on chart
         *
         * @since    7.0.0
         * @requires modules/debugger
         */
        displayErrors: true
    }
});
/* eslint-disable no-invalid-this */
addEvent(H.Chart, 'displayError', function (e) {
    var chart = this, code = e.code, msg, options = chart.options.chart, renderer = chart.renderer, chartWidth, chartHeight;
    if (chart.errorElements) {
        each(chart.errorElements, function (el) {
            if (el) {
                el.destroy();
            }
        });
    }
    if (options && options.displayErrors && renderer) {
        chart.errorElements = [];
        msg = isNumber(code) ?
            ('Highcharts error #' + code + ': ' +
                H.errorMessages[code].text) :
            code;
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;
        // Format msg so SVGRenderer can handle it
        msg = msg
            .replace(/<h1>(.*)<\/h1>/g, '<br><span style="font-size: 24px">$1</span><br>')
            .replace(/<\/p>/g, '</p><br>');
        // Render red chart frame.
        chart.errorElements[0] = renderer.rect(2, 2, chartWidth - 4, chartHeight - 4).attr({
            'stroke-width': 4,
            stroke: '#ff0000',
            zIndex: 3
        }).add();
        // Render error message
        chart.errorElements[1] = renderer.label(msg, 0, 0, 'rect', undefined, undefined, undefined, undefined, 'debugger').css({
            color: '#ffffff',
            width: chartWidth - 16,
            padding: 0
        }).attr({
            fill: 'rgba(255, 0, 0, 0.9)',
            width: chartWidth,
            padding: 8,
            zIndex: 10
        }).add();
        chart.errorElements[1].attr({
            y: chartHeight - this.errorElements[1].getBBox().height
        });
    }
});
addEvent(H.Chart, 'beforeRedraw', function () {
    var errorElements = this.errorElements;
    if (errorElements && errorElements.length) {
        each(errorElements, function (el) {
            el.destroy();
        });
    }
    this.errorElements = null;
});
