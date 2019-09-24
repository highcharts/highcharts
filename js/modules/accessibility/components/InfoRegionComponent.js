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
import U from '../../../parts/Utilities.js';
var extend = U.extend,
    pick = U.pick;

import AccessibilityComponent from '../AccessibilityComponent.js';
import A11yUtilities from '../utilities.js';

var merge = H.merge,
    makeHTMLTagFromText = A11yUtilities.makeHTMLTagFromText;


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
 * @name Highcharts.InfoRegionComponent
 */
var InfoRegionComponent = function () {};
InfoRegionComponent.prototype = new AccessibilityComponent();
extend(InfoRegionComponent.prototype, /** @lends Highcharts.InfoRegionComponent */ { // eslint-disable-line

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

        // Focus table after viewing
        this.addEvent(chart, 'afterViewData', function (tableDiv) {
            // Use small delay to give browsers & AT time to register new table
            setTimeout(function () {
                var table = tableDiv &&
                    tableDiv.getElementsByTagName('table')[0];
                if (table && table.focus) {
                    table.focus();
                }
            }, 300);
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
                this.tableHeading || this.createElement('h6'),
            tableShortcutAnchor = this.tableAnchor =
                this.tableAnchor || this.createElement('a'),
            chartHeading = this.chartHeading =
                this.chartHeading || this.createElement('h6');

        hiddenSection.setAttribute('id', hiddenSectionId);
        if (a11yOptions.landmarkVerbosity === 'all') {
            hiddenSection.setAttribute('role', 'region');
        }
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
                };
            tableShortcut.appendChild(tableShortcutAnchor);
            hiddenSection.appendChild(tableShortcut);
        }

        // Note: JAWS seems to refuse to read aria-label on the container, so
        // add an h6 element as title for the chart.
        chartHeading.innerHTML = chart.langFormat(
            'accessibility.chartHeading', { chart: chart }
        );
        chartHeading.setAttribute('aria-hidden', false);
        chart.renderTo.insertBefore(chartHeading, chart.renderTo.firstChild);
        chart.renderTo.insertBefore(hiddenSection, chart.renderTo.firstChild);
        this.unhideElementFromScreenReaders(hiddenSection);

        // Visually hide the section and the chart heading
        merge(true, chartHeading.style, this.hiddenStyle);
        merge(true, hiddenSection.style, this.hiddenStyle);
    },


    /**
     * The default formatter for the screen reader section.
     * @private
     * @return {string}
     */
    defaultScreenReaderSectionFormatter: function () {
        var options = this.chart.options;
        return this.defaultTypeDescriptionHTML(this.chart) +
            this.defaultSubtitleHTML(options) +
            this.defaultCaptionHTML(options) +
            this.defaultAxisDescriptionHTML('xAxis') +
            this.defaultAxisDescriptionHTML('yAxis');
    },


    /**
     * @private
     * @param {Highcharts.Options} chartOptions
     * @return {string}
     */
    defaultCaptionHTML: function (chartOptions) {
        var captionOptions = chartOptions.caption,
            captionText = captionOptions && captionOptions.text,
            descriptionText = chartOptions.accessibility.description ||
                captionText;
        return descriptionText ?
            makeHTMLTagFromText('div', descriptionText) : '';
    },


    /**
     * @private
     * @param {string} axisCollection
     * @return {string}
     */
    defaultAxisDescriptionHTML: function (axisCollection) {
        var axisDesc = this.getAxesDescription()[axisCollection];
        return axisDesc ? makeHTMLTagFromText('div', axisDesc) : '';
    },


    /**
     * @private
     * @param {Highcharts.Chart} chart
     * @returns {string}
     */
    defaultTypeDescriptionHTML: function (chart) {
        return chart.types ?
            makeHTMLTagFromText(
                'h5',
                chart.options.accessibility.typeDescription ||
                    chart.getTypeDescription(chart.types)
            ) : '';
    },


    /**
     * @private
     * @param {Highcharts.Options} chartOptions
     * @return {string}
     */
    defaultSubtitleHTML: function (options) {
        var subtitle = options.subtitle,
            text = subtitle && subtitle.text;
        return text ? makeHTMLTagFromText('div', text) : '';
    },


    /**
     * Return object with text description of each of the chart's axes.
     * @private
     * @return {object}
     */
    getAxesDescription: function () {
        var chart = this.chart,
            component = this,
            xAxes = chart.xAxis,
            // Figure out when to show axis info in the region
            showXAxes = xAxes.length > 1 || xAxes[0] &&
                pick(
                    xAxes[0].options.accessibility &&
                    xAxes[0].options.accessibility.enabled,
                    !chart.angular && chart.hasCartesianSeries &&
                    chart.types.indexOf('map') < 0
                ),
            yAxes = chart.yAxis,
            showYAxes = yAxes.length > 1 || yAxes[0] &&
                pick(
                    yAxes[0].options.accessibility &&
                    yAxes[0].options.accessibility.enabled,
                    chart.hasCartesianSeries && chart.types.indexOf('map') < 0
                ),
            desc = {};

        if (showXAxes) {
            desc.xAxis = chart.langFormat(
                'accessibility.axis.xAxisDescription' + (
                    xAxes.length > 1 ? 'Plural' : 'Singular'
                ),
                {
                    chart: chart,
                    names: chart.xAxis.map(function (axis) {
                        return axis.getDescription();
                    }),
                    ranges: chart.xAxis.map(function (axis) {
                        return component.getAxisRangeDescription(axis);
                    }),
                    numAxes: xAxes.length
                }
            );
        }

        if (showYAxes) {
            desc.yAxis = chart.langFormat(
                'accessibility.axis.yAxisDescription' + (
                    yAxes.length > 1 ? 'Plural' : 'Singular'
                ),
                {
                    chart: chart,
                    names: chart.yAxis.map(function (axis) {
                        return axis.getDescription();
                    }),
                    ranges: chart.yAxis.map(function (axis) {
                        return component.getAxisRangeDescription(axis);
                    }),
                    numAxes: yAxes.length
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
                    numCategories: axis.dataMax - axis.dataMin + 1
                }
            );
        }

        // Use range, not from-to?
        if (axis.isDatetimeAxis && (axis.min === 0 || axis.dataMin === 0)) {
            var range = {},
                rangeUnit = 'Seconds';
            range.Seconds = (axis.max - axis.min) / 1000;
            range.Minutes = range.Seconds / 60;
            range.Hours = range.Minutes / 60;
            range.Days = range.Hours / 24;
            ['Minutes', 'Hours', 'Days'].forEach(function (unit) {
                if (range[unit] > 2) {
                    rangeUnit = unit;
                }
            });
            range.value = range[rangeUnit].toFixed(
                rangeUnit !== 'Seconds' &&
                rangeUnit !== 'Minutes' ? 1 : 0 // Use decimals for days/hours
            );

            // We have the range and the unit to use, find the desc format
            return chart.langFormat(
                'accessibility.axis.timeRange' + rangeUnit,
                {
                    chart: chart,
                    axis: axis,
                    range: range.value.replace('.0', '')
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
