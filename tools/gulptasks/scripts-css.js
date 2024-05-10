/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const COPY_DIRECTORIES = [
    'css',
    'gfx'
];

const TARGET_DIRECTORY = 'code';

const highchartsConfig = {
    sources: COPY_DIRECTORIES,
    target: TARGET_DIRECTORY,
    replacePath: '',
    exclude: [
        'dashboards/',
        'datagrid/',
        'dashboards-icons/'
    ]
};

const dashboardsConfig = {
    sources: [
        'css/dashboards/',
        'gfx/dashboards-icons/'
    ],
    target: TARGET_DIRECTORY + '/dashboards',
    replacePath: 'dashboards/',
    exclude: []
};

const datagridConfig = {
    sources: 'css/datagrid/',
    target: TARGET_DIRECTORY + '/datagrid',
    replacePath: 'datagrid/',
    exclude: []
};

function handleConfig(config) {
    const defaultConfig = {
        sources: [], // Directories to copy over
        target: 'code', // Directory to copy to
        exclude: [], // Files and directories to exclude. Uses strubg.include()
        replacePath: '' // String to replace from the path of the original file when copying
    };

    // Ensure sources is an array
    if (typeof config.sources === 'string') {
        config.sources = [config.sources];
    }

    // Merge the defaultConfig with the provided config
    return { ...defaultConfig, ...config };
}

function copyCSS(config) {
    const fslib = require('../libs/fs');
    const path = require('path');

    config = handleConfig(config);

    config.sources.forEach(
        copyPath => fslib.copyAllFiles(
            copyPath,
            path.join(
                config.target,
                config.replacePath ?
                    copyPath.replace(config.replacePath, '') :
                    copyPath
            ),
            true,
            fileName => !config.exclude
                .some(name => fileName.includes(name))
        )
    );
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates CSS files
 *
 * @param  {object} argv
 *         Command line arguments
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function scriptCSS(argv) {
    const log = require('../libs/log');

    return new Promise(resolve => {
        log.message(`Generating css for ${argv.dashboards ? 'dashboards' : 'highcharts'} ...`);

        if (argv.dashboards) {
            copyCSS(dashboardsConfig);
            copyCSS(datagridConfig);
        } else {
            copyCSS(highchartsConfig);
        }

        log.success(`Copied ${argv.dashboards ? 'dashboards' : 'highcharts'} CSS`);

        resolve();
    });
}

scriptCSS.description = 'Creates CSS files for given product';
scriptCSS.flags = {
    '--dashboards': 'Creates CSS files for dashboards'
};

gulp.task('scripts-css', () => scriptCSS(require('yargs').argv));

module.exports = {
    scriptCSS
};
