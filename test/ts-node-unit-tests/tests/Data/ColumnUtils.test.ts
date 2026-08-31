import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import ColumnUtils from '../../../../ts/Data/ColumnUtils.js';

describe('ColumnUtils', () => {
    describe('splice', () => {
        const cases: Array<[number, number, number[]]> = [
            [-2, 1, [8]],
            [-10, 1, [8]],
            [10, 1, [8]],
            [1, 10, [8]],
            [1, -1, [8]],
            [1.9, 1.9, [8]],
            [NaN, NaN, [8]],
            [Infinity, 1, [8]],
            [-Infinity, 1, [8]]
        ];

        for (const [start, deleteCount, items] of cases) {
            it(`should match Array.splice at start ${start}`, () => {
                const expected = [1, 2, 3],
                    expectedRemoved = expected.splice(
                        start,
                        deleteCount,
                        ...items
                    ),
                    result = ColumnUtils.splice(
                        new Uint8Array([1, 2, 3]),
                        start,
                        deleteCount,
                        false,
                        items
                    );

                deepStrictEqual(Array.from(result.array), expected);
                deepStrictEqual(Array.from(result.removed), expectedRemoved);
            });
        }
    });
});
