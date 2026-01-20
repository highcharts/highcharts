/**
 * Browser console log capture utilities for QUnit tests
 */

import type { Page } from '@playwright/test';

export interface ConsoleLogEntry {
    level: 'log' | 'error' | 'warn' | 'info' | 'debug';
    message: string;
    timestamp: number;
    args: unknown[];
    stack?: string;
}

export interface ConsoleCapture {
    logs: ConsoleLogEntry[];
    errors: ConsoleLogEntry[];
    warnings: ConsoleLogEntry[];
}

/**
 * Sets up comprehensive console log capture with filtering and formatting
 */
export async function setupConsoleCapture(page: Page): Promise<void> {
    // Listen to console events from Playwright
    page.on('console', (msg) => {
        const level = msg.type() as ConsoleLogEntry['level'];
        const text = msg.text();
        const timestamp = Date.now();
        
        // Skip QUnit's own console output to reduce noise
        if (text.includes('QUnit') && (text.includes('Running') || text.includes('Finished'))) {
            return;
        }
        
        // Add to browser-side storage
        void page.evaluate(({ level, text, timestamp }) => {
            window.__qunitBrowserLogs__ ??= [];
            window.__qunitConsoleErrors__ ??= [];
            
            const entry = `[${new Date(timestamp).toISOString()}] [${level.toUpperCase()}] ${text}`;
            window.__qunitBrowserLogs__.push(entry);
            
            if (level === 'error') {
                window.__qunitConsoleErrors__.push(entry);
            }
        }, { level, text, timestamp });
    });
    
    // Setup browser-side console interception for more detailed capture
    await page.evaluate(() => {
        // Store original console methods
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug
        };
        
        // Initialize capture arrays
        window.__qunitBrowserLogs__ ??= [];
        window.__qunitConsoleErrors__ ??= [];
        
        function formatArgs(args: unknown[]): string {
            return args.map(arg => {
                if (arg === null) return 'null';
                if (arg === undefined) return 'undefined';
                if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
                    return String(arg);
                }
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return '[object Object]';
                    }
                }
                return '[Unknown Type]';
            }).join(' ');
        }
        
        function captureConsole(
            level: string, 
            originalMethod: (...args: unknown[]) => void
        ) {
            return function (...args: unknown[]) {
                const timestamp = new Date().toISOString();
                const message = formatArgs(args);
                const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                
                // Filter out noisy or irrelevant messages
                const shouldCapture = !message.includes('QUnit') || 
                    message.includes('error') || 
                    message.includes('failed');
                
                if (shouldCapture) {
                    window.__qunitBrowserLogs__?.push(entry);
                    
                    if (level === 'error') {
                        window.__qunitConsoleErrors__?.push(entry);
                    }
                }
                
                // Call original method
                originalMethod.apply(console, args);
            };
        }
        
        // Override console methods
        console.log = captureConsole('log', originalConsole.log);
        console.error = captureConsole('error', originalConsole.error);
        console.warn = captureConsole('warn', originalConsole.warn);
        console.info = captureConsole('info', originalConsole.info);
        console.debug = captureConsole('debug', originalConsole.debug);
        
        // Capture unhandled errors with more detail
        window.addEventListener('error', (event) => {
            const timestamp = new Date().toISOString();
            const errorMsg = `[${timestamp}] [UNHANDLED ERROR] ${event.message}`;
            const location = `at ${event.filename}:${event.lineno}:${event.colno}`;
            const fullError = `${errorMsg} ${location}`;
            
            window.__qunitConsoleErrors__?.push(fullError);
            window.__qunitBrowserLogs__?.push(fullError);
            
            // Try to capture stack trace if available
            if (event.error && typeof event.error === 'object' && 'stack' in event.error) {
                const errorObj = event.error as Record<string, unknown>;
                let errorStack = 'No stack trace';
                if (errorObj.stack && typeof errorObj.stack === 'string') {
                    errorStack = errorObj.stack;
                }
                const stackTrace = `[${timestamp}] [STACK TRACE] ${errorStack}`;
                window.__qunitBrowserLogs__?.push(stackTrace);
            }
        });
        
        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            const timestamp = new Date().toISOString();
            let reason = 'Unknown reason';
            
            if (event.reason instanceof Error) {
                const stack = event.reason.stack ? '\n' + event.reason.stack : '';
                reason = `${event.reason.message}${stack}`;
            } else {
                reason = String(event.reason);
            }
            
            const errorMsg = `[${timestamp}] [UNHANDLED REJECTION] ${reason}`;
            window.__qunitConsoleErrors__?.push(errorMsg);
            window.__qunitBrowserLogs__?.push(errorMsg);
        });
    });
}

/**
 * Retrieves and formats captured console logs
 */
export async function getCapturedConsoleLogs(
    page: Page
): Promise<ConsoleCapture> {
    const [browserLogs] = await Promise.all([
        page.evaluate(() => window.__qunitBrowserLogs__ || [])
    ]);
    
    // Parse and categorize logs
    const logs: ConsoleLogEntry[] = [];
    const errors: ConsoleLogEntry[] = [];
    const warnings: ConsoleLogEntry[] = [];
    
    browserLogs.forEach(logEntry => {
        const match = logEntry.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
        if (match) {
            const [, timestamp, level, message] = match;
            const entry: ConsoleLogEntry = {
                level: level.toLowerCase() as ConsoleLogEntry['level'],
                message,
                timestamp: new Date(timestamp).getTime(),
                args: [message]
            };
            
            logs.push(entry);
            
            if (level.toLowerCase() === 'error') {
                errors.push(entry);
            } else if (level.toLowerCase() === 'warn') {
                warnings.push(entry);
            }
        }
    });
    
    return { logs, errors, warnings };
}

/**
 * Formats console logs for display in error reports
 */
export function formatConsoleLogs(capture: ConsoleCapture): string {
    if (capture.logs.length === 0) {
        return 'No console output captured';
    }
    
    const sections = [];
    
    if (capture.errors.length > 0) {
        sections.push(`🚨 Console Errors (${capture.errors.length}):`);
        sections.push(capture.errors.map(entry => `   ${entry.message}`).join('\n'));
    }
    
    if (capture.warnings.length > 0) {
        sections.push(`⚠️  Console Warnings (${capture.warnings.length}):`);
        sections.push(capture.warnings.map(entry => `   ${entry.message}`).join('\n'));
    }
    
    const otherLogs = capture.logs.filter(log => 
        log.level !== 'error' && log.level !== 'warn'
    );
    
    if (otherLogs.length > 0) {
        sections.push(`📝 Other Console Output (${otherLogs.length}):`);
        const formattedLogs = otherLogs.map(entry => {
            const level = entry.level.toUpperCase();
            return `   [${level}] ${entry.message}`;
        }).join('\n');
        sections.push(formattedLogs);
    }
    
    return sections.join('\n\n');
}

/**
 * Filters console logs to remove noise and focus on relevant information
 */
export function filterRelevantLogs(capture: ConsoleCapture): ConsoleCapture {
    const isRelevant = (entry: ConsoleLogEntry): boolean => {
        const message = entry.message.toLowerCase();
        
        // Always include errors
        if (entry.level === 'error') return true;
        
        // Include warnings that might be test-related
        if (entry.level === 'warn' && (
            message.includes('test') ||
            message.includes('assert') ||
            message.includes('qunit') ||
            message.includes('highcharts')
        )) return true;
        
        // Exclude common noise
        if (message.includes('favicon') ||
            message.includes('livereload') ||
            message.includes('websocket') ||
            message.includes('devtools')
        ) return false;
        
        // Include logs that might indicate test issues
        if (message.includes('failed') ||
            message.includes('error') ||
            message.includes('exception') ||
            message.includes('undefined') ||
            message.includes('null')
        ) return true;
        
        return false;
    };
    
    return {
        logs: capture.logs.filter(isRelevant),
        errors: capture.errors, // Always keep all errors
        warnings: capture.warnings.filter(isRelevant)
    };
}

/**
 * Clears captured console logs
 */
export async function clearConsoleLogs(page: Page): Promise<void> {
    await page.evaluate(() => {
        window.__qunitBrowserLogs__ = [];
        window.__qunitConsoleErrors__ = [];
    });
}