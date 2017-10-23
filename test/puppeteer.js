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
 * Function to run in the page context before running the tests.
 * @returns {void}
 */
function beforeAll() {
    const randomValues = [0.14102989272214472, 0.0351817375048995,
        0.10094573209062219, 0.35990892769768834, 0.7690574480220675,
        0.16634021210484207, 0.3944594960194081, 0.7656398438848555,
        0.27706647920422256, 0.5681763959582895, 0.513730650767684,
        0.26344996923580766, 0.09001278411597013, 0.2977627406362444,
        0.6982127586379647, 0.9593012358527631, 0.8456065070349723,
        0.26248381356708705, 0.12872424302622676, 0.25530692492611706,
        0.9969052199739963, 0.09259856841526926, 0.9022860133554786,
        0.3393681487068534, 0.41671016393229365, 0.10582929337397218,
        0.1322793234139681, 0.595869708340615, 0.050670077092945576,
        0.8613549116998911, 0.17356411134824157, 0.16447093593887985,
        0.44514468451961875, 0.15736589767038822, 0.8677479331381619,
        0.30932203005068004, 0.6120233973488212, 0.001859797164797783,
        0.7689258102327585, 0.7421043077483773, 0.7548440918326378,
        0.9667320610024035, 0.13654314493760467, 0.6277681242208928,
        0.002858637133613229, 0.6877673089038581, 0.44036358245648444,
        0.3101970909629017, 0.013212101766839623, 0.7115063068922609,
        0.2931885647121817, 0.5031651991885155, 0.8921459852717817,
        0.547999506117776, 0.010382920736446977, 0.9862914837431163,
        0.9629317701328546, 0.07685352209955454, 0.2859949553385377,
        0.5578324059024453, 0.7765828191768378, 0.1696563793811947,
        0.34366130153648555, 0.11959927808493376, 0.8898638435639441,
        0.8963573810178787, 0.332408863119781, 0.27137733018025756,
        0.3066735703032464, 0.2789501305669546, 0.4567076754756272,
        0.09539463231340051, 0.9158625246491283, 0.2145260546822101,
        0.8913846455980092, 0.22340057184919715, 0.09033847553655505,
        0.49042539740912616, 0.4070818084292114, 0.5827512110117823,
        0.1993762720376253, 0.9264022477436811, 0.3290765874553472,
        0.07792594563215971, 0.7663758248090744, 0.4329648329876363,
        0.10257583996281028, 0.8170149670913815, 0.41387700103223324,
        0.7504217880778015, 0.08603733032941818, 0.17256441875360906,
        0.4064991301856935, 0.829071992309764, 0.6997416105587035,
        0.2686419754754752, 0.36025605257600546, 0.6014082923065871,
        0.9787689209915698, 0.016065671807155013];
    let randomCursor = 0;
    Math.random = function () {
        var ret = randomValues[randomCursor];
        randomCursor++;
        if (randomCursor >= randomValues.length) {
            randomCursor = 0;
        }
        return ret;
    };

}

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
    await page.evaluate(beforeAll);
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

