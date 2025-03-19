/**
 * This was a once-off job to style buttons, paragraphs, text and some other
 * elements that overflowed the margin in the samples.
 *
 * Keeping the file here in case we need to deal with more similar cases.
 *
 * Usage: From root, run
 *
 * node tools/samples-report
 */
/* eslint-disable */

const fs = require('fs').promises;
const { glob } = require('glob');
// const { parse } = require('node-html-parser');
const puppeteer = require('puppeteer');
const { PNG } = require('pngjs');
const { join } = require('path');

// Function to analyze pixel data from binary PNG
async function overflowsMargin(binaryData) {
    // Decode the PNG using pngjs
    const png = PNG.sync.read(Buffer.from(binaryData));

    const width = png.width;
    const height = png.height;
    const data = png.data; // This contains pixel data in RGBA format

    const nonWhitePixels = [];

    // Iterate over every pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2; // Calculate the index for the current pixel

        const red = data[idx];
        const green = data[idx + 1];
        const blue = data[idx + 2];
        const alpha = data[idx + 3];

        // Check if the pixel is not white
        if (!(red === 255 && green === 255 && blue === 255 && alpha === 255)) {
          nonWhitePixels.push([x, y]);
        }
      }
    }

    return nonWhitePixels.length > 0;
}


(async () => {
    const matches = await glob('samples/**/demo.html');
    // const matches = await glob('samples/highcharts/blog/sound-pressure-level*/demo.html');

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    let i = 0;
    const listItems = [];
    for (const file of matches) {

        if (file.indexOf('/unit-tests/') !== -1) {
            continue;
        }

        let html = await (await fs.readFile(file)).toString(),
            cssFile = file.replace(/\.html$/u, '.css');

        // const document = parse(html);


        let cssChanged = false,
            htmlChanged = false;

        let css;
        try {
            css = await (
                await fs.readFile(cssFile)
            ).toString();

        } catch {
            css = '';
        }

        await page.setContent(`<html>
            <head>
                <style>
                    ${css}
                </style>
                </head>
                <body>
                    ${html}
                </body>
            </html>`);

        await page.setViewport({ width: 800, height: 800 });

        // Make a screenshot of the page and analyze its pixels. We are looking
        // for pixels that are not white.
        const png = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 10,
                height: 800
            }
        });

        /*
        const firstLevel = document.childNodes
            .filter(node => node.nodeType === 1)
            .filter(node => (
                node.getAttribute('id') !== 'container' &&
                node.tagName !== 'SCRIPT' &&
                node.tagName !== 'LINK' &&
                node.tagName !== 'PRE' &&
                node.tagName !== 'BUTTON'
            ));

        if (
            firstLevel.length > 0 &&
            css.indexOf('font-family') === -1 &&
            css.indexOf('serif') === -1 &&
            css.indexOf('@import') === -1
        ) {
            if (css) {
                css = `* {
    font-family: Helvetica, Arial, sans-serif;
}

${css}`;
            } else {
                css = `* {
    font-family: Helvetica, Arial, sans-serif;
}
`;
            }


            cssChanged = true;
        }
        */

        // For each match do a replacement
        /*
        const classes = [];

        const buttons = root.querySelectorAll('button')
            .filter(button => !button.classNames.length)
            .filter(button => button.parentNode?.getAttribute('id') !== 'button-box');

        for (const button of buttons) {

            htmlChanged = true;
            button.classList.add('highcharts-demo-button');

            if (!cssChanged) {
                css += `
.highcharts-demo-button {
    border: none;
    border-radius: 0.3rem;
    display: inline-block;
    padding: 0.5rem 1.5rem;
    margin: 0.5rem -5px 0.5rem 10px;
}
`;
            }
            cssChanged = true;
        }
        */
        const sample = file
            .replace('samples/', '')
            .replace('/demo.html', '');

        if (await overflowsMargin(png)) {
            listItems.push(`
                <a target="iframe" class="sample" href="http://localhost:3030/samples/view?path=${sample}">${sample}</a>
                <a href="vscode://file//Users/torstein/GitHub/highcharts/samples/${sample}/demo.html">Edit</a>
            `);
        }
        console.log(sample);


        if (i > 20) {
            // break;
        }

        //*
        if (htmlChanged) {
            html = document.toString();
            // await fs.writeFile(file, html, 'utf-8');
        }
        if (cssChanged) {
            // await fs.writeFile(cssFile, css, 'utf-8');
        }
        // */
        i++;

    }

    await browser.close();

    const outHTML = `<!DOCTYPE html>
        <html>
        <head>
            <title>Highcharts samples with buttons</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                h1 {
                    font-size: 1.5em;
                }
                a.active {
                    font-weight: bold;
                }
            </style>
            <script>
            window.addEventListener('load', () => {
                document.querySelectorAll('a.sample').forEach(
                    a => a.addEventListener('click', (e) => {
                        document.querySelectorAll('a.sample').forEach(a2 => a2.classList.remove('active'));
                        e.target.classList.add('active');
                    })
                });
            });
            </script>
        </head>
        <body>
            <div style="width: 300px; float: left;">
                <h1>Highcharts samples with buttons</h1>
                <ol>
                    ${listItems.map(item => `<li>${item}</li>`).join('')}
                </ol>
            </div>
            <div style="width: 800px; position: fixed; right: 0">
                <iframe name="iframe" style="width: 100%; height: 1200px"></iframe>
                <script>
                document.querySelector('iframe').src = document.querySelector('a').href;
                </script>
            </div>
        </body>
        </html>`;

    const outfile = join(__dirname, '../tmp/samples-report.html');
    console.log(`${listItems.length} hits reported to ${outfile}`);

    await fs.writeFile(
        outfile,
        outHTML
    );
})();