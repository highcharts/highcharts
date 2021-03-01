/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Chart from '../../Core/Chart/Chart.js';
import ErrorMessages from './ErrorMessages.js';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    isNumber,
    setOptions
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        errorElements?: Array<SVGElement>;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ChartOptions {
            displayErrors?: boolean;
        }
        let errorMessages: typeof ErrorMessages;
    }
}

/* *
 *
 *  Compositions
 *
 * */

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

addEvent(Chart, 'displayError', function (
    e: Highcharts.ErrorMessageEventObject
): void {
    var chart = this,
        code = e.code,
        msg,
        options = chart.options.chart,
        renderer = chart.renderer,
        chartWidth,
        chartHeight;

    if (chart.errorElements) {
        (chart.errorElements).forEach(function (el: SVGElement): void {
            if (el) {
                el.destroy();
            }
        });
    }

    if (options && options.displayErrors && renderer) {
        chart.errorElements = [];
        msg = isNumber(code) ?
            (
                'Highcharts error #' + code + ': ' +
                (H.errorMessages as any)[code].text
            ) :
            code;
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;

        // Format msg so SVGRenderer can handle it
        msg = msg
            .replace(
                /<h1>(.*)<\/h1>/g,
                '<br><span style="font-size: 24px">$1</span><br>'
            )
            .replace(/<p>/g, '')
            .replace(/<\/p>/g, '<br>');

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

        // Render error message
        chart.errorElements[1] = renderer.label(
            msg,
            0,
            0,
            'rect',
            void 0,
            void 0,
            void 0,
            void 0,
            'debugger'
        ).css({
            color: '#ffffff',
            width: (chartWidth - 16) + 'px',
            padding: 0
        }).attr({
            fill: 'rgba(255, 0, 0, 0.9)',
            width: chartWidth,
            padding: 8,
            zIndex: 10
        }).add();

        chart.errorElements[1].attr({
            y: chartHeight - (this.errorElements as any)[1].getBBox().height
        });
    }
});

addEvent(Chart, 'beforeRedraw', function (): void {
    var errorElements = this.errorElements;

    if (errorElements && errorElements.length) {
        errorElements.forEach(function (el: SVGElement): void {
            el.destroy();
        });
    }
    this.errorElements = null as any;
});

/* eslint-enable no-invalid-this */
