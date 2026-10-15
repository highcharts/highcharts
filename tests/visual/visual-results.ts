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

export type VisualReferenceFailure = {
    sample: string;
    error: string;
};

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

export function readReferenceFailures(root: string): VisualReferenceFailure[] {
    const failurePath = sharedFile(root, 'visual-reference-failures.json');
    if (!existsSync(failurePath)) {
        return [];
    }

    const failures: unknown = JSON.parse(readFileSync(failurePath, 'utf8'));
    if (
        !Array.isArray(failures) ||
        failures.some((failure: unknown) =>
            !failure || typeof failure !== 'object' ||
            !('sample' in failure) || typeof failure.sample !== 'string' ||
            !failure.sample.trim() || !('error' in failure) ||
            typeof failure.error !== 'string'
        )
    ) {
        throw new Error('Visual reference failures must be an array of sample/error objects.');
    }

    return failures as VisualReferenceFailure[];
}

export function writeReferenceFailures(
    root: string,
    failures: VisualReferenceFailure[]
): void {
    const failurePath = sharedFile(root, 'visual-reference-failures.json');
    ensureParent(failurePath);
    writeFileSync(failurePath, JSON.stringify(
        failures.map(({ sample, error }) => ({
            sample,
            error: error.split(/\r?\n/)[0]
        })).sort((a, b) => a.sample.localeCompare(b.sample)),
        null,
        ' '
    ));
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

/** Preserve a successful render when a failed reference prevents comparison. */
export function writeUncomparedCandidate(
    root: string,
    samplePath: string,
    svg: string
): void {
    const candidatePath = sampleFile(root, samplePath, 'candidate.svg');
    ensureParent(candidatePath);
    writeFileSync(candidatePath, svg);
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

    if (referenceMode) {
        rmSync(sharedFile(root, 'visual-reference-failures.json'), { force: true });
    } else {
        const resultsPath = sharedFile(root, 'visual-test-results.json');
        ensureParent(resultsPath);
        writeFileSync(resultsPath, '{}');
    }

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

    if (referenceMode) {
        expectedSamples.forEach(samplePath =>
            requireReference(root, samplePath)
        );
        return;
    }

    const failures = readReferenceFailures(root).map(({ sample }) => sample);
    if (
        new Set(failures).size !== failures.length ||
        failures.some(sample => !expectedSamples.includes(sample))
    ) {
        throw new Error('Reference failures must be unique selected sample IDs.');
    }
    for (const sample of failures) {
        const candidatePath = sampleFile(root, sample, 'candidate.svg');
        if (
            !existsSync(candidatePath) ||
            !readFileSync(candidatePath, 'utf8').trim()
        ) {
            throw new Error(`Missing rendered candidate for ${sample}.`);
        }
    }
    const comparedSamples = expectedSamples.filter(id =>
        !failures.includes(id)
    );
    comparedSamples.forEach(samplePath => requireReference(root, samplePath));

    const results = readResults(sharedFile(root, 'visual-test-results.json'));
    const resultPaths = Object.keys(results);
    if (
        resultPaths.length !== comparedSamples.length ||
        comparedSamples.some(samplePath =>
            !Object.prototype.hasOwnProperty.call(results, samplePath)
        )
    ) {
        throw new Error(
            'Visual test results must contain exactly one result for each expected sample.'
        );
    }

    for (const samplePath of comparedSamples) {
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
