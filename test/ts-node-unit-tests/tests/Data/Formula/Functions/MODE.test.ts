import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.MODE', () => {
    it('MODE should return expected value', () => {
        const table = new DataTable({
            columns: {
                as: [-1, 0, 1, 2, 3, 4, '5', '6', null, 8, 9],
                bs: [-9, -8, -7, -6, false, false, -3, -2, -1, 0, 1]
            }
        });
        const formula = Formula.parseFormula('MODE( A2, A1:A11, A1 )', false);

        strictEqual(
            Formula.processFormula(formula, table),
            -1,
            'MODE test should return expected value.'
        );
    });
});

describe('Formula.processorFunctions["MODE.MULT"]', () => {
    it('MODE.MULT should return expected values', () => {
        const table = new DataTable({
            columns: {
                values: [0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 7]
            }
        });
        const formula = Formula.parseFormula('SUM( MODE.MULT( A1:A12 ) )', false);

        strictEqual(
            Formula.processFormula(formula, table),
            17,
            'MODE.MULT test should return expected values.'
        );
    });
});

describe('Formula.processorFunctions["MODE.SNGL"]', () => {
    it('MODE.SNGL should return expected value', () => {
        const table = new DataTable({
            columns: {
                as: [-1, 0, 1, 2, 3, 4, '5', '6', null, 8, 9],
                bs: [-9, -8, -7, -6, false, false, -3, -2, -1, 0, 1]
            }
        });
        const formula = Formula.parseFormula('MODE.SNGL( B1:B11, A1, B2, 1, 1 )', false);

        strictEqual(
            Formula.processFormula(formula, table),
            1,
            'MODE.SNGL test should return expected value.'
        );
    });
});
