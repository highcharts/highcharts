import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { generateColumnData } from '../../data-generators';
import { getHighchartsJSDOM, setupDOM } from '../../test-utils';

export const config = {
    sizes: [100, 1000, 10_000, 100_000, 1_000_000, 2_500_000]
};

export function before(size: number) {
    return {
        fileName: `data-${size}-rows.json`,
        func: () => generateColumnData(size, 5)
    };
}

export default async function benchmarkTest(
    {
        CODE_PATH,
        data
    }: BenchmarkContext
): Promise<BenchmarkResult> {
    const { win } = setupDOM();
    const { Highcharts: hc, el } = getHighchartsJSDOM('highcharts', ['modules/data-tools']);
    global.window = win;

    const { DataTable } = hc;
    const columns = data;

    performance.mark('Start');

    new DataTable({
        columns
    });

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
