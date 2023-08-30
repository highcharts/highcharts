import type { BenchmarkResult } from '../benchmark';
import { performance } from 'node:perf_hooks';

function generateCSV(rows:number, columns: number){
    let csv = 'id';
    for (let column = 0; column < columns; column++) {
        csv += `,col${column}`;
    }
    csv += '\n';

    for (let row = 0; row < rows; row++) {
        csv += `${row}`;
        for (let j = 0; j < columns; j++) {
            csv += `,${Math.random()}`;
        }
        csv += '\n';
    }

    return csv;
}

export const config = {
    sizes: [100, 1000, 10_000, 1_000_000, 3_000_000, 5_000_000]
}

export default async function benchmarkTest(size: number): Promise<BenchmarkResult> {
    const hc = require('../../../code/highcharts.js')();
    require('../../../code/modules/data-tools.js')(hc);

    const { DataPool } = hc;

    const csv = generateCSV(size, 5);

    performance.mark('Start');

    new DataPool({
        connectors: [
            {
                id: size,
                type: 'CSV',
                options: {
                    csv
                }
            }
        ]
    });

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
