import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { generateColumnData } from '../../data-generators';

export const config = {
    sizes: [10_000, 100_000, 500_000, 1_000_000]
};

export function before(size: number) {
    return {
        fileName: `${size}-points.json`,
        func: () => generateColumnData(size, 1)
    };
}

export default async function benchmarkTest(
    {
        size,
        CODE_PATH,
        data
    }: BenchmarkContext
): Promise<BenchmarkResult> {

    const Delaunay = require(join(CODE_PATH, '/es-modules/Shared/Delaunay.js')).default;
    const pts = new Float32Array(
        Array.from({ length: size * 2 }, () => Math.random() * 100 - 50)
    );

    performance.mark('Start');

    new Delaunay(pts);

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
