import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.IF', () => {
    const table = new DataTable({ columns: { values: [1, 2, 3, 4, 5, 6] } });
    const formula1 = Formula.parseFormula('AVERAGE( IF( 1 < 2, A1:A3, A4:A6) )', false);
    const formula2 = Formula.parseFormula('AVERAGE( IF( 3 <= 2, A1:A3, A4:A6) )', false);

    it('IF test should succeed and AVERAGE should calculate first range', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            2,
            'IF test should succeed and AVERAGE should calculate first range.'
        );
    });

    it('IF test should fail and AVERAGE should calculate second range', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            5,
            'IF test should fail and AVERAGE should calculate second range.'
        );
    });
});
