import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.AVERAGE', () => {
    const table = new DataTable({
        columns: { values: [1, 2, 3, 4, 5, 6, false, true, null, '7'] }
    });
    const formula = Formula.parseFormula('AVERAGE(A1:A9,A10)', false);

    it('should return expected value', () => {
        strictEqual(
            Formula.processFormula(formula, table),
            3.5,
            'AVERAGE test should return expected value.'
        );
    });
});
