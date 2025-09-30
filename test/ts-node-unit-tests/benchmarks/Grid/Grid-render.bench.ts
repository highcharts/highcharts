import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { setupDOM, mockObservers } from '../../test-utils';
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
    mockObservers(win);

    global.window = win;
    global.document = doc;
    global.ResizeObserver = win.ResizeObserver;
    global.MutationObserver = win.MutationObserver;
    
    // Load Grid module
    let Grid = await import(join(CODE_PATH, '/grid/grid-lite.src.js'));
    if (typeof Grid === 'function') {
        Grid = Grid(win); // old UMD pattern
    } else if (!Grid.win) {
        Grid.win = win;
    }

    performance.mark('Start');

    // Create and render the Grid
    await Grid.grid(el, {
        dataTable: {
            columns: data.columns
        }
    }, true);

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}
