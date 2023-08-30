import type { BenchmarkResult } from '../benchmark';
import { performance } from 'node:perf_hooks';

function generateColumnData(rows: number, columns: number){
    const data = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            row.push(Math.random());
        }
        data.push(row);
    }
    return data;
}

export const config = {
    sizes: [100, 1000, 10_000, 1_000_000, 3_000_000, 5_000_000]
}

export default async function benchmarkTest(size: number): Promise<BenchmarkResult> {
    const hc = require('../../../code/highcharts.js')();
    require('../../../code/modules/data-tools.js')(hc);

    const { DataTable } = hc;

    const columns = generateColumnData(size, 5);

    performance.mark('Start');

    new DataTable({
        columns
    });

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
