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
    'readme.md',
    'js/Core/Utilities.js',
    'js/Core/Axis/Axis.js',
    'js/Core/Chart/Chart.js',
    'js/Core/Color.js',
    'js/Series/ColumnSeries.js',
    'js/Extensions/DataGrouping.js',
    'js/Core/Series/DataLabels.js',
    'js/Core/Dynamics.js',
    'js/Core/Globals.js',
    'js/Core/Interaction.js',
    'js/Core/Legend.js',
    'js/Core/Options.js',
    'js/Series/PieSeries.js',
    'js/Core/Series/Point.js',
    'js/Core/Pointer.js',
    'js/Core/Axis/PlotLineOrBand.js',
    'js/Core/Series/Series.js',
    'js/Core/Chart/StockChart.js',
    'js/Core/Renderer/SVG/SVGElement.js',
    'js/Core/Renderer/SVG/SVGRenderer.js',
    'js/Core/Axis/Tick.js',
    'js/Core/Time.js',
    'js/Core/Tooltip.js',
    'js/Core/Chart/GanttChart.js',
    'js/Core/Axis/TreeGridAxis.js',
    'js/Core/Axis/TreeGridTick.js',
    'js/Core/Axis/ColorAxis.js',
    'js/Extensions/GeoJSON.js',
    'js/Maps/Map.js',
    'js/Maps/MapNavigation.js',
    'js/Series/MapSeries.js',
    'js/Series/AreaRangeSeries.js',
    'js/Series/PackedBubbleSeries.js',
    'js/mixins/ajax.js',
    'js/modules/accessibility/*.js',
    'js/modules/data.src.js',
    'js/modules/draggable-points.src.js',
    'js/modules/drilldown.src.js',
    'js/modules/exporting.src.js',
    'js/modules/export-data.src.js',
    'js/modules/full-screen.src.js',
    'js/modules/marker-clusters.src.js',
    'js/Series/Networkgraph/*.js',
    'js/modules/offline-exporting.src.js',
    'js/modules/organization.src.js',
    'js/modules/pattern-fill.src.js',
    'js/modules/sankey.src.js',
    'js/modules/series-label.src.js',
    'js/modules/sonification/*.js',
    'js/modules/sunburst.src.js',
    'js/modules/timeline.src.js',
    'js/Extensions/Annotations/Annotations.js',
    'js/Extensions/Annotations/Mixins/controllableMixin.js',
    'js/Extensions/Annotations/ControlPoint.js',
    'js/Extensions/Annotations/NavigationBindings.js'
];

const TARGET_DIRECTORY = Path.join('build', 'api', 'class-reference');

const TEMPLATE_DIRECTORY = Path.join(
    'node_modules', 'highcharts-documentation-generators', 'docstrap'
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
    const LogLib = require('./lib/log');

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
