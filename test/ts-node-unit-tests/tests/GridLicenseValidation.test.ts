import { afterEach, beforeEach, describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import GridGlobals from '../../../ts/Grid/Core/Globals.js';
import {
    getStatus,
    licenseStatus
} from '../../../ts/Grid/Pro/License/LicenseValidation.js';

/**
 * Fixed `today` for annual tests only: `getStatus` uses `new Date()` for
 * non-perpetual keys.
 */
const STATIC_DAY = new Date(Date.UTC(2026, 3, 13));

const KEY_ANNUAL_VALID = 'NMD7-4JNR-GU9L-A223-06PP-TEST';
const KEY_ANNUAL_EXPIRED = 'C2TR-Z9ZC-OL4D-A1HT-07CF-TEST';
/** Perpetual expiry date: 2025-10-21 */
const KEY_PERPETUAL_SUPPORT_ENDED = '5DR9-W35I-TMXI-P1MW-07PU-TEST';

function setBuildDateForTest(yyyyMmDd: string): void {
    (GridGlobals as { buildDate: string }).buildDate = yyyyMmDd;
}

describe('Grid Pro license validation', () => {
    afterEach((c) => {
        if ('mock' in c) {
            c.mock.timers.reset();
        }
    });

    describe('Annual', () => {
        beforeEach((t) => {
            if ('mock' in t) {
                t.mock.timers.enable({ apis: ['Date'], now: STATIC_DAY });
            }
        });

        it('valid', () => {
            strictEqual(
                getStatus(KEY_ANNUAL_VALID),
                licenseStatus.VALID
            );
        });

        it('expired', () => {
            strictEqual(
                getStatus(KEY_ANNUAL_EXPIRED),
                licenseStatus.EXPIRED
            );
        });
    });

    describe('Perpetual', () => {
        it('valid (build before support end in key)', () => {
            setBuildDateForTest('2000-01-01');
            strictEqual(
                getStatus(KEY_PERPETUAL_SUPPORT_ENDED),
                licenseStatus.VALID
            );
        });

        it('expired (build after support end in key)', () => {
            setBuildDateForTest('2026-04-13');
            strictEqual(
                getStatus(KEY_PERPETUAL_SUPPORT_ENDED),
                licenseStatus.EXPIRED
            );
        });
    });

    describe('Invalid / missing', () => {
        it('missing', () => {
            strictEqual(
                getStatus(void 0),
                licenseStatus.MISSING
            );
        });

        it('invalid (malformed)', () => {
            strictEqual(
                getStatus('not-a-grid-key'),
                licenseStatus.INVALID
            );
        });
    });
});
