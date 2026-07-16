/**
 * Registry of benchmarkable products. Each product declares the built assets
 * to inject into the page (paths relative to the build directory, e.g. `code/`)
 * and its browser runtime (path relative to `tests/benchmarks/`).
 *
 * Adding a product = one entry here + a runtime file + scenarios.
 */
export interface ProductAssets {
    /** Scripts to inject, relative to the build dir (code/ or code-base/). */
    scripts: string[];
    /** Stylesheets to inject, relative to the build dir. */
    styles: string[];
    /** Product runtime file, relative to tests/benchmarks/. */
    runtime: string;
}

export const products: Record<string, ProductAssets> = {
    'grid-lite': {
        scripts: ['grid/grid-lite.src.js'],
        styles: ['grid/css/grid-lite.css'],
        runtime: 'grid/runtime.js'
    },
    'grid-pro': {
        scripts: ['grid/grid-pro.src.js'],
        styles: ['grid/css/grid-pro.css'],
        runtime: 'grid/runtime.js'
    }
};
