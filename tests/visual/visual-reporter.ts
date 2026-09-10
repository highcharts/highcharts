import type {
    FullConfig, FullResult, Reporter, Suite, TestCase
} from '@playwright/test/reporter';
import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    appendError,
    resetVisualRun,
    validateVisualRun,
    writeCandidateCompletion
} from './visual-results.ts';

export default class VisualReporter implements Reporter {
    private tests: TestCase[] = [];
    private started = false;
    private setupError?: unknown;
    private root: string;
    private referenceMode: boolean;

    constructor(options: { root?: string; referenceMode?: boolean } = {}) {
        this.root = options.root ?? process.cwd();
        this.referenceMode = options.referenceMode ??
            process.env.VISUAL_TEST_REFERENCE === '1';
    }

    onBegin(_config: FullConfig, suite: Suite): void {
        this.tests = suite.allTests().filter(test =>
            test.location.file.replace(/\\/g, '/')
                .endsWith('/visual/visual.spec.ts')
        );
    }

    onTestBegin(test: TestCase): void {
        if (!this.started && this.tests.includes(test)) {
            this.started = true;
            try {
                resetVisualRun(
                    this.root,
                    this.tests.map(test => test.title),
                    this.referenceMode
                );
            } catch (error) {
                this.setupError = error;
            }
        }
    }

    onEnd(result: FullResult): { status: 'failed' } | undefined {
        // Listing tests and running unrelated projects must not change output.
        if (!this.started) {
            return;
        }

        const ids = this.tests.map(test => test.title);
        try {
            if (this.setupError) {
                throw this.setupError;
            }
            if (
                result.status !== 'passed' || this.tests.some(test =>
                    test.results.at(-1)?.status !== 'passed'
                )
            ) {
                throw new Error('Visual run did not finish every sample.');
            }
            validateVisualRun(this.root, ids, this.referenceMode);

            if (process.env.GITHUB_STEP_SUMMARY) {
                const results = this.referenceMode ? {} : JSON.parse(
                    readFileSync(
                        join(this.root, 'test/visual-test-results.json'), 'utf8'
                    )
                ) as Record<string, number>;
                appendFileSync(process.env.GITHUB_STEP_SUMMARY, [
                    `### Visual ${this.referenceMode ? 'reference' : 'candidate'} run`,
                    '',
                    '| Sample | Numeric visual difference |',
                    '| --- | --- |',
                    ...ids.map(id =>
                        `| ${id} | ${this.referenceMode ? 'reference rendered' : results[id]} |`
                    ),
                    ''
                ].join('\n'));
            }
            if (!this.referenceMode) {
                writeCandidateCompletion(this.root);
            }
        } catch (error) {
            const message = error instanceof Error ?
                error.message : String(error);
            appendError(this.root, message);
            console.error(message);
            return { status: 'failed' };
        }
    }
}
