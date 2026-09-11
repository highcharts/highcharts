import { strictEqual, ok, deepStrictEqual, throws } from 'node:assert';
import { describe, it } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import manifest from '../../../tests/visual/samples.json';

import {
    excludedSamples,
    getVisualSampleSkipReason
} from '../../visual-test-samples.js';

const repositoryRoot = join(__dirname, '..', '..', '..');

describe('visual test sample eligibility', () => {
    it('keeps representative Karma exclusions, including extension variants', () => {
        ok(excludedSamples.includes(
            'samples/highcharts/demo/gauge-clock/demo.js'
        ));
        ok(excludedSamples.includes(
            'samples/highcharts/blog/ternary-blade-steels/demo.js'
        ));
        strictEqual(
            getVisualSampleSkipReason(
                repositoryRoot,
                'highcharts/demo/gauge-clock/demo.ts'
            ),
            'excluded from Karma visual tests'
        );
        strictEqual(
            getVisualSampleSkipReason(
                repositoryRoot,
                'samples/highcharts/blog/ternary-blade-steels/demo.mjs'
            ),
            'excluded from Karma visual tests'
        );
    });

    it('skips samples marked skipTest or requiresManualTesting', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-visual-eligibility-'));

        try {
            await mkdir(join(root, 'samples', 'skip-test'), { recursive: true });
            await writeFile(
                join(root, 'samples', 'skip-test', 'demo.details'),
                'skipTest: true\n'
            );
            await mkdir(join(root, 'samples', 'manual-test'), { recursive: true });
            await writeFile(
                join(root, 'samples', 'manual-test', 'demo.details'),
                'requiresManualTesting: true\n'
            );

            strictEqual(
                getVisualSampleSkipReason(root, 'skip-test'),
                'skipTest'
            );
            strictEqual(
                getVisualSampleSkipReason(root, 'manual-test'),
                'requiresManualTesting'
            );
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('allows samples without truthy skip metadata', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-visual-eligibility-'));

        try {
            await mkdir(join(root, 'samples', 'allowed'), { recursive: true });
            await writeFile(
                join(root, 'samples', 'allowed', 'demo.details'),
                'skipTest: false\nrequiresManualTesting: false\n'
            );
            strictEqual(
                getVisualSampleSkipReason(root, 'allowed'),
                undefined
            );
            strictEqual(
                getVisualSampleSkipReason(root, 'without-details'),
                undefined
            );
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('fails closed for malformed demo.details metadata', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-visual-eligibility-'));

        try {
            await mkdir(join(root, 'samples', 'malformed'), { recursive: true });
            await writeFile(
                join(root, 'samples', 'malformed', 'demo.details'),
                'skipTest: [\n'
            );
            throws(
                () => getVisualSampleSkipReason(root, 'malformed'),
                /unexpected end of the stream/i
            );
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('keeps the proposed initial samples eligible', () => {
        deepStrictEqual(
            manifest.map(sampleId =>
                getVisualSampleSkipReason(repositoryRoot, sampleId)
            ),
            manifest.map(() => undefined)
        );
    });
});
