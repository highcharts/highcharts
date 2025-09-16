/* eslint-disable playwright/no-conditional-in-test */
import { Page } from '@playwright/test';
import { test, expect, setupRoutes } from '../fixtures.ts';
import { getKarmaScripts, getSample } from '../utils.ts';
import { join, dirname } from 'node:path';

import { glob } from 'glob';

test.describe('QUnit tests', () => {
    test.describe.configure({
        timeout: 30_000,
        retries: 1 // retry once
    });

    // Set up page in advance to share browser between tests
    // which saves setup time for each test
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 800, height: 600 }
        });
        page = await context.newPage();
        await setupRoutes(page); // need to setup routes separately


        await page.setContent(`<div id="qunit"></div>
        <div id="qunit-fixture"></div>
        <div id="container" style="width: 600px; margin 0 auto"></div>
        <div id="output"></div>`);


        const scripts = [
            ...(await getKarmaScripts()),
            join('test', 'call-analyzer.js'),
            join('test', 'test-controller.js'),
            join('test', 'test-utilities.js'),
            join('tmp', 'json-sources.js'),
            join('test', 'test-template.js'),
            ...(await glob('test/templates/**/*.js')),
            join('test', 'karma-setup.js')
        ];

        await page.addScriptTag({ url: 'https://code.jquery.com/qunit/qunit-2.4.0.js' });
        await page.addStyleTag({ url: 'https://code.jquery.com/qunit/qunit-2.4.0.css' });

        for (const script of scripts) {
            await page.addScriptTag({
                path: script
            });
        }

        await page.evaluate(()=>{
            QUnit.testStart(()=>{
                Highcharts.setOptions({
                    chart: {
                        events: {
                            load: function () {
                                (window as any).setHCStyles(this);
                            }
                        }
                    }
                });
            });

            QUnit.testDone(() => {
                document.querySelector('#test-hc-styles')?.remove();
            });
        });
    });

    test.afterAll(async ({ browser }) => {
        await browser.close();
    });

    test.afterEach(async () => {
        await page.evaluate(() => {
            const testScript = document.querySelector('#test-script');

            if (testScript) testScript.remove();
            if (window.__qunitResults__) {
                window.__qunitResults__ = null;
            }
        });
    });

    const unitTests = glob.sync('samples/unit-tests/**/demo.js', {
        ignore: [
            // Also ignored in karma, should maybe just delete
            'samples/unit-tests/themes/**'
        ]
    });

    for (const qunitTest of unitTests){
        test(qunitTest + '', async () =>{
            const sample = await getSample(dirname(qunitTest));

            if(!sample.script) {
                // eslint-disable-next-line playwright/no-skipped-test
                test.skip(true, 'Skipping as there\'s no script');
                return;
            }
            if (!sample.script.includes('QUnit.test')) {
                sample.script =
                    sample.script +
                    'QUnit.test("", (assert) => { assert.ok(true)  })';
            }

            await page.evaluate(()=>{
                QUnit.on('runEnd', function (details) {
                    // Optionally expose to Playwright
                    window.__qunitResults__ = details.testCounts;
                });
            });


            const script = await page.addScriptTag({
                content: sample.script
            });
            await script.evaluate(s => (s as HTMLScriptElement).id = 'test-script');

            // const testResults = page.locator('#qunit-testresult-display');
            // await expect(testResults).toBeInViewport();

            const results = await page.waitForFunction(
                () => window.__qunitResults__
            );


            const { failed, passed, total } = await results.jsonValue();


            if (Number(failed) > 0){
                console.log(`QUnit results: ${passed}/${total} passed, ${Number(failed)} failed`);
            }

            // Fail the Playwright test if any QUnit test failed
            expect(Number(failed)).toBe(0);


        });
    }
});
