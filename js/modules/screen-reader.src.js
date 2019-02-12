/**
 * Accessibility module - Screen Reader support
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Point.js';

var win = H.win,
    doc = win.document,
    erase = H.erase,
    addEvent = H.addEvent,
    merge = H.merge,
    // CSS style to hide element from visual users while still exposing it to
    // screen readers
    hiddenStyle = {
        position: 'absolute',
        top: '-999em',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
    };

// If a point has one of the special keys defined, we expose all keys to the
// screen reader.
H.Series.prototype.commonKeys = ['name', 'id', 'category', 'x', 'value', 'y'];
H.Series.prototype.specialKeys = [
    'z', 'open', 'high', 'q3', 'median', 'q1', 'low', 'close'
];
if (H.seriesTypes.pie) {
    // A pie is always simple. Don't quote me on that.
    H.seriesTypes.pie.prototype.specialKeys = [];
}


/**
 * HTML encode some characters vulnerable for XSS.
 *
 * @private
 * @function htmlencode
 *
 * @param {string} html
 *        The input string.
 *
 * @return {string}
 *         The excaped string.
 */
function htmlencode(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}




// Accessibility options
H.setOptions({

    /**
     * Options for configuring accessibility for the chart. Requires the
     * [accessibility module](https://code.highcharts.com/modules/accessibility.js)
     * to be loaded. For a description of the module and information
     * on its features, see
     * [Highcharts Accessibility](http://www.highcharts.com/docs/chart-concepts/accessibility).
     *
     * @since        5.0.0
     * @optionparent accessibility
     */
    accessibility: {

        /**
         * Whether or not to add series descriptions to charts with a single
         * series.
         *
         * @type      {boolean}
         * @default   false
         * @since     5.0.0
         * @apioption accessibility.describeSingleSeries
         */

        /**
         * Function to run upon clicking the "View as Data Table" link in the
         * screen reader region.
         *
         * By default Highcharts will insert and set focus to a data table
         * representation of the chart.
         *
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.onTableAnchorClick
         */

        /**
         * Date format to use for points on datetime axes when describing them
         * to screen reader users.
         *
         * Defaults to the same format as in tooltip.
         *
         * For an overview of the replacement codes, see
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @see [pointDateFormatter](#accessibility.pointDateFormatter)
         *
         * @type      {string}
         * @since     5.0.0
         * @apioption accessibility.pointDateFormat
         */

        /**
         * Formatter function to determine the date/time format used with
         * points on datetime axes when describing them to screen reader users.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a date format string compatible with
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @see [pointDateFormat](#accessibility.pointDateFormat)
         *
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.pointDateFormatter
         */

        /**
         * Formatter function to use instead of the default for point
         * descriptions.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a String with the description of the point for a screen
         * reader user.
         *
         * @see [point.description](#series.line.data.description)
         *
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.pointDescriptionFormatter
         */

        /**
         * Formatter function to use instead of the default for series
         * descriptions. Receives one argument, `series`, referring to the
         * series to describe. Should return a String with the description of
         * the series for a screen reader user.
         *
         * @see [series.description](#plotOptions.series.description)
         *
         * @type      {Function}
         * @since     5.0.0
         * @apioption accessibility.seriesDescriptionFormatter
         */

        /**
         * Enable accessibility features for the chart.
         *
         * @since 5.0.0
         */
        enabled: true,

        /**
         * When a series contains more points than this, we no longer expose
         * information about individual points to screen readers.
         *
         * Set to `false` to disable.
         *
         * @type  {false|number}
         * @since 5.0.0
         */
        pointDescriptionThreshold: false, // set to false to disable

        /**
         * A formatter function to create the HTML contents of the hidden screen
         * reader information region. Receives one argument, `chart`, referring
         * to the chart object. Should return a String with the HTML content
         * of the region.
         *
         * The button to view the chart as a data table will be added
         * automatically after the custom HTML content if enabled.
         *
         * @type    {Function}
         * @default undefined
         * @since   5.0.0
         */
        screenReaderSectionFormatter: 

    }

});

/**
 * A text description of the chart.
 *
 * If the Accessibility module is loaded, this is included by default
 * as a long description of the chart and its contents in the hidden
 * screen reader information region.
 *
 * @see [typeDescription](#chart.typeDescription)
 *
 * @type      {string}
 * @since     5.0.0
 * @apioption chart.description
 */

/**
 * A text description of the chart type.
 *
 * If the Accessibility module is loaded, this will be included in the
 * description of the chart in the screen reader information region.
 *
 *
 * Highcharts will by default attempt to guess the chart type, but for
 * more complex charts it is recommended to specify this property for
 * clarity.
 *
 * @type      {string}
 * @since     5.0.0
 * @apioption chart.typeDescription
 */


/**
 * Utility function. Reverses child nodes of a DOM element.
 *
 * @private
 * @function reverseChildNodes
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} node
 */
function reverseChildNodes(node) {
    var i = node.childNodes.length;

    while (i--) {
        node.appendChild(node.childNodes[i]);
    }
}



/**
 * Put accessible info on series and points of a series.
 *
 * @private
 * @function Highcharts.Series#setA11yDescription
 */
H.Series.prototype.setA11yDescription = function () {
    var a11yOptions = this.chart.options.accessibility,
        firstPointEl = (
            this.points &&
            this.points.length &&
            this.points[0].graphic &&
            this.points[0].graphic.element
        ),
        seriesEl = (
            firstPointEl &&
            firstPointEl.parentNode || this.graph &&
            this.graph.element || this.group &&
            this.group.element
        ); // Could be tracker series depending on series type

    if (seriesEl) {
        // For some series types the order of elements do not match the order of
        // points in series. In that case we have to reverse them in order for
        // AT to read them out in an understandable order
        if (seriesEl.lastChild === firstPointEl) {
            reverseChildNodes(seriesEl);
        }
        // Make individual point elements accessible if possible. Note: If
        // markers are disabled there might not be any elements there to make
        // accessible.
        if (
            this.points && (
                this.points.length < a11yOptions.pointDescriptionThreshold ||
                a11yOptions.pointDescriptionThreshold === false
            )
        ) {
            this.points.forEach(function (point) {
                if (point.graphic) {
                    point.graphic.element.setAttribute('role', 'img');
                    point.graphic.element.setAttribute('tabindex', '-1');
                    point.graphic.element.setAttribute('aria-label', stripTags(
                        point.series.options.pointDescriptionFormatter &&
                        point.series.options.pointDescriptionFormatter(point) ||
                        a11yOptions.pointDescriptionFormatter &&
                        a11yOptions.pointDescriptionFormatter(point) ||
                        point.buildPointInfoString()
                    ));
                }
            });
        }
        // Make series element accessible
        if (this.chart.series.length > 1 || a11yOptions.describeSingleSeries) {
            seriesEl.setAttribute(
                'role',
                this.options.exposeElementToA11y ? 'img' : 'region'
            );
            seriesEl.setAttribute('tabindex', '-1');
            seriesEl.setAttribute(
                'aria-label',
                stripTags(
                    a11yOptions.seriesDescriptionFormatter &&
                    a11yOptions.seriesDescriptionFormatter(this) ||
                    this.buildSeriesInfoString()
                )
            );
        }
    }
};


/**
 * Return string with information about series.
 *
 * @private
 * @function Highcharts.Series#buildSeriesInfoString
 *
 * @return {string}
 */
H.Series.prototype.buildSeriesInfoString = function () {
    var chart = this.chart,
        desc = this.description || this.options.description,
        description = desc && chart.langFormat(
            'accessibility.series.description', {
                description: desc,
                series: this
            }
        ),
        xAxisInfo = chart.langFormat(
            'accessibility.series.xAxisDescription',
            {
                name: this.xAxis && this.xAxis.getDescription(),
                series: this
            }
        ),
        yAxisInfo = chart.langFormat(
            'accessibility.series.yAxisDescription',
            {
                name: this.yAxis && this.yAxis.getDescription(),
                series: this
            }
        ),
        summaryContext = {
            name: this.name || '',
            ix: this.index + 1,
            numSeries: chart.series.length,
            numPoints: this.points.length,
            series: this
        },
        combination = chart.types.length === 1 ? '' : 'Combination',
        summary = chart.langFormat(
            'accessibility.series.summary.' + this.type + combination,
            summaryContext
        ) || chart.langFormat(
            'accessibility.series.summary.default' + combination,
            summaryContext
        );

    return summary + (description ? ' ' + description : '') + (
        chart.yAxis.length > 1 && this.yAxis ?
            ' ' + yAxisInfo : ''
    ) + (
        chart.xAxis.length > 1 && this.xAxis ?
            ' ' + xAxisInfo : ''
    );
};


/**
 * Return string with information about point.
 *
 * @private
 * @function Highcharts.Point#buildPointInfoString
 *
 * @return {string}
 */
H.Point.prototype.buildPointInfoString = function () {
    var point = this,
        series = point.series,
        chart = series.chart,
        a11yOptions = chart.options.accessibility,
        infoString = '',
        dateTimePoint = series.xAxis && series.xAxis.isDatetimeAxis,
        timeDesc =
            dateTimePoint &&
            chart.time.dateFormat(
                a11yOptions.pointDateFormatter &&
                a11yOptions.pointDateFormatter(point) ||
                a11yOptions.pointDateFormat ||
                H.Tooltip.prototype.getXDateFormat.call(
                    {
                        getDateFormat: H.Tooltip.prototype.getDateFormat,
                        chart: chart
                    },
                    point,
                    chart.options.tooltip,
                    series.xAxis
                ),
                point.x
            ),
        hasSpecialKey = H.find(series.specialKeys, function (key) {
            return point[key] !== undefined;
        });

    // If the point has one of the less common properties defined, display all
    // that are defined
    if (hasSpecialKey) {
        if (dateTimePoint) {
            infoString = timeDesc;
        }
        series.commonKeys.concat(series.specialKeys).forEach(function (key) {
            if (point[key] !== undefined && !(dateTimePoint && key === 'x')) {
                infoString += (infoString ? '. ' : '') +
                    key + ', ' +
                    point[key];
            }
        });
    } else {
        // Pick and choose properties for a succint label
        infoString =
            (
                this.name ||
                timeDesc ||
                this.category ||
                this.id ||
                'x, ' + this.x
            ) + ', ' +
            (this.value !== undefined ? this.value : this.y);
    }

    return (this.index + 1) + '. ' + infoString + '.' +
        (this.description ? ' ' + this.description : '') +
        (chart.series.length > 1 && series.name ? ' ' + series.name : '');
};





// Make chart container accessible, and wrap table functionality.
H.Chart.prototype.callbacks.push(function (chart) {
    var options = chart.options,
        a11yOptions = options.accessibility;
    var titleElement,
        descElement = chart.container.getElementsByTagName('desc')[0],
        textElements = chart.container.getElementsByTagName('text'),
        titleId = 'highcharts-title-' + chart.index,
        chartTitle = options.title.text || chart.langFormat(
            'accessibility.defaultChartTitle', { chart: chart }
        ),
        svgContainerTitle = stripTags(chart.langFormat(
            'accessibility.svgContainerTitle', {
                chartTitle: chartTitle
            }
        ));

    // Add SVG title tag if it is set
    if (svgContainerTitle.length) {
        titleElement = doc.createElementNS(
            'http://www.w3.org/2000/svg',
            'title'
        );
        titleElement.textContent = svgContainerTitle;
        titleElement.id = titleId;
        descElement.parentNode.insertBefore(titleElement, descElement);
    }

    chart.renderTo.setAttribute('role', 'region');
    chart.renderTo.setAttribute(
        'aria-label',
        chart.langFormat(
            'accessibility.chartContainerLabel',
            {
                title: stripTags(chartTitle),
                chart: chart
            }
        )
    );

    // Hide text elements from screen readers
    [].forEach.call(textElements, function (el) {
        if (el.getAttribute('aria-hidden') !== 'false') {
            el.setAttribute('aria-hidden', 'true');
        }
    });

    // Hide desc element
    descElement.setAttribute('aria-hidden', 'true');
});
