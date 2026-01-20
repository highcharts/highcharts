import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula Operation priorities', () => {
    it('should respect operator precedence in complex formula', () => {
        strictEqual(
            Formula.processFormula(
                Formula.parseFormula('21 = 1 + 2 + 3 * 36 ^ 0.5', false)
            ),
            true,
            'Formula `21 = 1 + 2 + 3 * 36 ^ 0.5` should be TRUE.'
        );
    });
});
