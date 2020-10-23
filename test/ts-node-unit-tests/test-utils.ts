import { message } from '../../tools/gulptasks/lib/log.js';

const { argv } = process;

/**
 * Logs the output if `argv.verbose` is given
 * @param text
 */
export function describe(...text: string[]): void {
    if (argv.includes('--verbose')) message(text);
};