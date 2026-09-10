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

    for (const [samplePath, pixels] of Object.entries(results)) {
        if (!Number.isInteger(pixels) || pixels < 0) {
            throw new Error(
                `Visual test result for ${samplePath} must be a non-negative integer.`
            );
        }
    }

    return results as VisualResults;
}

function requireSamplePaths(samplePaths: string[]): string[] {
    if (
        !samplePaths.length ||
        samplePaths.some(samplePath =>
            typeof samplePath !== 'string' || !samplePath.trim()
        )
    ) {
        throw new Error('Visual sample paths must contain non-empty IDs.');
    }

    if (new Set(samplePaths).size !== samplePaths.length) {
        throw new Error('Visual sample paths must be unique.');
    }

    return samplePaths;
}

function sharedFile(root: string, filename: string): string {
    return join(root, 'test', filename);
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
    const errorPath = sharedFile(root, 'visual-test-errors.log');
    ensureParent(errorPath);
    appendFileSync(errorPath, message.endsWith('\n') ? message : `${message}\n`);
}

export function resetVisualRun(
    root: string,
    samplePaths: string[],
    referenceMode = false
): void {
    const selectedSamples = requireSamplePaths(samplePaths);

    rmSync(sharedFile(root, 'visual-test-results.json'), { force: true });
    rmSync(sharedFile(root, 'visual-test-errors.log'), { force: true });
    rmSync(sharedFile(root, 'visual-test-complete'), { force: true });

    for (const samplePath of selectedSamples) {
        rmSync(sampleFile(root, samplePath, 'candidate.svg'), { force: true });
        rmSync(sampleFile(root, samplePath, 'diff.gif'), { force: true });

        if (referenceMode) {
            rmSync(sampleFile(root, samplePath, 'reference.svg'), { force: true });
        }
    }
}

export function validateVisualRun(
    root: string,
    samplePaths: string[],
    referenceMode = false
): void {
    const expectedSamples = requireSamplePaths(samplePaths);
    const errorPath = sharedFile(root, 'visual-test-errors.log');

    if (existsSync(errorPath) && readFileSync(errorPath, 'utf8').length > 0) {
        throw new Error('Visual test errors log is non-empty.');
    }

    for (const samplePath of expectedSamples) {
        requireReference(root, samplePath);
    }

    if (referenceMode) {
        return;
    }

    const results = readResults(sharedFile(root, 'visual-test-results.json'));
    const resultPaths = Object.keys(results);
    if (
        resultPaths.length !== expectedSamples.length ||
        expectedSamples.some(samplePath =>
            !Object.prototype.hasOwnProperty.call(results, samplePath)
        )
    ) {
        throw new Error(
            'Visual test results must contain exactly one result for each expected sample.'
        );
    }

    for (const samplePath of expectedSamples) {
        const pixels = results[samplePath];
        if (pixels > 0) {
            const candidatePath = sampleFile(root, samplePath, 'candidate.svg');
            const diffPath = sampleFile(root, samplePath, 'diff.gif');
            if (!existsSync(candidatePath) || !existsSync(diffPath)) {
                throw new Error(
                    `Positive visual difference for ${samplePath} requires candidate SVG and GIF artifacts.`
                );
            }
        }
    }
}

export function writeCandidateCompletion(root: string): void {
    const completionPath = sharedFile(root, 'visual-test-complete');
    ensureParent(completionPath);
    writeFileSync(completionPath, '');
}
