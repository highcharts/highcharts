import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, throws } from 'node:assert';

import Formula from '../../../../../ts/Data/Formula/Formula';

describe('Formula.parseFormula', () => {
    it('should parse to expected structure', () => {
        deepStrictEqual(
            Formula.parseFormula('SUM(1,2,3)+10', false),
            [
                {
                    'args': [
                        1,
                        2,
                        3
                    ],
                    'name': 'SUM',
                    'type': 'function'
                },
                '+',
                10
            ],
            'Parsing should result in the expected structure.'
        );
    });

    it('should reject too deeply nested formulas', () => {
        throws(
            () => Formula.parseFormula(
                '('.repeat(10000) + '1' + ')'.repeat(10000),
                false
            ),
            { name: 'FormulaParseError' },
            'Deep nesting should throw a parse error, not a RangeError.'
        );

        strictEqual(
            Formula.processFormula(Formula.parseFormula(
                '('.repeat(100) + '1' + ')'.repeat(100),
                false
            )),
            1,
            'Nesting within the limit should still parse and process.'
        );
    });

    it('should process to value of 16', () => {
        strictEqual(
            Formula.processFormula(Formula.parseFormula('SUM(1,2,3)+10', false)),
            16,
            'Processing should result in a value of 16.'
        );
    });

    it('should process negative number', () => {
        strictEqual(
            Formula.processFormula(Formula.parseFormula('-10', false)),
            -10,
            'Processing should result in a value of -10.'
        );
    });

    it('should parse and process >=', () => {
        const formula = Formula.parseFormula('2 >= 1', false);

        deepStrictEqual(
            formula,
            [2, '>=', 1],
            'Parsing `2 >= 1` should keep >= as one operator.'
        );
        strictEqual(
            Formula.processFormula(formula),
            true,
            'Formula `2 >= 1` should return TRUE.'
        );
    });

    it('should parse and process <=', () => {
        const formula = Formula.parseFormula('1 <= 1', false);

        deepStrictEqual(
            formula,
            [1, '<=', 1],
            'Parsing `1 <= 1` should keep <= as one operator.'
        );
        strictEqual(
            Formula.processFormula(formula),
            true,
            'Formula `1 <= 1` should return TRUE.'
        );
    });
});
