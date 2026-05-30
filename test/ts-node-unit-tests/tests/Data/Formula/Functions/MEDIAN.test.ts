import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.MEDIAN', () => {
    const table = new DataTable({
        columns: { values: [1, 2, 3, 4, 5, 6, false, true, null, '7'] }
    });
    const formula1 = Formula.parseFormula('MEDIAN(A1:A10)', false);
    const formula2 = Formula.parseFormula('MEDIAN(A1,A1:A10)', false);

    it('should return expected value for single range', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            3.5,
            'MEDIAN test should return expected value.'
        );
    });

    it('should return expected value for combined range', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            3,
            'MEDIAN test should return expected value.'
        );
    });
});
