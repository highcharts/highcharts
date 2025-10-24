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
 * Validates Grid Pro Grid Keys using checksum algorithm.
 * @internal
 */
class LicenseValidation {

    /* *
     *
     *  Static Methods
     *
     * */

    /**
     * Calculate checksum for Grid Key data.
     *
     * @param data
     * First 12 characters of the Grid Key (3 groups of 4).
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
     * Validate a Grid Pro Grid Key.
     *
     * @param key
     * The Grid Key to validate.
     *
     * @return
     * True if the Grid Key is valid, false otherwise.
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
     * - *.stackblitz.com (any subdomain, any port)
     * - *.highcharts.com.cn (any subdomain, any port)
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

        const wildcardDomains = [
            'highcharts.com',
            'jsfiddle.net',
            'stackblitz.com',
            'highcharts.com.cn'
        ];

        for (const domain of wildcardDomains) {
            if (hostname === domain || hostname.endsWith(`.${domain}`)) {
                return true;
            }
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
