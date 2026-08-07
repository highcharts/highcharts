/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Default lang/i18n options for accessibility.
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { LangOptions } from '../../Core/Options';
import type { LangStockToolsOptions } from '../../Stock/StockTools/StockToolsOptions';

/* *
 *
 * Declarations
 *
 * */

export interface LangAccessibilityAnnounceNewDataOptions {
    newDataAnnounce: string;
    newSeriesAnnounceSingle: string;
    newPointAnnounceSingle: string;
    newSeriesAnnounceMultiple: string;
    newPointAnnounceMultiple: string;
}

export interface LangAccessibilityAxisOptions {
    rangeCategories: string;
    rangeFromTo: string;
    timeRangeDays: string;
    timeRangeHours: string;
    timeRangeMinutes: string;
    timeRangeSeconds: string;
    xAxisDescriptionPlural: string;
    xAxisDescriptionSingular: string;
    yAxisDescriptionPlural: string;
    yAxisDescriptionSingular: string;
    defaultAxisNames?: {
        categories: string;
        time: string;
        values: string;
    };
}

export interface LangAccessibilityChartTypesOptions {
    barMultiple: string;
    barSingle: string;
    boxplotMultiple: string;
    boxplotSingle: string;
    bubbleSingle: string;
    bubbleMultiple: string;
    columnMultiple: string;
    columnSingle: string;
    combinationChart: string;
    defaultMultiple: string;
    defaultSingle: string;
    emptyChart: string;
    lineMultiple: string;
    lineSingle: string;
    mapTypeDescription: string;
    pieMultiple: string;
    pieSingle: string;
    scatterMultiple: string;
    scatterSingle: string;
    splineMultiple: string;
    splineSingle: string;
    unknownMap: string;
}

export interface LangAccessibilityExportingOptions {
    chartMenuLabel: string;
    exportRegionLabel: string;
    menuButtonLabel: string;
}

export interface LangAccessibilityLegendOptions {

    /**
     * Accessible label for individual legend items. `{itemName}` refers
     * to the visual text in the legend for that item.
     */
    legendItem: string;

    /**
     * Accessible label for the legend, for charts where there is a
     * legend title defined. `{legendTitle}` refers to the visual text
     * in the legend title.
     */
    legendLabel: string;

    /**
     * Accessible label for the legend, for charts where there is no
     * legend title defined.
     */
    legendLabelNoTitle: string;
}

export interface LangAccessibilityOptions {

    /**
     * Default announcement for new data in charts. If addPoint or
     * addSeries is used, and only one series/point is added, the
     * `newPointAnnounce` and `newSeriesAnnounce` strings are used.
     * The `...Single` versions will be used if there is only one chart
     * on the page, and the `...Multiple` versions will be used if there
     * are multiple charts on the page. For all other new data events,
     * the `newDataAnnounce` string will be used.
     *
     * @since 7.1.0
     */
    announceNewData: LangAccessibilityAnnounceNewDataOptions;

    /**
     * Axis description format strings.
     *
     * @since 6.0.6
     */
    axis: LangAccessibilityAxisOptions;

    /**
     * Accessible label for the chart container HTML element.
     * `{title}` refers to the chart title.
     */
    chartContainerLabel: string;

    /**
     * Chart type description strings. This is added to the chart
     * information region.
     *
     * If there is only a single series type used in the chart, we use
     * the format string for the series type, or default if missing.
     * There is one format string for cases where there is only a single
     * series in the chart, and one for multiple series of the same
     * type.
     *
     * @since 6.0.6
     */
    chartTypes: LangAccessibilityChartTypesOptions;

    /**
     * Accessible label for the chart credits.
     * `{creditsStr}` refers to the visual text in the credits.
     */
    credits: string;

    /**
     * Default title of the chart for assistive technology, for charts
     * without a chart title.
     */
    defaultChartTitle: string;

    /**
     * Accessible label for the drill-up button.
     * `{buttonText}` refers to the visual text on the button.
     */
    drillUpButton: string;

    /**
     * Exporting menu format strings for accessibility module.
     *
     * @since 6.0.6
     */
    exporting: LangAccessibilityExportingOptions;

    /**
     * Set a label on the container wrapping the SVG.
     *
     * @see [chartContainerLabel](#lang.accessibility.chartContainerLabel)
     *
     * @since 8.0.0
     */
    graphicContainerLabel: string;

    /**
     * Language options for accessibility of the legend.
     *
     * @since 8.0.0
     */
    legend: LangAccessibilityLegendOptions;

    /**
     * Navigator language options for accessibility.
     *
     * @since 11.2.0
     */
    navigator: LangAccessibilityNavigatorOptions;

    /**
     * Range selector language options for accessibility.
     *
     * @since 8.0.0
     */
    rangeSelector: LangAccessibilityRangeSelectorOptions;

    /**
     * Language options for the screen reader information sections added
     * before and after the charts.
     *
     * @since 8.0.0
     */
    screenReaderSection: LangAccessibilityScreenReaderSectionOptions;

    /**
     * Lang configuration for different series types. For more dynamic
     * control over the series element descriptions, see
     * [accessibility.seriesDescriptionFormatter](#accessibility.seriesDescriptionFormatter).
     *
     * @since 6.0.6
     */
    series: LangAccessibilitySeriesOptions;

    /**
     * Descriptions of lesser known series types. The relevant
     * description is added to the screen reader information region
     * when these series types are used.
     *
     * @since 6.0.6
     */
    seriesTypeDescriptions: (
        LangAccessibilitySeriesTypeDescriptionsOptions
    );

    /**
     * Language options for sonification.
     *
     * @since 8.0.1
     */
    sonification: LangAccessibilitySonificationOptions;

    /**
     * Stock tools language options for accessibility.
     *
     * @since 12.6.0
     */
    stockTools: LangStockToolsOptions;

    /**
     * Accessible label for the chart SVG element.
     * `{chartTitle}` refers to the chart title.
     */
    svgContainerLabel: string;

    /**
     * Title element text for the chart SVG element. Leave this
     * empty to disable adding the title element. Browsers will display
     * this content when hovering over elements in the chart. Assistive
     * technology may use this element to label the chart.
     *
     * @since 6.0.8
     */
    svgContainerTitle: string;

    /**
     * Accessibility language options for the data table.
     *
     * @since 8.0.0
     */
    table: LangAccessibilityTableOptions;

    /**
     * Thousands separator to use when formatting numbers for screen
     * readers. Note that many screen readers will not handle space as a
     * thousands separator, and will consider "11 700" as two numbers.
     *
     * Set to `null` to use the separator defined in
     * [lang.thousandsSep](lang.thousandsSep).
     *
     * @since 7.1.0
     */
    thousandsSep: string;

    /**
     * Chart and map zoom accessibility language options.
     *
     * @since 8.0.0
     */
    zoom: LangAccessibilityZoomOptions;
}

export interface LangAccessibilityRangeSelectorOptions {
    dropdownLabel: string;
    maxInputLabel: string;
    minInputLabel: string;
    clickButtonAnnouncement: string;
}

export interface LangAccessibilityNavigatorOptions {

    /**
     * Label for the navigator handles.
     *
     * Receives `handleIx` and `chart` as context.
     * `handleIx` refers to the index of the navigator handle.
     */
    handleLabel: string;

    /**
     * Label for the navigator region.
     *
     * Receives `chart` as context.
     */
    groupLabel: string;

    /**
     * Announcement for assistive technology when navigator values
     * are changed.
     *
     * Receives `axisRangeDescription` and `chart` as context.
     * `axisRangeDescription` corresponds to the range description
     * defined in [lang.accessibility.axis](#lang.accessibility.axis)
     */
    changeAnnouncement: string;
}

export interface LangAccessibilityAnnotationOptions {
    heading: string;
    descriptionSinglePoint: string;
    descriptionMultiplePoints: string;
    descriptionNoPoints: string;
}

export interface LangAccessibilityScreenReaderSectionOptions {
    afterRegionLabel: string;

    /**
     * Language options for annotation descriptions.
     *
     * @since 8.0.1
     */
    annotations: LangAccessibilityAnnotationOptions;

    beforeRegionLabel: string;

    /**
     * Label for the end of the chart. Announced by screen readers.
     *
     * @since 8.0.0
     */
    endOfChartMarker: string;
}

export interface LangAccessibilitySeriesOptions {

    /**
     * User supplied description text. This is added in the point
     * comment description by default if present.
     *
     * `{description}` refers to the value given in
     * [point.accessibility.description](#series.line.data.accessibility.description).
     *
     * @since 6.0.6
     */
    description: string;

    /**
     * Description for the value of null points.
     *
     * @since 8.0.0
     */
    nullPointValue: string;

    /**
     * Description for annotations on a point, as it is made available
     * to assistive technology.
     *
     * @since 8.0.1
     */
    pointAnnotationsDescription: string;

    /**
     * Lang configuration for the series main summary. Each series
     * type has two modes:
     *
     * 1. This series type is the only series type used in the
     *    chart
     *
     * 2. This is a combination chart with multiple series types
     *
     * If a definition does not exist for the specific series type
     * and mode, the 'default' lang definitions are used.
     *
     * Chart and its subproperties can be accessed with the `{chart}`
     * variable. The series and its subproperties can be accessed with the
     * `{series}` variable.
     *
     * The series index (starting from 1) can be accessed with the
     * `{seriesNumber}` variable.
     *
     * @since 6.0.6
     */
    summary: LangAccessibilitySeriesSummaryOptions;

    /**
     * X-axis description for series if there are multiple xAxes in
     * the chart.
     *
     * @since 6.0.6
     */
    xAxisDescription: string;

    /**
     * Y-axis description for series if there are multiple yAxes in
     * the chart.
     *
     * @since 6.0.6
     */
    yAxisDescription: string;
}

export interface LangAccessibilitySeriesSummaryOptions {
    bar: string;
    barCombination: string;
    boxplot: string;
    boxplotCombination: string;
    bubble: string;
    bubbleCombination: string;
    column: string;
    columnCombination: string;
    'default': string;
    defaultCombination: string;
    line: string;
    lineCombination: string;
    map: string;
    mapCombination: string;
    mapbubble: string;
    mapbubbleCombination: string;
    mapline: string;
    maplineCombination: string;
    pie: string;
    pieCombination: string;
    scatter: string;
    scatterCombination: string;
    spline: string;
    splineCombination: string;
}

export interface LangAccessibilitySeriesTypeDescriptionsOptions {
    arearange: string;
    areasplinerange: string;
    boxplot: string;
    bubble: string;
    columnrange: string;
    errorbar: string;
    funnel: string;
    pyramid: string;
    waterfall: string;
}

export interface LangAccessibilitySonificationOptions {
    playAsSoundButtonText: string;
    playAsSoundClickAnnouncement: string;
}

export interface LangAccessibilityTableOptions {
    tableSummary: string;
    viewAsDataTableButtonText: string;
}

export interface LangAccessibilityZoomOptions {
    mapZoomIn: string;
    mapZoomOut: string;
    resetZoomButton: string;
}

declare module '../../Core/Options'{
    interface LangOptions {

        /**
         * Configure the accessibility strings in the chart. Requires the
         * [accessibility module](https://code.highcharts.com/modules/accessibility.js)
         * to be loaded. For a description of the module and information on its
         * features, see
         * [Highcharts Accessibility](https://www.highcharts.com/docs/chart-concepts/accessibility).
         *
         * The lang options use [Format Strings](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#format-strings)
         * with variables that are replaced at run time. These variables should
         * be used when available, to avoid duplicating text that is defined
         * elsewhere.
         *
         * For more dynamic control over the accessibility functionality, see
         * [accessibility.point.descriptionFormatter](#accessibility.point.descriptionFormatter),
         * [accessibility.series.descriptionFormatter](#accessibility.series.descriptionFormatter),
         * and
         * [accessibility.screenReaderSection.beforeChartFormatter](#accessibility.screenReaderSection.beforeChartFormatter).
         *
         * @since 6.0.6
         */
        accessibility?: LangAccessibilityOptions;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default LangOptions;
