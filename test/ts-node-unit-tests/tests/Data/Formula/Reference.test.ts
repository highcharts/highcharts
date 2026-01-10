import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable';
import Formula from '../../../../../ts/Data/Formula/Formula';

describe('Formula.getReferenceValues', () => {
    const table = new DataTable({ columns: { values: [0, 1, 2, 3, 4, 5] } });
    const formula1 = Formula.parseFormula('SUM(A1)', false);
    const result1 = Formula.processFormula(formula1, table);

    it('should return 0 (zero)', () => {
        strictEqual(
            result1,
            0,
            'Reference should return 0 (zero).'
        );
    });
});

describe('Formula.translateReferences', () => {
    it('should translate reference arguments', () => {
        const formula = [{
            args: [{
                column: 4,
                columnRelative: true as const,
                row: 0,
                rowRelative: true as const,
                type: 'reference' as const
            }],
            name: 'LEN',
            type: 'function' as const
        }];
        const result1 = Formula.translateReferences(formula, 0, 1);

        // Access the translated formula's args
        const func = result1[0] as { args: Array<{ row: number }> };
        strictEqual(
            func.args[0].row,
            1,
            'Translation of reference arguments should succeed.'
        );
    });
});
