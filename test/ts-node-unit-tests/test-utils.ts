import type { AssertionError } from 'assert';
import { message, failure, warn } from '../../tools/gulptasks/lib/log.js';

const { argv } = process;

/**
 * Logs the output if `argv.verbose` is given
 * @param text
 */
export function describe(...text: string[]): void {
    if (argv.includes('--verbose')) {
        message(text);
    }
}

/**
 * Handles logging a failed test to the console.
 * @param error
 * The error object
 */
export function reportError(error: (AssertionError & Error)): void {
    const { actual, expected, code, message: errorMessage, stack } = error;

    const printArrayOrString = (array: string | []) =>
        (Array.isArray(array) ? JSON.stringify(array, undefined, 4) : array);

    failure(`${code} ${errorMessage}
        ${stack?.split('\n')[1]}

Got: ${printArrayOrString(actual as any)}

Expected: ${printArrayOrString(expected as any)}
`);
}
