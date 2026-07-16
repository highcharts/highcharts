/**
 * Ambient declarations for the in-page benchmark runtime. These symbols exist
 * only inside the browser (injected via runtime.js / <product>/runtime.js), but
 * are referenced from `page.evaluate` callbacks that TypeScript type-checks in
 * the Node context.
 */
interface ScrollProfileResult {
    avgFrameMs: number;
    p95FrameMs: number;
    fps: number;
    jankFrames: number;
    longTaskMs: number;
    error?: string;
}

interface BenchRuntime {
    reset(width?: number, height?: number): HTMLElement;
    nextPaint(): Promise<void>;
    time(action: () => unknown): Promise<number>;
    gc(): void;
    heapUsedMb(): number;
    genColumns(rows: number, cols: number, seed?: number): Record<string, unknown[]>;
    findScrollable(axis: 'x' | 'y'): Element | null;
    scrollProfile(opts: { axis?: 'x' | 'y'; distance?: number; steps?: number }):
        Promise<ScrollProfileResult>;
    grid: {
        instance: unknown;
        mount(options: unknown): Promise<boolean>;
        update(options: unknown): Promise<boolean>;
    };
}

interface Window {
    __bench: BenchRuntime;
    Grid: { grid(container: string | HTMLElement, options: unknown, ...rest: unknown[]): Promise<unknown> };
    gc?: () => void;
}

interface Performance {
    memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
}
