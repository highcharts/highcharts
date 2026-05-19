/**
 * Timeout handling utilities for QUnit tests
 */

import type { Page } from '@playwright/test';

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
            
            return Promise.race([
                operation(),
                new Promise<never>((_, reject) => {
                    setTimeout(() => {
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
                            });
                    }, timeout);
                })
            ]);
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
            return await page.evaluate(() => {
                const logs = window.__qunitBrowserLogs__ || [];
                return logs.slice(-10); // Last 10 log entries
            });
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
    timeout: number = 30000
): Promise<unknown> {
    const context: TimeoutContext = {
        testPath,
        startTime: Date.now(),
        timeout,
        phase: 'test-execution'
    };
    
    const handler = createTimeoutHandler(context);
    
    return handler.waitWithTimeout(page, async () => {
        // Wait for QUnit to complete with periodic activity checks
        return await page.waitForFunction(
            () => {
                // Update last activity timestamp
                const results = window.__qunitResults__;
                if (results) {
                    return results;
                }
                
                // Check if QUnit is still active
                const qunit = window.QUnit;
                if (qunit) {
                    // QUnit is loaded and potentially running
                    return null;
                }
                
                // If QUnit isn't even loaded, that's a problem
                throw new Error('QUnit not loaded');
            },
            { timeout: timeout }
        );
    });
}

/**
 * Waits for script loading with timeout handling
 */
export async function waitForScriptLoadWithTimeout(
    page: Page,
    scriptPromise: Promise<unknown>,
    testPath: string,
    timeout: number = 10000
): Promise<unknown> {
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
): Promise<{ recovered: boolean; message: string }> {
    try {
        const { context, diagnostics } = error;
        
        // Strategy 1: Check if QUnit is just slow but still running
        if (
            diagnostics.qunitState.isRunning && 
            diagnostics.domState.qunitContainer
        ) {
            // Give it a bit more time
            try {
                await page.waitForFunction(
                    () => window.__qunitResults__,
                    { timeout: 5000 }
                );
                return { 
                    recovered: true, 
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
                recovered: false, 
                message: 'Script loading failed - test script not found in DOM' 
            };
        }
        
        // Strategy 3: Check for QUnit initialization issues
        if (!diagnostics.domState.qunitContainer) {
            return { 
                recovered: false, 
                message: 'QUnit container not found - QUnit may not be properly initialized' 
            };
        }
        
        // Strategy 4: Check for Highcharts loading issues
        const isHighchartsTest = context.testPath.includes('highcharts');
        if (!diagnostics.domState.highchartsLoaded && isHighchartsTest) {
            return { 
                recovered: false, 
                message: 'Highcharts not loaded - required dependency missing' 
            };
        }
        
        return { 
            recovered: false, 
            message: 'No recovery strategy applicable' 
        };
        
    } catch (recoveryError) {
        const errorMsg = recoveryError instanceof Error ? 
            recoveryError.message : 
            String(recoveryError);
        return { 
            recovered: false, 
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