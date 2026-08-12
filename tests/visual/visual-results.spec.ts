import {
    appendError,
    readReference,
    recordCandidateResult,
    writeCandidateCompletion,
    writeReference
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

function referencePath(root: string): string {
    return join(root, 'samples', samplePath, 'reference.svg');
}

function candidatePath(root: string): string {
    return join(root, 'samples', samplePath, 'candidate.svg');
}

function diffPath(root: string): string {
    return join(root, 'samples', samplePath, 'diff.gif');
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
