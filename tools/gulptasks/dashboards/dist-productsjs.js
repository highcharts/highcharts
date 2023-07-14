/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Tasks
 *
 * */


/**
 * Copies additional DTS files, that were not created by TypeScript itself.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function productsJS() {

    const fetch = require('node-fetch').default;
    const fs = require('fs');
    const logLib = require('../lib/log');

    const {
        buildFolder
    } = require('./_config.json');
    const {
        release
    } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const now = new Date();
    const prefix = 'var products = ';
    const products = await fetch('https://code.highcharts.com/products.js')
        .then(response => response.text())
        .then(content => JSON.parse(content.substring(prefix.length)));

    products['Highcharts Dashboards'] = {
        date: [
            now.getFullYear(),
            (now.getMonth() + 1).toString().padStart('0', 2),
            now.getDate().toString().padStart('0', 2)
        ].join('-'),
        nr: release
    };

    await fs.promises.writeFile(
        path.join(buildFolder, '..', 'products.js'),
        prefix + JSON.stringify(products, void 0, '    ') + '\n'
    );

    logLib.success('Created products.js');

}


gulp.task('dashboards/dist-productsjs', productsJS);
