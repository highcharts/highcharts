/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for chart info region and table.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
var doc = H.win.document,
    format = H.format;

import U from '../../../parts/Utilities.js';
var extend = U.extend,
    pick = U.pick;

import AccessibilityComponent from '../AccessibilityComponent.js';

import ChartUtilities from '../utils/chartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT,
    getChartTitle = ChartUtilities.getChartTitle,
    getAxisDescription = ChartUtilities.getAxisDescription;

import HTMLUtilities from '../utils/htmlUtilities.js';
var addClass = HTMLUtilities.addClass,
    setElAttrs = HTMLUtilities.setElAttrs,
    escapeStringForHTML = HTMLUtilities.escapeStringForHTML,
    stripHTMLTagsFromString = HTMLUtilities.stripHTMLTagsFromString,
    getElement = HTMLUtilities.getElement,
    visuallyHideElement = HTMLUtilities.visuallyHideElement;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class InfoRegionsComponent extends AccessibilityComponent {
            public constructor();
            public dataTableButtonId?: string;
            public dataTableDiv?: HTMLDOMElement;
            public linkedDescriptionElement: (HTMLDOMElement|undefined);
            public screenReaderSections: Dictionary<(
                InfoRegionsComponentScreenReaderSectionObject
            )>;
            public viewDataTableButton?: (
                ''|HTMLDOMElement|SVGDOMElement|null
            );
            public defaultAfterChartFormatter(): string;
            public defaultBeforeChartFormatter(): string;
            public focusDataTable(): void;
            public getAxesDescription(): Dictionary<string>;
            public getAxisDescriptionText(
                collectionKey: ('xAxis'|'yAxis')
            ): string;
            public getAxisFromToDescription(axis: Axis): string;
            public getAxisRangeDescription(axis: Axis): string;
            public getAxisTimeLengthDesc(axis: Axis): string;
            public getCategoryAxisRangeDesc(axis: Axis): string;
            public getDataTableButtonText(buttonId: string): string;
            public getEndOfChartMarkerText(): string;
            public getLinkedDescription(): string;
            public getLinkedDescriptionElement(): (HTMLDOMElement|undefined);
            public getLongdescText(): string;
            public getSubtitleText(): string;
            public getTypeDescriptionText(): string;
            public init(): void;
            public initDataTableButton(tableButtonId: string): void;
            public initRegionsDefinitions(): void;
            public onChartUpdate(): void;
            public onDataTableCreated(e: { html: string }): void;
            public setLinkedDescriptionAttrs(): void;
            public setScreenReaderSectionAttribs(
                sectionDiv: HTMLDOMElement,
                regionKey: string
            ): void;
            public updateScreenReaderSection(regionKey: string): void;
        }
        interface Chart {
            /** @requires modules/accessibility */
            getTypeDescription(types: Array<string>): string;
        }
        interface InfoRegionsComponentTypeDescFormatContextObject {
            chart: Chart;
            mapTitle: (string|undefined);
            numSeries: number;
            numPoints: number;
        }
        interface InfoRegionsComponentScreenReaderSectionObject {
            afterInserted?: Function;
            element: (HTMLDOMElement|null);
            buildContent: Function;
            insertIntoDOM: Function;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function getTypeDescForMapChart(
    chart: Highcharts.Chart,
    formatContext: Highcharts.InfoRegionsComponentTypeDescFormatContextObject
): string {
    return formatContext.mapTitle ?
        chart.langFormat('accessibility.chartTypes.mapTypeDescription',
            formatContext) :
        chart.langFormat('accessibility.chartTypes.unknownMap',
            formatContext);
}

/**
 * @private
 */
function getTypeDescForCombinationChart(
    chart: Highcharts.Chart,
    formatContext: Highcharts.InfoRegionsComponentTypeDescFormatContextObject
): string {
    return chart.langFormat('accessibility.chartTypes.combinationChart',
        formatContext);
}

/**
 * @private
 */
function getTypeDescForEmptyChart(
    chart: Highcharts.Chart,
    formatContext: Highcharts.InfoRegionsComponentTypeDescFormatContextObject
): string {
    return chart.langFormat('accessibility.chartTypes.emptyChart',
        formatContext);
}

/**
 * @private
 */
function buildTypeDescriptionFromSeries(
    chart: Highcharts.Chart,
    types: Array<string>,
    context: Highcharts.InfoRegionsComponentTypeDescFormatContextObject
): string {
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

/**
 * @private
 */
function getTableSummary(chart: Highcharts.Chart): string {
    return chart.langFormat(
        'accessibility.table.tableSummary', { chart: chart }
    );
}

/**
 * @private
 */
function stripEmptyHTMLTags(str: string): string {
    return str.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, '');
}

/**
 * @private
 */
function enableSimpleHTML(str: string): string {
    return str
        .replace(/&lt;(h[1-7]|p|div)&gt;/g, '<$1>')
        .replace(/&lt;&#x2F;(h[1-7]|p|div|a|button)&gt;/g, '</$1>')
        .replace(
            /&lt;(div|a|button) id=&quot;([a-zA-Z\-0-9#]*?)&quot;&gt;/g,
            '<$1 id="$2">'
        );
}

/**
 * @private
 */
function stringToSimpleHTML(str: string): string {
    return stripEmptyHTMLTags(enableSimpleHTML(escapeStringForHTML(str)));
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
H.Chart.prototype.getTypeDescription = function (types: Array<string>): string {
    var firstType = types[0],
        firstSeries = this.series && this.series[0] || {},
        formatContext: Highcharts.InfoRegionsComponentTypeDescFormatContextObject = {
            numSeries: this.series.length,
            numPoints: firstSeries.points && firstSeries.points.length,
            chart: this,
            mapTitle: (firstSeries as Highcharts.MapSeries).mapTitle
        };

    if (!firstType) {
        return getTypeDescForEmptyChart(this, formatContext);
    }

    if (firstType === 'map') {
        return getTypeDescForMapChart(this, formatContext);
    }

    if ((this.types as any).length > 1) {
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
var InfoRegionsComponent: typeof Highcharts.InfoRegionsComponent =
    function (): void {} as any;
InfoRegionsComponent.prototype = new (AccessibilityComponent as any)();
extend(InfoRegionsComponent.prototype, /** @lends Highcharts.InfoRegionsComponent */ { // eslint-disable-line

    /**
     * Init the component
     * @private
     */
    init: function (this: Highcharts.InfoRegionsComponent): void {
        var chart: Highcharts.Chart = this.chart as any,
            component = this;

        this.initRegionsDefinitions();

        this.addEvent(chart, 'afterGetTable', function (
            e: { html: string }
        ): void {
            component.onDataTableCreated(e);
        });

        this.addEvent(chart, 'afterViewData', function (
            tableDiv: Highcharts.HTMLDOMElement
        ): void {
            component.dataTableDiv = tableDiv;

            // Use small delay to give browsers & AT time to register new table
            setTimeout(function (): void {
                component.focusDataTable();
            }, 300);
        });
    },


    /**
     * @private
     */
    initRegionsDefinitions: function (
        this: Highcharts.InfoRegionsComponent
    ): void {
        var component = this;

        this.screenReaderSections = {
            before: {
                element: null,
                buildContent: function (
                    chart: Highcharts.AccessibilityChart
                ): string {
                    var formatter: (
                        Highcharts.ScreenReaderFormatterCallbackFunction<(
                            Highcharts.Chart
                        )>|undefined
                    ) = chart.options.accessibility
                        .screenReaderSection.beforeChartFormatter;
                    return formatter ? formatter(chart) :
                        (component.defaultBeforeChartFormatter as any)(chart);
                },
                insertIntoDOM: function (
                    el: Highcharts.HTMLDOMElement,
                    chart: Highcharts.AccessibilityChart
                ): void {
                    chart.renderTo.insertBefore(
                        el, chart.renderTo.firstChild
                    );
                },
                afterInserted: function (): void {
                    if (typeof component.dataTableButtonId !== 'undefined') {
                        component.initDataTableButton(component.dataTableButtonId);
                    }
                }
            },

            after: {
                element: null,
                buildContent: function (
                    chart: Highcharts.AccessibilityChart
                ): string {
                    var formatter = chart.options.accessibility.screenReaderSection
                        .afterChartFormatter;
                    return formatter ? formatter(chart) :
                        component.defaultAfterChartFormatter();
                },
                insertIntoDOM: function (
                    el: Highcharts.HTMLDOMElement,
                    chart: Highcharts.AccessibilityChart
                ): void {
                    chart.renderTo.insertBefore(
                        el, chart.container.nextSibling
                    );
                }
            }
        };
    },


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function (this: Highcharts.InfoRegionsComponent): void {
        var component = this;

        this.linkedDescriptionElement = this.getLinkedDescriptionElement();
        this.setLinkedDescriptionAttrs();

        Object.keys(this.screenReaderSections).forEach(function (
            regionKey: string
        ): void {
            component.updateScreenReaderSection(regionKey);
        });
    },


    /**
     * @private
     */
    getLinkedDescriptionElement: function (
        this: Highcharts.InfoRegionsComponent
    ): (Highcharts.HTMLDOMElement|undefined) {
        var chartOptions = this.chart.options,
            linkedDescOption = chartOptions.accessibility.linkedDescription;

        if (!linkedDescOption) {
            return;
        }

        if (typeof linkedDescOption !== 'string') {
            return linkedDescOption;
        }

        var query = format(linkedDescOption, this.chart),
            queryMatch = doc.querySelectorAll(query);

        if (queryMatch.length === 1) {
            return queryMatch[0] as any;
        }
    },


    /**
     * @private
     */
    setLinkedDescriptionAttrs: function (
        this: Highcharts.InfoRegionsComponent
    ): void {
        var el = this.linkedDescriptionElement;

        if (el) {
            el.setAttribute('aria-hidden', 'true');
            addClass(el, 'highcharts-linked-description');
        }
    },


    /**
     * @private
     * @param {string} regionKey The name/key of the region to update
     */
    updateScreenReaderSection: function (
        this: Highcharts.InfoRegionsComponent,
        regionKey: string
    ): void {
        var chart = this.chart,
            region = this.screenReaderSections[regionKey],
            content = region.buildContent(chart),
            sectionDiv = region.element = (
                region.element || this.createElement('div')
            ),
            hiddenDiv: Highcharts.HTMLDOMElement = (
                (sectionDiv.firstChild as any) || this.createElement('div')
            );

        this.setScreenReaderSectionAttribs(sectionDiv, regionKey);
        hiddenDiv.innerHTML = content;
        sectionDiv.appendChild(hiddenDiv);
        region.insertIntoDOM(sectionDiv, chart);

        visuallyHideElement(hiddenDiv);
        unhideChartElementFromAT(chart, hiddenDiv);
        if (region.afterInserted) {
            region.afterInserted();
        }
    },


    /**
     * @private
     * @param {Highcharts.HTMLDOMElement} sectionDiv The section element
     * @param {string} regionKey Name/key of the region we are setting attrs for
     */
    setScreenReaderSectionAttribs: function (
        this: Highcharts.InfoRegionsComponent,
        sectionDiv: Highcharts.HTMLDOMElement,
        regionKey: string
    ): void {
        var labelLangKey = (
                'accessibility.screenReaderSection.' + regionKey + 'RegionLabel'
            ),
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

        if (
            chart.options.accessibility.landmarkVerbosity === 'all' &&
            labelText
        ) {
            sectionDiv.setAttribute('role', 'region');
        }
    },


    /**
     * @private
     * @return {string}
     */
    defaultBeforeChartFormatter: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
        var chart = this.chart,
            format = chart.options.accessibility
                .screenReaderSection.beforeChartFormat,
            axesDesc = this.getAxesDescription(),
            dataTableButtonId = 'hc-linkto-highcharts-data-table-' +
                chart.index,
            context = {
                chartTitle: getChartTitle(chart),
                typeDescription: this.getTypeDescriptionText(),
                chartSubtitle: this.getSubtitleText(),
                chartLongdesc: this.getLongdescText(),
                xAxisDescription: axesDesc.xAxis,
                yAxisDescription: axesDesc.yAxis,
                viewTableButton: chart.getCSV ?
                    this.getDataTableButtonText(dataTableButtonId) : ''
            },
            formattedString = H.i18nFormat(format, context, chart);

        this.dataTableButtonId = dataTableButtonId;
        return stringToSimpleHTML(formattedString);
    },


    /**
     * @private
     * @return {string}
     */
    defaultAfterChartFormatter: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
        var chart = this.chart,
            format = chart.options.accessibility
                .screenReaderSection.afterChartFormat,
            context = {
                endOfChartMarker: this.getEndOfChartMarkerText()
            },
            formattedString = H.i18nFormat(format, context, chart);

        return stringToSimpleHTML(formattedString);
    },


    /**
     * @private
     * @return {string}
     */
    getLinkedDescription: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
        var el = this.linkedDescriptionElement,
            content = el && el.innerHTML || '';

        return stripHTMLTagsFromString(content);
    },


    /**
     * @private
     * @return {string}
     */
    getLongdescText: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
        var chartOptions = this.chart.options,
            captionOptions = chartOptions.caption,
            captionText = captionOptions && captionOptions.text,
            linkedDescription = this.getLinkedDescription();

        return (
            chartOptions.accessibility.description ||
            linkedDescription ||
            captionText ||
            ''
        );
    },


    /**
     * @private
     * @return {string}
     */
    getTypeDescriptionText: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
        var chart = this.chart;
        return chart.types ?
            chart.options.accessibility.typeDescription ||
            chart.getTypeDescription(chart.types) : '';
    },


    /**
     * @private
     * @param {string} buttonId
     * @return {string}
     */
    getDataTableButtonText: function (
        this: Highcharts.InfoRegionsComponent,
        buttonId: string
    ): string {
        var chart = this.chart,
            buttonText = chart.langFormat(
                'accessibility.table.viewAsDataTableButtonText',
                { chart: chart, chartTitle: getChartTitle(chart) }
            );

        return '<a id="' + buttonId + '">' + buttonText + '</a>';
    },


    /**
     * @private
     * @return {string}
     */
    getSubtitleText: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
        var subtitle = (
            this.chart.options.subtitle
        );
        return stripHTMLTagsFromString(subtitle && subtitle.text || '');
    },


    /**
     * @private
     * @return {string}
     */
    getEndOfChartMarkerText: function (
        this: Highcharts.InfoRegionsComponent
    ): string {
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
     * @param {Highcharts.Dictionary<string>} e
     */
    onDataTableCreated: function (
        this: Highcharts.InfoRegionsComponent,
        e: { html: string }
    ): void {
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
    focusDataTable: function (
        this: Highcharts.InfoRegionsComponent
    ): void {
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
    initDataTableButton: function (
        this: Highcharts.InfoRegionsComponent,
        tableButtonId: string
    ): void {
        var el = this.viewDataTableButton = getElement(tableButtonId),
            chart = this.chart,
            tableId = tableButtonId.replace('hc-linkto-', '');

        if (el) {
            setElAttrs(el, {
                role: 'button',
                tabindex: '-1',
                'aria-expanded': !!getElement(tableId),
                href: '#' + tableId
            });

            el.onclick = chart.options.accessibility
                .screenReaderSection.onViewDataTableClick ||
                function (): void {
                    chart.viewData();
                };
        }
    },


    /**
     * Return object with text description of each of the chart's axes.
     * @private
     * @return {Highcharts.Dictionary<string>}
     */
    getAxesDescription: function (
        this: Highcharts.InfoRegionsComponent
    ): Highcharts.Dictionary<string> {
        var chart = this.chart,
            shouldDescribeColl = function (
                collectionKey: ('xAxis'|'yAxis'),
                defaultCondition: boolean
            ): boolean {
                var axes = chart[collectionKey];
                return axes.length > 1 || axes[0] &&
                pick(
                    axes[0].options.accessibility &&
                    axes[0].options.accessibility.enabled,
                    defaultCondition
                );
            },
            hasNoMap = !!chart.types && chart.types.indexOf('map') < 0,
            hasCartesian = !!chart.hasCartesianSeries,
            showXAxes = shouldDescribeColl(
                'xAxis', !chart.angular && hasCartesian && hasNoMap
            ),
            showYAxes = shouldDescribeColl(
                'yAxis', hasCartesian && hasNoMap
            ),
            desc: Highcharts.Dictionary<string> = {};

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
    getAxisDescriptionText: function (
        this: Highcharts.InfoRegionsComponent,
        collectionKey: ('xAxis'|'yAxis')
    ): string {
        var component = this,
            chart = this.chart,
            axes = chart[collectionKey];

        return chart.langFormat(
            'accessibility.axis.' + collectionKey + 'Description' + (
                axes.length > 1 ? 'Plural' : 'Singular'
            ),
            {
                chart: chart,
                names: axes.map(function (axis: Highcharts.Axis): string {
                    return getAxisDescription(axis);
                }),
                ranges: axes.map(function (axis: Highcharts.Axis): string {
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
    getAxisRangeDescription: function (
        this: Highcharts.InfoRegionsComponent,
        axis: Highcharts.Axis
    ): string {
        var axisOptions = axis.options || {};

        // Handle overridden range description
        if (
            axisOptions.accessibility &&
            typeof axisOptions.accessibility.rangeDescription !== 'undefined'
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
    getCategoryAxisRangeDesc: function (
        this: Highcharts.InfoRegionsComponent,
        axis: Highcharts.Axis
    ): string {
        var chart = this.chart;

        if (axis.dataMax && axis.dataMin) {
            return chart.langFormat(
                'accessibility.axis.rangeCategories',
                {
                    chart: chart,
                    axis: axis,
                    numCategories: axis.dataMax - axis.dataMin + 1
                }
            );
        }

        return '';
    },


    /**
     * @private
     * @param {Highcharts.Axis} axis
     * @return {string}
     */
    getAxisTimeLengthDesc: function (
        this: Highcharts.InfoRegionsComponent,
        axis: Highcharts.Axis
    ): string {
        var chart = this.chart,
            range: Highcharts.Dictionary<number> = {},
            rangeUnit = 'Seconds';

        range.Seconds = ((axis.max || 0) - (axis.min || 0)) / 1000;
        range.Minutes = range.Seconds / 60;
        range.Hours = range.Minutes / 60;
        range.Days = range.Hours / 24;

        ['Minutes', 'Hours', 'Days'].forEach(function (unit: string): void {
            if (range[unit] > 2) {
                rangeUnit = unit;
            }
        });

        const rangeValue: string = range[rangeUnit].toFixed(
            rangeUnit !== 'Seconds' &&
            rangeUnit !== 'Minutes' ? 1 : 0 // Use decimals for days/hours
        );

        // We have the range and the unit to use, find the desc format
        return chart.langFormat(
            'accessibility.axis.timeRange' + rangeUnit,
            {
                chart: chart,
                axis: axis,
                range: rangeValue.replace('.0', '')
            }
        );
    },


    /**
     * @private
     * @param {Highcharts.Axis} axis
     * @return {string}
     */
    getAxisFromToDescription: function (
        this: Highcharts.InfoRegionsComponent,
        axis: Highcharts.Axis
    ): string {
        var chart = this.chart,
            dateRangeFormat = chart.options.accessibility
                .screenReaderSection.axisRangeDateFormat,
            format = function (axisKey: string): string {
                return axis.isDatetimeAxis ? chart.time.dateFormat(
                    dateRangeFormat, (axis as any)[axisKey]
                ) : (axis as any)[axisKey];
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
