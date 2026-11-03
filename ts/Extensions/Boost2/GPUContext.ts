/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: WebGPU renderer for series marks - device context.
 *
 *  License: highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import { error } from '../../Core/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/*
 * TypeScript ships WebGPU interfaces in `lib.dom`, but not the usage flag
 * namespaces. Same workaround as in ContourSeries.
 */
declare const GPUBufferUsage: {
    readonly COPY_DST: GPUFlagsConstant;
    readonly STORAGE: GPUFlagsConstant;
    readonly UNIFORM: GPUFlagsConstant;
};

/** @internal */
export type PipelineFactory = (
    device: GPUDevice,
    format: GPUTextureFormat
) => GPURenderPipeline;

/* *
 *
 *  Class
 *
 * */

/**
 * One GPU device per page, shared by every chart and series.
 *
 * Device acquisition is asynchronous while rendering is synchronous, so the
 * pending state is explicit: `ready` is false until the device arrives, and
 * `whenReady` runs the queued callbacks once it does.
 *
 * @internal
 */
class GPUContext {

    /* *
     *
     *  Static Properties
     *
     * */

    /** @internal */
    public static device?: GPUDevice;

    /** @internal */
    public static format?: GPUTextureFormat;

    /** @internal */
    public static ready = false;

    /** @internal */
    public static unavailable = false;

    /** @internal */
    private static promise?: Promise<void>;

    /** @internal */
    private static pipelines: Record<string, GPURenderPipeline> = {};

    /** @internal */
    private static waiters: Array<() => void> = [];

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Acquire the adapter and device. Idempotent.
     * @internal
     */
    public static init(): Promise<void> {
        if (!this.promise) {
            this.promise = this.request();
        }
        return this.promise;
    }

    /** @internal */
    private static async request(): Promise<void> {
        try {
            await this.acquire();
        } finally {
            // Waiters also run when acquisition fails, so a series waiting
            // on the device cannot stall indefinitely.
            const waiters = this.waiters.splice(0);

            for (const waiter of waiters) {
                waiter();
            }
        }
    }

    /** @internal */
    private static async acquire(): Promise<void> {
        const gpu = navigator.gpu;

        if (!gpu) {
            // WebGPU requires a secure context, so `navigator.gpu` is
            // absent on a plain HTTP host other than localhost. The reason
            // is reported because the fallback is otherwise silent.
            this.unavailable = true;
            const secure = typeof isSecureContext === 'undefined' ?
                'unknown' :
                String(isSecureContext);

            error(
                'Highcharts Boost2: WebGPU is not available, falling back ' +
                'to SVG rendering. Secure context: ' + secure + '.'
            );
            return;
        }

        const adapter = await gpu.requestAdapter();

        if (!adapter) {
            this.unavailable = true;
            error(
                'Highcharts Boost2: no WebGPU adapter, falling back to ' +
                'SVG rendering.'
            );
            return;
        }

        this.device = await adapter.requestDevice();
        this.format = gpu.getPreferredCanvasFormat();
        this.ready = true;

        // Device loss occurs on sleep and on GPU switching; clearing the
        // cached state allows a later `init` to acquire a new device.
        void this.device.lost.then((): void => {
            this.ready = false;
            this.device = void 0;
            this.pipelines = {};
            this.promise = void 0;
        });

    }

    /**
     * Run `fn` once the device is ready, or once acquisition has failed.
     * @internal
     */
    public static whenReady(fn: () => void): void {
        if (this.ready) {
            fn();
        } else if (!this.unavailable) {
            this.waiters.push(fn);
            void this.init();
        }
    }

    /**
     * Pipelines are created once per key and shared by every series.
     * @internal
     */
    public static pipeline(
        key: string,
        factory: PipelineFactory
    ): GPURenderPipeline {
        return (
            this.pipelines[key] ||= factory(this.device!, this.format!)
        );
    }

    /** @internal */
    public static createStorageBuffer(size: number): GPUBuffer {
        return this.device!.createBuffer({
            size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }

    /** @internal */
    public static createUniformBuffer(size: number): GPUBuffer {
        return this.device!.createBuffer({
            size,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default GPUContext;
