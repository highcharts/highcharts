/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const SOURCE_FILES = [
    'README.md',
    './js/parts/Utilities.js',
    './js/parts/Axis.js',
    './js/parts/Chart.js',
    './js/parts/Color.js',
    './js/parts/DataGrouping.js',
    './js/parts/DataLabels.js',
    './js/parts/Dynamics.js',
    './js/parts/Globals.js',
    './js/parts/Interaction.js',
    './js/parts/Legend.js',
    './js/parts/Options.js',
    './js/parts/PieSeries.js',
    './js/parts/Point.js',
    './js/parts/Pointer.js',
    './js/parts/PlotLineOrBand.js',
    './js/parts/Series.js',
    './js/parts/StockChart.js',
    './js/parts/SVGRenderer.js',
    './js/parts/Tick.js',
    './js/parts/Time.js',
    './js/parts-gantt/GanttChart.js',
    './js/parts-gantt/TreeGrid.js',
    './js/parts-map/ColorAxis.js',
    './js/parts-map/GeoJSON.js',
    './js/parts-map/Map.js',
    './js/parts-map/MapNavigation.js',
    './js/parts-map/MapSeries.js',
    './js/parts-more/AreaRangeSeries.js',
    './js/modules/drilldown.src.js',
    './js/modules/exporting.src.js',
    './js/modules/export-data.src.js',
    './js/modules/data.src.js',
    './js/modules/offline-exporting.src.js',
    './js/modules/pattern-fill.src.js',
    './js/modules/sankey.src.js',
    './js/modules/networkgraph/*.js',
    './js/modules/sonification/*.js',
    './js/annotations/annotations.src.js'
    /*
    './js/annotations/eventEmitterMixin.js',
    './js/annotations/MockPoint.js',
    './js/annotations/ControlPoint.js',
    './js/annotations/controllable/controllableMixin.js',
    './js/annotations/controllable/ControllableCircle.js',
    './js/annotations/controllable/ControllableImage.js',
    './js/annotations/controllable/ControllableLabel.js',
    './js/annotations/controllable/ControllablePath.js',
    './js/annotations/controllable/ControllableRect.js',
    './js/annotations/types/CrookedLine.js',
    './js/annotations/types/ElliottWave.js',
    './js/annotations/types/Tunnel.js',
    './js/annotations/types/Fibonacci.js',
    './js/annotations/types/InfinityLine.js',
    './js/annotations/types/Measure.js',
    './js/annotations/types/Pitchfork.js',
    './js/annotations/types/VerticalLine.js'*/
];

const TARGET_DIRECTORY = 'build/api/class-reference';

const TEMPLATE_DIRECTORY = (
    'node_modules/highcharts-documentation-generator/docstrap'
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
function task() {

    const gulpJSDoc = require('gulp-jsdoc3');
    const LogLib = require('./lib/log');

    return new Promise((resolve, reject) => {

        const jsDocConfig = {
            navOptions: {
                theme: 'highsoft'
            },
            opts: {
                TARGET_DIRECTORY,
                private: false,
                template: TEMPLATE_DIRECTORY + '/template'
            },
            plugins: [
                TEMPLATE_DIRECTORY + '/plugins/add-namespace',
                TEMPLATE_DIRECTORY + '/plugins/markdown',
                TEMPLATE_DIRECTORY + '/plugins/sampletag'
            ],
            templates: {
                logoFile: 'img/highcharts-logo.svg',
                systemName: 'Highcharts',
                theme: 'highsoft'
            }
        };

        LogLib.message('Generating Class documentation...');

        Gulp.src(SOURCE_FILES, { read: false })
            .pipe(gulpJSDoc(jsDocConfig, function (error) {
                if (error) {
                    reject(error);
                } else {
                    LogLib.success('Generating Class documentation done.');
                    resolve();
                }
            }));
    });
}

Gulp.task('jsdoc-classes', task);
