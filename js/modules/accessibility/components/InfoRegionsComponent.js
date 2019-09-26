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


function getTypeDescForMapChart(chart, formatContext) {
    return formatContext.mapTitle ?
        chart.langFormat('accessibility.chartTypes.mapTypeDescription',
            formatContext) :
        chart.langFormat('accessibility.chartTypes.unknownMap',
            formatContext);
}

function getTypeDescForCombinationChart(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.combinationChart',
        formatContext);
}

function getTypeDescForEmptyChart(chart, formatContext) {
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
            /<div id="[a-zA-Z\-0-9#]*?">/g,
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
 * Return simplified explaination of chart type. Some types will not be familiar
 * to most users, but in those cases we try to add an explaination of the type.
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
        return getTypeDescForEmptyChart(this, formatContext);
    }

    if (firstType === 'map') {
        return getTypeDescForMapChart(this, formatContext);
    }

    if (this.types.length > 1) {
        return getTypeDescForCombinationChart(this, formatContext);
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
                },
                afterInserted: function () {
                    component.initDataTableButton(component.dataTableButtonId);
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
                    chart.renderTo.insertBefore(
                        el, chart.container.nextSibling
                    );
                },
                afterInserted: function () {
                    if (component.endOfChartMarkerId) {
                        component.chart.endOfChartMarker = component
                            .getElement(component.endOfChartMarkerId);
                    }
                }
            }
        };
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
     * @param {string} regionKey The name/key of the region to update
     */
    updateScreenReaderSection: function (regionKey) {
        var chart = this.chart,
            region = this.screenReaderSections[regionKey],
            content = region.buildContent(chart),
            sectionDiv = region.element = region.element ||
                this.createElement('div'),
            hiddenDiv = sectionDiv.firstChild || this.createElement('div');

        this.setScreenReaderSectionAttribs(sectionDiv, regionKey);
        hiddenDiv.innerHTML = content;
        sectionDiv.appendChild(hiddenDiv);
        region.insertIntoDOM(sectionDiv, chart);

        this.visuallyHideElement(hiddenDiv);
        this.unhideElementFromScreenReaders(hiddenDiv);
        if (region.afterInserted) {
            region.afterInserted();
        }
    },


    /**
     * @private
     * @param {Highcharts.HTMLDOMElement} sectionDiv The section element
     * @param {string} regionKey Name/key of the region we are setting attrs for
     */
    setScreenReaderSectionAttribs: function (sectionDiv, regionKey) {
        var labelLangKey = 'accessibility.screenReaderSection.' + regionKey +
                'RegionLabel',
            chart = this.chart,
            labelText = chart.langFormat(labelLangKey, { chart: chart }),
            sectionId = 'highcharts-screen-reader-region-' + regionKey + '-' +
                chart.index;

        setElAttrs(sectionDiv, {
            id: sectionId,
            'aria-label': labelText
        });

        // Sections are wrapped to be positioned relatively to chart in case
        // elements inside are tabbed to.
        sectionDiv.style.position = 'relative';

        if (chart.options.accessibility.landmarkVerbosity === 'all' &&
            labelText) {
            sectionDiv.setAttribute('role', 'region');
        }
    },


    /**
     * @private
     * @return {string}
     */
    defaultBeforeChartFormatter: function () {
        var chart = this.chart,
            format = chart.options.accessibility.screenReaderSection
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
                viewTableButton: chart.getCSV ?
                    this.getDataTableButtonText(dataTableButtonId) : ''
            },
            formattedString = H.i18nFormat(format, context);

        this.dataTableButtonId = dataTableButtonId;
        return stripEmptyHTMLTags(filterHTMLTags(formattedString));
    },


    /**
     * @private
     * @return {string}
     */
    defaultAfterChartFormatter: function () {
        var chart = this.chart,
            format = chart.options.accessibility.screenReaderSection
                .afterChartFormat,
            context = {
                endOfChartMarker: this.getEndOfChartMarkerText()
            },
            formattedString = H.i18nFormat(format, context);

        return stripEmptyHTMLTags(filterHTMLTags(formattedString));
    },


    /**
     * @private
     * @return {string}
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
     * @return {string}
     */
    getTypeDescriptionText: function () {
        var chart = this.chart;
        return chart.types ? chart.options.accessibility.typeDescription ||
            chart.getTypeDescription(chart.types) : '';
    },


    /**
     * @private
     * @return {string}
     */
    getChartTitleText: function () {
        var chart = this.chart;
        return chart.options.title.text || chart.langFormat(
            'accessibility.defaultChartTitle', { chart: chart }
        );
    },


    /**
     * @private
     * @param {string} buttonId
     * @return {string}
     */
    getDataTableButtonText: function (buttonId) {
        var chart = this.chart,
            buttonText = chart.langFormat(
                'accessibility.table.viewAsDataTableButtonText',
                { chart: chart, chartTitle: this.getChartTitleText() }
            );

        return '<a id="' + buttonId + '">' + buttonText + '</a>';
    },


    /**
     * @private
     * @return {string}
     */
    getSubtitleText: function () {
        var subtitle = this.chart.options.subtitle;
        return subtitle && subtitle.text || '';
    },


    /**
     * @private
     * @return {string}
     */
    getEndOfChartMarkerText: function () {
        var chart = this.chart,
            markerText = chart.langFormat(
                'accessibility.screenReaderSection.endOfChartMarker',
                { chart: chart }
            ),
            id = 'highcharts-end-of-chart-marker-' + chart.index;

        return '<div id="' + id + '">' + markerText + '</div>';
    },


    /**
     * @private
     * @param {global.Event} e
     */
    onDataTableCreated: function (e) {
        var chart = this.chart;

        if (chart.options.accessibility.enabled) {
            if (this.viewDataTableButton) {
                this.viewDataTableButton.setAttribute('aria-expanded', 'true');
            }

            e.html = e.html.replace('<table ',
                '<table tabindex="0" summary="' + getTableSummary(chart) + '"');
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
     * Set attribs and handlers for default viewAsDataTable button if exists.
     * @private
     * @param {string} tableButtonId
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
     * Return object with text description of each of the chart's axes.
     * @private
     * @return {object}
     */
    getAxesDescription: function () {
        var chart = this.chart,
            shouldDescribeColl = function (collectionKey, defaultCondition) {
                var axes = chart[collectionKey];
                return axes.length > 1 || axes[0] &&
                pick(
                    axes[0].options.accessibility &&
                    axes[0].options.accessibility.enabled,
                    defaultCondition
                );
            },
            hasNoMap = chart.types.indexOf('map') < 0,
            hasCartesian = chart.hasCartesianSeries,
            showXAxes = shouldDescribeColl(
                'xAxis', !chart.angular && hasCartesian && hasNoMap
            ),
            showYAxes = shouldDescribeColl(
                'yAxis', hasCartesian && hasNoMap
            ),
            desc = {};

        if (showXAxes) {
            desc.xAxis = this.getAxisDescriptionText('xAxis');
        }

        if (showYAxes) {
            desc.yAxis = this.getAxisDescriptionText('yAxis');
        }

        return desc;
    },


    /**
     * @private
     * @param {string} collectionKey
     * @return {string}
     */
    getAxisDescriptionText: function (collectionKey) {
        var component = this,
            chart = this.chart,
            axes = chart[collectionKey];

        return chart.langFormat(
            'accessibility.axis.' + collectionKey + 'Description' + (
                axes.length > 1 ? 'Plural' : 'Singular'
            ),
            {
                chart: chart,
                names: axes.map(function (axis) {
                    return axis.getDescription();
                }),
                ranges: axes.map(function (axis) {
                    return component.getAxisRangeDescription(axis);
                }),
                numAxes: axes.length
            }
        );
    },


    /**
     * Return string with text description of the axis range.
     * @private
     * @param {Highcharts.Axis} axis The axis to get range desc of.
     * @return {string} A string with the range description for the axis.
     */
    getAxisRangeDescription: function (axis) {
        var axisOptions = axis.options || {};

        // Handle overridden range description
        if (
            axisOptions.accessibility &&
            axisOptions.accessibility.rangeDescription !== undefined
        ) {
            return axisOptions.accessibility.rangeDescription;
        }

        // Handle category axes
        if (axis.categories) {
            return this.getCategoryAxisRangeDesc(axis);
        }

        // Use time range, not from-to?
        if (axis.isDatetimeAxis && (axis.min === 0 || axis.dataMin === 0)) {
            return this.getAxisTimeLengthDesc(axis);
        }

        // Just use from and to.
        // We have the range and the unit to use, find the desc format
        return this.getAxisFromToDescription(axis);
    },


    /**
     * @private
     * @param {Highcharts.Axis} axis
     * @return {string}
     */
    getCategoryAxisRangeDesc: function (axis) {
        var chart = this.chart;
        return chart.langFormat(
            'accessibility.axis.rangeCategories',
            {
                chart: chart,
                axis: axis,
                numCategories: axis.dataMax - axis.dataMin + 1
            }
        );
    },


    /**
     * @private
     * @param {Highcharts.Axis} axis
     * @return {string}
     */
    getAxisTimeLengthDesc: function (axis) {
        var chart = this.chart,
            range = {},
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
    },


    /**
     * @private
     * @param {Highcharts.Axis} axis
     * @return {string}
     */
    getAxisFromToDescription: function (axis) {
        var chart = this.chart,
            dateRangeFormat = chart.options.accessibility.screenReaderSection
                .axisRangeDateFormat,
            format = function (axisKey) {
                return axis.isDatetimeAxis ? chart.time.dateFormat(
                    dateRangeFormat, axis[axisKey]
                ) : axis[axisKey];
            };

        return chart.langFormat(
            'accessibility.axis.rangeFromTo',
            {
                chart: chart,
                axis: axis,
                rangeFrom: format('min'),
                rangeTo: format('max')
            }
        );
    }
});

export default InfoRegionsComponent;
