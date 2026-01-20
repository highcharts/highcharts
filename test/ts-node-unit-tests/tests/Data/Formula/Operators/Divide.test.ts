import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula Divide decimal digits', () => {
    it('should result in a decimal with 9 digits', () => {
        strictEqual(
            Formula.processFormula(Formula.parseFormula('6 / 7', false)),
            0.857142857,
            'Formula `6 / 7` should result in a decimal with 9 digits.'
        );
    });
});
