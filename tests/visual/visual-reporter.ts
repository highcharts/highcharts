import type {
    Reporter,
    TestCase,
    TestResult
} from '@playwright/test/reporter';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { getLatestCommitShaSync } from '../../tools/libs/git';

type VisualTestMeta = {
    referenceGitSha: string;
    referenceVersion: string;
    browser: string;
    runId: string;
    runDate: string;
    runDateTs: number;
    gitSha: string;
    version: string;
};

type VisualTestResults = {
    meta?: VisualTestMeta;
    [samplePath: string]: number | undefined | VisualTestMeta;
};

type ReporterOptions = {
    outputFile?: string;
    projectName?: string;
};

function readExistingResults(outputFile: string): VisualTestResults {
    try {
        const existing = readFileSync(outputFile, 'utf8');
        if (!existing) {
            return {};
        }
        return JSON.parse(existing) as VisualTestResults;
    } catch {
        return {};
    }
}

function getPackageVersion(): string {
    try {
        const pkg = readFileSync('package.json', 'utf8');
        const parsed = JSON.parse(pkg) as { version?: string };
        return parsed.version ?? 'unknown';
    } catch {
        return 'unknown';
    }
}

function getRunId(): string {
    return (
        process.env.CIRCLE_BUILD_NUM ||
        process.env.GITHUB_RUN_ID ||
        process.env.BUILD_ID ||
        'local'
    );
}

function normalizeSampleName(title: string): string {
    const normalized = title.replace(/\\/g, '/');
    const samplesIndex = normalized.indexOf('/samples/');
    const trimmed = samplesIndex >= 0 ? 
        normalized.slice(samplesIndex + 9) :
        normalized;
    return trimmed.replace(/\/demo\.(js|mjs|ts)$/u, '');
}

function extractDiffPixels(result: TestResult): number | null {
    const messages = [
        result.error?.message,
        ...result.errors.map(error => error.message)
    ]
        .filter(Boolean)
        .join(' ');

    if (!messages) {
        return null;
    }

    const match = messages
        .match(/(\d+)\s*(?:pixels?|different|diff|mismatch)/iu);
    if (match?.[1]) {
        const parsed = Number.parseInt(match[1], 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
}

function getProjectName(test: TestCase): string | undefined {
    let current = test.parent;
    while (current) {
        const project = current.project?.();
        if (project?.name) {
            return project.name;
        }
        current = current.parent;
    }
    return undefined;
}

class VisualReporter implements Reporter {
    private readonly outputFile: string;
    private readonly projectName?: string;
    private readonly gitSha: string;
    private readonly version: string;
    private results: VisualTestResults;
    private hasVisualTests: boolean;

    constructor(options: ReporterOptions = {}) {
        this.outputFile = options.outputFile ?? 'test/visual-test-results.json';
        this.projectName = options.projectName ?? 'visual';
        this.gitSha = getLatestCommitShaSync() || 'unknown';
        this.version = getPackageVersion();
        this.results = {};
        this.hasVisualTests = false;
    }

    onBegin(): void {
        const now = new Date();
        const existing = readExistingResults(this.outputFile);
        const referenceGitSha =
            existing.meta?.referenceGitSha ??
            process.env.VISUAL_REFERENCE_GIT_SHA ??
            this.gitSha;
        const referenceVersion =
            existing.meta?.referenceVersion ??
            process.env.VISUAL_REFERENCE_VERSION ??
            this.version;

        this.results = existing;
        this.results.meta = {
            referenceGitSha,
            referenceVersion,
            browser: existing.meta?.browser ?? this.projectName ?? 'Playwright',
            runId: getRunId(),
            runDate: now.toISOString().slice(0, 10),
            runDateTs: now.getTime(),
            gitSha: this.gitSha,
            version: this.version
        };
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const projectName = getProjectName(test);
        if (
            this.projectName &&
            projectName &&
            projectName !== this.projectName
        ) {
            return;
        }

        this.hasVisualTests = true;

        if (this.results.meta && projectName) {
            this.results.meta.browser = projectName;
        }

        const sampleName = normalizeSampleName(test.title) || test.title;

        if (result.status === 'skipped') {
            delete this.results[sampleName];
            return;
        }

        if (result.status === 'passed') {
            this.results[sampleName] = 0;
            return;
        }

        const diffPixels = extractDiffPixels(result);
        this.results[sampleName] = diffPixels ?? 1;
    }

    onEnd(): void {
        if (!this.hasVisualTests) {
            return;
        }
        if (!this.results.meta) {
            const now = new Date();
            this.results.meta = {
                referenceGitSha: this.gitSha,
                referenceVersion: this.version,
                browser: this.projectName ?? 'Playwright',
                runId: getRunId(),
                runDate: now.toISOString().slice(0, 10),
                runDateTs: now.getTime(),
                gitSha: this.gitSha,
                version: this.version
            };
        }

        mkdirSync(dirname(this.outputFile), { recursive: true });
        writeFileSync(this.outputFile, JSON.stringify(this.results, null, ' '));
    }

    printsToStdio(): boolean {
        return false;
    }
}

export default VisualReporter;
