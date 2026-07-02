/* *
 *
 *  License Validation for Grid Pro
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Author:
 *  - Mikkel Espolin Birkeland
 *  - Sebastian Bochan
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import Globals from '../../Core/Globals.js';
import {
    defined,
    isNumber,
    isString
} from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

const GRID_KEY_PART = /^[A-Z0-9]{4}$/;
const GRID_KEY_EPOCH = Date.UTC(2020, 0, 1);
const GRID_KEY_DOC = 'https://www.highcharts.com/docs/grid/grid-key';

/** Hostnames (exact or `*.domain`) where a Grid Key is not required. */
const GRID_KEY_WILDCARD_DOMAINS = [
    'highcharts.com',
    'jsfiddle.net',
    'stackblitz.com',
    'highcharts.com.cn'
] as const;


/* *
 *
 *  Declarations
 *
 * */

/**
 * Result of status for a Grid Key string.
 * @internal
 */
export const licenseStatus = {
    VALID: 'valid',
    INVALID: 'invalid',
    MISSING: 'missing',
    EXPIRED: 'expired'
} as const;

/** @internal */
export type LicenseStatus = (typeof licenseStatus)[keyof typeof licenseStatus];


/* *
 *
 *  Module state
 *
 * */

/** Set after the first full license check for a non-whitelisted page. */
let hasValidatedLicenseKey = false;


/* *
 *
 *  Functions
 *
 * */

/**
 * Segment 5 checksum: weighted char sum of payload, mod `36^4`, 4-char
 * upper base-36.
 * @internal
 *
 * @param integrityPayload16 segments 1–4 joined, no hyphens (16 chars).
 * @returns Four upper-case base-36 checksum characters.
 */
export function calculateChecksum(integrityPayload16: string): string {
    let sum = 0;
    for (let i = 0; i < integrityPayload16.length; i++) {
        sum += integrityPayload16.charCodeAt(i) * (i + 1);
    }
    const mod = sum % 1679616;
    let checksum = mod.toString(36).toUpperCase();

    while (checksum.length < 4) {
        checksum = '0' + checksum;
    }

    return checksum;
}

/**
 * Parse a Grid Key (`XXXX-…-WWWW`, six hyphen-separated groups of four
 * `A–Z`/`0–9`).
 * @internal
 *
 * @param key raw key.
 *
 * @returns expiry segment, end date, and checksum matches.
 */
function parseKey(
    key: string
): {
    expirySegment: string;
    endDate: Date;
    checksumMatches: boolean;
} | null {

    // 1. Normalize (trim spaces, upper case).
    const normalizedKey = key.replace(/\s/g, '').toUpperCase();
    const segments = normalizedKey.split('-');
    const expirySegment = segments[3] ?? '';
    let daysSinceEpoch = 0;
    let invalidSegment4Digits = false;

    // 2. Convert base-36 digits to days since epoch.
    for (let i = 1; i < 4; i++) {
        const codeUnit = expirySegment.charCodeAt(i);
        const digit =
            codeUnit <= 57 ? codeUnit - 48 : 10 + (codeUnit - 65);
        if (digit < 0 || digit > 35) {
            invalidSegment4Digits = true;
            break;
        }
        daysSinceEpoch = daysSinceEpoch * 36 + digit;
    }

    // 3. Calculate license expiry date.
    const endDate = new Date(GRID_KEY_EPOCH + daysSinceEpoch * 864e5);

    // 4. Checksum of joined segments 1–4.
    const integrityPayload = segments.slice(0, 4).join('');
    const expectedSegment5 = calculateChecksum(integrityPayload);
    const checksumMatches = segments[4] === expectedSegment5;

    if (
        !normalizedKey.length ||
        segments.length !== 6 ||
        !segments.every((part): boolean => GRID_KEY_PART.test(part)) ||
        !/^[AP]/.test(expirySegment) ||
        invalidSegment4Digits ||
        !isNumber(endDate.getTime())
    ) {
        return null;
    }

    return {
        expirySegment,
        endDate,
        checksumMatches
    };
}

/**
 * License status from key shape, checksum, and expiry.
 * @internal
 *
 * **Annual:** calendar check against the current date (`new Date()`).
 * **Perpetual:** the date in the key is the end of the support window;
 *   the bundle may be used for releases **on or before** that date. The
 *   reference day is only `getGridBuildDate()` from `Globals.buildDate`
 *   (`YYYY-MM-DD` in a built bundle). If that value is not set, the
 *   status is `EXPIRED` (no date substitution).
 *
 * @param key Grid Key (optional).
 * @returns License status value for `key`.
 */
export function getStatus(key?: string): LicenseStatus {

    // Check if the key is a string and not empty.
    if (!isString(key)) {
        return licenseStatus.MISSING;
    }

    const x = parseKey(key);

    // Check if the key is valid and the checksum matches.
    if (!x || !x.checksumMatches) {
        return licenseStatus.INVALID;
    }

    const isPerpetual = x.expirySegment[0] === 'P';
    const ref = isPerpetual ? getGridBuildDate() : new Date();
    // Expired: annual vs today, or perpetual build vs support end.
    if (isExpired(x.endDate, ref)) {
        return licenseStatus.EXPIRED;
    }

    // Valid key.
    return licenseStatus.VALID;
}

/**
 * Build date of this bundle (`Grid/Core/Globals` `buildDate` as
 * `YYYY-MM-DD` in production).
 * @internal
 * @returns UTC start-of-day for the `buildDate` string, or `undefined` if
 *   it is not a `YYYY-MM-DD` value. Perpetual license checks do not
 *   substitute a fallback `Date` when this is missing.
 */
export function getGridBuildDate(): Date | undefined {
    const raw = Globals.buildDate;
    if (isString(raw) && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(raw)) {
        const n = raw.split('-').map(Number);
        return new Date(Date.UTC(n[0], n[1] - 1, n[2]));
    }
    return void 0;
}

/**
 * True when `now` (UTC date) is strictly after `end` (UTC date).
 * @internal
 *
 * @param end Parsed license end date.
 * @param now Defaults to `new Date()`.
 * @returns True if the `now` UTC calendar day is strictly after `end`.
 */
export function isExpired(end: Date, now: Date = new Date()): boolean {
    const y = now.getUTCFullYear(),
        m = now.getUTCMonth(),
        d = now.getUTCDate(),
        ey = end.getUTCFullYear(),
        em = end.getUTCMonth(),
        ed = end.getUTCDate();

    return (
        y > ey ||
        (y === ey && m > em) ||
        (y === ey && m === em && d > ed)
    );
}

/**
 * Lowercased `window.location.hostname` when a location exists.
 * @internal
 * @returns Lowercased host, or `undefined` when `location` is missing.
 */
function getPageHostname(): string | undefined {
    const { win } = Globals;
    if (!defined(win.location)) {
        return void 0;
    }
    return win.location.hostname.toLowerCase();
}

/**
 * True for typical local dev hostnames.
 * @internal
 * @returns True for `localhost` and common loopback hostnames.
 */
export function isLocalhostURL(): boolean {
    const host = getPageHostname();
    if (!defined(host)) {
        return false;
    }
    return (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '[::1]' ||
        host === '::1'
    );
}

/**
 * Checks if domain is whitelisted (including subdomains).
 * @internal
 * @returns True if the current host matches a whitelisted domain (or
 *   subdomain).
 */
export function isWhitelistedURL(): boolean {
    const host = getPageHostname();
    if (!defined(host)) {
        return false;
    }

    // Support subdomains
    return GRID_KEY_WILDCARD_DOMAINS.some(
        (domain): boolean => host === domain || host.endsWith('.' + domain)
    );
}

/**
 * Checks key and errors once if not valid.
 * @internal
 *
 * @param grid Grid instance
 */
export function validate(grid: Grid): void {
    const userOptions = grid.userOptions;
    const options = grid.options;
    const userGridKey = defined(userOptions?.gridKey) ?
        userOptions.gridKey : void 0;
    const optionsGridKey = defined(options?.gridKey) ?
        options.gridKey : void 0;

    if (
        isWhitelistedURL() ||
        (
            hasValidatedLicenseKey &&
            userGridKey === optionsGridKey
        )
    ) {
        return;
    }

    const status = getStatus(optionsGridKey);

    hasValidatedLicenseKey = true;

    if (status === licenseStatus.VALID) {
        return;
    }

    let statusMsg: string;

    switch (status) {
        case licenseStatus.MISSING:
            statusMsg = 'missing a valid Grid Key.';
            break;
        case licenseStatus.EXPIRED:
            statusMsg = 'using an expired Grid Key.';
            break;
        default:
            statusMsg = 'using an invalid Grid Key.';
            break;
    }

    const message = [
        `Highcharts Grid Pro is ${statusMsg}`,
        `Please visit ${GRID_KEY_DOC} for more details.`
    ];

    /* eslint-disable no-console */
    if (isLocalhostURL()) {
        console.warn(message.join(' '));
    } else {
        console.error('**************************************************');
        console.error(message.join('\n'));
        console.error('**************************************************');
    }
    /* eslint-enable no-console */
}
