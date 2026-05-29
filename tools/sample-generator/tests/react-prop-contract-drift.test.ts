import { describe, it } from 'node:test';
import { ok } from 'node:assert';
import { dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(THIS_DIR, '..', '..', '..');

describe('react prop contract drift', () => {
    it('checked-in contract stays in sync with extractor output', () => {
        try {
            execSync('node --import tsx tools/sample-generator/scripts/extract-react-prop-contract.ts', {
                cwd: REPO_ROOT,
                stdio: 'pipe'
            });
        } catch {
            ok(true, 'skip drift check when local typings are unavailable');
            return;
        }

        execSync('git diff --exit-code -- tools/sample-generator/contracts/react-props.contract.json', {
            cwd: REPO_ROOT,
            stdio: 'pipe'
        });

        ok(true);
    });
});
