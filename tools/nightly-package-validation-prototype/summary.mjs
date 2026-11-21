import { appendFileSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';

if (process.argv.includes('--help')) {
    console.log('Usage: node summary.mjs');
    console.log('Reads BUILD, VALIDATION, CHECKS, EVIDENCE, RESULTS, SETUP_STEP and SETUP_ERROR from the workflow.');
    console.log('Appends the report to GITHUB_STEP_SUMMARY. Exits 1 unless validation passed.');
    process.exit(0);
}

const {
    BUILD, CHECKS, EVIDENCE, GRID_LITE, GRID_LITE_MISSING_CSS, GITHUB_REPOSITORY, GITHUB_RUN_ATTEMPT,
    GITHUB_RUN_ID, GITHUB_SERVER_URL, GITHUB_STEP_SUMMARY, RESULTS,
    SETUP_ERROR, SETUP_STEP, VALIDATION
} = process.env;

function parseResults() {
    try {
        return JSON.parse(RESULTS);
    } catch {
        return undefined;
    }
}

function shortLine(value, length) {
    if (typeof value !== 'string') {
        return '';
    }
    const line = stripVTControlCharacters(value).trim().split(/\r?\n/u, 1)[0];
    return line.length > length ? line.slice(0, length) + '…' : line;
}

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

function lanePassed(result) {
    return result?.outcome === 'passed' && result.stage === 'browser' && !Object.hasOwn(result, 'error');
}

function formatLane(label, result) {
    const outcome = shortLine(result?.outcome, 30) || 'unavailable';
    const stage = shortLine(result?.stage, 60);
    const error = shortLine(result?.error, 400);
    const lines = [
        `- ${label} <code>${escapeHtml(outcome)}</code>` +
        (stage ? ` at <code>${escapeHtml(stage)}</code>` : '')
    ];
    if (error) {
        lines.push('', `  <pre>${escapeHtml(error)}</pre>`);
    }
    return lines;
}

const results = parseResults();
const runNumber = /^[1-9]\d*$/u;
const hasReportIdentity = typeof results?.runId === 'string' && runNumber.test(results.runId) &&
    typeof results.attempt === 'string' && runNumber.test(results.attempt);
const currentReport = hasReportIdentity &&
    results.runId === GITHUB_RUN_ID && results.attempt === GITHUB_RUN_ATTEMPT;
const staleReport = hasReportIdentity && !currentReport;
const reportPassed = currentReport && results.verdict === 'passed' && results.provenance === 'nightly' &&
    lanePassed(results.control) && lanePassed(results.candidate);
const hasFailure = !staleReport &&
    [CHECKS, results?.verdict, results?.control?.outcome, results?.candidate?.outcome].includes('failed');
const hasEvidence = /^\d+$/u.test(EVIDENCE);
let verdict = 'blocked';
if (hasFailure) {
    verdict = 'failed';
} else if (BUILD === 'success' && VALIDATION === 'success' && CHECKS === 'passed' &&
    reportPassed && hasEvidence && !SETUP_STEP && !SETUP_ERROR) {
    verdict = 'passed';
}

const title = GRID_LITE === 'true' ? 'Nightly Grid Lite npm package validation' : 'Nightly npm package validation';
const evidenceLabel = staleReport ? `Validation evidence from run ${results.runId}, attempt ${results.attempt}` :
    'Validation evidence';
const evidenceRun = staleReport ? results.runId : GITHUB_RUN_ID;
const reportIssue = staleReport ? `Consumer results are from run ${results.runId}, attempt ${results.attempt}.` :
    CHECKS === 'passed' && !reportPassed ? 'Consumer report is incomplete or inconsistent.' : '';
const report = [
    `## ${title} — ${verdict}`,
    '',
    `Run ${GITHUB_RUN_ID}, attempt ${GITHUB_RUN_ATTEMPT}`,
    '',
    ...(GRID_LITE === 'true' && GRID_LITE_MISSING_CSS === 'true' ?
        ['Synthetic candidate with `css/grid-lite.css` removed.', ''] : []),
    `- ${GRID_LITE === 'true' ? 'Distribution build and pack' : 'Distribution build and upload'}: ${BUILD || 'unavailable'}`,
    ...(reportIssue ? [`- ${reportIssue}`] : []),
    `- Validation job: ${VALIDATION || 'unavailable'}`,
    `- Consumer checks: ${CHECKS || 'unavailable'}`,
    ...(SETUP_STEP ? formatLane('Setup', {
        outcome: 'blocked', stage: SETUP_STEP, error: SETUP_ERROR
    }) : []),
    ...formatLane('Stable', results?.control),
    ...formatLane('Candidate', results?.candidate),
    '',
    hasEvidence ?
        `[${evidenceLabel}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${evidenceRun}/artifacts/${EVIDENCE})` :
        'Validation evidence unavailable',
    ''
];

appendFileSync(GITHUB_STEP_SUMMARY, report.join('\n'));
process.exitCode = verdict === 'passed' ? 0 : 1;
