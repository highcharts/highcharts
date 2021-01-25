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

'use strict';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface LangAccessibilityAnnounceNewDataOptions {
            newDataAnnounce: string;
            newSeriesAnnounceSingle: string;
            newPointAnnounceSingle: string;
            newSeriesAnnounceMultiple: string;
            newPointAnnounceMultiple: string;
        }
        interface LangAccessibilityAxisOptions {
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
        interface LangAccessibilityChartTypesOptions {
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
        interface LangAccessibilityExportingOptions {
            chartMenuLabel: string;
            exportRegionLabel: string;
            menuButtonLabel: string;
        }
        interface LangAccessibilityLegendOptions {
            legendItem: string;
            legendLabel: string;
            legendLabelNoTitle: string;
        }
        interface LangAccessibilityOptions {
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
        interface LangAccessibilityRangeSelectorOptions {
            dropdownLabel: string;
            maxInputLabel: string;
            minInputLabel: string;
            clickButtonAnnouncement: string;
        }
        interface LangAccessibilityAnnotationOptions {
            heading: string;
            descriptionSinglePoint: string;
            descriptionMultiplePoints: string;
            descriptionNoPoints: string;
        }
        interface LangAccessibilityScreenReaderSectionOptions {
            afterRegionLabel: string;
            annotations: LangAccessibilityAnnotationOptions;
            beforeRegionLabel: string;
            endOfChartMarker: string;
        }
        interface LangAccessibilitySeriesOptions {
            description: string;
            nullPointValue: string;
            pointAnnotationsDescription: string;
            summary: LangAccessibilitySeriesSummaryOptions;
            xAxisDescription: string;
            yAxisDescription: string;
        }
        interface LangAccessibilitySeriesSummaryOptions {
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
        interface LangAccessibilitySeriesTypeDescriptionsOptions {
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
        interface LangAccessibilitySonificationOptions {
            playAsSoundButtonText: string;
            playAsSoundClickAnnouncement: string;
        }
        interface LangAccessibilityTableOptions {
            tableSummary: string;
            viewAsDataTableButtonText: string;
        }
        interface LangAccessibilityZoomOptions {
            mapZoomIn: string;
            mapZoomOut: string;
            resetZoomButton: string;
        }
        interface LangOptions {
            accessibility?: LangAccessibilityOptions;
        }
    }
}

var langOptions: Highcharts.LangOptions = {

    /**
     * Configure the accessibility strings in the chart. Requires the
     * [accessibility module](https://code.highcharts.com/modules/accessibility.js)
     * to be loaded. For a description of the module and information on its
     * features, see
     * [Highcharts Accessibility](https://www.highcharts.com/docs/chart-concepts/accessibility).
     *
     * For more dynamic control over the accessibility functionality, see
     * [accessibility.pointDescriptionFormatter](#accessibility.pointDescriptionFormatter),
     * [accessibility.seriesDescriptionFormatter](#accessibility.seriesDescriptionFormatter),
     * and
     * [accessibility.screenReaderSectionFormatter](#accessibility.screenReaderSectionFormatter).
     *
     * @since        6.0.6
     * @optionparent lang.accessibility
     */
    accessibility: {
        defaultChartTitle: 'Chart',
        chartContainerLabel: '{title}. Highcharts interactive chart.',
        svgContainerLabel: 'Interactive chart',
        drillUpButton: '{buttonText}',
        credits: 'Chart credits: {creditsStr}',

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
        thousandsSep: ',',

        /**
         * Title element text for the chart SVG element. Leave this
         * empty to disable adding the title element. Browsers will display
         * this content when hovering over elements in the chart. Assistive
         * technology may use this element to label the chart.
         *
         * @since 6.0.8
         */
        svgContainerTitle: '',

        /**
         * Set a label on the container wrapping the SVG.
         *
         * @see [chartContainerLabel](#lang.accessibility.chartContainerLabel)
         *
         * @since 8.0.0
         */
        graphicContainerLabel: '',

        /**
         * Language options for the screen reader information sections added
         * before and after the charts.
         *
         * @since 8.0.0
         */
        screenReaderSection: {
            beforeRegionLabel: 'Chart screen reader information.',
            afterRegionLabel: '',

            /**
             * Language options for annotation descriptions.
             *
             * @since 8.0.1
             */
            annotations: {
                heading: 'Chart annotations summary',
                descriptionSinglePoint: '{annotationText}. Related to {annotationPoint}',
                descriptionMultiplePoints: '{annotationText}. Related to {annotationPoint}' +
                    '{ Also related to, #each(additionalAnnotationPoints)}',
                descriptionNoPoints: '{annotationText}'
            },

            /**
             * Label for the end of the chart. Announced by screen readers.
             *
             * @since 8.0.0
             */
            endOfChartMarker: 'End of interactive chart.'
        },

        /**
         * Language options for sonification.
         *
         * @since 8.0.1
         */
        sonification: {
            playAsSoundButtonText: 'Play as sound, {chartTitle}',
            playAsSoundClickAnnouncement: 'Play'
        },

        /**
         * Language options for accessibility of the legend.
         *
         * @since 8.0.0
         */
        legend: {
            legendLabelNoTitle: 'Toggle series visibility',
            legendLabel: 'Chart legend: {legendTitle}',
            legendItem: 'Show {itemName}'
        },

        /**
         * Chart and map zoom accessibility language options.
         *
         * @since 8.0.0
         */
        zoom: {
            mapZoomIn: 'Zoom chart',
            mapZoomOut: 'Zoom out chart',
            resetZoomButton: 'Reset zoom'
        },

        /**
         * Range selector language options for accessibility.
         *
         * @since 8.0.0
         */
        rangeSelector: {
            dropdownLabel: '{rangeTitle}',
            minInputLabel: 'Select start date.',
            maxInputLabel: 'Select end date.',
            clickButtonAnnouncement: 'Viewing {axisRangeDescription}'
        },

        /**
         * Accessibility language options for the data table.
         *
         * @since 8.0.0
         */
        table: {
            viewAsDataTableButtonText: 'View as data table, {chartTitle}',
            tableSummary: 'Table representation of chart.'
        },

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
        announceNewData: {
            newDataAnnounce: 'Updated data for chart {chartTitle}',
            newSeriesAnnounceSingle: 'New data series: {seriesDesc}',
            newPointAnnounceSingle: 'New data point: {pointDesc}',
            newSeriesAnnounceMultiple:
                'New data series in chart {chartTitle}: {seriesDesc}',
            newPointAnnounceMultiple:
                'New data point in chart {chartTitle}: {pointDesc}'
        },

        /**
         * Descriptions of lesser known series types. The relevant
         * description is added to the screen reader information region
         * when these series types are used.
         *
         * @since 6.0.6
         */
        seriesTypeDescriptions: {
            boxplot: 'Box plot charts are typically used to display ' +
            'groups of statistical data. Each data point in the ' +
            'chart can have up to 5 values: minimum, lower quartile, ' +
            'median, upper quartile, and maximum.',
            arearange: 'Arearange charts are line charts displaying a ' +
            'range between a lower and higher value for each point.',
            areasplinerange: 'These charts are line charts displaying a ' +
            'range between a lower and higher value for each point.',
            bubble: 'Bubble charts are scatter charts where each data ' +
            'point also has a size value.',
            columnrange: 'Columnrange charts are column charts ' +
            'displaying a range between a lower and higher value for ' +
            'each point.',
            errorbar: 'Errorbar series are used to display the ' +
            'variability of the data.',
            funnel: 'Funnel charts are used to display reduction of data ' +
            'in stages.',
            pyramid: 'Pyramid charts consist of a single pyramid with ' +
            'item heights corresponding to each point value.',
            waterfall: 'A waterfall chart is a column chart where each ' +
            'column contributes towards a total end value.'
        },

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
        chartTypes: {
            /* eslint-disable max-len */
            emptyChart: 'Empty chart',
            mapTypeDescription: 'Map of {mapTitle} with {numSeries} data series.',
            unknownMap: 'Map of unspecified region with {numSeries} data series.',
            combinationChart: 'Combination chart with {numSeries} data series.',
            defaultSingle: 'Chart with {numPoints} data {#plural(numPoints, points, point)}.',
            defaultMultiple: 'Chart with {numSeries} data series.',
            splineSingle: 'Line chart with {numPoints} data {#plural(numPoints, points, point)}.',
            splineMultiple: 'Line chart with {numSeries} lines.',
            lineSingle: 'Line chart with {numPoints} data {#plural(numPoints, points, point)}.',
            lineMultiple: 'Line chart with {numSeries} lines.',
            columnSingle: 'Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.',
            columnMultiple: 'Bar chart with {numSeries} data series.',
            barSingle: 'Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.',
            barMultiple: 'Bar chart with {numSeries} data series.',
            pieSingle: 'Pie chart with {numPoints} {#plural(numPoints, slices, slice)}.',
            pieMultiple: 'Pie chart with {numSeries} pies.',
            scatterSingle: 'Scatter chart with {numPoints} {#plural(numPoints, points, point)}.',
            scatterMultiple: 'Scatter chart with {numSeries} data series.',
            boxplotSingle: 'Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.',
            boxplotMultiple: 'Boxplot with {numSeries} data series.',
            bubbleSingle: 'Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
            bubbleMultiple: 'Bubble chart with {numSeries} data series.'
        }, /* eslint-enable max-len */

        /**
         * Axis description format strings.
         *
         * @since 6.0.6
         */
        axis: {
        /* eslint-disable max-len */
            xAxisDescriptionSingular: 'The chart has 1 X axis displaying {names[0]}. {ranges[0]}',
            xAxisDescriptionPlural: 'The chart has {numAxes} X axes displaying {#each(names, -1), }and {names[-1]}.',
            yAxisDescriptionSingular: 'The chart has 1 Y axis displaying {names[0]}. {ranges[0]}',
            yAxisDescriptionPlural: 'The chart has {numAxes} Y axes displaying {#each(names, -1), }and {names[-1]}.',
            timeRangeDays: 'Range: {range} days.',
            timeRangeHours: 'Range: {range} hours.',
            timeRangeMinutes: 'Range: {range} minutes.',
            timeRangeSeconds: 'Range: {range} seconds.',
            rangeFromTo: 'Range: {rangeFrom} to {rangeTo}.',
            rangeCategories: 'Range: {numCategories} categories.'
        }, /* eslint-enable max-len */

        /**
         * Exporting menu format strings for accessibility module.
         *
         * @since 6.0.6
         */
        exporting: {
            chartMenuLabel: 'Chart menu',
            menuButtonLabel: 'View chart menu',
            exportRegionLabel: 'Chart menu'
        },

        /**
         * Lang configuration for different series types. For more dynamic
         * control over the series element descriptions, see
         * [accessibility.seriesDescriptionFormatter](#accessibility.seriesDescriptionFormatter).
         *
         * @since 6.0.6
         */
        series: {
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
             * @since 6.0.6
             */
            summary: {
                /* eslint-disable max-len */
                'default': '{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                defaultCombination: '{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                line: '{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                lineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.',
                spline: '{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                splineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.',
                column: '{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.',
                columnCombination: '{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.',
                bar: '{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.',
                barCombination: '{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.',
                pie: '{name}, pie {ix} of {numSeries} with {numPoints} {#plural(numPoints, slices, slice)}.',
                pieCombination: '{name}, series {ix} of {numSeries}. Pie with {numPoints} {#plural(numPoints, slices, slice)}.',
                scatter: '{name}, scatter plot {ix} of {numSeries} with {numPoints} {#plural(numPoints, points, point)}.',
                scatterCombination: '{name}, series {ix} of {numSeries}, scatter plot with {numPoints} {#plural(numPoints, points, point)}.',
                boxplot: '{name}, boxplot {ix} of {numSeries} with {numPoints} {#plural(numPoints, boxes, box)}.',
                boxplotCombination: '{name}, series {ix} of {numSeries}. Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.',
                bubble: '{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
                bubbleCombination: '{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
                map: '{name}, map {ix} of {numSeries} with {numPoints} {#plural(numPoints, areas, area)}.',
                mapCombination: '{name}, series {ix} of {numSeries}. Map with {numPoints} {#plural(numPoints, areas, area)}.',
                mapline: '{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                maplineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.',
                mapbubble: '{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
                mapbubbleCombination: '{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.'
            }, /* eslint-enable max-len */

            /**
             * User supplied description text. This is added in the point
             * comment description by default if present.
             *
             * @since 6.0.6
             */
            description: '{description}',

            /**
             * xAxis description for series if there are multiple xAxes in
             * the chart.
             *
             * @since 6.0.6
             */
            xAxisDescription: 'X axis, {name}',

            /**
             * yAxis description for series if there are multiple yAxes in
             * the chart.
             *
             * @since 6.0.6
             */
            yAxisDescription: 'Y axis, {name}',

            /**
             * Description for the value of null points.
             *
             * @since 8.0.0
             */
            nullPointValue: 'No value',

            /**
             * Description for annotations on a point, as it is made available
             * to assistive technology.
             *
             * @since 8.0.1
             */
            pointAnnotationsDescription: '{Annotation: #each(annotations). }'
        }
    }
};

export default langOptions;
