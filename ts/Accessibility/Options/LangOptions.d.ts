/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Default lang/i18n options for accessibility.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { LangOptions } from '../../Core/Options';

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
    legendItem: string;
    legendLabel: string;
    legendLabelNoTitle: string;
}

export interface LangAccessibilityOptions {
    announceNewData: LangAccessibilityAnnounceNewDataOptions;
    axis: LangAccessibilityAxisOptions;
    chartContainerLabel: string;
    chartTypes: LangAccessibilityChartTypesOptions;
    credits: string;
    defaultChartTitle: string;
    drillUpButton: string;
    exporting: LangAccessibilityExportingOptions;
    graphicContainerLabel: string;
    legend: LangAccessibilityLegendOptions;
    rangeSelector: LangAccessibilityRangeSelectorOptions;
    screenReaderSection: LangAccessibilityScreenReaderSectionOptions;
    series: LangAccessibilitySeriesOptions;
    seriesTypeDescriptions: (
        LangAccessibilitySeriesTypeDescriptionsOptions
    );
    sonification: LangAccessibilitySonificationOptions;
    svgContainerLabel: string;
    svgContainerTitle: string;
    table: LangAccessibilityTableOptions;
    thousandsSep: string;
    zoom: LangAccessibilityZoomOptions;
}

export interface LangAccessibilityRangeSelectorOptions {
    dropdownLabel: string;
    maxInputLabel: string;
    minInputLabel: string;
    clickButtonAnnouncement: string;
}

export interface LangAccessibilityAnnotationOptions {
    heading: string;
    descriptionSinglePoint: string;
    descriptionMultiplePoints: string;
    descriptionNoPoints: string;
}

export interface LangAccessibilityScreenReaderSectionOptions {
    afterRegionLabel: string;
    annotations: LangAccessibilityAnnotationOptions;
    beforeRegionLabel: string;
    endOfChartMarker: string;
}

export interface LangAccessibilitySeriesOptions {
    description: string;
    nullPointValue: string;
    pointAnnotationsDescription: string;
    summary: LangAccessibilitySeriesSummaryOptions;
    xAxisDescription: string;
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
        accessibility?: LangAccessibilityOptions;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default LangOptions;
