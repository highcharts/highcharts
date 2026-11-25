import type { Page } from '@playwright/test';
import { glob } from 'glob';
import { readFile } from 'node:fs/promises';
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

export async function readQUnitSetupScripts(): Promise<string[]> {
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

    return Promise.all(scripts.map(async path => {
        const source = await readFile(path, 'utf8');
        return `${source}\n//# sourceURL=${pathToFileURL(path).href}`;
    }));
}

async function installSetupScripts(
    page: Page,
    setupScripts: string[]
): Promise<void> {
    // Send the setup together while keeping each classic script separate.
    await page.evaluate(sources => {
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
    }, setupScripts);
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
    setupScripts: string[]
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
    await installSetupScripts(page, setupScripts);
    await installStyledModeHooks(page);
}
