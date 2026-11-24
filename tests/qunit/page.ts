import type { JSHandle, Page } from '@playwright/test';
import { glob } from 'glob';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { qunitScript, qunitStyles } from '~/qunit/assets.ts';
import { clearConsoleLogs, setupConsoleCapture } from '~/qunit/utils/console-capture.ts';
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
            config: { autostart: false }
        } as typeof window.QUnit;
    });
    await page.addScriptTag({ path: qunitScript });
    await page.addStyleTag({ path: qunitStyles });
    await setupEnhancedQUnitCallbacks(page);
    await installSetupScripts(page, setupScripts);
    await installStyledModeHooks(page);
}

export async function initializeWarmPage(
    page: Page,
    setupScripts: string[]
): Promise<void> {
    await initializePage(page);
    await page.addStyleTag({ path: qunitStyles });
    await installSetupScripts(page, setupScripts);
}

export async function readQUnitSource(): Promise<string> {
    const source = await readFile(qunitScript, 'utf8');
    return `${source}\n//# sourceURL=${pathToFileURL(qunitScript).href}`;
}

export function scopeWarmSample(source: string): string {
    // Function scope keeps declarations local while preserving directives.
    return `(function () {\n${source}\n}).call(window);`;
}

export async function prepareWarmSample(
    page: Page,
    source: string
): Promise<JSHandle<() => void>> {
    await clearConsoleLogs(page);

    return page.evaluateHandle(({ source, body }) => {
        document.body.innerHTML = `${body}<div id="demo-html"></div>`;
        document.body.style.cssText = 'margin: 8px';
        window.__qunitResults__ = undefined;
        window.QUnit = {
            config: { autostart: false }
        } as typeof window.QUnit;

        const headNodes = new Set(document.head.childNodes);
        const originalOnError = window.onerror;
        const originalAddEventListener = Object.getOwnPropertyDescriptor(
            window,
            'addEventListener'
        );
        const addEventListener = window.addEventListener.bind(window) as
            Window['addEventListener'];
        const listeners: Parameters<Window['addEventListener']>[] = [];

        // The browser distribution installs a global rejection listener.
        // Remember QUnit's registrations so they leave with this instance.
        window.addEventListener = (
            ...args: Parameters<Window['addEventListener']>
        ) => {
            listeners.push(args);
            addEventListener(...args);
        };
        const script = document.createElement('script');
        script.text = source;
        try {
            document.head.append(script);
        } finally {
            script.remove();
            if (originalAddEventListener) {
                Object.defineProperty(
                    window,
                    'addEventListener',
                    originalAddEventListener
                );
            } else {
                Reflect.deleteProperty(window, 'addEventListener');
            }
        }

        return (): void => {
            for (const args of listeners) {
                window.removeEventListener(...args);
            }
            window.onerror = originalOnError;
            Reflect.deleteProperty(window, 'QUnit');

            try {
                window.resetQUnitSample();
            } finally {
                for (const node of Array.from(document.head.childNodes)) {
                    if (!headNodes.has(node)) {
                        node.remove();
                    }
                }
            }
        };
    }, { source, body: sampleBody });
}

export async function installWarmSampleHooks(page: Page): Promise<void> {
    await setupEnhancedQUnitCallbacks(page);
    await page.evaluate(() => window.installQUnitHooks());
    await installStyledModeHooks(page);
}
