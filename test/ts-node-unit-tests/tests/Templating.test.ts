import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import Templating from '../../../ts/Core/Templating.js';

describe('Templating', () => {
    describe('multiply helper', () => {
        it('corrects floating point artifacts in template output', () => {
            [
                [0.07, '7'],
                [0.1 + 0.2, '30'],
                [0.29, '29']
            ].forEach(([value, expected]) => {
                strictEqual(
                    Templating.format('{(multiply value 100)}', { value }),
                    expected
                );
            });
        });

        it('preserves integer-clean multiplication output', () => {
            strictEqual(
                Templating.format('{(multiply value 3)}', { value: 2 }),
                '6'
            );
        });
    });
});
