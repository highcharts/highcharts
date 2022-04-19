/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for chart info region and table.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import A11yI18n from '../A11yI18n.js';
import AccessibilityComponent from '../AccessibilityComponent.js';
import Announcer from '../Utils/Announcer.js';
import AnnotationsA11y from './AnnotationsA11y.js';
var getAnnotationsInfoHTML = AnnotationsA11y.getAnnotationsInfoHTML;
import AST from '../../Core/Renderer/HTML/AST.js';
import CU from '../Utils/ChartUtilities.js';
var getAxisDescription = CU.getAxisDescription, getAxisRangeDescription = CU.getAxisRangeDescription, getChartTitle = CU.getChartTitle, unhideChartElementFromAT = CU.unhideChartElementFromAT;
import F from '../../Core/FormatUtilities.js';
var format = F.format;
import H from '../../Core/Globals.js';
var doc = H.doc;
import HU from '../Utils/HTMLUtilities.js';
var addClass = HU.addClass, getElement = HU.getElement, getHeadingTagNameForElement = HU.getHeadingTagNameForElement, stripHTMLTagsFromString = HU.stripHTMLTagsFromString, visuallyHideElement = HU.visuallyHideElement;
import U from '../../Core/Utilities.js';
var attr = U.attr, pick = U.pick;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * @private
 */
function getTableSummary(chart) {
    return chart.langFormat('accessibility.table.tableSummary', { chart: chart });
}
/**
 * @private
 */
function getTypeDescForMapChart(chart, formatContext) {
    return formatContext.mapTitle ?
        chart.langFormat('accessibility.chartTypes.mapTypeDescription', formatContext) :
        chart.langFormat('accessibility.chartTypes.unknownMap', formatContext);
}
/**
 * @private
 */
function getTypeDescForCombinationChart(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.combinationChart', formatContext);
}
/**
 * @private
 */
function getTypeDescForEmptyChart(chart, formatContext) {
    return chart.langFormat('accessibility.chartTypes.emptyChart', formatContext);
}
/**
 * @private
 */
function buildTypeDescriptionFromSeries(chart, types, context) {
    var firstType = types[0], typeExplaination = chart.langFormat('accessibility.seriesTypeDescriptions.' + firstType, context), multi = chart.series && chart.series.length < 2 ? 'Single' : 'Multiple';
    return (chart.langFormat('accessibility.chartTypes.' + firstType + multi, context) ||
        chart.langFormat('accessibility.chartTypes.default' + multi, context)) + (typeExplaination ? ' ' + typeExplaination : '');
}
/**
 * Return simplified explaination of chart type. Some types will not be
 * familiar to most users, but in those cases we try to add an explaination
 * of the type.
 *
 * @private
 * @function Highcharts.Chart#getTypeDescription
 * @param {Array<string>} types The series types in this chart.
 * @return {string} The text description of the chart type.
 */
function getTypeDescription(chart, types) {
    var firstType = types[0], firstSeries = chart.series && chart.series[0] || {}, formatContext = {
        numSeries: chart.series.length,
        numPoints: firstSeries.points && firstSeries.points.length,
        chart: chart,
        mapTitle: firstSeries.mapTitle
    };
    if (!firstType) {
        return getTypeDescForEmptyChart(chart, formatContext);
    }
    if (firstType === 'map') {
        return getTypeDescForMapChart(chart, formatContext);
    }
    if (chart.types.length > 1) {
        return getTypeDescForCombinationChart(chart, formatContext);
    }
    return buildTypeDescriptionFromSeries(chart, types, formatContext);
}
/**
 * @private
 */
function stripEmptyHTMLTags(str) {
    return str.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, '');
}
/* *
 *
 *  Class
 *
 * */
/**
 * The InfoRegionsComponent class
 *
 * @private
 * @class
 * @name Highcharts.InfoRegionsComponent
 */
var InfoRegionsComponent = /** @class */ (function (_super) {
    __extends(InfoRegionsComponent, _super);
    function InfoRegionsComponent() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.announcer = void 0;
        _this.screenReaderSections = {};
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Init the component
     * @private
     */
    InfoRegionsComponent.prototype.init = function () {
        var chart = this.chart;
        var component = this;
        this.initRegionsDefinitions();
        this.addEvent(chart, 'aftergetTableAST', function (e) {
            component.onDataTableCreated(e);
        });
        this.addEvent(chart, 'afterViewData', function (tableDiv) {
            component.dataTableDiv = tableDiv;
            // Use small delay to give browsers & AT time to register new table
            setTimeout(function () {
                component.focusDataTable();
            }, 300);
        });
        this.announcer = new Announcer(chart, 'assertive');
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.initRegionsDefinitions = function () {
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
                    chart.renderTo.insertBefore(el, chart.renderTo.firstChild);
                },
                afterInserted: function () {
                    if (typeof component.sonifyButtonId !== 'undefined') {
                        component.initSonifyButton(component.sonifyButtonId);
                    }
                    if (typeof component.dataTableButtonId !== 'undefined') {
                        component.initDataTableButton(component.dataTableButtonId);
                    }
                }
            },
            after: {
                element: null,
                buildContent: function (chart) {
                    var formatter = chart.options.accessibility
                        .screenReaderSection
                        .afterChartFormatter;
                    return formatter ? formatter(chart) :
                        component.defaultAfterChartFormatter();
                },
                insertIntoDOM: function (el, chart) {
                    chart.renderTo.insertBefore(el, chart.container.nextSibling);
                },
                afterInserted: function () {
                    if (component.chart.accessibility) {
                        component.chart.accessibility
                            .keyboardNavigation.updateExitAnchor(); // #15986
                    }
                }
            }
        };
    };
    /**
     * Called on chart render. Have to update the sections on render, in order
     * to get a11y info from series.
     */
    InfoRegionsComponent.prototype.onChartRender = function () {
        var component = this;
        this.linkedDescriptionElement = this.getLinkedDescriptionElement();
        this.setLinkedDescriptionAttrs();
        Object.keys(this.screenReaderSections).forEach(function (regionKey) {
            component.updateScreenReaderSection(regionKey);
        });
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getLinkedDescriptionElement = function () {
        var chartOptions = this.chart.options, linkedDescOption = chartOptions.accessibility.linkedDescription;
        if (!linkedDescOption) {
            return;
        }
        if (typeof linkedDescOption !== 'string') {
            return linkedDescOption;
        }
        var query = format(linkedDescOption, this.chart), queryMatch = doc.querySelectorAll(query);
        if (queryMatch.length === 1) {
            return queryMatch[0];
        }
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.setLinkedDescriptionAttrs = function () {
        var el = this.linkedDescriptionElement;
        if (el) {
            el.setAttribute('aria-hidden', 'true');
            addClass(el, 'highcharts-linked-description');
        }
    };
    /**
     * @private
     * @param {string} regionKey
     * The name/key of the region to update
     */
    InfoRegionsComponent.prototype.updateScreenReaderSection = function (regionKey) {
        var chart = this.chart;
        var region = this.screenReaderSections[regionKey];
        var content = region.buildContent(chart);
        var sectionDiv = region.element = (region.element || this.createElement('div'));
        var hiddenDiv = (sectionDiv.firstChild || this.createElement('div'));
        if (content) {
            this.setScreenReaderSectionAttribs(sectionDiv, regionKey);
            AST.setElementHTML(hiddenDiv, content);
            sectionDiv.appendChild(hiddenDiv);
            region.insertIntoDOM(sectionDiv, chart);
            if (chart.styledMode) {
                addClass(hiddenDiv, 'highcharts-visually-hidden');
            }
            else {
                visuallyHideElement(hiddenDiv);
            }
            unhideChartElementFromAT(chart, hiddenDiv);
            if (region.afterInserted) {
                region.afterInserted();
            }
        }
        else {
            if (sectionDiv.parentNode) {
                sectionDiv.parentNode.removeChild(sectionDiv);
            }
            delete region.element;
        }
    };
    /**
     * @private
     * @param {Highcharts.HTMLDOMElement} sectionDiv The section element
     * @param {string} regionKey Name/key of the region we are setting attrs for
     */
    InfoRegionsComponent.prototype.setScreenReaderSectionAttribs = function (sectionDiv, regionKey) {
        var labelLangKey = ('accessibility.screenReaderSection.' + regionKey + 'RegionLabel'), chart = this.chart, labelText = chart.langFormat(labelLangKey, { chart: chart, chartTitle: getChartTitle(chart) }), sectionId = 'highcharts-screen-reader-region-' + regionKey + '-' +
            chart.index;
        attr(sectionDiv, {
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
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.defaultBeforeChartFormatter = function () {
        var chart = this.chart, format = chart.options.accessibility.screenReaderSection
            .beforeChartFormat;
        if (!format) {
            return '';
        }
        var axesDesc = this.getAxesDescription(), shouldHaveSonifyBtn = (chart.sonify &&
            chart.options.sonification &&
            chart.options.sonification.enabled), sonifyButtonId = 'highcharts-a11y-sonify-data-btn-' +
            chart.index, dataTableButtonId = 'hc-linkto-highcharts-data-table-' +
            chart.index, annotationsList = getAnnotationsInfoHTML(chart), annotationsTitleStr = chart.langFormat('accessibility.screenReaderSection.annotations.heading', { chart: chart }), context = {
            headingTagName: getHeadingTagNameForElement(chart.renderTo),
            chartTitle: getChartTitle(chart),
            typeDescription: this.getTypeDescriptionText(),
            chartSubtitle: this.getSubtitleText(),
            chartLongdesc: this.getLongdescText(),
            xAxisDescription: axesDesc.xAxis,
            yAxisDescription: axesDesc.yAxis,
            playAsSoundButton: shouldHaveSonifyBtn ?
                this.getSonifyButtonText(sonifyButtonId) : '',
            viewTableButton: chart.getCSV ?
                this.getDataTableButtonText(dataTableButtonId) : '',
            annotationsTitle: annotationsList ? annotationsTitleStr : '',
            annotationsList: annotationsList
        }, formattedString = A11yI18n.i18nFormat(format, context, chart);
        this.dataTableButtonId = dataTableButtonId;
        this.sonifyButtonId = sonifyButtonId;
        return stripEmptyHTMLTags(formattedString);
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.defaultAfterChartFormatter = function () {
        var chart = this.chart;
        var format = chart.options.accessibility.screenReaderSection
            .afterChartFormat;
        if (!format) {
            return '';
        }
        var context = { endOfChartMarker: this.getEndOfChartMarkerText() };
        var formattedString = A11yI18n.i18nFormat(format, context, chart);
        return stripEmptyHTMLTags(formattedString);
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getLinkedDescription = function () {
        var el = this.linkedDescriptionElement, content = el && el.innerHTML || '';
        return stripHTMLTagsFromString(content);
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getLongdescText = function () {
        var chartOptions = this.chart.options, captionOptions = chartOptions.caption, captionText = captionOptions && captionOptions.text, linkedDescription = this.getLinkedDescription();
        return (chartOptions.accessibility.description ||
            linkedDescription ||
            captionText ||
            '');
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getTypeDescriptionText = function () {
        var chart = this.chart;
        return chart.types ?
            chart.options.accessibility.typeDescription ||
                getTypeDescription(chart, chart.types) : '';
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getDataTableButtonText = function (buttonId) {
        var chart = this.chart, buttonText = chart.langFormat('accessibility.table.viewAsDataTableButtonText', { chart: chart, chartTitle: getChartTitle(chart) });
        return '<button id="' + buttonId + '">' + buttonText + '</button>';
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getSonifyButtonText = function (buttonId) {
        var chart = this.chart;
        if (chart.options.sonification &&
            chart.options.sonification.enabled === false) {
            return '';
        }
        var buttonText = chart.langFormat('accessibility.sonification.playAsSoundButtonText', { chart: chart, chartTitle: getChartTitle(chart) });
        return '<button id="' + buttonId + '">' + buttonText + '</button>';
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getSubtitleText = function () {
        var subtitle = (this.chart.options.subtitle);
        return stripHTMLTagsFromString(subtitle && subtitle.text || '');
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getEndOfChartMarkerText = function () {
        var chart = this.chart, markerText = chart.langFormat('accessibility.screenReaderSection.endOfChartMarker', { chart: chart }), id = 'highcharts-end-of-chart-marker-' + chart.index;
        return '<div id="' + id + '">' + markerText + '</div>';
    };
    /**
     * @private
     * @param {Highcharts.Dictionary<string>} e
     */
    InfoRegionsComponent.prototype.onDataTableCreated = function (e) {
        var chart = this.chart;
        if (chart.options.accessibility.enabled) {
            if (this.viewDataTableButton) {
                this.viewDataTableButton.setAttribute('aria-expanded', 'true');
            }
            var attributes = e.tree.attributes || {};
            attributes.tabindex = -1;
            attributes.summary = getTableSummary(chart);
            e.tree.attributes = attributes;
        }
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.focusDataTable = function () {
        var tableDiv = this.dataTableDiv, table = tableDiv && tableDiv.getElementsByTagName('table')[0];
        if (table && table.focus) {
            table.focus();
        }
    };
    /**
     * @private
     * @param {string} sonifyButtonId
     */
    InfoRegionsComponent.prototype.initSonifyButton = function (sonifyButtonId) {
        var _this = this;
        var el = this.sonifyButton = getElement(sonifyButtonId);
        var chart = this.chart;
        var defaultHandler = function (e) {
            if (el) {
                el.setAttribute('aria-hidden', 'true');
                el.setAttribute('aria-label', '');
            }
            e.preventDefault();
            e.stopPropagation();
            var announceMsg = chart.langFormat('accessibility.sonification.playAsSoundClickAnnouncement', { chart: chart });
            _this.announcer.announce(announceMsg);
            setTimeout(function () {
                if (el) {
                    el.removeAttribute('aria-hidden');
                    el.removeAttribute('aria-label');
                }
                if (chart.sonify) {
                    chart.sonify();
                }
            }, 1000); // Delay to let screen reader speak the button press
        };
        if (el && chart) {
            el.setAttribute('tabindex', -1);
            el.onclick = function (e) {
                var onPlayAsSoundClick = (chart.options.accessibility &&
                    chart.options.accessibility.screenReaderSection
                        .onPlayAsSoundClick);
                (onPlayAsSoundClick || defaultHandler).call(this, e, chart);
            };
        }
    };
    /**
     * Set attribs and handlers for default viewAsDataTable button if exists.
     * @private
     * @param {string} tableButtonId
     */
    InfoRegionsComponent.prototype.initDataTableButton = function (tableButtonId) {
        var el = this.viewDataTableButton = getElement(tableButtonId), chart = this.chart, tableId = tableButtonId.replace('hc-linkto-', '');
        if (el) {
            attr(el, {
                tabindex: -1,
                'aria-expanded': !!getElement(tableId)
            });
            el.onclick = chart.options.accessibility
                .screenReaderSection.onViewDataTableClick ||
                function () {
                    chart.viewData();
                };
        }
    };
    /**
     * Return object with text description of each of the chart's axes.
     * @private
     */
    InfoRegionsComponent.prototype.getAxesDescription = function () {
        var chart = this.chart, shouldDescribeColl = function (collectionKey, defaultCondition) {
            var axes = chart[collectionKey];
            return axes.length > 1 || axes[0] &&
                pick(axes[0].options.accessibility &&
                    axes[0].options.accessibility.enabled, defaultCondition);
        }, hasNoMap = !!chart.types && chart.types.indexOf('map') < 0, hasCartesian = !!chart.hasCartesianSeries, showXAxes = shouldDescribeColl('xAxis', !chart.angular && hasCartesian && hasNoMap), showYAxes = shouldDescribeColl('yAxis', hasCartesian && hasNoMap), desc = {};
        if (showXAxes) {
            desc.xAxis = this.getAxisDescriptionText('xAxis');
        }
        if (showYAxes) {
            desc.yAxis = this.getAxisDescriptionText('yAxis');
        }
        return desc;
    };
    /**
     * @private
     */
    InfoRegionsComponent.prototype.getAxisDescriptionText = function (collectionKey) {
        var chart = this.chart;
        var axes = chart[collectionKey];
        return chart.langFormat('accessibility.axis.' + collectionKey + 'Description' + (axes.length > 1 ? 'Plural' : 'Singular'), {
            chart: chart,
            names: axes.map(function (axis) {
                return getAxisDescription(axis);
            }),
            ranges: axes.map(function (axis) {
                return getAxisRangeDescription(axis);
            }),
            numAxes: axes.length
        });
    };
    /**
     * Remove component traces
     */
    InfoRegionsComponent.prototype.destroy = function () {
        if (this.announcer) {
            this.announcer.destroy();
        }
    };
    return InfoRegionsComponent;
}(AccessibilityComponent));
/* *
 *
 *  Default Export
 *
 * */
export default InfoRegionsComponent;
