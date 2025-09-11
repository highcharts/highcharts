import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';

export const config = {
    sizes: [10_000, 100_000, 500_000, 1_000_000]
};

export function before(size: number) {
    return {
        fileName: `${size}-points.json`,
        func: () => new Float64Array(
            Array.from({ length: size * 2 }, () => Math.random() * 100 - 50)
        )
    };
}

export default async function benchmarkTest(
    {
        CODE_PATH,
        data
    }: BenchmarkContext
): Promise<BenchmarkResult> {
    const Delaunay = require(join(CODE_PATH, '/es-modules/Shared/Delaunay.js')).default;

    performance.mark('Start');
    new Delaunay(data);
    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
