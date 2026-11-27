import { deepEqual, match, strictEqual } from 'node:assert/strict';
import { test } from 'node:test';
import {
    browserCases,
    consumerStartedAttachment
} from '../nightly-package-validation-prototype/browser-cases.mjs';
import { inspectBrowserResults } from '../nightly-package-validation-prototype/browser-results.mjs';

function report(stockResults) {
    return {
        errors: [],
        suites: [{
            specs: browserCases.map(({ id }) => ({
                title: id,
                tests: [{
                    results: id === 'Stock renders the navigator' ? stockResults : [passed()]
                }]
            }))
        }]
    };
}

function passed() {
    return { status: 'passed', attachments: [{ name: consumerStartedAttachment }] };
}

test('requires one successful execution of every browser case', () => {
    deepEqual(inspectBrowserResults(0, report([passed()])), { outcome: 'passed' });
    for (const [results, diagnostic] of [
        [[], /Missing case: Stock renders the navigator/u],
        [[{ status: 'skipped' }], /Skipped case: Stock renders the navigator/u],
        [[passed(), passed()], /Duplicate case: Stock renders the navigator/u]
    ]) {
        const outcome = inspectBrowserResults(0, report(results));
        strictEqual(outcome.outcome, 'blocked');
        match(outcome.error, diagnostic);
    }
});

test('separates a failed consumer assertion from unavailable Chromium', () => {
    const failure = { status: 'failed', error: { message: 'Navigator is hidden' } };
    const assertion = inspectBrowserResults(1, report([{ ...passed(), ...failure }]));
    strictEqual(assertion.outcome, 'failed');
    match(assertion.error, /Stock renders the navigator: Navigator is hidden/u);

    const unavailable = inspectBrowserResults(1, report([{
        ...failure,
        error: { message: 'browserType.launch: Executable does not exist' }
    }]));
    strictEqual(unavailable.outcome, 'blocked');
    match(unavailable.error, /browserType.launch.*Stock renders the navigator/u);
});
