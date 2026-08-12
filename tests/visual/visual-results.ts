import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
    writeFileSync
} from 'node:fs';
import { dirname, join } from 'node:path';

type VisualResults = Record<string, number>;

function sampleFile(
    root: string,
    samplePath: string,
    filename: string
): string {
    return join(root, 'samples', samplePath, filename);
}

function ensureParent(filePath: string): void {
    mkdirSync(dirname(filePath), { recursive: true });
}

function requireReference(root: string, samplePath: string): string {
    const referencePath = sampleFile(root, samplePath, 'reference.svg');

    if (!existsSync(referencePath)) {
        throw new Error(`Missing visual reference for ${samplePath}`);
    }

    return referencePath;
}

function readResults(resultsPath: string): VisualResults {
    if (!existsSync(resultsPath)) {
        return {};
    }

    const contents = readFileSync(resultsPath, 'utf8').trim();
    if (!contents) {
        return {};
    }

    const results: unknown = JSON.parse(contents);
    if (!results || typeof results !== 'object' || Array.isArray(results)) {
        throw new Error('Visual test results must be a JSON object.');
    }

    return results as VisualResults;
}

export function writeReference(
    root: string,
    samplePath: string,
    svg: string
): void {
    const referencePath = sampleFile(root, samplePath, 'reference.svg');
    ensureParent(referencePath);
    writeFileSync(referencePath, svg);
}

export function readReference(root: string, samplePath: string): string {
    return readFileSync(requireReference(root, samplePath), 'utf8');
}

export function recordCandidateResult(
    root: string,
    samplePath: string,
    pixels: number,
    candidateSVG?: string,
    diffGif?: Uint8Array
): void {
    requireReference(root, samplePath);

    if (!Number.isInteger(pixels) || pixels < 0) {
        throw new TypeError('Visual difference must be a non-negative integer.');
    }

    const candidatePath = sampleFile(root, samplePath, 'candidate.svg');
    const diffPath = sampleFile(root, samplePath, 'diff.gif');

    if (pixels === 0) {
        rmSync(candidatePath, { force: true });
        rmSync(diffPath, { force: true });
    } else {
        if (candidateSVG === undefined || diffGif === undefined) {
            throw new TypeError(
                'Positive visual differences require candidate SVG and GIF data.'
            );
        }

        ensureParent(candidatePath);
        writeFileSync(candidatePath, candidateSVG);
        writeFileSync(diffPath, diffGif);
    }

    const resultsPath = join(root, 'test', 'visual-test-results.json');
    const results = readResults(resultsPath);
    results[samplePath] = pixels;
    ensureParent(resultsPath);
    writeFileSync(resultsPath, JSON.stringify(results, null, ' '));
}

export function appendError(root: string, message: string): void {
    const errorPath = join(root, 'test', 'visual-test-errors.log');
    ensureParent(errorPath);
    appendFileSync(errorPath, message.endsWith('\n') ? message : `${message}\n`);
}

export function writeCandidateCompletion(root: string): void {
    const completionPath = join(root, 'test', 'visual-test-complete');
    ensureParent(completionPath);
    writeFileSync(completionPath, '');
}
