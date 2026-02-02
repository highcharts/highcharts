import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable';
import Formula from '../../../../../ts/Data/Formula/Formula';

describe('Formula.getRangeValues', () => {
    const table = new DataTable({ columns: { values: [1, 2, 3, 4, 5, 6] } });
    const formula1 = Formula.parseFormula('SUM(A1:A6)', false);
    const formula2 = Formula.parseFormula('SUM(SUM(A1:A3), SUM(A4:A6))', false);
    const result1 = Formula.processFormula(formula1, table);
    const result2 = Formula.processFormula(formula2, table);

    it('should sum range to 21', () => {
        strictEqual(
            result1,
            21,
            'Range should result in a sum of 21.'
        );
    });

    it('should return same sum for subdivisions of ranges', () => {
        strictEqual(
            result2,
            result1,
            'Subdivisions of ranges should result in the same sum.'
        );
    });
});
