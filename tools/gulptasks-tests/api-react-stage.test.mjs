import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { HELP_MESSAGE, runApiReactStage } = require('../gulptasks/api-react-stage.js');

describe('api-react-stage task', () => {
    it('documents the standalone staging options', () => {
        assert.match(HELP_MESSAGE, /--react-artifact/u);
        assert.match(HELP_MESSAGE, /--expected-react-version/u);
        assert.match(HELP_MESSAGE, /--expected-highcharts-version/u);
    });

    it('requires the artifact and both expected versions', async () => {
        await assert.rejects(
            runApiReactStage({ reactArtifact: '/tmp/artifact' }, {
                reactStatic: {}
            }),
            /requires --react-artifact, --expected-react-version, and --expected-highcharts-version/u
        );
    });

    it('verifies versions before staging into build/api', async () => {
        const calls = [];
        const verifiedArtifact = { root: '/tmp/artifact', records: [] };
        const stagedArtifact = { root: '/tmp/staged', records: [] };
        const result = await runApiReactStage(
            {
                reactArtifact: '/tmp/artifact',
                expectedReactVersion: ' 5.0.1 ',
                expectedHighchartsVersion: ' 13.1.1 '
            },
            {
                reactStatic: {
                    async verifyArtifact(directory, versions) {
                        calls.push(['verify', directory, versions]);
                        return verifiedArtifact;
                    },
                    async stageArtifact(artifact, targetRoot) {
                        calls.push(['stage', artifact, targetRoot]);
                        return stagedArtifact;
                    }
                }
            }
        );

        assert.deepEqual(calls, [
            [
                'verify',
                resolve('/tmp/artifact'),
                {
                    expectedHighchartsVersion: '13.1.1',
                    expectedReactVersion: '5.0.1'
                }
            ],
            ['stage', verifiedArtifact, resolve('build/api')]
        ]);
        assert.equal(result, stagedArtifact);
    });

    it('does not stage when verification fails', async () => {
        const calls = [];
        const verifyError = new Error('version mismatch');

        await assert.rejects(
            runApiReactStage(
                {
                    reactArtifact: '/tmp/artifact',
                    expectedReactVersion: '5.0.1',
                    expectedHighchartsVersion: '13.1.1'
                },
                {
                    reactStatic: {
                        async verifyArtifact() {
                            calls.push('verify');
                            throw verifyError;
                        },
                        async stageArtifact() {
                            calls.push('stage');
                        }
                    }
                }
            ),
            verifyError
        );

        assert.deepEqual(calls, ['verify']);
    });
});
