/*
 * Copyright (C) Highsoft AS
 */


const gulp = require('gulp');

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
    const logLib = require('../lib/log');

    const {
        writeProducts,
        fetchCurrentProducts
    } = require('../dist-productsjs.js');

    const {
        release
    } = require('yargs').argv;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const now = new Date();
    const products = await fetchCurrentProducts();

    products['Highcharts Dashboards'] = {
        date: [
            now.getFullYear(),
            (now.getMonth() + 1).toString().padStart('0', 2),
            now.getDate().toString().padStart('0', 2)
        ].join('-'),
        nr: release
    };

    await writeProducts(products);

    logLib.success('Created products.js');

}


gulp.task('dashboards/dist-productsjs', productsJS);
