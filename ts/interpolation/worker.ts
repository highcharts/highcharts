const BLOCK_SIZE = 4;

// Modified from https://developer.chrome.com/docs/capabilities/web-apis/gpu-compute
/**
 *
 */
async function computePass(
    pixelData: Uint32Array,
    width: number,
    height: number,
    device: GPUDevice,
    shaderCode: string
): Promise<ArrayBuffer> {
    const start = performance.now();
    const size = pixelData.byteLength;

    const metadata = new Uint32Array([
        width,
        height,
        1 // write to debug
    ]);

    const uniformBuffer = device.createBuffer({
        size: metadata.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    device.queue.writeBuffer(uniformBuffer, 0, metadata);

    // Buffer to modify
    const gpuBuffer = device.createBuffer({
        mappedAtCreation: true,
        size: size,
        usage: GPUBufferUsage.STORAGE
    });

    new Uint8ClampedArray(gpuBuffer.getMappedRange())
        .set(pixelData);
    gpuBuffer.unmap();

    // Buffer to store result
    const resultBuffer = device.createBuffer({
        size: size, // Length will be the same
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    const minBuffer = device.createBuffer({
        size: size, // Length will be the same
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    const debugBufferSize = 12 * 4;

    const debugBuffer = device.createBuffer({
        size: debugBufferSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    // Shader
    const chunkWidth = BLOCK_SIZE;
    const chunkHeight = BLOCK_SIZE;

    const shaderModule = device.createShaderModule({
        code: `
        const chunk_width = ${chunkWidth};
        const chunk_height = ${chunkHeight};

        ${shaderCode}
`
    });


    // Bindings
    // Can't get auto binding to work for some reason
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage'
                }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage'
                }
            },
            {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'uniform'
                }
            },
            {
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage'
                }
            },
            {
                binding: 4,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage'
                }
            }
        ]
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: resultBuffer
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: minBuffer
                }
            },
            {
                binding: 2,
                resource: {
                    buffer: uniformBuffer
                }
            },
            {
                binding: 3,
                resource: {
                    buffer: gpuBuffer
                }
            },
            {
                binding: 4,
                resource: {
                    buffer: debugBuffer
                }
            }
        ]
    });


    // Pipeline
    const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        }),
        compute: {
            module: shaderModule,
            entryPoint: 'main'
        }
    });


    // Commands
    const commandEncoder = device.createCommandEncoder();

    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);

    passEncoder.dispatchWorkgroups(
        Math.ceil(width / chunkWidth),
        Math.ceil(height / chunkHeight)
    );

    passEncoder.end();

    const gpuReadBuffer = device.createBuffer({
        size: size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    const debugReadBuffer = device.createBuffer({
        size: debugBufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(
        resultBuffer,
        0,
        gpuReadBuffer,
        0,
        size
    );

    commandEncoder.copyBufferToBuffer(
        debugBuffer,
        0,
        debugReadBuffer,
        0,
        debugBufferSize
    );

    const gpuCommands = commandEncoder.finish();
    device.queue.submit([gpuCommands]);

    const results = [];

    for (const buffer of [debugReadBuffer, gpuReadBuffer]) {
        await buffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = buffer.getMappedRange();

        results.push(copyArrayBuffer);
    }

    const end = performance.now();

    const [debug, copyArrayBuffer] = results;
    /* eslint-disable no-console */
    console.log('Compute pass done in', end - start, 'ms');
    console.log('Debug', debug);

    /* eslint-enable no-console */


    return copyArrayBuffer;
}

self.addEventListener('message', function (e): void {
    /**
     *
     */
    async function doTheWork(): Promise<void> {
        const offscreenCanvas = e.data.canvas as OffscreenCanvas;

        const pixelData = e.data.pixelData;
        const { width, height, options } = e.data;

        const { shaderCode } = options;
        const ctx = offscreenCanvas.getContext('webgpu') as GPUCanvasContext;

        if ('gpu' in navigator) {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                return;
            }

            const device = await adapter.requestDevice();

            const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

            ctx.configure({
                device,
                format: presentationFormat
            });

            const copyArrayBuffer = await computePass(
                pixelData,
                width,
                height,
                device,
                shaderCode
            );

            // Bit of a workaround,
            // could be avoided if we don't set the context to webgpu earlier
            const tempCanvas = new OffscreenCanvas(width, height);
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
                tempCtx.imageSmoothingEnabled = false;

                const tempImageData = tempCtx.createImageData(width, height);
                tempImageData.data.set(new Uint8ClampedArray(copyArrayBuffer));

                tempCtx.putImageData(tempImageData, 0, 0);
                const blob = await tempCanvas.convertToBlob();

                self.postMessage({ done: true, blob });
            }
        }
    }

    doTheWork();
});
