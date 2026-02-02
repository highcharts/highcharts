import { describe, it } from 'node:test';
import { ok, strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.MOD', () => {
    const table = new DataTable({
        columns: {
            as: [3.1, 0],
            bs: [0, 2]
        }
    });
    const formula1 = Formula.parseFormula('MOD( A1, B1 )', false);
    const formula2 = Formula.parseFormula('MOD( A1, B2 )', false);

    it('should return NaN when divisor is zero', () => {
        ok(
            isNaN(Formula.processFormula(formula1, table) as number),
            'MOD test should return not a number.'
        );
    });

    it('should return expected value', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            1.1,
            'MOD test should return expected value.'
        );
    });
});
