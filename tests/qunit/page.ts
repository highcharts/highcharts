import type { JSHandle, Page } from '@playwright/test';
import { glob } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { qunitScript, qunitStyles } from '~/qunit/assets.ts';
import {
    clearConsoleCapture,
    setupConsoleCapture
} from '~/qunit/utils/console-capture.ts';
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

export async function initializeWarmPage(
    page: Page,
    setupFile: string
): Promise<JSHandle<{ source: string }>> {
    await initializePage(page);
    await page.addStyleTag({ path: qunitStyles });
    await page.evaluate(() => {
        const errors: string[] = [];
        const reported = new WeakSet<Error>();
        const nativeSetTimeout = setTimeout;
        const state: Window['__qunitWarmState'] = {
            initialized: false,
            checkErrors(): void {
                if (errors.length) {
                    const error = new Error(errors.splice(0).join('\n'));
                    reported.add(error);
                    throw error;
                }
            },
            async finish(): Promise<void> {
                await new Promise(resolve => nativeSetTimeout(resolve, 0));
                state.checkErrors();
            }
        };
        window.__qunitWarmState = state;
        const recordError = (message: string): void => {
            if (!window.QUnit) {
                const location = state.sample ?
                    `After shared sample ${state.sample}` :
                    state.initialized ? 'Before the first shared sample' :
                        'During shared QUnit setup';
                errors.push(`${location}: ${message}`);
            }
        };
        window.addEventListener('error', event => {
            const error: unknown = event.error;
            if (!(error instanceof Error && reported.has(error))) {
                recordError(event.message);
            }
        });
        window.addEventListener('unhandledrejection', event => {
            if (!window.QUnit) {
                const reason: unknown = event.reason;
                // Firefox can surface a failed Playwright evaluation as an
                // unhandled rejection in the page as well.
                if (!(reason instanceof Error && reported.has(reason))) {
                    recordError(reason instanceof Error ? reason.message :
                        typeof reason === 'string' ? reason :
                            'Unhandled promise rejection');
                }
            }
        });
    });
    await installSetupScripts(page, setupFile);
    const source = await readFile(qunitScript, 'utf8');
    return page.evaluateHandle(source => {
        window.__qunitWarmState.initialized = true;
        return { source };
    }, source);
}

interface WarmSample {
    trackTimers(): void;
    reset(): void;
    restore(): void;
}

export async function prepareWarmSample(
    page: Page,
    qunitSource: JSHandle<{ source: string }>,
    samplePath: string
): Promise<JSHandle<WarmSample>> {
    clearConsoleCapture(page);
    return page.evaluateHandle(({ qunitSource, body, samplePath }) => {
        const state = window.__qunitWarmState;
        if (state.sample === undefined) {
            // Setup failures invalidate the page. Later idle errors belong
            // to the worker and must not stop the next sample from running.
            state.checkErrors();
        }
        state.sample = samplePath;
        document.body.innerHTML = `${body}<div id="demo-html"></div>`;
        document.body.style.cssText = 'margin: 8px';
        window.__qunitResults__ = undefined;
        window.__qunitBrowserLogs__ = [];
        window.__qunitConsoleErrors__ = [];

        const windowKeys = new Set(Reflect.ownKeys(window));
        const headNodes = new Set(document.head.childNodes);
        const { onerror, onunhandledrejection } = window;
        const rememberProperty = (
            target: EventTarget,
            property: string
        ): (() => void) => {
            const original = Object.getOwnPropertyDescriptor(target, property);
            return () => {
                if (original) {
                    Object.defineProperty(target, property, original);
                } else {
                    Reflect.deleteProperty(target, property);
                }
            };
        };
        const timerProperties = [
            'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
            'requestAnimationFrame', 'cancelAnimationFrame'
        ];
        const restoreTimers = timerProperties.map(name =>
            rememberProperty(window, name)
        );
        const timeoutIDs: number[] = [];
        const animationIDs: number[] = [];
        const removeListeners: (() => void)[] = [];
        for (const target of [window, document] as EventTarget[]) {
            removeListeners.push(rememberProperty(target, 'addEventListener'));
            const add = target.addEventListener.bind(target) as
                EventTarget['addEventListener'];
            const remove = target.removeEventListener.bind(target) as
                EventTarget['removeEventListener'];
            target.addEventListener = (type, listener, options) => {
                const capture =
                    typeof options === 'object' ? options?.capture : options;
                removeListeners.push(() => remove(type, listener, capture));
                add(type, listener, options);
            };
        }

        window.QUnit = {
            config: {
                autostart: false,
                testTimeout: 0,
                reporters: { perf: false }
            }
        } as typeof window.QUnit;
        const script = document.createElement('script');
        script.text = qunitSource.source;
        document.head.append(script);
        script.remove();

        const cancelTimeout = window.clearTimeout.bind(window) as
            Window['clearTimeout'];
        const cancelFrame = window.cancelAnimationFrame.bind(window) as
            Window['cancelAnimationFrame'];
        const { timers } = window.Highcharts as { timers: unknown[] };

        return {
            trackTimers(): void {
                // Start tracking after QUnit and the late-error check have
                // captured the native timer.
                const browserWindow: Window = window;
                const timeout = window.setTimeout.bind(window) as
                    Window['setTimeout'];
                const interval = window.setInterval.bind(window) as
                    Window['setInterval'];
                const frame = window.requestAnimationFrame.bind(window) as
                    Window['requestAnimationFrame'];
                browserWindow.setTimeout = (
                    handler, delay, ...args: unknown[]
                ) => {
                    const id = timeout(handler, delay, ...args);
                    timeoutIDs.push(id);
                    return id;
                };
                browserWindow.setInterval = (
                    handler, delay, ...args: unknown[]
                ) => {
                    const id = interval(handler, delay, ...args);
                    timeoutIDs.push(id);
                    return id;
                };
                window.requestAnimationFrame = callback => {
                    const id = frame(callback);
                    animationIDs.push(id);
                    return id;
                };
            },
            reset(): void {
                if (window.__qunitResults__?.status === 'failed') {
                    // Playwright discards the worker after a failure. In
                    // particular, a failed chart destroy must not run again.
                    return;
                }
                try {
                    window.resetQUnitSample();
                    for (const node of Array.from(document.head.childNodes)) {
                        if (!headNodes.has(node)) {
                            node.remove();
                        }
                    }
                } catch (error) {
                    window.QUnit.onUncaughtException(error);
                }
            },
            restore(): void {
                for (const remove of removeListeners) {
                    remove();
                }
                for (const id of timeoutIDs) {
                    cancelTimeout(id);
                }
                for (const id of animationIDs) {
                    cancelFrame(id);
                }
                // Highcharts requests a frame when its first animation is queued.
                timers.length = 0;
                for (const restore of restoreTimers) {
                    restore();
                }
                Object.assign(window, { onerror, onunhandledrejection });
                for (const key of Reflect.ownKeys(window)) {
                    if (!windowKeys.has(key)) {
                        Reflect.deleteProperty(window, key);
                    }
                }
            }
        };
    }, { qunitSource, body: sampleBody, samplePath });
}

export async function installWarmSampleHooks(
    page: Page,
    warm: JSHandle<WarmSample>
): Promise<void> {
    await setupEnhancedQUnitCallbacks(page);
    await page.evaluate(() => window.installQUnitHooks());
    await installStyledModeHooks(page);
    await warm.evaluate(sample => sample.trackTimers());
}
