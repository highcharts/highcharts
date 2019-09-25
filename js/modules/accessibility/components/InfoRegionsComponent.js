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
var extend = U.extend;

import AccessibilityComponent from '../AccessibilityComponent.js';
import A11yUtilities from '../utilities.js';

var pick = H.pick,
    setElAttrs = A11yUtilities.setElAttrs;


function getMapTypeDescription(chart, formatContext) {
    return formatContext.mapTitle ?
        chart.langFormat('accessibility.chartTypes.mapTypeDescription',
            formatContext) :
        chart.langFormat('accessibility.chartTypes.unknownMap',
            formatContext);
}

function getCombinationChartTypeDescription(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.combinationChart',
        formatContext);
}

function getEmptyChartTypeDescription(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.emptyChart',
        formatContext);
}

function buildTypeDescriptionFromSeries(chart, types, context) {
    var firstType = types[0],
        typeExplaination = chart.langFormat(
            'accessibility.seriesTypeDescriptions.' + firstType,
            context
        ),
        multi = chart.series && chart.series.length < 2 ? 'Single' : 'Multiple';

    return (
        chart.langFormat(
            'accessibility.chartTypes.' + firstType + multi,
            context
        ) ||
        chart.langFormat(
            'accessibility.chartTypes.default' + multi,
            context
        )
    ) + (typeExplaination ? ' ' + typeExplaination : '');
}

function getTableSummary(chart) {
    return chart.langFormat(
        'accessibility.table.tableSummary', { chart: chart }
    );
}

function filterHTMLTags(str) {
    var whitelist = [
            /<\/?h[1-7]>/g,
            /<\/?p>/g,
            /<\/?div>/g,
            /<button id="[a-zA-Z\-0-9#]*?">/g, /<\/button>/g,
            /<a id="[a-zA-Z\-0-9#]*?">/g, /<\/a>/g
        ],
        filteredString = str;

    whitelist.forEach(function (exp) {
        filteredString = filteredString.replace(exp, '');
    });

    var hasHTMLCharsLeft = /[&<>"'\\\/]/.test(filteredString);
    return hasHTMLCharsLeft ? 'Content blocked' : str;
}

function stripEmptyHTMLTags(str) {
    return str.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, '');
}


/**
 * Return simplified text description of chart type. Some types will not be
 * familiar to most users, but in those cases we try to add an explaination of
 * the type.
 *
 * @private
 * @function Highcharts.Chart#getTypeDescription
 * @param {Array<string>} types The series types in this chart.
 * @return {string} The text description of the chart type.
 */
H.Chart.prototype.getTypeDescription = function (types) {
    var firstType = types[0],
        firstSeries = this.series && this.series[0] || {},
        formatContext = {
            numSeries: this.series.length,
            numPoints: firstSeries.points && firstSeries.points.length,
            chart: this,
            mapTitle: firstSeries.mapTitle
        };

    if (!firstType) {
        return getEmptyChartTypeDescription(this, formatContext);
    }

    if (firstType === 'map') {
        return getMapTypeDescription(this, formatContext);
    }

    if (this.types.length > 1) {
        return getCombinationChartTypeDescription(this, formatContext);
    }

    return buildTypeDescriptionFromSeries(this, types, formatContext);
};


/**
 * The InfoRegionsComponent class
 *
 * @private
 * @class
 * @name Highcharts.InfoRegionsComponent
 */
var InfoRegionsComponent = function () {};
InfoRegionsComponent.prototype = new AccessibilityComponent();
extend(InfoRegionsComponent.prototype, /** @lends Highcharts.InfoRegionsComponent */ { // eslint-disable-line

    /**
     * Init the component
     * @private
     */
    init: function () {
        var chart = this.chart,
            component = this;

        this.initRegionsDefinitions();

        this.addEvent(chart, 'afterGetTable', function (e) {
            component.onDataTableCreated(e);
        });

        this.addEvent(chart, 'afterViewData', function (tableDiv) {
            component.dataTableDiv = tableDiv;

            // Use small delay to give browsers & AT time to register new table
            setTimeout(function () {
                component.focusDataTable();
            }, 300);
        });
    },


    /**
     * @private
     */
    initRegionsDefinitions: function () {
        var component = this;

        this.screenReaderSections = {
            before: {
                element: null,
                buildContent: function (chart) {
                    var formatter = chart.options.accessibility
                        .screenReaderSection.beforeChartFormatter;
                    return formatter ? formatter(chart) :
                        component.defaultBeforeChartFormatter(chart);
                },
                insertIntoDOM: function (el, chart) {
                    chart.renderTo.insertBefore(
                        el, chart.renderTo.firstChild
                    );
                }
            },

            after: {
                element: null,
                buildContent: function (chart) {
                    var formatter = chart.options.accessibility
                        .screenReaderSection.afterChartFormatter;
                    return formatter ? formatter(chart) :
                        component.defaultAfterChartFormatter(chart);
                },
                insertIntoDOM: function (el, chart) {
                    chart.renderTo.appendChild(el);
                }
            }
        };
    },


    /**
     * @private
     */
    onDataTableCreated: function (e) {
        var chart = this.chart,
            summary = getTableSummary(chart);

        if (chart.options.accessibility.enabled) {
            this.viewDataTableButton.setAttribute('aria-expanded', 'true');
            e.html = e.html
                .replace(
                    '<table ',
                    '<table tabindex="0" summary="' + summary + '"'
                );
        }
    },


    /**
     * @private
     */
    focusDataTable: function () {
        var tableDiv = this.dataTableDiv,
            table = tableDiv && tableDiv.getElementsByTagName('table')[0];

        if (table && table.focus) {
            table.focus();
        }
    },


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        var component = this;
        Object.keys(this.screenReaderSections).forEach(function (regionKey) {
            component.updateScreenReaderSection(regionKey);
        });
    },


    /**
     * @private
     */
    updateScreenReaderSection: function (regionKey) {
        var chart = this.chart,
            regions = this.screenReaderSections,
            content = regions[regionKey].buildContent(chart),
            sectionDiv = regions[regionKey].element =
                regions[regionKey].element || this.createElement('div');

        this.setScreenReaderSectionAttribs(sectionDiv, regionKey);
        sectionDiv.innerHTML = content;
        regions[regionKey].insertIntoDOM(sectionDiv, chart);

        this.initDataTableButton(this.dataTableButtonId);
        this.unhideElementFromScreenReaders(sectionDiv);
        this.visuallyHideElement(sectionDiv);
    },


    /**
     * @private
     */
    setScreenReaderSectionAttribs: function (sectionDiv, regionKey) {
        var labelLangKey = 'accessibility.screenReaderSection.' + regionKey +
                'RegionLabel',
            chart = this.chart,
            sectionId = 'highcharts-screen-reader-region-' + regionKey + '-' +
                chart.index;

        setElAttrs(sectionDiv, {
            id: sectionId,
            'aria-label': chart.langFormat(labelLangKey, { chart: chart })
        });

        if (chart.options.accessibility.landmarkVerbosity === 'all') {
            sectionDiv.setAttribute('role', 'region');
        }
    },


    /**
     * @private
     */
    defaultBeforeChartFormatter: function () {
        var chart = this.chart,
            options = chart.options,
            format = options.accessibility.screenReaderSection
                .beforeChartFormat,
            axesDesc = this.getAxesDescription(),
            dataTableButtonId = 'hc-linkto-highcharts-data-table-' +
                chart.index,
            context = {
                chartTitle: this.getChartTitleText(),
                typeDescription: this.getTypeDescriptionText(),
                chartSubtitle: this.getSubtitleText(),
                chartLongdesc: this.getLongdescText(),
                xAxisDescription: axesDesc.xAxis,
                yAxisDescription: axesDesc.yAxis,
                viewTableButtonText: chart.getCSV ?
                    this.getDataTableButtonText(dataTableButtonId) : ''
            },
            formattedString = H.i18nFormat(format, context),
            filteredString = filterHTMLTags(formattedString),
            strippedString = stripEmptyHTMLTags(filteredString);

        this.dataTableButtonId = dataTableButtonId;
        return strippedString;
    },


    /**
     * @private
     */
    defaultAfterChartFormatter: function () {
        return 'After';
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
        var srSectionOpts = chart.options.accessibility.screenReaderSection;
        return chart.langFormat(
            'accessibility.axis.rangeFromTo',
            {
                chart: chart,
                axis: axis,
                rangeFrom: axis.isDatetimeAxis ?
                    chart.time.dateFormat(
                        srSectionOpts.axisRangeDateFormat, axis.min
                    ) : axis.min,
                rangeTo: axis.isDatetimeAxis ?
                    chart.time.dateFormat(
                        srSectionOpts.axisRangeDateFormat, axis.max
                    ) : axis.max
            }
        );
    },

    /**
     * Set attribs and handlers for default view as data table button.
     * @private
     */
    initDataTableButton: function (tableButtonId) {
        var el = this.viewDataTableButton = tableButtonId &&
                this.getElement(tableButtonId),
            chart = this.chart,
            tableId = tableButtonId && tableButtonId.replace('hc-linkto-', '');

        if (el) {
            setElAttrs(el, {
                role: 'button',
                tabindex: '-1',
                'aria-expanded': !!this.getElement(tableId),
                href: '#' + tableId
            });

            el.onclick = chart.options.accessibility.screenReaderSection
                .onViewDataTableClick ||
                function () {
                    chart.viewData();
                };
        }
    },


    /**
     * @private
     */
    getLongdescText: function () {
        var chartOptions = this.chart.options,
            captionOptions = chartOptions.caption,
            captionText = captionOptions && captionOptions.text;
        return chartOptions.accessibility.description ||
                captionText || '';
    },


    /**
     * @private
     */
    getTypeDescriptionText: function () {
        var chart = this.chart;
        return chart.types ? chart.options.accessibility.typeDescription ||
            chart.getTypeDescription(chart.types) : '';
    },


    /**
     * @private
     */
    getChartTitleText: function () {
        var chart = this.chart;
        return chart.options.title.text || chart.langFormat(
            'accessibility.defaultChartTitle', { chart: chart }
        );
    },


    /**
     * @private
     */
    getDataTableButtonText: function (buttonId) {
        var chart = this.chart,
            buttonText = chart.langFormat(
                'accessibility.table.viewAsDataTableButtonText',
                { chart: chart }
            );

        return '<a id="' + buttonId + '">' + buttonText + '</a>';
    },


    /**
     * @private
     */
    getSubtitleText: function () {
        var subtitle = this.chart.options.subtitle;
        return subtitle && subtitle.text || '';
    }
});

export default InfoRegionsComponent;
