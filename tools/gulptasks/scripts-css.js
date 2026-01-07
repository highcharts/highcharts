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
    target: TARGET_DIRECTORY + '/grid/',
    replacePath: 'grid/',
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

function mergeAndCopyGridProCSS(config) {
    const fslib = require('../libs/fs');
    const path = require('path');

    config = handleConfig(config);

    // Read the original source files
    const gridLiteCSS = fslib.getFile(path.join('css/grid', 'grid-lite.css'));
    const gridProCSS = fslib.getFile(path.join('css/grid', 'grid-pro.css'));

    // Extract Grid Pro license header
    const gridProLicenseMatch = gridProCSS.match(/^\/\*\*[\s\S]*?\*\/\s*/);
    const gridProLicense = gridProLicenseMatch ? gridProLicenseMatch[0] : '';

    // Remove license header from Grid Lite CSS (everything until the first non-license content)
    const gridLiteCSSNoLicense = gridLiteCSS.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '');

    // Remove license header, @import statement, and import comments from Grid Pro CSS
    const gridProCSSClean = gridProCSS
        .replace(/^\/\*\*[\s\S]*?\*\/\s*/, '') // Remove license header
        .replace(/@import\s+url\s*\(\s*["']?(\.\/)?grid-lite\.css["']?\s*\)\s*;?\s*/g, '') // Remove import
        .replace(/^\/\*\s*Import Grid Lite styles\s*\*\/\s*/gm, '') // Remove import comment
        .trim();

    // Combine: Grid Pro license + Grid Lite CSS (no license) + cleaned Grid Pro CSS
    const mergedCSS = gridProLicense + '\n' + gridLiteCSSNoLicense + '\n\n' + gridProCSSClean;

    // Write the merged CSS to the target directory
    fslib.setFile(path.join(config.target, 'css', 'grid-pro.css'), mergedCSS);
}

function copyDeprecatedGridLiteCSS(config) {
    const fslib = require('../libs/fs');
    const path = require('path');

    config = handleConfig(config);

    // Read the original source files
    const gridLiteCSS = fslib.getFile(path.join('css/grid', 'grid-lite.css'));
    const gridCSS = gridLiteCSS.replace(
        '/*  ==== Start Grid Color Scheme  ==== */',
        '/*  ==== UPGRADE WARNING NOTE  ==== */\n/**\n' +
        ' * This file is provided for backward compatibility only.\n' +
        ' * Please use grid-lite.css directly instead.\n' +
        ' * This file will be removed in the future.\n' +
        ' */\n' +
        '/* ==== END UPGRADE WARNING NOTE ==== */\n\n' +
        '/*  ==== Start Grid Color Scheme  ==== */'
    );

    // Write the merged CSS to the target directory
    fslib.setFile(path.join(config.target, 'css', 'grid.css'), gridCSS);
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
            mergeAndCopyGridProCSS(gridConfig);
            copyDeprecatedGridLiteCSS(gridConfig); // to be removed
            replaceProductVersionInFiles(
                require('path').join(gridConfig.target, 'css'),
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
