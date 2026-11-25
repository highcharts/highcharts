import type { Page } from '@playwright/test';
import { glob } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { qunitScript, qunitStyles } from '~/qunit/assets.ts';
import { setupConsoleCapture } from '~/qunit/utils/console-capture.ts';
import { setupEnhancedQUnitCallbacks } from '~/qunit/utils/error-capture.ts';
import { getKarmaScripts } from '~/utils.ts';
import type { setOptions } from '~ts/Core/Defaults.ts';

const sampleBody = `
    <div id="qunit"></div>
    <div id="qunit-fixture"></div>
    <div id="container" style="width: 600px"></div>
    <div id="output"></div>`;

export const qunitViewport = { width: 800, height: 600 };

export async function writeQUnitSetupFile(
    path: string,
    extraScripts: string[] = []
): Promise<void> {
    const scripts = [
        ...(await getKarmaScripts()),
        join('test', 'call-analyzer.js'),
        join('test', 'test-controller.js'),
        join('test', 'test-utilities.js'),
        join('tmp', 'json-sources.js'),
        join('test', 'test-template.js'),
        ...(await glob('test/templates/**/*.js')),
        join('test', 'visual-comparator.js'),
        join('test', 'karma-setup.js')
    ];

    const sources = await Promise.all(scripts.map(async path => {
        const source = await readFile(path, 'utf8');
        return `${source}\n//# sourceURL=${pathToFileURL(path).href}`;
    }));
    await writeFile(path, JSON.stringify([...sources, ...extraScripts]));
}

async function installSetupScripts(
    page: Page,
    setupFile: string
): Promise<void> {
    // File inputs let a local browser read the setup without sending its
    // contents through Playwright's protocol on every page.
    const input = await page.evaluateHandle(() => {
        const element = document.createElement('input');
        element.type = 'file';
        return element;
    });
    try {
        await input.setInputFiles(setupFile);
        await input.evaluate(async element => {
            const file = element.files?.[0];
            if (!file) {
                throw new Error('Missing QUnit setup file');
            }
            const sources = JSON.parse(await file.text()) as string[];
            const errors: string[] = [];
            const captureError = (event: ErrorEvent): void => {
                errors.push(`${event.message} at ${event.filename}:${event.lineno}`);
            };
            window.addEventListener('error', captureError);
            try {
                for (const source of sources) {
                    const script = document.createElement('script');
                    script.text = source;
                    document.head.append(script);
                }
            } finally {
                window.removeEventListener('error', captureError);
            }
            if (errors.length) {
                throw new Error(`QUnit setup failed\n${errors.join('\n')}`);
            }
        });
    } finally {
        await input.dispose();
    }
}

async function installStyledModeHooks(page: Page): Promise<void> {
    await page.evaluate(() => {
        const qunit = window.QUnit;

        qunit.on('testStart', () => {
            const highcharts = window.Highcharts as {
                setOptions: typeof setOptions;
            };
            if (highcharts) {
                highcharts.setOptions({
                    chart: {
                        events: {
                            load: function () {
                                window.setHCStyles(this);
                            }
                        }
                    }
                });
            }
        });

        qunit.on('testEnd', () => {
            document.querySelector('#test-hc-styles')?.remove();
        });
    });
}

async function initializePage(page: Page): Promise<void> {
    await setupConsoleCapture(page);
    // Keep layout independent of the QUnit stylesheet's body margin reset.
    await page.setContent(`<body style="margin: 8px">${sampleBody}</body>`);
}

export async function initializeFreshPage(
    page: Page,
    setupFile: string
): Promise<void> {
    await initializePage(page);
    await page.evaluate(() => {
        window.QUnit = {
            // Use the Playwright sample timeout unless a case sets its own.
            config: { autostart: false, testTimeout: 0 }
        } as typeof window.QUnit;
    });
    await page.addScriptTag({ path: qunitScript });
    await page.addStyleTag({ path: qunitStyles });
    await setupEnhancedQUnitCallbacks(page);
    await installSetupScripts(page, setupFile);
    await installStyledModeHooks(page);
}
