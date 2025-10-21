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
 * */

'use strict';

/* *
 *
 *  Class
 *
 * */

/**
 * Validates Grid Pro license keys using checksum algorithm.
 * @internal
 */
class LicenseValidation {

    /* *
     *
     *  Static Methods
     *
     * */

    /**
     * Calculate checksum for license key data.
     *
     * @param data
     * First 12 characters of the license key (3 groups of 4).
     *
     * @return
     * 4-character checksum in uppercase alphanumeric format.
     *
     * @internal
     */
    public static calculateChecksum(data: string): string {
        // Calculate weighted sum based on character position
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data.charCodeAt(i) * (i + 1);
        }

        // Take modulo to fit in 4-character space (36^4 = 1,679,616)
        const checksumValue = sum % 1679616;

        // Convert to base-36 and pad to 4 characters
        let checksum = checksumValue.toString(36).toUpperCase();
        while (checksum.length < 4) {
            checksum = '0' + checksum;
        }
        return checksum;
    }

    /**
     * Validate a Grid Pro license key.
     *
     * @param key
     * The license key to validate.
     *
     * @return
     * True if the license key is valid, false otherwise.
     *
     * @internal
     */
    public static validate(key?: string): boolean {
        // Handle non-string input (null, undefined, numbers, etc.)
        if (!key || typeof key !== 'string') {
            return false;
        }

        // Normalize: remove spaces, convert to uppercase
        key = key.replace(/\s/g, '').toUpperCase();

        // Split by dash
        const parts = key.split('-');

        if (parts.length !== 4) {
            return false;
        }

        for (const part of parts) {
            if (part.length !== 4) {
                return false;
            }
        }

        const data = parts.slice(0, 3).join('');
        const providedChecksum = parts[3];

        const calculatedChecksum = this.calculateChecksum(data);

        return providedChecksum === calculatedChecksum;
    }

    /**
     * Check if the current URL is whitelisted (no license required).
     *
     * Whitelisted URLs:
     * - localhost (any port)
     * - *.highcharts.com (any subdomain, any port)
     * - *.jsfiddle.net (any subdomain, any port)
     *
     * @return
     * True if the current URL is whitelisted, false otherwise.
     *
     * @internal
     */
    public static isWhitelistedURL(): boolean {
        // Skip in SSR environments (no window object)
        if (typeof window === 'undefined') {
            return false;
        }

        // Get hostname (already excludes port)
        const hostname = window.location.hostname.toLowerCase();

        // Exact match: localhost
        if (hostname === 'localhost') {
            return true;
        }

        // Wildcard match: *.highcharts.com
        if (
            hostname === 'highcharts.com' ||
            hostname.endsWith('.highcharts.com')
        ) {
            return true;
        }

        // Wildcard match: *.jsfiddle.net
        if (
            hostname === 'jsfiddle.net' ||
            hostname.endsWith('.jsfiddle.net')
        ) {
            return true;
        }

        return false;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default LicenseValidation;
