import type { Page } from '@playwright/test';

/**
 * A benchmark scenario. It is intentionally thin: the harness owns iteration,
 * warmup, interleaving and statistics — a scenario only describes *what* to
 * measure. Adding a benchmark = adding one file that default-exports a scenario.
 */
export interface Scenario {
    /** Unique name within its product (used as the output file name). */
    name: string;
    /** Product key from products.ts — decides which build/runtime is injected. */
    product: string;
    /** Free-form parameters passed to prepare/steps (rows, columns, seed, …). */
    params?: Record<string, number | string>;
    /** Measured samples to keep per step (after warmup). Default 20. */
    iterations?: number;
    /** Warmup iterations to discard before measuring. Default 3. */
    warmup?: number;
    /**
     * Optional unmeasured setup run once per iteration before the steps
     * (e.g. mount a grid and wait until ready). Runs on a clean page.
     */
    prepare?(ctx: BenchContext): Promise<unknown>;
    /**
     * Measured operations. Each returns a record of metric-name → value; the
     * harness aggregates each metric across iterations independently.
     */
    steps: Record<string, (ctx: BenchContext) => Promise<Record<string, number>>>;
}

export interface BenchContext {
    page: Page;
    params: Record<string, number | string>;
}

export function defineScenario(scenario: Scenario): Scenario {
    return scenario;
}
