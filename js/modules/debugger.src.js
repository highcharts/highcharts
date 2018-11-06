/* *
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    isNumber = H.isNumber,
    setOptions = H.setOptions,
    each = H.each;

setOptions({
    chart: {
      /**
       * Whether to display errors on the chart. When `false`, the errors will
       * be shown only in the console. Requires `debugger.js` module.
       *
       * @type {Boolean}
       * @default true
       * @sample highcharts/chart/display-errors/
       *         True by default
       * @since 7.0.0
       * @apioption chart.displayErrors
       */
        displayErrors: true
    }
});

addEvent(H.Chart, 'displayError', function (e) {
    var chart = this,
        code = e.code,
        errorElements = this.errorElements || [],
        msg,
        options = chart.options.chart,
        renderer = chart.renderer,
        chartWidth,
        chartHeight;

    if (errorElements.length) {
        each(errorElements, function (el) {
            el.destroy();
        });
    }

    if (options.displayErrors) {
        msg = isNumber(code) ? 'Highcharts error #' + code + ': ' +
            H.errorMessages[code].title + H.errorMessages[code].text : code;
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;

        // Render red chart frame.
        errorElements[0] = renderer.rect(
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
        errorElements[1] = renderer.label(
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

        errorElements[1].attr({
            y: chartHeight - errorElements[1].getBBox().height
        });

        chart.errorElements = errorElements;
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
