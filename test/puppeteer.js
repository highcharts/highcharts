/* eslint-env browser, node, es6 */
/* eslint no-console: 0, no-underscore-dangle: 0 */
/* global Highcharts */

/*
Experimental script for visual test.

@example
From root:
node test/puppeteer

@todo
- Compare to reference images. Possibly faster to get the raw image data from
  the pages instead of the PNG encoded stream.
- Possibly combine with a test framework and use return codes for CI.
*/


const fs = require('fs');
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
    <canvas id="canvas" width="600" height="400"></canvas>

    </body>
    </html>`;

    return html;
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

                ctx.drawImage(img, 0, 0, 600, 400);
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

        // Run the scripts on the page
        await page.evaluate(beforeEach);
        await page.evaluate(js);
        const png = await page.evaluate(getPNG, container);

        // Strip off the data: url prefix to get just the base64-encoded bytes
        if (png) {
            var data = png.replace(/^data:image\/\w+;base64,/, '');
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync(
                'test/screenshots/' + path.replace(/\//g, '-') + '.png',
                buf
            );
        } else {
            console.log('x'.red + ' ' + path.gray);
        }

        count++;
        console.log('✓'.green + ' ' + path.gray);
    }

    await browser.close();

    console.log('Did ' + count + ' charts in ' + ((Date.now() - startTime) / 1000) + 's');
}

run();

