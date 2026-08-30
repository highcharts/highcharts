import { loadHCWithModules } from '../test-utils';
import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

describe('Highcharts.pad', () => {
    const Highcharts = loadHCWithModules();
    const pad = Highcharts.pad as (number: number, length?: number, padder?: string) => string;

    it('should pad a single digit number to two digits (default)', () => {
        strictEqual(pad(1), '01');
    });

    it('should pad a single digit number to three digits', () => {
        strictEqual(pad(1, 3), '001');
    });

    it('should not pad if the number is already the requested length', () => {
        strictEqual(pad(10, 2), '10');
    });

    it('should not pad (and NOT CRASH) if the number is longer than the requested length', () => {
        strictEqual(pad(100, 2), '100');
        strictEqual(pad(1000, 2), '1000');
    });

    it('should use a custom padder', () => {
        strictEqual(pad(5, 2, ' '), ' 5');
    });

    it('should handle negative numbers by padding before the sign (existing behavior)', () => {
        // Based on the implementation: new Array(...).join(padder) + number
        // pad(-1, 2) -> "0-1"
        strictEqual(pad(-1, 2), '0-1');
    });
});
