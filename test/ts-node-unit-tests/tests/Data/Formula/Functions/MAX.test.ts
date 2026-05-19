import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.MAX', () => {
    const table = new DataTable({
        columns: {
            values: ['-7', -6, -3, 0, 3, 6, false, true, null, '7']
        }
    });
    const formula = Formula.parseFormula('MAX( A1:A10 )', false);

    it('should return expected value', () => {
        strictEqual(
            Formula.processFormula(formula, table),
            6,
            'MAX test should return expected value.'
        );
    });
});
