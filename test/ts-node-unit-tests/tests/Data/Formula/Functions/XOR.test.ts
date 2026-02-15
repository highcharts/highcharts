import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.XOR', () => {
    const table = new DataTable({
        columns: {
            values: [0, 1, '2', false, true, null, void 0]
        }
    });
    const formula1 = Formula.parseFormula('XOR(A1, A4, A6:A10)', false);
    const formula2 = Formula.parseFormula('XOR(A2:A3, A5)', false);
    const formula3 = Formula.parseFormula('XOR(A1:A10)', false);

    it('XOR should return FALSE for even number of falsy values', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            false,
            'XOR test should result in FALSE. (1)'
        );
    });

    it('XOR should return FALSE for even number of truthy values', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            false,
            'XOR test should result in FALSE. (2)'
        );
    });

    it('XOR should return TRUE for odd number of truthy values', () => {
        strictEqual(
            Formula.processFormula(formula3, table),
            true,
            'XOR test should result in TRUE.'
        );
    });
});
