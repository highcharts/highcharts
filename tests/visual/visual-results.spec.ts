import {
    appendError,
    readReference,
    recordCandidateResult,
    resetVisualRun,
    writeCandidateCompletion,
    writeReference,
    validateVisualRun
} from './visual-results.ts';
import { test, expect } from '@playwright/test';
import {
    existsSync,
    mkdtempSync,
    mkdirSync,
    readFileSync,
    rmSync,
    writeFileSync
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const samplePath = 'highcharts/demo/area-missing';
const secondSamplePath = 'highcharts/demo/line-basic';
const referenceSVG = '<svg>reference</svg>';
const candidateSVG = '<svg>candidate</svg>';
const diffGif = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);

function withTemporaryRoot(run: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), 'highcharts-visual-results-'));

    try {
        run(root);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
}

function artifactPath(
    root: string,
    sample: string,
    filename: string
): string {
    return join(root, 'samples', sample, filename);
}

function referencePath(root: string, sample = samplePath): string {
    return artifactPath(root, sample, 'reference.svg');
}

function candidatePath(root: string, sample = samplePath): string {
    return artifactPath(root, sample, 'candidate.svg');
}

function diffPath(root: string, sample = samplePath): string {
    return artifactPath(root, sample, 'diff.gif');
}

function resultsPath(root: string): string {
    return join(root, 'test', 'visual-test-results.json');
}

function errorsPath(root: string): string {
    return join(root, 'test', 'visual-test-errors.log');
}

function completionPath(root: string): string {
    return join(root, 'test', 'visual-test-complete');
}

test('reference writes canonical SVG without completion', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);

        expect(readReference(root, samplePath)).toBe(referenceSVG);
        expect(readFileSync(referencePath(root), 'utf8')).toBe(referenceSVG);
        expect(existsSync(completionPath(root))).toBe(false);
    });
});

test('zero candidate result records zero and removes stale artifacts', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        mkdirSync(join(root, 'samples', samplePath), { recursive: true });
        writeFileSync(candidatePath(root), 'stale candidate');
        writeFileSync(diffPath(root), Buffer.from('stale diff'));

        recordCandidateResult(root, samplePath, 0);

        expect(readFileSync(resultsPath(root), 'utf8')).toBe(
            `{
 "${samplePath}": 0
}`
        );
        expect(existsSync(candidatePath(root))).toBe(false);
        expect(existsSync(diffPath(root))).toBe(false);
        expect(existsSync(errorsPath(root))).toBe(false);
    });
});

test('positive candidate result writes artifacts without an error', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);

        recordCandidateResult(root, samplePath, 7, candidateSVG, diffGif);

        expect(readFileSync(resultsPath(root), 'utf8')).toBe(
            `{
 "${samplePath}": 7
}`
        );
        expect(readFileSync(candidatePath(root), 'utf8')).toBe(candidateSVG);
        expect(readFileSync(diffPath(root))).toEqual(diffGif);
        expect(existsSync(errorsPath(root))).toBe(false);
    });
});

test('sample errors append to the established error log', () => {
    withTemporaryRoot(root => {
        appendError(root, 'Execution error\nTest: area-missing');
        appendError(root, 'Run error\nBrowser: Chrome');

        expect(readFileSync(errorsPath(root), 'utf8')).toBe(
            'Execution error\nTest: area-missing\n' +
            'Run error\nBrowser: Chrome\n'
        );
    });
});

test('candidate completion is explicit and reference writes omit it', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        expect(existsSync(completionPath(root))).toBe(false);

        writeCandidateCompletion(root);

        expect(readFileSync(completionPath(root), 'utf8')).toBe('');
    });
});

test('missing reference rejects candidate recording as terminal', () => {
    withTemporaryRoot(root => {
        expect(() => readReference(root, samplePath)).toThrow(
            `Missing visual reference for ${samplePath}`
        );
        expect(() => recordCandidateResult(root, samplePath, 0)).toThrow(
            `Missing visual reference for ${samplePath}`
        );
        expect(existsSync(resultsPath(root))).toBe(false);
    });
});

test('validates complete multi-sample candidate results', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        writeReference(root, secondSamplePath, referenceSVG);

        recordCandidateResult(root, samplePath, 0);
        recordCandidateResult(root, secondSamplePath, 7, candidateSVG, diffGif);

        expect(() => validateVisualRun(root, [samplePath, secondSamplePath]))
            .not.toThrow();
    });
});

test('resets shared outputs and selected stale candidate artifacts', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        mkdirSync(join(root, 'test'), { recursive: true });
        mkdirSync(join(root, 'samples', samplePath), { recursive: true });
        writeFileSync(resultsPath(root), `{ "${samplePath}": 0 }`);
        writeFileSync(errorsPath(root), 'stale error\n');
        writeFileSync(completionPath(root), '');
        writeFileSync(candidatePath(root), 'stale candidate');
        writeFileSync(diffPath(root), Buffer.from('stale diff'));

        resetVisualRun(root, [samplePath]);

        expect(existsSync(resultsPath(root))).toBe(false);
        expect(existsSync(errorsPath(root))).toBe(false);
        expect(existsSync(completionPath(root))).toBe(false);
        expect(existsSync(candidatePath(root))).toBe(false);
        expect(existsSync(diffPath(root))).toBe(false);
        expect(existsSync(referencePath(root))).toBe(true);
    });
});

test('reference reset removes selected references as well as candidate artifacts', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        writeReference(root, secondSamplePath, referenceSVG);
        writeFileSync(candidatePath(root), 'stale candidate');
        writeFileSync(diffPath(root), Buffer.from('stale diff'));

        resetVisualRun(root, [samplePath], true);

        expect(existsSync(referencePath(root))).toBe(false);
        expect(existsSync(referencePath(root, secondSamplePath))).toBe(true);
        expect(existsSync(candidatePath(root))).toBe(false);
        expect(existsSync(diffPath(root))).toBe(false);
    });
});

test('candidate validation rejects missing or unexpected results', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);

        expect(() => validateVisualRun(root, [samplePath])).toThrow(
            'exactly one result for each expected sample'
        );

        mkdirSync(join(root, 'test'), { recursive: true });
        writeFileSync(
            resultsPath(root),
            JSON.stringify({ [samplePath]: 0, [secondSamplePath]: 0 })
        );
        expect(() => validateVisualRun(root, [samplePath])).toThrow(
            'exactly one result for each expected sample'
        );
    });
});

test('validation rejects empty or duplicate expected sample IDs', () => {
    withTemporaryRoot(root => {
        expect(() => validateVisualRun(root, [])).toThrow('non-empty IDs');
        expect(() => validateVisualRun(root, [''])).toThrow('non-empty IDs');
        expect(() => validateVisualRun(root, [samplePath, samplePath]))
            .toThrow('unique');
    });
});

test('validation rejects malformed result JSON and numeric values', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        mkdirSync(join(root, 'test'), { recursive: true });

        writeFileSync(resultsPath(root), '{');
        expect(() => validateVisualRun(root, [samplePath])).toThrow();

        writeFileSync(resultsPath(root), '[]');
        expect(() => validateVisualRun(root, [samplePath])).toThrow(
            'must be a JSON object'
        );

        for (const value of ['"7"', '-1', '1.5']) {
            writeFileSync(resultsPath(root), `{ "${samplePath}": ${value} }`);
            expect(() => validateVisualRun(root, [samplePath])).toThrow(
                'non-negative integer'
            );
        }
    });
});

test('reference validation rejects omissions', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);

        expect(() =>
            validateVisualRun(root, [samplePath, secondSamplePath], true)
        ).toThrow(`Missing visual reference for ${secondSamplePath}`);
    });
});

test('positive candidate results require both visual artifacts', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        mkdirSync(join(root, 'test'), { recursive: true });
        writeFileSync(resultsPath(root), `{ "${samplePath}": 1 }`);
        writeFileSync(candidatePath(root), candidateSVG);

        expect(() => validateVisualRun(root, [samplePath])).toThrow(
            'requires candidate SVG and GIF artifacts'
        );

        writeFileSync(diffPath(root), diffGif);
        expect(() => validateVisualRun(root, [samplePath])).not.toThrow();
    });
});

test('validation rejects a non-empty error log', () => {
    withTemporaryRoot(root => {
        writeReference(root, samplePath, referenceSVG);
        recordCandidateResult(root, samplePath, 0);
        appendError(root, 'Visual test failed');

        expect(() => validateVisualRun(root, [samplePath])).toThrow(
            'errors log is non-empty'
        );
    });
});
