import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import Templating from '../../../ts/Core/Templating.js';

describe('Templating', () => {
    describe('divide helper', () => {
        it('corrects floating point artifacts in template output', () => {
            [
                [0.07, '0.0007'],
                [0.1 + 0.2, '0.003'],
                [0.29, '0.0029']
            ].forEach(([value, expected]) => {
                strictEqual(
                    Templating.format('{(divide value 100)}', { value }),
                    expected
                );
            });
        });

        it('preserves integer-clean division output', () => {
            strictEqual(
                Templating.format('{(divide value 2)}', { value: 6 }),
                '3'
            );
        });
    });

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
