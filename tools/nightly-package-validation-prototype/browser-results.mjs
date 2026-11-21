import { browserCases, consumerStartedAttachment } from './browser-cases.mjs';

function collectExecutions(suites, executions) {
    for (const suite of suites) {
        for (const { title, tests } of suite.specs ?? []) {
            const results = executions.get(title) ?? [];
            results.push(...tests.flatMap(test => test.results ?? []));
            executions.set(title, results);
        }
        collectExecutions(suite.suites ?? [], executions);
    }
}

function errorLine(error) {
    return (error?.message ?? error?.value ?? '')
        .replace(/\x1b\[[0-9;]*m/gu, '')
        .split('\n')
        .find(line => line.trim())?.trim();
}

export function inspectBrowserResults(status, report) {
    const executions = new Map();
    collectExecutions(report.suites ?? [], executions);
    const incomplete = [];
    let assertionFailure;
    let setupError;
    if (browserCases.length === 0) {
        incomplete.push('No browser cases are registered');
    }

    for (const { id } of browserCases) {
        const results = executions.get(id) ?? [];
        executions.delete(id);
        if (results.length === 0) {
            incomplete.push(`Missing case: ${id}`);
        } else if (results.length > 1) {
            incomplete.push(`Duplicate case: ${id} (${results.length} executions)`);
        }
        for (const result of results) {
            const started = result.attachments?.some(({ name }) => name === consumerStartedAttachment);
            const diagnostic = errorLine(result.error ?? result.errors?.[0]);
            if (result.status === 'skipped') {
                incomplete.push(`Skipped case: ${id}`);
            } else if (started && ['failed', 'timedOut'].includes(result.status)) {
                assertionFailure ??= diagnostic ? `${id}: ${diagnostic}` : id;
            } else if (!started || result.status !== 'passed') {
                setupError ??= diagnostic;
                incomplete.push(`Incomplete case: ${id}`);
            }
        }
    }

    for (const id of executions.keys()) {
        incomplete.push(`Unregistered case: ${id}`);
    }
    if (assertionFailure) {
        return {
            outcome: 'failed',
            error: [`Chromium consumer assertion failed: ${assertionFailure}`, ...incomplete].join('; ')
        };
    }
    if (incomplete.length || report.errors?.length || status !== 0) {
        const diagnostic = setupError ?? report.errors?.map(errorLine).find(Boolean);
        return {
            outcome: 'blocked',
            error: [diagnostic, ...incomplete].filter(Boolean).join('; ') ||
                'Chromium consumer checks did not complete'
        };
    }
    return { outcome: 'passed' };
}
