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
import type {
    DeprecatedOptionMatchSegment,
    DeprecatedOptionMetadata
} from './DeprecatedOptionsMetadata';
import type { DeepPartial } from '../../Shared/Types';

import { error } from '../../Core/Utilities.js';
import { deprecatedOptionsMetadata } from './DeprecatedOptionsMetadata.js';


/* *
 *
 *  Constants
 *
 * */

const API_BASE_URL = 'https://api.highcharts.com/grid/';


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
 * Checks whether a deprecated-option match pattern is used in an options
 * object.
 *
 * @param source
 * Source object or array to inspect.
 *
 * @param pathSegments
 * Property and discriminator segments to traverse.
 *
 * @param segmentIndex
 * Current segment index during recursive traversal.
 */
export function matchesDeprecatedOption(
    source: unknown,
    pathSegments: Array<DeprecatedOptionMatchSegment>,
    segmentIndex = 0
): boolean {
    if (segmentIndex >= pathSegments.length) {
        return true;
    }

    const segment = pathSegments[segmentIndex];

    if (!source || typeof source !== 'object') {
        return false;
    }

    if (Array.isArray(source)) {
        return source.some((item): boolean =>
            matchesDeprecatedOption(item, pathSegments, segmentIndex)
        );
    }

    const sourceRecord = source as Record<string, unknown>;

    if (segment.kind === 'discriminator') {
        if (!Object.prototype.hasOwnProperty.call(sourceRecord, segment.name)) {
            return !!segment.allowUndefined &&
                matchesDeprecatedOption(
                    source,
                    pathSegments,
                    segmentIndex + 1
                );
        }

        return sourceRecord[segment.name] === segment.value &&
            matchesDeprecatedOption(source, pathSegments, segmentIndex + 1);
    }

    if (!Object.prototype.hasOwnProperty.call(sourceRecord, segment.name)) {
        return false;
    }

    return matchesDeprecatedOption(
        sourceRecord[segment.name],
        pathSegments,
        segmentIndex + 1
    );
}

/**
 * Finds deprecated options used in the provided options object.
 *
 * @param options
 * Grid options to inspect.
 */
export function findMatchingDeprecatedOptions(
    options: DeepPartial<Options>
): Array<DeprecatedOptionMetadata> {
    return deprecatedOptionsMetadata.filter(
        (metadata): boolean => (
            matchesDeprecatedOption(options, metadata.segments)
        )
    );
}

/**
 * Builds a warning message for a deprecated Grid option.
 *
 * @param metadata
 * Deprecated option metadata.
 */
export function getDeprecatedOptionMessage(
    metadata: DeprecatedOptionMetadata
): string {
    const messageParts = [
        `Option "${metadata.runtimePath}" has been deprecated.`
    ];

    if (metadata.text) {
        messageParts.push(ensureSentence(metadata.text));
    }

    messageParts.push(`Read more at ${API_BASE_URL}${metadata.docsPath}`);

    return messageParts.join(' ');
}

/**
 * Emits warnings for deprecated Grid options used in the provided object.
 *
 * @param options
 * Grid options to inspect.
 */
export function warnIfDeprecatedOptions(
    options: DeepPartial<Options>
): void {
    for (const metadata of findMatchingDeprecatedOptions(options)) {
        error(getDeprecatedOptionMessage(metadata), false);
    }
}
