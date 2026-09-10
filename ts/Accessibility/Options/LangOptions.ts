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

    /**
     * @default 'Updated data for chart {chartTitle}'
     */
    newDataAnnounce: string;

    /**
     * @default 'New data series: {seriesDesc}'
     */
    newSeriesAnnounceSingle: string;

    /**
     * @default 'New data point: {pointDesc}'
     */
    newPointAnnounceSingle: string;

    /**
     * @default 'New data series in chart {chartTitle}: {seriesDesc}'
     */
    newSeriesAnnounceMultiple: string;

    /**
     * @default 'New data point in chart {chartTitle}: {pointDesc}'
     */
    newPointAnnounceMultiple: string;
}

export interface LangAccessibilityAxisOptions {

    /**
     * @default 'Data range: {numCategories} categories.'
     */
    rangeCategories: string;

    /**
     * @default 'Data ranges from {rangeFrom} to {rangeTo}.'
     */
    rangeFromTo: string;

    /**
     * @default 'Data range: {range} days.'
     */
    timeRangeDays: string;

    /**
     * @default 'Data range: {range} hours.'
     */
    timeRangeHours: string;

    /**
     * @default 'Data range: {range} minutes.'
     */
    timeRangeMinutes: string;

    /**
     * @default 'Data range: {range} seconds.'
     */
    timeRangeSeconds: string;

    /**
     * @default `The chart has {numAxes} X axes displaying {#each names}{#unless @first},{/unless}{#if @last} and{/if} {this}{/each}.`
     */
    xAxisDescriptionPlural: string;

    /**
     * @default 'The chart has 1 X axis displaying {names[0]}. {ranges[0]}'
     */
    xAxisDescriptionSingular: string;

    /**
     * @default `The chart has {numAxes} Y axes displaying {#each names}{#unless @first},{/unless}{#if @last} and{/if} {this}{/each}.`
     */
    yAxisDescriptionPlural: string;

    /**
     * @default 'The chart has 1 Y axis displaying {names[0]}. {ranges[0]}'
     */
    yAxisDescriptionSingular: string;

    defaultAxisNames?: {

        /**
         * @default 'categories'
         */
        categories: string;

        /**
         * @default 'Time'
         */
        time: string;

        /**
         * @default 'values'
         */
        values: string;
    };
}

export interface LangAccessibilityChartTypesOptions {

    /**
     * @default 'Bar chart with {numSeries} data series.'
     */
    barMultiple: string;

    /**
     * @default 'Bar chart with {numPoints} {#eq numPoints 1}bar{else}bars{/eq}.'
     */
    barSingle: string;

    /**
     * @default 'Boxplot with {numSeries} data series.'
     */
    boxplotMultiple: string;

    /**
     * @default 'Boxplot with {numPoints} {#eq numPoints 1}box{else}boxes{/eq}.'
     */
    boxplotSingle: string;

    /**
     * @default 'Bubble chart with {numPoints} {#eq numPoints 1}bubbles{else}bubble{/eq}.'
     */
    bubbleSingle: string;

    /**
     * @default 'Bubble chart with {numSeries} data series.'
     */
    bubbleMultiple: string;

    /**
     * @default 'Bar chart with {numSeries} data series.'
     */
    columnMultiple: string;

    /**
     * @default 'Bar chart with {numPoints} {#eq numPoints 1}bar{else}bars{/eq}.'
     */
    columnSingle: string;

    /**
     * @default 'Combination chart with {numSeries} data series.'
     */
    combinationChart: string;

    /**
     * @default 'Chart with {numSeries} data series.'
     */
    defaultMultiple: string;

    /**
     * @default 'Chart with {numPoints} data {#eq numPoints 1}point{else}points{/eq}.'
     */
    defaultSingle: string;

    /**
     * @default 'Empty chart'
     */
    emptyChart: string;

    /**
     * @default 'Line chart with {numSeries} lines.'
     */
    lineMultiple: string;

    /**
     * @default 'Line chart with {numPoints} data {#eq numPoints 1}point{else}points{/eq}.'
     */
    lineSingle: string;

    /**
     * @default 'Map of {mapTitle} with {numSeries} data series.'
     */
    mapTypeDescription: string;

    /**
     * @default 'Pie chart with {numSeries} pies.'
     */
    pieMultiple: string;

    /**
     * @default 'Pie chart with {numPoints} {#eq numPoints 1}slice{else}slices{/eq}.'
     */
    pieSingle: string;

    /**
     * @default 'Scatter chart with {numSeries} data series.'
     */
    scatterMultiple: string;

    /**
     * @default 'Scatter chart with {numPoints} {#eq numPoints 1}point{else}points{/eq}.'
     */
    scatterSingle: string;

    /**
     * @default 'Line chart with {numSeries} lines.'
     */
    splineMultiple: string;

    /**
     * @default 'Line chart with {numPoints} data {#eq numPoints 1}point{else}points{/eq}.'
     */
    splineSingle: string;

    /**
     * @default 'Map of unspecified region with {numSeries} data series.'
     */
    unknownMap: string;
}

export interface LangAccessibilityExportingOptions {

    /**
     * @default 'Chart menu'
     */
    chartMenuLabel: string;

    exportRegionLabel: string;

    /**
     * @default 'View chart context menu, {chartTitle}'
     */
    menuButtonLabel: string;
}

export interface LangAccessibilityLegendOptions {

    /**
     * Accessible label for individual legend items. `{itemName}` refers
     * to the visual text in the legend for that item.
     *
     * @default 'Show {itemName}'
     */
    legendItem: string;

    /**
     * Accessible label for the legend, for charts where there is a
     * legend title defined. `{legendTitle}` refers to the visual text
     * in the legend title.
     *
     * @default 'Chart legend: {legendTitle}'
     */
    legendLabel: string;

    /**
     * Accessible label for the legend, for charts where there is no
     * legend title defined.
     *
     * @default 'Toggle series visibility, {chartTitle}'
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
     *
     * @default '{title}. Highcharts interactive chart.'
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
     *
     * @default 'Chart credits: {creditsStr}'
     */
    credits: string;

    /**
     * Default title of the chart for assistive technology, for charts
     * without a chart title.
     *
     * @default 'Chart'
     */
    defaultChartTitle: string;

    /**
     * Accessible label for the drill-up button.
     * `{buttonText}` refers to the visual text on the button.
     *
     * @default '{buttonText}'
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
     * @default ''
     * @since   8.0.0
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
     *
     * @default 'Interactive chart'
     */
    svgContainerLabel: string;

    /**
     * Title element text for the chart SVG element. Leave this
     * empty to disable adding the title element. Browsers will display
     * this content when hovering over elements in the chart. Assistive
     * technology may use this element to label the chart.
     *
     * @default ''
     * @since   6.0.8
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
     * @default ','
     * @since   7.1.0
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

    /**
     * @default '{rangeTitle}'
     */
    dropdownLabel: string;

    /**
     * @default 'Select end date.'
     */
    maxInputLabel: string;

    /**
     * @default 'Select start date.'
     */
    minInputLabel: string;

    /**
     * @default 'Viewing {axisRangeDescription}'
     */
    clickButtonAnnouncement: string;
}

export interface LangAccessibilityNavigatorOptions {

    /**
     * Label for the navigator handles.
     *
     * Receives `handleIx` and `chart` as context.
     * `handleIx` refers to the index of the navigator handle.
     *
     * @default '{#eq handleIx 0}Start, percent{else}End, percent{/eq}'
     */
    handleLabel: string;

    /**
     * Label for the navigator region.
     *
     * Receives `chart` as context.
     *
     * @default 'Axis zoom'
     */
    groupLabel: string;

    /**
     * Announcement for assistive technology when navigator values
     * are changed.
     *
     * Receives `axisRangeDescription` and `chart` as context.
     * `axisRangeDescription` corresponds to the range description
     * defined in [lang.accessibility.axis](#lang.accessibility.axis)
     *
     * @default '{axisRangeDescription}'
     */
    changeAnnouncement: string;
}

export interface LangAccessibilityAnnotationOptions {

    /**
     * @default 'Chart annotations summary'
     */
    heading: string;

    /**
     * @default '{annotationText}. Related to {annotationPoint}'
     */
    descriptionSinglePoint: string;

    /**
     * @default '{annotationText}. Related to {annotationPoint}{#each additionalAnnotationPoints}, also related to {this}{/each}'
     */
    descriptionMultiplePoints: string;

    /**
     * @default '{annotationText}'
     */
    descriptionNoPoints: string;
}

export interface LangAccessibilityScreenReaderSectionOptions {

    /**
     * @default ''
     */
    afterRegionLabel: string;

    /**
     * Language options for annotation descriptions.
     *
     * @since 8.0.1
     */
    annotations: LangAccessibilityAnnotationOptions;

    /**
     * @default ''
     */
    beforeRegionLabel: string;

    /**
     * Label for the end of the chart. Announced by screen readers.
     *
     * @default 'End of interactive chart.'
     * @since   8.0.0
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
     * @default '{description}'
     * @since   6.0.6
     */
    description: string;

    /**
     * Description for the value of null points.
     *
     * @default 'No value'
     * @since   8.0.0
     */
    nullPointValue: string;

    /**
     * Description for annotations on a point, as it is made available
     * to assistive technology.
     *
     * @default '{#each annotations}Annotation: {this}{/each}'
     * @since   8.0.1
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
     * @default 'X axis, {name}'
     * @since   6.0.6
     */
    xAxisDescription: string;

    /**
     * Y-axis description for series if there are multiple yAxes in
     * the chart.
     *
     * @default 'Y axis, {name}'
     * @since   6.0.6
     */
    yAxisDescription: string;
}

export interface LangAccessibilitySeriesSummaryOptions {

    /**
     * @default '{series.name}, bar series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.'
     */
    bar: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Bar series with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.'
     */
    barCombination: string;

    /**
     * @default '{series.name}, boxplot {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}box{else}boxes{/eq}.'
     */
    boxplot: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Boxplot with {series.points.length} {#eq series.points.length 1}box{else}boxes{/eq}.'
     */
    boxplotCombination: string;

    /**
     * @default '{series.name}, bubble series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.'
     */
    bubble: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Bubble series with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.'
     */
    bubbleCombination: string;

    /**
     * @default '{series.name}, bar series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.'
     */
    column: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Bar series with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.'
     */
    columnCombination: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    'default': string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    defaultCombination: string;

    /**
     * @default '{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    line: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    lineCombination: string;

    /**
     * @default '{series.name}, map {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}area{else}areas{/eq}.'
     */
    map: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Map with {series.points.length} {#eq series.points.length 1}area{else}areas{/eq}.'
     */
    mapCombination: string;

    /**
     * @default '{series.name}, bubble series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.'
     */
    mapbubble: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Bubble series with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.'
     */
    mapbubbleCombination: string;

    /**
     * @default '{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    mapline: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    maplineCombination: string;

    /**
     * @default '{series.name}, pie {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}slice{else}slices{/eq}.'
     */
    pie: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Pie with {series.points.length} {#eq series.points.length 1}slice{else}slices{/eq}.'
     */
    pieCombination: string;

    /**
     * @default '{series.name}, scatter plot {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}point{else}points{/eq}.'
     */
    scatter: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}, scatter plot with {series.points.length} {#eq series.points.length 1}point{else}points{/eq}.'
     */
    scatterCombination: string;

    /**
     * @default '{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    spline: string;

    /**
     * @default '{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.'
     */
    splineCombination: string;
}

export interface LangAccessibilitySeriesTypeDescriptionsOptions {

    /**
     * @default 'Arearange charts are line charts displaying a range between a lower and higher value for each point.'
     */
    arearange: string;

    /**
     * @default 'These charts are line charts displaying a range between a lower and higher value for each point.'
     */
    areasplinerange: string;

    /**
     * @default 'Box plot charts are typically used to display groups of statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.'
     */
    boxplot: string;

    /**
     * @default 'Bubble charts are scatter charts where each data point also has a size value.'
     */
    bubble: string;

    /**
     * @default 'Columnrange charts are column charts displaying a range between a lower and higher value for each point.'
     */
    columnrange: string;

    /**
     * @default 'Errorbar series are used to display the variability of the data.'
     */
    errorbar: string;

    /**
     * @default 'Funnel charts are used to display reduction of data in stages.'
     */
    funnel: string;

    /**
     * @default 'Pyramid charts consist of a single pyramid with item heights corresponding to each point value.'
     */
    pyramid: string;

    /**
     * @default 'A waterfall chart is a column chart where each column contributes towards a total end value.'
     */
    waterfall: string;
}

export interface LangAccessibilitySonificationOptions {

    /**
     * @default 'Play as sound, {chartTitle}'
     */
    playAsSoundButtonText: string;

    /**
     * @default 'Play'
     */
    playAsSoundClickAnnouncement: string;
}

export interface LangAccessibilityTableOptions {

    /**
     * @default 'Table representation of chart.'
     */
    tableSummary: string;

    /**
     * @default 'View as data table, {chartTitle}'
     */
    viewAsDataTableButtonText: string;
}

export interface LangAccessibilityZoomOptions {

    /**
     * @default 'Zoom chart'
     */
    mapZoomIn: string;

    /**
     * @default 'Zoom out chart'
     */
    mapZoomOut: string;

    /**
     * @default 'Reset zoom'
     */
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
