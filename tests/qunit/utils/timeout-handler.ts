/**
 * Timeout handling utilities for QUnit tests
 */

import type { Page } from '@playwright/test';
import type { QUnitTestCounts } from '~/qunit/types.ts';
import { getCapturedConsoleLogs } from '~/qunit/utils/console-capture.ts';

export interface TimeoutContext {
    testPath: string;
    startTime: number;
    timeout: number;
    phase: 'setup' | 'script-load' | 'test-execution' | 'cleanup';
    lastActivity?: number;
}

export interface TimeoutError extends Error {
    context: TimeoutContext;
    diagnostics: TimeoutDiagnostics;
}

export interface TimeoutDiagnostics {
    browserState: {
        url: string;
        title: string;
        readyState: string;
    };
    qunitState: {
        isRunning: boolean;
        testsCompleted: number;
        testsTotal: number;
        currentTest?: string;
    };
    networkActivity: string[];
    consoleActivity: string[];
    domState: {
        qunitContainer: boolean;
        testScript: boolean;
        highchartsLoaded: boolean;
    };
}

/**
 * Creates a timeout handler with enhanced diagnostics
 */
export function createTimeoutHandler(context: TimeoutContext) {
    const handler = {
        context,
        
        async waitWithTimeout<T>(
            page: Page,
            operation: () => Promise<T>,
            customTimeout?: number
        ): Promise<T> {
            const timeout = customTimeout || context.timeout;
            
            let timer: ReturnType<typeof setTimeout>;
            return Promise.race([
                operation(),
                new Promise<never>((_, reject) => {
                    timer = setTimeout(() => {
                        void handler.captureDiagnostics(page)
                            .then(diagnostics => {
                                const phase = context.phase;
                                const phaseMsg = `Timeout after ${timeout}ms in phase: ${phase}`;
                                const testMsg = `Test: ${context.testPath}`;
                                const diagText = handler.formatDiagnostics(
                                    diagnostics
                                );
                                const diagMsg = `Diagnostics:\n${diagText}`;
                                const errorMsg = `${phaseMsg}\n${testMsg}\n${diagMsg}`;
                                const error = new Error(
                                    errorMsg
                                ) as TimeoutError;
                                
                                error.context = context;
                                error.diagnostics = diagnostics;
                                reject(error);
                            }).catch(reject);
                    }, timeout);
                })
            ]).finally(() => clearTimeout(timer));
        },
        
        async captureDiagnostics(page: Page): Promise<TimeoutDiagnostics> {
            try {
                const [browserState, qunitState, domState] = await Promise.all([
                    handler.captureBrowserState(page),
                    handler.captureQUnitState(page),
                    handler.captureDOMState(page)
                ]);
                
                const [networkActivity, consoleActivity] = await Promise.all([
                    handler.captureNetworkActivity(),
                    handler.captureConsoleActivity(page)
                ]);
                
                return {
                    browserState,
                    qunitState,
                    networkActivity,
                    consoleActivity,
                    domState
                };
            } catch (error) {
                const errorMsg = error instanceof Error ? 
                    error.message : String(error);
                return {
                    browserState: { 
                        url: 'unknown', 
                        title: 'unknown', 
                        readyState: 'unknown' 
                    },
                    qunitState: { 
                        isRunning: false, 
                        testsCompleted: 0, 
                        testsTotal: 0 
                    },
                    networkActivity: [`Error capturing diagnostics: ${errorMsg}`],
                    consoleActivity: [],
                    domState: { 
                        qunitContainer: false, 
                        testScript: false, 
                        highchartsLoaded: false 
                    }
                };
            }
        },
        
        async captureBrowserState(page: Page) {
            return await page.evaluate(() => ({
                url: window.location.href,
                title: document.title,
                readyState: document.readyState
            }));
        },
        
        async captureQUnitState(page: Page) {
            return await page.evaluate(() => {
                const results = window.__qunitResults__;
                
                return {
                    isRunning: !results, // If results exist, QUnit is done
                    testsCompleted: (results?.passed || 0) 
                        + (results?.failed || 0),
                    testsTotal: results?.total || 0,
                    currentTest: 'unknown'
                };
            });
        },
        
        async captureDOMState(page: Page) {
            return await page.evaluate(() => ({
                qunitContainer: !!document.getElementById('qunit'),
                testScript: !!document.getElementById('test-script'),
                highchartsLoaded: typeof window.Highcharts !== 'undefined'
            }));
        },
        
        captureNetworkActivity(): Promise<string[]> {
            // This would require setting up network listeners beforehand
            // For now, return basic info
            const msg = 'Network activity monitoring not implemented';
            return Promise.resolve([msg]);
        },
        
        async captureConsoleActivity(page: Page): Promise<string[]> {
            const { logs } = await getCapturedConsoleLogs(page);
            return logs.slice(-10).map(log => log.message);
        },
        
        formatDiagnostics(diagnostics: TimeoutDiagnostics): string {
            const sections = [
                '🌐 Browser State:',
                `   URL: ${diagnostics.browserState.url}`,
                `   Title: ${diagnostics.browserState.title}`,
                `   Ready State: ${diagnostics.browserState.readyState}`,
                '',
                '🧪 QUnit State:',
                `   Running: ${diagnostics.qunitState.isRunning}`,
                `   Completed: ${diagnostics.qunitState.testsCompleted}/${diagnostics.qunitState.testsTotal}`,
                `   Current Test: ${diagnostics.qunitState.currentTest || 'unknown'}`,
                '',
                '🏗️  DOM State:',
                `   QUnit Container: ${diagnostics.domState.qunitContainer}`,
                `   Test Script: ${diagnostics.domState.testScript}`,
                `   Highcharts Loaded: ${diagnostics.domState.highchartsLoaded}`,
            ];
            
            if (diagnostics.consoleActivity.length > 0) {
                sections.push(
                    '',
                    '📝 Recent Console Activity:',
                    ...diagnostics.consoleActivity.map(log => `   ${log}`)
                );
            }
            
            if (diagnostics.networkActivity.length > 0) {
                sections.push(
                    '',
                    '🌐 Network Activity:',
                    ...diagnostics.networkActivity.map(activity => `   ${activity}`)
                );
            }
            
            return sections.join('\n');
        }
    };
    
    return handler;
}

/**
 * Waits for QUnit results with enhanced timeout handling
 */
export async function waitForQUnitWithTimeout(
    page: Page, 
    testPath: string, 
    timeout: number
): Promise<QUnitTestCounts> {
    const context: TimeoutContext = {
        testPath,
        startTime: Date.now(),
        timeout,
        phase: 'test-execution'
    };
    
    const handler = createTimeoutHandler(context);
    
    return handler.waitWithTimeout(page, () => readQUnitResults(page));
}

async function readQUnitResults(
    page: Page,
    timeout?: number
): Promise<QUnitTestCounts> {
    const results = await page.waitForFunction(
        () => window.__qunitResults__,
        undefined,
        { timeout }
    );
    try {
        return await results.jsonValue();
    } finally {
        await results.dispose();
    }
}

/**
 * Waits for script loading with timeout handling
 */
export async function waitForScriptLoadWithTimeout<T>(
    page: Page,
    scriptPromise: Promise<T>,
    testPath: string,
    timeout: number = 10000
): Promise<T> {
    const context: TimeoutContext = {
        testPath,
        startTime: Date.now(),
        timeout,
        phase: 'script-load'
    };
    
    const handler = createTimeoutHandler(context);
    
    return handler.waitWithTimeout(page, () => scriptPromise, timeout);
}

/**
 * Implements graceful timeout recovery strategies
 */
export async function attemptTimeoutRecovery(
    page: Page,
    error: TimeoutError
): Promise<{ results?: QUnitTestCounts; message: string }> {
    try {
        const { context, diagnostics } = error;
        
        // QUnit may also have completed while diagnostics were collected.
        if (
            context.phase === 'test-execution' &&
            diagnostics.domState.qunitContainer
        ) {
            // Give it a bit more time
            try {
                const results = await readQUnitResults(page, 5000);
                return {
                    results,
                    message: 'QUnit completed after extended wait'
                };
            } catch {
                // Continue to other strategies
            }
        }
        
        // Strategy 2: Check for script loading issues
        const isScriptLoad = context.phase === 'script-load';
        if (isScriptLoad && !diagnostics.domState.testScript) {
            return { 
                message: 'Script loading failed - test script not found in DOM' 
            };
        }
        
        // Strategy 3: Check for QUnit initialization issues
        if (!diagnostics.domState.qunitContainer) {
            return { 
                message: 'QUnit container not found - QUnit may not be properly initialized' 
            };
        }
        
        // Strategy 4: Check for Highcharts loading issues
        const isHighchartsTest = context.testPath.includes('highcharts');
        if (!diagnostics.domState.highchartsLoaded && isHighchartsTest) {
            return { 
                message: 'Highcharts not loaded - required dependency missing' 
            };
        }
        
        return { 
            message: 'No recovery strategy applicable' 
        };
        
    } catch (recoveryError) {
        const errorMsg = recoveryError instanceof Error ? 
            recoveryError.message : 
            String(recoveryError);
        return { 
            message: `Recovery attempt failed: ${errorMsg}` 
        };
    }
}

/**
 * Creates a timeout error with enhanced context
 */
export function createTimeoutError(
    message: string,
    context: TimeoutContext,
    diagnostics: TimeoutDiagnostics
): TimeoutError {
    const error = new Error(message) as TimeoutError;
    error.context = context;
    error.diagnostics = diagnostics;
    return error;
}
