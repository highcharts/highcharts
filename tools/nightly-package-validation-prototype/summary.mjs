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

const hasEvidence = /^\d+$/u.test(EVIDENCE);
let verdict = 'blocked';
if (BUILD === 'success' && VALIDATION === 'success' && CHECKS === 'passed' && hasEvidence) {
    verdict = 'passed';
} else if (CHECKS === 'failed') {
    verdict = 'failed';
}

const results = parseResults();
const title = GRID_LITE === 'true' ? 'Nightly Grid Lite npm package validation' : 'Nightly npm package validation';
const report = [
    `## ${title} — ${verdict}`,
    '',
    `Run ${GITHUB_RUN_ID}, attempt ${GITHUB_RUN_ATTEMPT}`,
    '',
    ...(GRID_LITE === 'true' && GRID_LITE_MISSING_CSS === 'true' ?
        ['Synthetic candidate with `css/grid-lite.css` removed.', ''] : []),
    `- ${GRID_LITE === 'true' ? 'Distribution build and pack' : 'Distribution build and upload'}: ${BUILD || 'unavailable'}`,
    `- Validation job: ${VALIDATION || 'unavailable'}`,
    `- Consumer checks: ${CHECKS || 'unavailable'}`,
    ...(SETUP_STEP ? formatLane('Setup', {
        outcome: 'blocked', stage: SETUP_STEP, error: SETUP_ERROR
    }) : []),
    ...formatLane('Stable', results?.control),
    ...formatLane('Candidate', results?.candidate),
    '',
    hasEvidence ?
        `[Validation evidence](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}/artifacts/${EVIDENCE})` :
        'Validation evidence unavailable',
    ''
];

appendFileSync(GITHUB_STEP_SUMMARY, report.join('\n'));
process.exitCode = verdict === 'passed' ? 0 : 1;
