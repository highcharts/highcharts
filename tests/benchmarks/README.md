# Product benchmarks

Real-browser performance benchmarks driven by Playwright's pinned Chromium.
Unlike the legacy jsdom micro-benchmarks in `test/ts-node-unit-tests`, these
measure actual rendering, layout and scrolling — the things users feel.

The harness is product-agnostic. Today it covers Grid; Highcharts, Stock and
Dashboards can plug in by adding a product entry and scenarios.

## Layout

```
tests/benchmarks/
  harness/            # product-agnostic engine
    run.ts            # orchestrator: interleaves base vs PR, warmup, samples
    compare.ts        # stats + significance -> tmp/benchmarks/table.md
    stats.ts          # median, IQR trimming, Mann–Whitney U
    browser.ts        # injects a build into a page
    products.ts       # product -> built assets + runtime
    scenario.ts       # Scenario type + defineScenario()
    runtime.js        # in-page primitives (window.__bench.*)
  grid/
    runtime.js        # grid-specific in-page helpers (window.__bench.grid)
    scenarios/*.bench.ts
```

## Running locally

Build the product first (`npx gulp scripts --product Grid`), then:

```bash
cd tests/benchmarks

# single build — quick sanity check, writes tmp/benchmarks/actual/
node --import tsx harness/run.ts --pr code

# base vs PR, interleaved (what CI does)
node --import tsx harness/run.ts --base code-base --pr code
node --import tsx harness/compare.ts            # -> tmp/benchmarks/table.md

# filter + fewer iterations while iterating on a scenario
node --import tsx harness/run.ts --pr code --pattern scroll --iterations 8 --warmup 2
```

## Adding a benchmark

Drop a `*.bench.ts` file in `<product>/scenarios/`:

```ts
import { defineScenario } from '../../harness/scenario.ts';

export default defineScenario({
    name: 'my-benchmark',
    product: 'grid-lite',
    params: { rows: 50_000, columns: 8, seed: 1 },
    // optional unmeasured setup (mount, wait ready)
    prepare: ({ page, params }) => page.evaluate((p) => {
        const columns = window.__bench.genColumns(p.rows, p.columns, p.seed);
        return window.__bench.grid.mount({ data: { columns } });
    }, params),
    // measured operations — each returns metric-name -> value
    steps: {
        'do-thing': ({ page }) => page.evaluate(
            () => window.__bench.scrollProfile({ axis: 'x', distance: 3000, steps: 60 })
        )
    }
});
```

In-page helpers available on `window.__bench`:

| Helper | Purpose |
| --- | --- |
| `genColumns(rows, cols, seed)` | deterministic column data (seeded) |
| `time(action)` | ms until the paint after `action` |
| `scrollProfile({axis, distance, steps})` | avg/p95 frame ms, fps, jank, long-task ms |
| `heapUsedMb()` | coarse JS heap (informational only) |
| `grid.mount(options)` / `grid.update(options)` | grid lifecycle |

## Methodology

- **Real Chromium** (Playwright-pinned) — real layout/paint, so scrolling and
  virtualization are actually measured.
- **Interleaving** — base and PR are measured alternately within each iteration,
  so a transient runner slowdown hits both, not just one.
- **Warmup + trimming** — first N iterations discarded; per-metric IQR outlier
  trimming before stats.
- **Significance gate** — a metric is flagged (✅/⚠️) only when the median moves
  more than ±5% *and* Mann–Whitney U gives p < 0.05. This filters runner noise.
- **Serial** — benchmarks must not run in parallel; concurrent CPU load destroys
  timing. The harness uses one browser and runs scenarios sequentially.

### Known limitations

- Memory (`heapMb`) is coarse (`performance.memory`) and shown for context only,
  never flagged. Precise memory would need CDP heap snapshots.
- Absolute numbers depend on the machine; only the base-vs-PR delta is meaningful.
- On shared CI runners even the delta has noise — the report is informational
  (non-blocking), not a merge gate.
