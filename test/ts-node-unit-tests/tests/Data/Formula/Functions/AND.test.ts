import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.AND', () => {
    const table = new DataTable({
        columns: {
            values: [0, 1, '2', false, true, null, void 0]
        }
    });
    const formula1 = Formula.parseFormula('AND(A1:A10)', false);
    const formula2 = Formula.parseFormula('AND(A2:A3, A5)', false);

    it('should result in FALSE for mixed values including falsy', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            false,
            'AND test should result in FALSE.'
        );
    });

    it('should result in TRUE for all truthy values', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            true,
            'AND test should result in TRUE.'
        );
    });
});
