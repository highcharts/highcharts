import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.SUM', () => {
    const table = new DataTable({
        columns: {
            values: [0, 1, 2, 3, 4, '6', false, true, null, void 0]
        }
    });
    const formula1 = Formula.parseFormula('SUM(A1:A5, A6:A11)', false);

    it('should return expected value', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            10,
            'SUM test should return expected value.'
        );
    });
});
