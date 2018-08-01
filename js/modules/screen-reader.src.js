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
    each = H.each,
    map = H.map,
    erase = H.erase,
    addEvent = H.addEvent,
    merge = H.merge,
    // CSS style to hide element from visual users while still exposing it to
    // screen readers
    hiddenStyle = {
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
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
 * @param  {string} html The input string
 * @return {string} The excaped string
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


/**
 * Strip HTML tags away from a string. Used for aria-label attributes, painting
 * on a canvas will fail if the text contains tags.
 * @param  {String} s The input string
 * @return {String}   The filtered string
 */
function stripTags(s) {
    return typeof s === 'string' ? s.replace(/<\/?[^>]+(>|$)/g, '') : s;
}


/**
 * Accessibility options
 */
H.setOptions({

    /**
     * Options for configuring accessibility for the chart. Requires the
     * [accessibility module](//code.highcharts.com/modules/accessibility.
     * js) to be loaded. For a description of the module and information
     * on its features, see [Highcharts Accessibility](http://www.highcharts.
     * com/docs/chart-concepts/accessibility).
     *
     * @since 5.0.0
     * @type {Object}
     * @optionparent accessibility
     */
    accessibility: {

        /**
         * Whether or not to add series descriptions to charts with a single
         * series.
         *
         * @type {Boolean}
         * @default false
         * @since 5.0.0
         * @apioption accessibility.describeSingleSeries
         */

        /**
         * Function to run upon clicking the "View as Data Table" link in the
         * screen reader region.
         *
         * By default Highcharts will insert and set focus to a data table
         * representation of the chart.
         *
         * @type {Function}
         * @since 5.0.0
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
         * @type {String}
         * @see [pointDateFormatter](#accessibility.pointDateFormatter)
         * @since 5.0.0
         * @apioption accessibility.pointDateFormat
         */

        /**
         * Formatter function to determine the date/time format used with
         * points on datetime axes when describing them to screen reader users.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a date format string compatible with
         * [dateFormat](/class-reference/Highcharts#dateFormat).
         *
         * @type {Function}
         * @see [pointDateFormat](#accessibility.pointDateFormat)
         * @since 5.0.0
         * @apioption accessibility.pointDateFormatter
         */

        /**
         * Formatter function to use instead of the default for point
         * descriptions.
         * Receives one argument, `point`, referring to the point to describe.
         * Should return a String with the description of the point for a screen
         * reader user.
         *
         * @type {Function}
         * @see [point.description](#series.line.data.description)
         * @since 5.0.0
         * @apioption accessibility.pointDescriptionFormatter
         */

        /**
         * Formatter function to use instead of the default for series
         * descriptions. Receives one argument, `series`, referring to the
         * series to describe. Should return a String with the description of
         * the series for a screen reader user.
         *
         * @type {Function}
         * @see [series.description](#plotOptions.series.description)
         * @since 5.0.0
         * @apioption accessibility.seriesDescriptionFormatter
         */

        /**
         * Enable accessibility features for the chart.
         *
         * @type {Boolean}
         * @default true
         * @since 5.0.0
         */
        enabled: true,

        /**
         * When a series contains more points than this, we no longer expose
         * information about individual points to screen readers.
         *
         * Set to `false` to disable.
         *
         * @type {Number|Boolean}
         * @since 5.0.0
         */
        pointDescriptionThreshold: false, // set to false to disable

        /**
         * A formatter function to create the HTML contents of the hidden screen
         * reader information region. Receives one argument, `chart`, referring
         * to the chart object. Should return a String with the HTML content
         * of the region.
         *
         * The link to view the chart as a data table will be added
         * automatically after the custom HTML content.
         *
         * @type {Function}
         * @default undefined
         * @since 5.0.0
         */
        screenReaderSectionFormatter: function (chart) {
            var options = chart.options,
                chartTypes = chart.types || [],
                formatContext = {
                    chart: chart,
                    numSeries: chart.series && chart.series.length
                },
                // Build axis info - but not for pies and maps. Consider not
                // adding for certain other types as well (funnel, pyramid?)
                axesDesc = (
                    chartTypes.length === 1 && chartTypes[0] === 'pie' ||
                    chartTypes[0] === 'map'
                ) && {} || chart.getAxesDescription();

            return '<div>' + chart.langFormat(
                        'accessibility.navigationHint', formatContext
                    ) + '</div><h3>' +
                    (
                        options.title.text ?
                            htmlencode(options.title.text) :
                            chart.langFormat(
                                'accessibility.defaultChartTitle', formatContext
                            )
                    ) +
                    (
                        options.subtitle && options.subtitle.text ?
                            '. ' + htmlencode(options.subtitle.text) :
                            ''
                    ) +
                    '</h3><h4>' + chart.langFormat(
                        'accessibility.longDescriptionHeading', formatContext
                    ) + '</h4><div>' +
                    (
                        options.chart.description || chart.langFormat(
                            'accessibility.noDescription', formatContext
                        )
                    ) +
                    '</div><h4>' + chart.langFormat(
                        'accessibility.structureHeading', formatContext
                    ) + '</h4><div>' +
                    (
                        options.chart.typeDescription ||
                        chart.getTypeDescription()
                    ) + '</div>' +
                    (axesDesc.xAxis ? (
                        '<div>' + axesDesc.xAxis + '</div>'
                    ) : '') +
                    (axesDesc.yAxis ? (
                        '<div>' + axesDesc.yAxis + '</div>'
                    ) : '');
        }
    }
});

/**
 * A text description of the chart.
 *
 * If the Accessibility module is loaded, this is included by default
 * as a long description of the chart and its contents in the hidden
 * screen reader information region.
 *
 * @type {String}
 * @see [typeDescription](#chart.typeDescription)
 * @default undefined
 * @since 5.0.0
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
 * @type {String}
 * @default undefined
 * @since 5.0.0
 * @apioption chart.typeDescription
 */


// Utility function. Reverses child nodes of a DOM element
function reverseChildNodes(node) {
    var i = node.childNodes.length;
    while (i--) {
        node.appendChild(node.childNodes[i]);
    }
}


// Whenever drawing series, put info on DOM elements
H.addEvent(H.Series, 'afterRender', function () {
    if (this.chart.options.accessibility.enabled) {
        this.setA11yDescription();
    }
});


// Put accessible info on series and points of a series
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
            each(this.points, function (point) {
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


// Return string with information about series
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


// Return string with information about point
H.Point.prototype.buildPointInfoString = function () {
    var point = this,
        series = point.series,
        a11yOptions = series.chart.options.accessibility,
        infoString = '',
        dateTimePoint = series.xAxis && series.xAxis.isDatetimeAxis,
        timeDesc =
            dateTimePoint &&
            series.chart.time.dateFormat(
                a11yOptions.pointDateFormatter &&
                a11yOptions.pointDateFormatter(point) ||
                a11yOptions.pointDateFormat ||
                H.Tooltip.prototype.getXDateFormat.call(
                    {
                        getDateFormat: H.Tooltip.prototype.getDateFormat,
                        chart: series.chart
                    },
                    point,
                    series.chart.options.tooltip,
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
        each(series.commonKeys.concat(series.specialKeys), function (key) {
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
        (this.description ? ' ' + this.description : '');
};


// Get descriptive label for axis
H.Axis.prototype.getDescription = function () {
    return (
        this.userOptions && this.userOptions.description ||
        this.axisTitle && this.axisTitle.textStr ||
        this.options.id ||
        this.categories && 'categories' ||
        this.isDatetimeAxis && 'Time' ||
        'values'
    );
};


// Whenever adding or removing series, keep track of types present in chart
addEvent(H.Series, 'afterInit', function () {
    var chart = this.chart;
    if (chart.options.accessibility.enabled) {
        chart.types = chart.types || [];

        // Add type to list if does not exist
        if (chart.types.indexOf(this.type) < 0) {
            chart.types.push(this.type);
        }
    }
});
addEvent(H.Series, 'remove', function () {
    var chart = this.chart,
        removedSeries = this,
        hasType = false;

    // Check if any of the other series have the same type as this one.
    // Otherwise remove it from the list.
    each(chart.series, function (s) {
        if (
            s !== removedSeries &&
            chart.types.indexOf(removedSeries.type) < 0
        ) {
            hasType = true;
        }
    });
    if (!hasType) {
        erase(chart.types, removedSeries.type);
    }
});


// Return simplified description of chart type. Some types will not be familiar
// to most screen reader users, but in those cases we try to add a description
// of the type.
H.Chart.prototype.getTypeDescription = function () {
    var firstType = this.types && this.types[0],
        firstSeries = this.series && this.series[0] || {},
        mapTitle = firstSeries.mapTitle,
        typeDesc = this.langFormat(
            'accessibility.seriesTypeDescriptions.' + firstType,
            { chart: this }
        ),
        formatContext = {
            numSeries: this.series.length,
            numPoints: firstSeries.points && firstSeries.points.length,
            chart: this,
            mapTitle: mapTitle
        },
        multi = this.series && this.series.length === 1 ? 'Single' : 'Multiple';

    if (!firstType) {
        return this.langFormat(
            'accessibility.chartTypes.emptyChart', formatContext
        );
    } else if (firstType === 'map') {
        return mapTitle ?
            this.langFormat(
                'accessibility.chartTypes.mapTypeDescription',
                formatContext
            ) :
            this.langFormat(
                'accessibility.chartTypes.unknownMap',
                formatContext
            );
    } else if (this.types.length > 1) {
        return this.langFormat(
            'accessibility.chartTypes.combinationChart', formatContext
        );
    }

    return (
        this.langFormat(
            'accessibility.chartTypes.' + firstType + multi,
            formatContext
        ) ||
        this.langFormat(
            'accessibility.chartTypes.default' + multi,
            formatContext
        )
    ) +
    (typeDesc ? ' ' + typeDesc : '');
};


// Return object with text description of each of the chart's axes
H.Chart.prototype.getAxesDescription = function () {
    var numXAxes = this.xAxis.length,
        numYAxes = this.yAxis.length,
        desc = {};

    if (numXAxes) {
        desc.xAxis = this.langFormat(
            'accessibility.axis.xAxisDescription' + (
                numXAxes > 1 ? 'Plural' : 'Singular'
            ),
            {
                chart: this,
                names: map(this.xAxis, function (axis) {
                    return axis.getDescription();
                }),
                numAxes: numXAxes
            }
        );
    }

    if (numYAxes) {
        desc.yAxis = this.langFormat(
            'accessibility.axis.yAxisDescription' + (
                numYAxes > 1 ? 'Plural' : 'Singular'
            ),
            {
                chart: this,
                names: map(this.yAxis, function (axis) {
                    return axis.getDescription();
                }),
                numAxes: numYAxes
            }
        );
    }

    return desc;
};


// Set a11y attribs on exporting menu
H.Chart.prototype.addAccessibleContextMenuAttribs = function () {
    var exportList = this.exportDivElements;
    if (exportList) {
        // Set tabindex on the menu items to allow focusing by script
        // Set role to give screen readers a chance to pick up the contents
        each(exportList, function (item) {
            if (item.tagName === 'DIV' &&
                !(item.children && item.children.length)) {
                item.setAttribute('role', 'menuitem');
                item.setAttribute('tabindex', -1);
            }
        });
        // Set accessibility properties on parent div
        exportList[0].parentNode.setAttribute('role', 'menu');
        exportList[0].parentNode.setAttribute('aria-label',
            this.langFormat(
                'accessibility.exporting.chartMenuLabel', { chart: this }
            )
        );
    }
};


// Add screen reader region to chart.
// tableId is the HTML id of the table to focus when clicking the table anchor
// in the screen reader region.
H.Chart.prototype.addScreenReaderRegion = function (id, tableId) {
    var chart = this,
        hiddenSection = chart.screenReaderRegion = doc.createElement('div'),
        tableShortcut = doc.createElement('h4'),
        tableShortcutAnchor = doc.createElement('a'),
        chartHeading = doc.createElement('h4');

    hiddenSection.setAttribute('id', id);
    hiddenSection.setAttribute('role', 'region');
    hiddenSection.setAttribute(
        'aria-label',
        chart.langFormat(
            'accessibility.screenReaderRegionLabel', { chart: this }
        )
    );

    hiddenSection.innerHTML = chart.options.accessibility
        .screenReaderSectionFormatter(chart);

    // Add shortcut to data table if export-data is loaded
    if (chart.getCSV) {
        tableShortcutAnchor.innerHTML = chart.langFormat(
            'accessibility.viewAsDataTable', { chart: chart }
        );
        tableShortcutAnchor.href = '#' + tableId;
        // Make this unreachable by user tabbing
        tableShortcutAnchor.setAttribute('tabindex', '-1');
        tableShortcutAnchor.onclick =
            chart.options.accessibility.onTableAnchorClick || function () {
                chart.viewData();
                doc.getElementById(tableId).focus();
            };
        tableShortcut.appendChild(tableShortcutAnchor);
        hiddenSection.appendChild(tableShortcut);
    }

    // Note: JAWS seems to refuse to read aria-label on the container, so add an
    // h4 element as title for the chart.
    chartHeading.innerHTML = chart.langFormat(
        'accessibility.chartHeading', { chart: chart }
    );
    chart.renderTo.insertBefore(chartHeading, chart.renderTo.firstChild);
    chart.renderTo.insertBefore(hiddenSection, chart.renderTo.firstChild);

    // Hide the section and the chart heading
    merge(true, chartHeading.style, hiddenStyle);
    merge(true, hiddenSection.style, hiddenStyle);
};


// Make chart container accessible, and wrap table functionality
H.Chart.prototype.callbacks.push(function (chart) {
    var options = chart.options,
        a11yOptions = options.accessibility;

    if (!a11yOptions.enabled) {
        return;
    }

    var titleElement,
        descElement = chart.container.getElementsByTagName('desc')[0],
        textElements = chart.container.getElementsByTagName('text'),
        titleId = 'highcharts-title-' + chart.index,
        tableId = 'highcharts-data-table-' + chart.index,
        hiddenSectionId = 'highcharts-information-region-' + chart.index,
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

    // Set screen reader properties on export menu
    if (
        chart.exportSVGElements &&
        chart.exportSVGElements[0] &&
        chart.exportSVGElements[0].element
    ) {
        // Set event handler on button
        var button = chart.exportSVGElements[0].element,
            oldExportCallback = button.onclick;
        button.onclick = function () {
            oldExportCallback.apply(
                this,
                Array.prototype.slice.call(arguments)
            );
            chart.addAccessibleContextMenuAttribs();
            chart.highlightExportItem(0);
        };

        // Set props on button
        button.setAttribute('role', 'button');
        button.setAttribute(
            'aria-label',
            chart.langFormat(
                'accessibility.exporting.menuButtonLabel', { chart: chart }
            )
        );

        // Set props on group
        chart.exportingGroup.element.setAttribute('role', 'region');
        chart.exportingGroup.element.setAttribute('aria-label',
            chart.langFormat(
                'accessibility.exporting.exportRegionLabel', { chart: chart }
            )
        );
    }

    // Set screen reader properties on input boxes for range selector. We need
    // to do this regardless of whether or not these are visible, as they are
    // by default part of the page's tabindex unless we set them to -1.
    if (chart.rangeSelector) {
        each(['minInput', 'maxInput'], function (key, i) {
            if (chart.rangeSelector[key]) {
                chart.rangeSelector[key].setAttribute('tabindex', '-1');
                chart.rangeSelector[key].setAttribute('role', 'textbox');
                chart.rangeSelector[key].setAttribute(
                    'aria-label',
                    chart.langFormat(
                        'accessibility.rangeSelector' +
                            (i ? 'MaxInput' : 'MinInput'), { chart: chart }
                    )
                );
            }
        });
    }

    // Hide text elements from screen readers
    each(textElements, function (el) {
        el.setAttribute('aria-hidden', 'true');
    });

    // Add top-secret screen reader region
    chart.addScreenReaderRegion(hiddenSectionId, tableId);

    // Add ID and summary attr to table HTML
    H.wrap(chart, 'getTable', function (proceed) {
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
            .replace(
                '<table>',
                '<table id="' + tableId + '" summary="' + chart.langFormat(
                    'accessibility.tableSummary', { chart: chart }
                ) + '">'
            );
    });
});
