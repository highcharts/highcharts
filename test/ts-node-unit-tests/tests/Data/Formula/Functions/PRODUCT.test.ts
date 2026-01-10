import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.PRODUCT', () => {
    const table = new DataTable({
        columns: {
            values: [0, 1, 2, 3, 4, '6', false, true, null, void 0]
        }
    });
    const formula1 = Formula.parseFormula('PRODUCT(A6:A10)', false);
    const formula2 = Formula.parseFormula('PRODUCT(A1:A5)', false);
    const formula3 = Formula.parseFormula('PRODUCT(A2:A5)', false);

    it('PRODUCT should return 0 for range with non-numeric values', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            0,
            'PRODUCT test should return expected value. (1)'
        );
    });

    it('PRODUCT should return 0 when range contains 0', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            0,
            'PRODUCT test should return expected value. (2)'
        );
    });

    it('PRODUCT should return expected value for valid range', () => {
        strictEqual(
            Formula.processFormula(formula3, table),
            24,
            'PRODUCT test should return expected value. (3)'
        );
    });
});
