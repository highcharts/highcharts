/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for chart info region and table.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import AccessibilityComponent from '../AccessibilityComponent.js';

var doc = H.win.document,
    merge = H.merge,
    hiddenStyle = {
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
    };


/**
 * Return simplified text description of chart type. Some types will not be
 * familiar to most users, but in those cases we try to add a description of the
 * type.
 *
 * @private
 * @function Highcharts.Chart#getTypeDescription
 * @param {Array<string>} types The series types in this chart.
 * @return {string} The text description of the chart type.
 */
H.Chart.prototype.getTypeDescription = function (types) {
    var firstType = types[0],
        firstSeries = this.series && this.series[0] || {},
        mapTitle = firstSeries.mapTitle,
        formatContext = {
            numSeries: this.series.length,
            numPoints: firstSeries.points && firstSeries.points.length,
            chart: this,
            mapTitle: mapTitle
        };

    if (!firstType) {
        return this.langFormat(
            'accessibility.chartTypes.emptyChart', formatContext
        );
    }

    if (firstType === 'map') {
        return mapTitle ?
            this.langFormat(
                'accessibility.chartTypes.mapTypeDescription',
                formatContext
            ) :
            this.langFormat(
                'accessibility.chartTypes.unknownMap',
                formatContext
            );
    }

    if (this.types.length > 1) {
        return this.langFormat(
            'accessibility.chartTypes.combinationChart', formatContext
        );
    }

    var typeDesc = this.langFormat(
            'accessibility.seriesTypeDescriptions.' + firstType,
            { chart: this }
        ),
        multi = this.series && this.series.length === 1 ? 'Single' : 'Multiple';

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


/**
 * The InfoRegionComponent class
 *
 * @private
 * @class
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var InfoRegionComponent = function (chart) {
    this.initBase(chart);
    this.init();
};
InfoRegionComponent.prototype = new AccessibilityComponent();
H.extend(InfoRegionComponent.prototype, {

    /**
     * Init the component
     * @private
     */
    init: function () {
        // Add ID and summary attr to table HTML
        var chart = this.chart,
            component = this;
        this.addEvent(chart, 'afterGetTable', function (e) {
            if (chart.options.accessibility.enabled) {
                component.tableAnchor.setAttribute('aria-expanded', true);
                e.html = e.html
                    .replace(
                        '<table ',
                        '<table tabindex="0" summary="' + chart.langFormat(
                            'accessibility.tableSummary', { chart: chart }
                        ) + '"'
                    );
            }
        });
    },


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        // Create/update the screen reader region
        var chart = this.chart,
            a11yOptions = chart.options.accessibility,
            hiddenSectionId = 'highcharts-information-region-' + chart.index,
            hiddenSection = this.screenReaderRegion =
                this.screenReaderRegion || this.createElement('div'),
            tableShortcut = this.tableHeading =
                this.tableHeading || this.createElement('h4'),
            tableShortcutAnchor = this.tableAnchor =
                this.tableAnchor || this.createElement('a'),
            chartHeading = this.chartHeading =
                this.chartHeading || this.createElement('h4');

        hiddenSection.setAttribute('id', hiddenSectionId);
        if (a11yOptions.landmarkVerbosityMode === 'all') {
            hiddenSection.setAttribute('role', 'region');
        }
        hiddenSection.setAttribute('aria-hidden', false);
        hiddenSection.setAttribute(
            'aria-label',
            chart.langFormat(
                'accessibility.screenReaderRegionLabel', { chart: chart }
            )
        );

        hiddenSection.innerHTML = a11yOptions.screenReaderSectionFormatter ?
            a11yOptions.screenReaderSectionFormatter(chart) :
            this.defaultScreenReaderSectionFormatter(chart);

        // Add shortcut to data table if export-data is loaded
        if (chart.getCSV && chart.options.accessibility.addTableShortcut) {
            var tableId = 'highcharts-data-table-' + chart.index;
            tableShortcutAnchor.innerHTML = chart.langFormat(
                'accessibility.viewAsDataTable', { chart: chart }
            );
            tableShortcutAnchor.href = '#' + tableId;
            // Make this unreachable by user tabbing
            tableShortcutAnchor.setAttribute('tabindex', '-1');
            tableShortcutAnchor.setAttribute('role', 'button');
            tableShortcutAnchor.setAttribute('aria-expanded', false);
            tableShortcutAnchor.onclick =
                chart.options.accessibility.onTableAnchorClick || function () {
                    chart.viewData();
                    setTimeout(function () {
                        // Give browser time to load before attempting focus
                        doc.getElementById(tableId).focus();
                    }, 300);
                };
            tableShortcut.appendChild(tableShortcutAnchor);
            hiddenSection.appendChild(tableShortcut);
        }

        // Note: JAWS seems to refuse to read aria-label on the container, so
        // add an h4 element as title for the chart.
        chartHeading.innerHTML = chart.langFormat(
            'accessibility.chartHeading', { chart: chart }
        );
        chart.renderTo.insertBefore(chartHeading, chart.renderTo.firstChild);
        chart.renderTo.insertBefore(hiddenSection, chart.renderTo.firstChild);

        // Hide the section and the chart heading
        merge(true, chartHeading.style, hiddenStyle);
        merge(true, hiddenSection.style, hiddenStyle);
    },


    /**
     * Accessibility disabled/chart destroyed.
     */
    destroy: function () {
        if (this.screenReaderRegion) {
            this.screenReaderRegion.setAttribute('aria-hidden', true);
        }
        this.destroyBase();
    },


    /**
     * The default formatter for the screen reader section.
     * @private
     */
    defaultScreenReaderSectionFormatter: function () {
        var chart = this.chart,
            options = chart.options,
            chartTypes = chart.types,
            formatContext = {
                chart: chart,
                numSeries: chart.series && chart.series.length
            },
            // Build axis info - but not for pies and maps. Consider not
            // adding for certain other types as well (funnel, pyramid?)
            axesDesc = (
                chartTypes.length === 1 && chartTypes[0] === 'pie' ||
                chartTypes[0] === 'map'
            ) && {} || this.getAxesDescription();

        return (
            options.subtitle && options.subtitle.text ?
                '<div>' + this.htmlencode(options.subtitle.text) + '</div>' : ''
        ) + (
            options.accessibility.description ?
                '<div>' + options.accessibility.description + '</div>' : ''
        ) + '<h4>' + chart.langFormat(
            'accessibility.structureHeading', formatContext
        ) + '</h4><div>' +
        (
            options.accessibility.typeDescription ||
            chart.getTypeDescription(chartTypes)
        ) + '</div>' +
        (axesDesc.xAxis ? (
            '<div>' + axesDesc.xAxis + '</div>'
        ) : '') +
        (axesDesc.yAxis ? (
            '<div>' + axesDesc.yAxis + '</div>'
        ) : '');
    },


    /**
     * Return object with text description of each of the chart's axes.
     * @private
     * @return {*}
     */
    getAxesDescription: function () {
        var chart = this.chart,
            component = this,
            numXAxes = chart.xAxis.length,
            numYAxes = chart.yAxis.length,
            desc = {};

        if (numXAxes) {
            desc.xAxis = chart.langFormat(
                'accessibility.axis.xAxisDescription' + (
                    numXAxes > 1 ? 'Plural' : 'Singular'
                ),
                {
                    chart: chart,
                    names: chart.xAxis.map(function (axis) {
                        return axis.getDescription();
                    }),
                    ranges: chart.xAxis.map(function (axis) {
                        return component.getAxisRangeDescription(axis);
                    }),
                    numAxes: numXAxes
                }
            );
        }

        if (numYAxes) {
            desc.yAxis = chart.langFormat(
                'accessibility.axis.yAxisDescription' + (
                    numYAxes > 1 ? 'Plural' : 'Singular'
                ),
                {
                    chart: chart,
                    names: chart.yAxis.map(function (axis) {
                        return axis.getDescription();
                    }),
                    ranges: chart.yAxis.map(function (axis) {
                        return component.getAxisRangeDescription(axis);
                    }),
                    numAxes: numYAxes
                }
            );
        }

        return desc;
    },


    /**
     * Return string with text description of the axis range.
     * @private
     * @param {Highcharts.Axis} axis The axis to get range desc of.
     * @return {string} A string with the range description for the axis.
     */
    getAxisRangeDescription: function (axis) {
        var chart = this.chart,
            axisOptions = axis.options || {};

        // Handle overridden range description
        if (
            axisOptions.accessibility &&
            axisOptions.accessibility.rangeDescription !== undefined
        ) {
            return axisOptions.accessibility.rangeDescription;
        }

        // Handle category axes
        if (axis.categories) {
            return chart.langFormat(
                'accessibility.axis.rangeCategories',
                {
                    chart: chart,
                    axis: axis,
                    numCategories: axis.categories.length
                }
            );
        }

        // Use range, not from-to?
        if (axis.isDatetimeAxis && axis.min === 0) {
            var range = {},
                rangeUnit = 'Seconds';
            range.Seconds = (axis.max - axis.min) / 1000;
            range.Minutes = range.seconds / 60;
            range.Hours = range.minutes / 60;
            range.Days = range.hours / 24;
            ['Minutes', 'Hours', 'Days'].forEach(function (unit) {
                if (range[unit] > 2) {
                    rangeUnit = unit;
                }
            });

            // We have the range and the unit to use, find the desc format
            return chart.langFormat(
                'accessibility.axis.timeRange' + rangeUnit,
                {
                    chart: chart,
                    axis: axis,
                    range: range[rangeUnit]
                }
            );
        }

        // Just use from and to.
        // We have the range and the unit to use, find the desc format
        var a11yOptions = chart.options.accessibility;
        return chart.langFormat(
            'accessibility.axis.rangeFromTo',
            {
                chart: chart,
                axis: axis,
                rangeFrom: axis.isDatetimeAxis ?
                    chart.time.dateFormat(
                        a11yOptions.axisRangeDateFormat, axis.min
                    ) : axis.min,
                rangeTo: axis.isDatetimeAxis ?
                    chart.time.dateFormat(
                        a11yOptions.axisRangeDateFormat, axis.max
                    ) : axis.max
            }
        );
    }

});

export default InfoRegionComponent;
