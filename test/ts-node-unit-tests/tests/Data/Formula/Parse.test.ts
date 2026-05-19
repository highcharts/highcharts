import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

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
});
