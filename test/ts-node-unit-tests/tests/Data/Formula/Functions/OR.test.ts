import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.OR', () => {
    const table = new DataTable({
        columns: {
            values: [0, 1, '2', false, true, null, void 0]
        }
    });
    const formula1 = Formula.parseFormula('OR(A1, A4, A6:A10)', false);
    const formula2 = Formula.parseFormula('OR(A4:A7)', false);

    it('OR should return FALSE for all falsy values', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            false,
            'OR test should result in FALSE.'
        );
    });

    it('OR should return TRUE when at least one value is truthy', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            true,
            'OR test should result in TRUE.'
        );
    });
});
