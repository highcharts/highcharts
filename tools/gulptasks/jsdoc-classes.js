/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_GLOBS = [
    'readme.md'
].concat([
    'Accessibility/*.js',
    'Core/Animation/*.js',
    'Core/Axis/Axis.js',
    'Core/Axis/Color/ColorAxis.js',
    'Core/Axis/PlotLineOrBand/PlotLineOrBandAxis.js',
    'Core/Axis/Tick.js',
    'Core/Axis/TreeGrid/TreeGridAxis.js',
    'Core/Axis/TreeGrid/TreeGridTick.js',
    'Core/Chart/Chart.js',
    'Core/Chart/GanttChart.js',
    'Core/Chart/MapChart.js',
    'Core/Chart/StockChart.js',
    'Core/Color/Color.js',
    'Core/Defaults.js',
    'Core/HttpUtilities.js',
    'Core/Legend/Legend.js',
    'Core/Renderer/HTML/AST.js',
    'Core/Renderer/SVG/SVGElement.js',
    'Core/Renderer/SVG/SVGRenderer.js',
    'Core/Series/DataLabel.js',
    'Core/Series/Point.js',
    'Core/Series/Series.js',
    'Core/Globals.js',
    'Core/Pointer.js',
    'Core/Time.js',
    'Core/Tooltip.js',
    'Core/Utilities.js',
    'Data/DataTableCore.js',
    'Extensions/Annotations/Controllables/Controllable.js',
    'Extensions/Annotations/Annotation.js',
    'Extensions/Annotations/AnnotationChart.js',
    'Extensions/Annotations/ControlPoint.js',
    'Extensions/Annotations/NavigationBindings.js',
    'Extensions/Sonification/*.js',
    'Extensions/BorderRadius.js',
    'Extensions/Breadcrumbs/Breadcrumbs.js',
    'Extensions/Data.js',
    'Extensions/DataGrouping/DataGrouping.js',
    'Extensions/DataGrouping/DataGroupingSeriesComposition.js',
    'Extensions/DraggablePoints/DraggablePoints.js',
    'Extensions/Drilldown/Drilldown.js',
    'Extensions/ExportData/ExportData.js',
    'Extensions/Exporting/Exporting.js',
    'Extensions/Exporting/Fullscreen.js',
    'Extensions/MarkerClusters/MarkerClusters.js',
    'Extensions/OfflineExporting/OfflineExporting.js',
    'Extensions/PatternFill.js',
    'Extensions/SeriesLabel/SeriesLabel.js',
    'Maps/GeoJSONComposition.js',
    'Maps/MapNavigation.js',
    'Maps/MapView.js',
    'Series/AreaRange/AreaRangePoint.js',
    'Series/AreaRange/AreaRangeSeries.js',
    'Series/Column/ColumnSeries.js',
    'Series/Networkgraph/NetworkgraphSeries.js',
    'Series/Organization/OrganizationSeries.js',
    'Series/PackedBubble/PackedBubbleSeries.js',
    'Series/Pie/PieSeries.js',
    'Series/Sankey/SankeySeries.js',
    'Series/Timeline/TimelineSeries.js',
    'Series/GeoHeatmap/GeoHeatmapSeries.js',
    'Stock/Navigator/StandaloneNavigator.js'
].map(path => `code/es-modules/${path}`));

const TARGET_DIRECTORY = Path.join('build', 'api', 'class-reference');

const TEMPLATE_DIRECTORY = Path.join(
    'node_modules', '@highcharts', 'highcharts-documentation-generators',
    'docstrap'
);

/* *
 *
 *  Tasks
 *
 * */

/**
 * Automated generation for internal Class reference.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocClasses() {

    const gulpJSDoc = require('gulp-jsdoc3');
    const LogLib = require('../libs/log');

    return new Promise((resolve, reject) => {

        const jsDocConfig = {
            navOptions: {
                theme: 'highsoft'
            },
            opts: {
                destination: TARGET_DIRECTORY,
                private: false,
                template: Path.join(TEMPLATE_DIRECTORY, 'template')
            },
            plugins: [
                ['plugins', 'add-namespace'],
                ['plugins', 'markdown'],
                ['plugins', 'sampletag']
            ].map(
                filePath => Path.join(TEMPLATE_DIRECTORY, ...filePath)
            ),
            templates: {
                logoFile: Path.join('img', 'highcharts-logo.svg'),
                systemName: 'Highcharts',
                theme: 'highsoft'
            }
        };

        LogLib.message('Generating', TARGET_DIRECTORY + '...');

        Gulp
            .src(SOURCE_GLOBS, { read: false })
            .pipe(gulpJSDoc(jsDocConfig, function (error) {
                if (error) {
                    reject(error);
                } else {
                    LogLib.success('Created', TARGET_DIRECTORY);
                    resolve();
                }
            }));
    });
}

Gulp.task('jsdoc-classes', jsDocClasses);
