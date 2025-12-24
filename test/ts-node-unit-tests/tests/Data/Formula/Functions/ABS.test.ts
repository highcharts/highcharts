import { describe, it } from 'node:test';
import { ok, strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.ABS', () => {
    const table = new DataTable({
        columns: {
            values: [0, -1, '2', false, true, null, void 0]
        }
    });
    const formula1 = Formula.parseFormula('ABS(A1:A10)', false);
    const formula2 = Formula.parseFormula('AVERAGE(ABS(A1:A2))', false);
    const formula3 = Formula.parseFormula('ABS(-6/7)', false);

    it('should not support non-numbers', () => {
        ok(
            isNaN(Formula.processFormula(formula1, table) as number),
            'ABS test should not support non-numbers.'
        );
    });

    it('should result in positive numbers', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            0.5,
            'ABS test should result in positive numbers.'
        );
    });

    it('should result in positive decimal number', () => {
        strictEqual(
            Formula.processFormula(formula3, table),
            0.857142857,
            'ABS test should result in positive decimal number.'
        );
    });
});
