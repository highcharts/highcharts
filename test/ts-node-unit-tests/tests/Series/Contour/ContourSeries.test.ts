import { deepStrictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import '../../../../../ts/masters/highcharts.src';
import ContourSeries from '../../../../../ts/Series/Contour/ContourSeries';

describe('ContourSeries', () => {
    it('should preserve zero color axis extremes', () => {
        const series = Object.create(
                ContourSeries.prototype
            ) as ContourSeries,
            getValueAxisExtremes = (
                series as unknown as {
                    getValueAxisExtremes: () => number[];
                }
            ).getValueAxisExtremes.bind(series);

        Object.assign(series, {
            colorAxis: {
                min: 0,
                max: 100
            },
            points: [{ value: 10 }, { value: 20 }],
            valueMin: NaN,
            valueMax: NaN
        });

        deepStrictEqual(getValueAxisExtremes(), [0, 100]);

        Object.assign(series, {
            colorAxis: {
                min: -100,
                max: 0
            },
            points: [{ value: -20 }, { value: -10 }]
        });

        deepStrictEqual(getValueAxisExtremes(), [-100, 0]);
    });
});
