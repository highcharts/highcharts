/* eslint-env browser, node, es6 */
/* eslint no-console: 0, no-underscore-dangle: 0 */
/* global Highcharts */

/*
Experimental script for visual test.

@example
From root:
node test/puppeteer

@todo
- Optimze parameters for pixelmatch. Avoid writing the candidate image to disk
  before diffing - pass the buffer in directly.
- Link to https://utils.highcharts.com for failing sets, for visual debugging.
- Possibly combine with a test framework and use return codes for CI.
- Exclude array for problem samples.
- Override Math.random
- Fall back to Page.screenshot when PNG capture fails?
*/


const fs = require('fs');
const argv = require('yargs').argv;
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
require('colors');

const puppeteer = require('puppeteer');
const glob = require('glob-fs')({ gitignore: true });
const files = glob.readdirSync('samples/highcharts/plotoptions/**/demo.js');

const startTime = Date.now();
let count = 0;

/**
 * Runs before each sample is evaluated.
 * @returns {void}
 */
function beforeEach() {
    Highcharts.setOptions({
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
            '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        chart: {
            animation: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        }
    });
}
/**
 * Create the page HTML.
 * @returns {String} The HTML
 */
function buildContent() {
    let html = `<html>
    <head>

    </head>
    <body>
    <div id="container" style="width: 600px; height: 400px"></div>
    <canvas id="canvas" width="210" height="140"></canvas>

    </body>
    </html>`;

    return html;
}

/**
 * Pad a string to a given length
 * @param {String}  s
 *                  The string to pad
 * @param {Number}  length
 *                  The length we want
 * @param {Boolean} left
 *                  Whether to pad on the left side (or right)
 * @returns {String} Padded string
 */
function pad(s, length, left) {
    var padding;

    s = s.toString();

    if (s.length > length) {
        s = s.substring(0, length);
    }

    padding = new Array((length || 2) + 1 - s.length).join(' ');

    return left ? padding + s : s + padding;
}

/**
 * Get the PNG from a container div containing SVG.
 * @param   {Object} container Div element
 * @returns {Promise} The PNG stream
 */
function getPNG(container) {
    return new Promise((resolve) => {

        let loaded = false;
        setTimeout(() => {
            if (!loaded) {
                resolve(false);
            }

        }, 1000);
        try {
            const data = container.querySelector('svg').outerHTML;
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            const DOMURL = window.URL || window.webkitURL || window;

            const img = new Image();
            const svg = new Blob([data], { type: 'image/svg+xml' });
            const url = DOMURL.createObjectURL(svg);
            img.onload = function () {
                loaded = true;

                ctx.drawImage(img, 0, 0, 210, 140);
                DOMURL.revokeObjectURL(url);
                const pngImg = canvas.toDataURL('image/png');
                resolve(pngImg);
            };
            img.onerror = function () {
                console.log('@img.onerror');
                resolve(false);
            };
            img.src = url;
        } catch (e) {
            console.log('@catch', e);
            resolve(false);
        }
    });

}

/**
 * Diff two PNG images using pixelmatch
 * @param  {String} path1 First image
 * @param  {String} path2 Second image
 * @returns {Promise} The promise
 */
async function diff(path1, path2) {
    return new Promise((resolve) => {

        let filesRead = 0,
            img1,
            img2;

        function doneReading() { // eslint-disable-line require-jsdoc
            if (++filesRead < 2) {
                return;
            }

            let numDiffPixels = pixelmatch(
                img1.data,
                img2.data,
                null,
                img1.width,
                img1.height,
                { threshold: 0 }
            );

            resolve(numDiffPixels);
        }

        img1 = fs.createReadStream(path1)
            .pipe(new PNG()).on('parsed', doneReading);
        img2 = fs.createReadStream(path2)
            .pipe(new PNG()).on('parsed', doneReading);

    });
}

/**
 * The main async runner
 * @returns {void}
 */
async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log(
        'PAGE LOG:'.gray,
        msg.args[0]._remoteObject.value,
        (msg.args[1] && msg.args[1]._remoteObject.value) || ''
    ));
    await page.setContent(
          buildContent()
    );
    let scripts = require('./karma-files.json');
    for (let i = 0; i < scripts.length; i++) {
        await page.addScriptTag({ path: scripts[i] });
    }
    const container = await page.$('#container');

    // Loop the sample files
    for (let i = 0; i < files.length; i++) {

        let path = files[i].replace('samples/', '').replace('/demo.js', '');
        let js = fs.readFileSync(files[i], 'utf8');
        let eachTime = Date.now();

        // Run the scripts on the page
        await page.evaluate(beforeEach);
        await page.evaluate(js);
        const png = await page.evaluate(getPNG, container);

        // Strip off the data: url prefix to get just the base64-encoded bytes
        if (png) {

            let referencePath =
                'test/reference/' + path.replace(/\//g, '-') + '.png';

            // Set reference image
            if (argv.reference) {
                let data = png.replace(/^data:image\/\w+;base64,/, '');
                let buf = new Buffer(data, 'base64');
                fs.writeFileSync(referencePath, buf);

                console.log(`Saved reference for ${path}`.gray);

            // Compare new image to reference
            } else {
                let candidatePath = 'test/screenshots/' + path.replace(/\//g, '-') + '.png';
                let data = png.replace(/^data:image\/\w+;base64,/, '');
                let buf = new Buffer(data, 'base64');
                fs.writeFileSync(candidatePath, buf);


                let numDiffPixels = await diff(referencePath, candidatePath);
                let numDiffPixelsPadded = pad(numDiffPixels, 5, true) + ' diff ';

                eachTime = ' ' + (pad(Date.now() - eachTime, 5, true) + 'ms').gray;

                if (numDiffPixels === 0) {
                    console.log('✓'.green + ' ' + pad(path, 60).gray + ' ' + numDiffPixelsPadded + eachTime);
                } else {
                    console.log('x'.red + ' ' + pad(path, 60).red + ' ' + numDiffPixelsPadded + eachTime);
                }
            }
        } else {
            console.log('x'.red + ' ' + path.gray);
        }

        count++;
    }

    await browser.close();

    console.log('Did ' + count + ' charts in ' + ((Date.now() - startTime) / 1000) + 's');
}

run();

