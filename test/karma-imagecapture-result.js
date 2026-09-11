/* eslint-env node,es6 */

function stringify(value) {
    if (value instanceof Error) {
        return value.stack || value.message;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (value === undefined || value === null) {
        return '';
    }
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function getLogText(log) {
    const entries = Array.isArray(log) ? log : [log];
    return entries.map(stringify).filter(Boolean).join('\n');
}

function getBrowserIdentity(browser) {
    if (!browser) {
        return 'unknown';
    }
    return browser.name || browser.id || String(browser);
}

function getBrowserIdentities(browsers) {
    const identities = browsers && typeof browsers.map === 'function' ?
        browsers.map(getBrowserIdentity) : [];
    return identities.join(', ') || 'unknown';
}

function getSpecDescription(testResult) {
    const suite = Array.isArray(testResult && testResult.suite) ?
        testResult.suite : [];
    return suite.concat(testResult && testResult.description || [])
        .filter(Boolean)
        .join(' ') || 'unknown';
}

function classifySpecResult(testResult) {
    if (testResult.skipped) {
        return { type: 'skip' };
    }
    if (testResult.success) {
        return { type: 'success' };
    }

    const logText = getLogText(testResult.log);
    const pixelDiff = logText.match(
        /(?:^|\n)Different pixels\r?\n[\s\S]*?\bActual:\s*(\d+)\b/u
    );
    if (pixelDiff) {
        return {
            type: 'pixel-diff',
            pixels: parseInt(pixelDiff[1], 10)
        };
    }

    return { type: 'execution-error' };
}

function classifyRunResult(runResult) {
    if (runResult && runResult.disconnected) {
        return { type: 'browser-disconnect' };
    }
    if (runResult && runResult.error) {
        return { type: 'browser-error' };
    }
    if (
        runResult && runResult.exitCode &&
        !runResult.failed && !runResult.skipped
    ) {
        return { type: 'run-error' };
    }
    return { type: 'success' };
}

function formatSpecFailure(browser, testResult) {
    return [
        'Execution error',
        `Test: ${getSpecDescription(testResult)}`,
        `Browser: ${getBrowserIdentity(browser)}`,
        'Log:',
        getLogText(testResult && testResult.log) || '(empty)'
    ].join('\n') + '\n';
}

function formatRunFailure(browsers, runResult) {
    const result = classifyRunResult(runResult);
    const error = runResult && runResult.error;
    const log = error && error !== true ? stringify(error) :
        result.type === 'browser-disconnect' ?
            'Browser disconnected' :
            result.type === 'browser-error' ?
                'Karma reported a terminal browser error' :
                `Karma exited with code ${runResult.exitCode}`;

    return [
        result.type === 'run-error' ? 'Run error' : 'Browser error',
        `Browser: ${getBrowserIdentities(browsers)}`,
        'Log:',
        log || '(empty)'
    ].join('\n') + '\n';
}

module.exports = {
    classifyRunResult,
    classifySpecResult,
    formatRunFailure,
    formatSpecFailure
};
