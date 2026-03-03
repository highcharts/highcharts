import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.basicOperation(`<`)', () => {
    describe('boolean comparisons', () => {
        it('FALSE < FALSE should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('FALSE < FALSE', false)),
                false,
                'Formula `FALSE < FALSE` test should return FALSE.'
            );
        });

        it('FALSE < TRUE should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('FALSE < TRUE', false)),
                true,
                'Formula `FALSE < TRUE` test should return TRUE.'
            );
        });

        it('TRUE < FALSE should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('TRUE < FALSE', false)),
                false,
                'Formula `TRUE < FALSE` test should return FALSE.'
            );
        });

        it('TRUE < TRUE should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('TRUE < TRUE', false)),
                false,
                'Formula `TRUE < TRUE` test should return FALSE.'
            );
        });

        it('FALSE < 0 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('FALSE < 0', false)),
                false,
                'Formula `FALSE < 0` test should return FALSE.'
            );
        });

        it('FALSE < "0" should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('FALSE < "0"', false)),
                false,
                'Formula `FALSE < "0"` test should return FALSE.'
            );
        });

        it('TRUE < 1 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('TRUE < 1', false)),
                false,
                'Formula `TRUE < 1` test should return FALSE.'
            );
        });

        it('TRUE < "1" should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('TRUE < "1"', false)),
                false,
                'Formula `TRUE < "1"` test should return FALSE.'
            );
        });
    });

    describe('number comparisons', () => {
        it('0 < 0 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('0 < 0', false)),
                false,
                'Formula `0 < 0` test should return FALSE.'
            );
        });

        it('0 < 1 should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('0 < 1', false)),
                true,
                'Formula `0 < 1` test should return TRUE.'
            );
        });

        it('1 < 0 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('1 < 0', false)),
                false,
                'Formula `1 < 0` test should return FALSE.'
            );
        });

        it('1 < 1 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('1 < 1', false)),
                false,
                'Formula `1 < 1` test should return FALSE.'
            );
        });

        it('0 < FALSE should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('0 < FALSE', false)),
                true,
                'Formula `0 < FALSE` test should return TRUE.'
            );
        });

        it('0 < "0" should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('0 < "0"', false)),
                true,
                'Formula `0 < "0"` test should return TRUE.'
            );
        });

        it('1 < TRUE should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('1 < TRUE', false)),
                true,
                'Formula `1 < TRUE` test should return TRUE.'
            );
        });

        it('1 < "1" should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('1 < "1"', false)),
                true,
                'Formula `1 < "1"` test should return TRUE.'
            );
        });
    });

    describe('string comparisons', () => {
        it('"FALSE" < FALSE should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"FALSE" < FALSE', false)),
                true,
                'Formula `"FALSE" < FALSE` test should return TRUE.'
            );
        });

        it('"0" < 0 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"0" < 0', false)),
                false,
                'Formula `"0" < 0` test should return FALSE.'
            );
        });

        it('"TRUE" < TRUE should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"TRUE" < TRUE', false)),
                true,
                'Formula `"TRUE" < TRUE` test should return TRUE.'
            );
        });

        it('"1" < 1 should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"1" < 1', false)),
                false,
                'Formula `"1" < 1` test should return FALSE.'
            );
        });

        it('"0" < "0" should return FALSE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"0" < "0"', false)),
                false,
                'Formula `"0" < "0"` test should return FALSE.'
            );
        });

        it('"0" < "1" should return TRUE', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"0" < "1"', false)),
                true,
                'Formula `"0" < "1"` test should return TRUE.'
            );
        });

        it('" " < "0" should return TRUE (space is lower)', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('" " < "0"', false)),
                true,
                'Formula `" " < "0"` test should return TRUE, because space is lower than any other character.'
            );
        });

        it('"A" < "a" should return FALSE (case insensitive)', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"A" < "a"', false)),
                false,
                'Formula `"A" < "a"` test should return FALSE, because comparisons are case insensitive.'
            );
        });

        it('"a" < "B" should return TRUE (case insensitive)', () => {
            strictEqual(
                Formula.processFormula(Formula.parseFormula('"a" < "B"', false)),
                true,
                'Formula `"a" < "B"` test should return TRUE, because comparisons are case insensitive.'
            );
        });
    });
});
