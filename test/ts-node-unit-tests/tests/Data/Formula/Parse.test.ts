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

    it('should parse signed relative R1C1 references', () => {
        deepStrictEqual(
            Formula.parseFormula('R[-2]C[3]', false),
            [{
                column: 3,
                columnRelative: true,
                row: -2,
                rowRelative: true,
                type: 'reference'
            }],
            'Parsing should retain signed relative row and column offsets.'
        );
    });

    it('should parse relative R1C1 ranges', () => {
        deepStrictEqual(
            Formula.parseFormula('SUM(R[-1]C[1]:R[2]C[-3])', false),
            [{
                args: [{
                    beginColumn: 1,
                    beginColumnRelative: true,
                    beginRow: -1,
                    beginRowRelative: true,
                    endColumn: -3,
                    endColumnRelative: true,
                    endRow: 2,
                    endRowRelative: true,
                    type: 'range'
                }],
                name: 'SUM',
                type: 'function'
            }],
            'Parsing should retain every signed relative range offset.'
        );
    });
});
