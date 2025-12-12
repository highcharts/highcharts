import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.ISNA', () => {
    const formula1 = Formula.parseFormula('ISNA(1)', false);
    const formula2 = Formula.parseFormula('ISNA(2 / 0)', false);
    const formula3 = Formula.parseFormula('ISNA(TRUE)', false);

    it('ISNA should return FALSE for number', () => {
        strictEqual(
            Formula.processFormula(formula1),
            false,
            'ISNA should return FALSE. (1)'
        );
    });

    it('ISNA should return FALSE for division by zero', () => {
        strictEqual(
            Formula.processFormula(formula2),
            false,
            'ISNA should return FALSE. (2)'
        );
    });

    it('ISNA should return TRUE for boolean', () => {
        strictEqual(
            Formula.processFormula(formula3),
            true,
            'ISNA should return TRUE.'
        );
    });
});
