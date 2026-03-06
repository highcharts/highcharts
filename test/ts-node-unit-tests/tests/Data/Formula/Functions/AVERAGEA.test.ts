import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.AVERAGEA', () => {
    const table = new DataTable({
        columns: { values: [1, 3, 4, 5, 6, 7, false, true, null, '7'] }
    });
    const formula = Formula.parseFormula('AVERAGEA(A1:A9,A10)', false);

    it('should return expected value', () => {
        strictEqual(
            Formula.processFormula(formula, table),
            3,
            'AVERAGEA test should return expected value.'
        );
    });
});
