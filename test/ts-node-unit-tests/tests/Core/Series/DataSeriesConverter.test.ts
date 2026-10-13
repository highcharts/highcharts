import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import DataSeriesConverter from '../../../../../ts/Core/Series/DataSeriesConverter.js';

describe('DataSeriesConverter', () => {
    it('should preserve zero coordinates and values across series', () => {
        const converter = new DataSeriesConverter();

        converter.updateTable([{
            id: 'first',
            options: {
                data: [[0, 5], [1, 6]]
            }
        }, {
            id: 'second',
            options: {
                data: [[1, 0], [0, 7]]
            }
        }, {
            id: 'third',
            options: {
                data: [{ x: 2, y: 9 }, { x: 0, y: 8 }]
            }
        }] as any);

        strictEqual(
            converter.table.getRowCount(),
            3,
            'Shared zero coordinates should reuse the first table row'
        );
        deepStrictEqual(
            converter.getSeriesData('second'),
            [{ x: 0, y: 7 }, { x: 1, y: 0 }],
            'Zero values should be merged into their matching coordinate rows'
        );
        deepStrictEqual(
            converter.getSeriesData('third'),
            [{ x: 0, y: 8 }, { x: 2, y: 9 }],
            'Object-form zero coordinates should not fall back to data indexes'
        );
    });

    it('should merge multi-value points into existing rows', () => {
        const converter = new DataSeriesConverter();

        converter.updateTable([{
            id: 'line',
            options: {
                data: [[0, 1], [1, 2]]
            }
        }, {
            id: 'range',
            pointArrayMap: ['low', 'high'],
            options: {
                data: [[1, 10, 20]]
            }
        }] as any);

        deepStrictEqual(
            converter.getSeriesData('range'),
            [{ x: 1, low: 10, high: 20 }],
            'Every value column should merge into the matching coordinate row'
        );
    });

    it('should preserve null points at their data indexes', () => {
        const converter = new DataSeriesConverter();

        converter.updateTable([{
            id: 'line',
            options: {
                data: [1, null, 2]
            }
        }] as any);

        deepStrictEqual(
            converter.getSeriesData('line'),
            [{ x: 0, y: 1 }, { x: 1, y: null }, { x: 2, y: 2 }],
            'Null points should remain aligned between neighboring values'
        );
    });
});
