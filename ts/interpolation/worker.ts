self.addEventListener('message', function (e): void {
    /**
     *
     */
    async function doTheWork(): Promise<void> {
        const offscreenCanvas = e.data.canvas;

        const pixelData = e.data.pixelData;
        const { width, height, shaderCode } = e.data;

        const ctx = offscreenCanvas.getContext('2d');

        // Mostly copy-pasted and simplified from https://developer.chrome.com/docs/capabilities/web-apis/gpu-compute
        if ('gpu' in navigator) {
            const start = performance.now();

            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                return;
            }

            const device = await adapter.requestDevice();

            // Insert metadata as u32s
            const metadata = new Uint32Array(2);
            metadata.set([
                width,
                height
            ]);

            const size = pixelData.byteLength + metadata.byteLength;

            // Buffer to modify
            const gpuBuffer = device.createBuffer({
                mappedAtCreation: true,
                size: size,
                usage: GPUBufferUsage.STORAGE
            });

            const range = gpuBuffer.getMappedRange();

            new Uint32Array(range)
                .set(metadata);

            new Uint8ClampedArray(range)
                .set(pixelData, metadata.byteLength);
            gpuBuffer.unmap();

            // Buffer to store result
            const resultBuffer = device.createBuffer({
                size: size, // Length will be the same
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
            });

            // Bindings
            const bindGroupLayout = device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'read-only-storage'
                        }
                    },
                    {
                        binding: 1,
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
                            buffer: gpuBuffer
                        }
                    },
                    {
                        binding: 1,
                        resource: {
                            buffer: resultBuffer
                        }
                    }
                ]
            });

            // Shader

            const shaderModule = device.createShaderModule({
                code: shaderCode
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
                Math.ceil(width / 8),
                Math.ceil(height / 8)
            );
            passEncoder.end();

            const gpuReadBuffer = device.createBuffer({
                size: size,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            });

            commandEncoder.copyBufferToBuffer(
                resultBuffer,
                0,
                gpuReadBuffer,
                0,
                size
            );

            const gpuCommands = commandEncoder.finish();
            device.queue.submit([gpuCommands]);

            await gpuReadBuffer.mapAsync(GPUMapMode.READ);
            const copyArrayBuffer = gpuReadBuffer
                .getMappedRange(metadata.byteLength);

            const end = performance.now();

            /* eslint-disable no-console */
            console.log(end - start);

            console.log(copyArrayBuffer);

            /* eslint-enable no-console */

            ctx.putImageData(
                new ImageData(
                    new Uint8ClampedArray(copyArrayBuffer),
                    width,
                    height
                ),
                0,
                0
            );
        }

        const blob = await offscreenCanvas.convertToBlob({
            type: 'image/png'
        });

        self.postMessage({ done: true, blob });
    }

    doTheWork();
});
