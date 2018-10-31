/* *
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';

var messages = {
    '10': {
        'title': 'Can not plot zero or subzero values on a logarithmic axis',
        'text': '<p>Error 10 text </p>'
    },
    '11': {
        'title': 'Can not link axes of different type',
        'text': '<p>Error 11 text </p>'
    },
    '12': {
        'title': 'Highcharts expects point configuration to be numbers or ' +
            'arrays in turbo\nmode',
        'text': '<p>Error 12 text </p>'
    },
    '13': {
        'title': 'Rendering div not found',
        'text': '<p>Error 13 text </p>'
    },
    '14': {
        'title': 'String value sent to series.data, expected Number',
        'text': '<p>Error 14 text </p>'
    },
    '15': {
        'title': 'Highcharts expects data to be sorted',
        'text': '<p>Error 15 text </p>'
    },
    '16': {
        'title': 'Highcharts already defined in the page',
        'text': '<p>Error 16 text </p>'
    },
    '17': {
        'title': 'The requested series type does not exist',
        'text': '<p>Error 17 text </p>'
    },
    '18': {
        'title': 'The requested axis does not exist',
        'text': '<p>Error 18 text </p>'
    },
    '19': {
        'title': 'Too many ticks',
        'text': '<p>Error 19 text </p>'
    },
    '20': {
        'title': 'Can not add object point configuration to a long data series',
        'text': '<p>Error 20 text </p>'
    },
    '21': {
        'title': 'Can not find Proj4js library',
        'text': '<p>Error 21 text </p>'
    },
    '22': {
        'title': 'Map does not support latitude/longitude',
        'text': '<p>Error 22 text </p>'
    },
    '23': {
        'title': 'Unsupported color format used for color interpolation',
        'text': '<p>Error 23 text </p>'
    },
    '24': {
        'title': 'Cannot run Point.update on a grouped point',
        'text': '<p>Error 24 text </p>'
    },
    '25': {
        'title': 'Can not find Moment.js library',
        'text': '<p>Error 25 text </p>'
    },
    '26': {
        'title': 'WebGL not supported, and no fallback module included',
        'text': '<p>Error 26 text </p>'
    },
    '27': {
        'title': 'This browser does not support SVG.',
        'text': '<p>Error 27 text </p>'
    },
    '28': {
        'title': 'Fallback to export server disabled',
        'text': '<p>Error 28 text </p>'
    },
    'meta': {
        'files': [
            {
                'path': 'js/modules/debugger.src.js',
                'line': 0
            }
        ],
        'version': '6.1.4'
    }
};


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
            messages[code].title + messages[code].text : code;
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
