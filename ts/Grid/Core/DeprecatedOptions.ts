/* *
 *
 *  Grid deprecated options runtime helper
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { Options } from './Options';

import { error } from '../../Core/Utilities.js';
import { deprecatedOptionsMetadata } from './DeprecatedOptionsMetadata.js';


/* *
 *
 *  Constants
 *
 * */

const API_BASE_URL = 'https://api.highcharts.com/grid/';
const deprecatedOptionPaths = Object.keys(deprecatedOptionsMetadata).sort();


/* *
 *
 *  Functions
 *
 * */

/**
 * Ensures that free-form deprecation text ends with sentence punctuation.
 *
 * @param text
 * Deprecation text to normalize.
 */
function ensureSentence(text: string): string {
    const trimmedText = text.trim();

    if (!trimmedText) {
        return trimmedText;
    }

    if (/[.!?]$/u.test(trimmedText)) {
        return trimmedText;
    }

    return `${trimmedText}.`;
}

/**
 * Checks whether a nested option path exists in an options object.
 *
 * @param source
 * Source object or array to inspect.
 *
 * @param pathSegments
 * Dot-path segments to traverse.
 *
 * @param segmentIndex
 * Current segment index during recursive traversal.
 */
function hasOptionPath(
    source: unknown,
    pathSegments: Array<string>,
    segmentIndex = 0
): boolean {
    if (segmentIndex >= pathSegments.length) {
        return true;
    }

    if (!source || typeof source !== 'object') {
        return false;
    }

    if (Array.isArray(source)) {
        return source.some((item): boolean =>
            hasOptionPath(item, pathSegments, segmentIndex)
        );
    }

    const segment = pathSegments[segmentIndex];
    const sourceRecord = source as Record<string, unknown>;

    if (!Object.prototype.hasOwnProperty.call(sourceRecord, segment)) {
        return false;
    }

    return hasOptionPath(
        sourceRecord[segment],
        pathSegments,
        segmentIndex + 1
    );
}

/**
 * Finds deprecated option paths used in the provided options object.
 *
 * @param options
 * Grid options to inspect.
 */
export function findMatchingDeprecatedOptionPaths(
    options: Partial<Options>
): string[] {
    return deprecatedOptionPaths.filter((path): boolean =>
        hasOptionPath(options, path.split('.'))
    );
}

/**
 * Builds a warning message for a deprecated Grid option path.
 *
 * @param path
 * Deprecated option path.
 */
export function getDeprecatedOptionMessage(path: string): string {
    if (
        !Object.prototype.hasOwnProperty.call(
            deprecatedOptionsMetadata,
            path
        )
    ) {
        return '';
    }

    const metadata = deprecatedOptionsMetadata[path];

    const messageParts = [
        `Option "${path}" has been deprecated.`
    ];

    if (metadata) {
        messageParts.push(ensureSentence(metadata));
    }

    messageParts.push(`Read more at ${API_BASE_URL}${path}`);

    return messageParts.join(' ');
}

/**
 * Emits warnings for deprecated Grid options used in the provided object.
 *
 * @param options
 * Grid options to inspect.
 */
export function warnIfDeprecatedOptions(
    options: Partial<Options>
): void {
    for (const path of findMatchingDeprecatedOptionPaths(options)) {
        error(getDeprecatedOptionMessage(path), false);
    }
}
