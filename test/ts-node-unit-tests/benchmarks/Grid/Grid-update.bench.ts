import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { setupDOM } from '../../test-utils';
import { generateGridData } from '../../data-generators';

export const config = {
    sizes: [1_000, 10_000, 50_000, 100_000]
};

export function before(size: number) {
    return {
        fileName: `${size}-rows.json`,
        func: generateGridData.bind(undefined, size, 5) // 5 columns
    };
}

export default async function benchmarkTest(
    {
        size,
        CODE_PATH,
        data
    }: BenchmarkContext
): Promise<BenchmarkResult> {

    const { win, doc, el } = setupDOM();

    global.window = win;
    global.document = doc;
    
    // Load Grid module
    let Grid = require(join(CODE_PATH, '/grid/grid-lite.src.js'));
    if (typeof Grid === 'function') {
        Grid = Grid(win); // old UMD pattern
    } else if (!Grid.win) {
        Grid.win = win;
    }

    // Create the Grid first
    const grid = Grid.grid(el, {
        dataTable: data
    });

    performance.mark('Start');

    // Update the Grid with new options
    grid.update({
        pagination: {
            enabled: true,
            pageSize: 20
        }
    });

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
