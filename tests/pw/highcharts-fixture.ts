import { test as base, chromium } from '@playwright/test';
import fs, { readFile } from 'node:fs/promises';
import path from 'node:path';

import yaml from 'js-yaml';

export async function setTestingOptions(page: import('@playwright/test').Page){
    await page.evaluate(()=>{
        Highcharts.setOptions({
            chart: {
                animation: false
            },
            lang: {
                locale: 'en-GB'
            },
            plotOptions: {
                series: {
                    animation: false,
                    kdNow: true,
                    dataLabels: {
                        defer: false
                    },
                    states: {
                        hover: {
                            animation: false
                        },
                        select: {
                            animation: false
                        },
                        inactive: {
                            animation: false
                        },
                        normal: {
                            animation: false
                        }
                    },
                    label: {
                        // Disable it to avoid diff. Consider enabling it in the future,
                        // then it can be enabled in the clean-up commit right after a
                        // release.
                        enabled: false
                    }
                },
                // We cannot use it in plotOptions.series because treemap
                // has the same layout option: layoutAlgorithm.
                networkgraph: {
                    layoutAlgorithm: {
                        enableSimulation: false,
                        maxIterations: 10
                    }
                },
                packedbubble: {
                    layoutAlgorithm: {
                        enableSimulation: false,
                        maxIterations: 10
                    }
                }

            },
            // Stock's Toolbar decreases width of the chart. At the same time, some
            // tests have hardcoded x/y positions for events which cuases them to fail.
            // For these tests, let's disable stockTools.gui globally.
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            tooltip: {
                animation: false
            },
            drilldown: {
                animation: false
            }

        });
    })
}

export async function loadSample(page, samplePath: string) {
    const details = yaml.safeLoad(path.join(samplePath, 'demo.details'))
    const demo = {
        ...details
    };

    for (const ext of ['html', 'css', 'js', 'mjs', 'ts']) {
        demo[ext] = await readFile(path.join(samplePath, `demo.${ext}`)).catch(()=> null);
    }

    const template = `
    <!DOCTYPE html>
    <html lang='en-US'>
    <head>
    <link rel="icon" type="image/x-icon" href="https://www.highcharts.com/demo/static/favicon.ico">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="googlebot" content="nofollow">
    <title>${demo.name}</title>
    ${/*demo.resources ? resources(demo.resources) : ''*/ ''}
    ${demo.css ? `<style>
        ${demo.css}
        </style>` : ''}

        </head>
        <body>
        ${demo.html}

        <script id="js" ${demo.esm ? 'type="module"' : ''} >
        ${demo.js ?? demo.mjs ?? demo.ts}
        </script>
        </body>
        </html>
        `;

        await page.setContent(template, { waitUntil: 'networkidle' });
}

async function replaceHCCode(route) {
    const url = route.request().url();
    const relativePath = url.split('/code.highcharts.com/')[1];
    const localPath = path.join(
        __dirname,
        '../../code' ,
        relativePath
        .replace(/^(stock|maps|gantt|grid)\//, '')
            .replace(/\.js$/, '.src.js')
    );

    console.log(localPath);

    try {
        const body = await fs.readFile(localPath);
        await route.fulfill({
            status: 200,
            body,
            headers: {
                'Content-Type': localPath.endsWith('.js') ?
                    'application/javascript' : 'text/css'
            }
        });
    } catch (err) {
        console.warn(`Missing local file for ${relativePath}`);
        await route.abort();
    }
}

export const test = base.extend<{}>({
    page: async ({ page }, use) => {
        if (!process.env.NO_REWRITES) {
            console.log('Redirecting to local code')
            await page.route('**/code.highcharts.com/**', replaceHCCode);
        }

        await use(page);
    }
});
