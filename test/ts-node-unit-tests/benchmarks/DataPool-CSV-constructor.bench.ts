import type { BenchmarkResult } from '../benchmark';
import { performance } from 'node:perf_hooks';
import { join, resolve } from 'node:path';

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
    sizes: [100, 1000, 10_000, 1_000_000, 2_500_000]
}

export function before(size: number) {
    return {
        fileName: `${size}-rows.csv`,
        func: () => generateCSV(size, 5)
    }
}

export default async function benchmarkTest(
    size: number,
    CODE_PATH: string,
    data: string
): Promise<BenchmarkResult> {
    const hc = require(join(CODE_PATH, '/highcharts.src.js'))();
    require(join(CODE_PATH, '/modules/data-tools.src.js'))(hc);

    const { DataPool } = hc;

    const csv = data;

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
