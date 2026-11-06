import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import '../../../../../ts/masters/highcharts.src';
import ContourSeries from '../../../../../ts/Series/Contour/ContourSeries';

describe('ContourSeries', () => {
    it('should coalesce draws while WebGPU initializes', async () => {
        const globals = globalThis as unknown as {
                window?: Window;
            },
            hadWindow = Object.hasOwn(globals, 'window'),
            originalWindow = globals.window,
            series = Object.create(
                ContourSeries.prototype
            ) as ContourSeries;

        let resolveRun!: () => void,
            runCount = 0;
        const runPromise = new Promise<void>((resolve): void => {
            resolveRun = resolve;
        });

        globals.window = { devicePixelRatio: 1 } as Window;

        Object.assign(series, {
            canvas: {
                style: {}
            },
            chart: {
                inverted: false
            },
            foreignObject: {
                height: {
                    baseVal: {
                        value: 100
                    }
                },
                width: {
                    baseVal: {
                        value: 100
                    }
                }
            },
            group: {},
            run: (): Promise<void> => {
                runCount++;
                return runPromise;
            },
            xAxis: {
                len: 100
            },
            yAxis: {
                len: 100
            }
        });

        try {
            series.drawPoints();
            const renderPromise = series.renderPromise;

            series.drawPoints();

            strictEqual(runCount, 1);
            strictEqual(series.renderPromise, renderPromise);

            resolveRun();
            await renderPromise;

            strictEqual(series.renderPromise, void 0);
        } finally {
            if (hadWindow) {
                globals.window = originalWindow;
            } else {
                delete globals.window;
            }
        }
    });
});
