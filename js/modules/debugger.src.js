/* *
 *
 *  (c) 2010-2018 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    isNumber = H.isNumber,
    setOptions = H.setOptions,
    each = H.each;

setOptions({
    /**
     * @optionparent chart
     */
    chart: {
        /**
         * Whether to display errors on the chart. When `false`, the errors will
         * be shown only in the console.
         *
         * Requires `debugger.js` module.
         *
         * @sample highcharts/chart/display-errors/
         *         Show errors on chart
         *
         * @since 7.0.0
         */
        displayErrors: true
    }
});

addEvent(H.Chart, 'displayError', function (e) {
    var chart = this,
        code = e.code,
        msg,
        options = chart.options.chart,
        renderer = chart.renderer,
        chartWidth,
        chartHeight;

    if (chart.errorElements) {
        each(chart.errorElements, function (el) {
            if (el) {
                el.destroy();
            }
        });
    }

    if (options && options.displayErrors) {
        chart.errorElements = [];
        msg = isNumber(code) ? 'Highcharts error #' + code + ': ' +
            H.errorMessages[code].title + H.errorMessages[code].text : code;
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;

        // Render red chart frame.
        chart.errorElements[0] = renderer.rect(
            2,
            2,
            chartWidth - 4,
            chartHeight - 4
        ).attr({
            'stroke-width': 4,
            stroke: '#ff0000',
            zIndex: 3
        }).add();

        // Render error message.
        chart.errorElements[1] = renderer.label(
            msg,
            0,
            0,
            'rect',
            null,
            null,
            true
        ).css({
            color: '#ffffff',
            width: chartWidth - 16,
            padding: 0
        }).attr({
            fill: '#ff0000',
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
