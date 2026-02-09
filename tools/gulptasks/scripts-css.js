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
        'grid/',
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

const gridConfig = {
    sources: [
        'css/grid/'
    ],
    target: TARGET_DIRECTORY + '/grid/css/modules',
    replacePath: 'css/grid/',
    exclude: [
        '.stylelintrc'
    ]
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

async function bundleGridCSS() {
    const argv = require('yargs').argv;
    const LogLib = require('../libs/log');
    const ProcessLib = require('../libs/process');
    const Path = require('path');

    const config = Path.join('tools', 'webpacks', 'grid-styles.webpack.mjs');

    if (argv.verbose) {
        LogLib.warn(config);
    }

    LogLib.message('Bundling Grid CSS...');
    await ProcessLib.exec(
        `npx webpack -c ${config} --no-color`,
        {
            maxBuffer: 1024 * 1024,
            silent: argv.verbose ? 1 : 2,
            timeout: 60000
        }
    );
    LogLib.success('Finished CSS bundling.');
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

/**
 * Changes the HC Grid product version in the CSS files.
 * @param  {string} folder
 * Folder to replace the version in.
 * @param  {string} buildPropertiesPath
 * Path to build properties file.
 */
function replaceProductVersionInFiles(folder, buildPropertiesPath) {
    const fs = require('fs');
    const path = require('path');

    const { version } = JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname, buildPropertiesPath),
            'utf8'
        )
    );
    const files = fs.readdirSync(folder);

    files.forEach(file => {
        const filePath = path.join(folder, file);

        if (fs.statSync(filePath).isDirectory()) {
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = content.replace(/@product\.version@/gu, version);

        fs.writeFileSync(filePath, updatedContent);
    });
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
        if (argv.product === 'Dashboards') {
            log.message('Generating css for Dashboards...');
            copyCSS(dashboardsConfig);
            replaceProductVersionInFiles(
                require('path').join(dashboardsConfig.target, 'css'),
                './dashboards/build-properties.json'
            );
            log.success('Copied dashboards CSS');
        } else if (argv.product === 'Grid') {
            log.message('Generating css for Grid...');
            copyCSS(gridConfig);
            bundleGridCSS();
            replaceProductVersionInFiles(
                require('path').join(TARGET_DIRECTORY, 'grid', 'css'),
                './grid/build-properties.json'
            );
            log.success('Copied grid CSS');
        } else {
            log.message('Generating css for Highcharts...');
            copyCSS(highchartsConfig);
            log.success('Copied highcharts CSS');
        }

        resolve();
    });
}

scriptCSS.description = 'Creates CSS files for given product';
scriptCSS.flags = {
    '--product': 'Creates CSS files for product: Highcharts (default), Grid, Dashboards'
};

gulp.task('scripts-css', () => scriptCSS(require('yargs').argv));

module.exports = {
    scriptCSS
};
