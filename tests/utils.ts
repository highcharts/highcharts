/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { JSHandle, Page } from '@playwright/test';

import { readFile } from 'fs/promises';
import { join, extname } from 'node:path/posix';
import { glob } from 'glob';
import { load as yamlLoad } from 'js-yaml';
import { readFileSync } from 'node:fs';

export async function setTestingOptions(
    page: Page, HC: JSHandle<typeof Highcharts> | undefined = undefined
){
    await page.evaluate(({ HC }) => {
        (HC ?? window.Highcharts).setOptions({
            chart: {
                animation: false
            },
            lang: {
                locale: 'en-GB'
            },
            plotOptions: {
                series: {
                    animation: false,
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
    }, { HC });


}

export async function getKarmaScripts() {
    const { default: files } = await import(
        '../test/karma-files.json',
        { with: { type: 'json'} }
    );

    return files;
}

type Details = {
    resources?: string[]
};

type SampleObj = {
    script?: string;
    css?: string;
    html?: string;
    details?: Details
};

export const template = ({ script, css, html, details }: SampleObj) => `<html>
    <head>
        <style>
            ${css}
        </style>

        ${details?.resources && details.resources.some(r => r.includes('qunit')) ?
                '<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>' : ''
        }

        ${details?.resources && details.resources.map(r => {
            const extToHTML = {
                '.css': (url: string) => `<link rel="stylesheet" href="${url}">`,
                '.js': (url: string) => `<script src="${url}"></script>`
            };

            const fn = extToHTML[extname(r)];
            return fn ? fn(r) : '';
        }).join('')}

        <script>
        if(window.QUnit){
            // Fix the number localization in IE
            if (
                /msie/.test(navigator.userAgent) &&
                !Number.prototype._toString) {
                    Number.prototype._toString = Number.prototype.toString;
                    Number.prototype.toString = function (radix) {
                        if (radix) {
                            return Number.prototype._toString.apply(
                                this, arguments
                            );
                        } else {
                            return this.toLocaleString('en', {
                                useGrouping: false,
                                maximumFractionDigits: 20,
                            });
                        }
                    };
                }




                QUnit.assert.close = function (
                    number, expected, error, message
                ) {
                    // Remove fix of number localization in IE
                    if (
                        /msie/.test(navigator.userAgent) &&
                        Number.prototype._toString
                    ) {
                        Number.prototype.toString =
                            Number.prototype._toString;
                        delete Number.prototype._toString;
                    }

                    if (error === void 0 || error === null) {
                        error = 0.00001; // default error
                    }

                    const result = number === expected ||
                        (
                            number <= expected + error &&
                                number >= expected - error
                    ) ||
                        false;

                    this.pushResult({
                        result: result,
                        actual: number,
                        expected: expected,
                        message: message,
                    });
                };
        }
            </script>
    </head>
    <body>
        ${html}
        <script>
        ${script}
        </script>
    </body>
</html>`;



// TODO: stolen from karma-conf. Can likely rely on intercepts for some of these
function resolveJSON(js: string) {
    const regex = /(?:(\$|Highcharts)\.getJSON|fetch)\([ \r\n]*'([^']+)/g;
    let match;
    const codeblocks = [];

    // eslint-disable-next-line no-cond-assign
    while (match = regex.exec(js)) {
        const src = match[2];
        let innerMatch: string[],
            filename: string,
            data: string;

        // Look for sources that can be matched to samples/data
        innerMatch = src.match(
            // eslint-disable-next-line @stylistic/max-len
            /^(https:\/\/cdn\.jsdelivr\.net\/gh\/highcharts\/highcharts@[a-z0-9.]+|https:\/\/www\.highcharts\.com)\/samples\/data\/([a-z0-9\-.]+$)/
        ) || src.match(
            /^(https:\/\/demo-live-data\.highcharts\.com)\/([a-z0-9\-.]+$)/
        );

        if (innerMatch) {
            filename = innerMatch[2];
            data = readFileSync(
                join(
                    __dirname,
                    '..',
                    'samples/data',
                    filename
                ),
                'utf8'
            );
        }

        // Look for sources that can be matched to the map collection
        innerMatch = src.match(
            /^(https:\/\/code\.highcharts\.com\/mapdata\/([a-z/.-]+))$/
        );
        if (innerMatch) {
            filename = innerMatch[2];
            data = readFileSync(
                join(
                    __dirname,
                    '..',
                    'node_modules/@highcharts/map-collection',
                    filename
                ),
                'utf8'
            );
        }

        if (data) {
            if (/json$/.test(filename)) {
                codeblocks.push(`window.JSONSources['${src}'] = ${data};`);
            }
            if (/csv$/.test(filename)) {
                codeblocks.push(`window.JSONSources['${src}'] = \`${data}\`;`);
            }
        }
    }

    codeblocks.push(js);

    return codeblocks.join('\n');
}
const highchartsCSS = readFileSync(
    join('code/css/highcharts.css'),
    'utf8'
);

export async function getSample(path: string) {
    const files = {
        html: 'demo.html',
        css: 'demo.css',
        script: 'demo.{js,mjs,ts}',
        details: 'demo.details'
    };

    const obj: SampleObj = {};

    for (const [type, file] of Object.entries(files)) {
        try {
            // TODO: check if faster to skip glob if not a pattern?
            const [globPath] = await glob(join(path, file), { absolute: true });
            const content = await readFile(globPath, { encoding: 'utf8'});

            obj[type] = type === 'details' ?
                yamlLoad(content) as object :
                content;

        } catch {/**/}
    }

    obj.script = resolveJSON(obj.script ?? '');
    if (path.includes('unit-tests') && /styledMode:\s+true/.test(obj.script)) {
        // Inject css
        obj.script = `window.highchartsCSS = \`${highchartsCSS}\`;
${obj.script}`;
    }

    return obj;
}


