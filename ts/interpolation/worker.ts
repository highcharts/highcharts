import { mat4 } from 'gl-matrix';
const BLOCK_SIZE = 4;

/**
 *
 */
function postProcess(
    device: GPUDevice,
    source: ImageBitmap,
    ctx: GPUCanvasContext
): void {
    const renderStart = performance.now();

    const renderBuffer = device.createBuffer({
        size: 64 * 3,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const renderViewDescriptor: GPUTextureViewDescriptor = {
        format: 'rgba8unorm',
        dimension: '2d',
        aspect: 'all',
        baseMipLevel: 0,
        mipLevelCount: 1,
        baseArrayLayer: 0,
        arrayLayerCount: 1
    };

    const texture = device.createTexture({
        size: {
            width: source.width,
            height: source.height
        },
        format: 'rgba8unorm',
        usage: GPUTextureUsage.COPY_DST |
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.copyExternalImageToTexture(
        { source },
        { texture },
        { width: source.width, height: source.height }
    );

    const textureView = texture.createView(renderViewDescriptor);

    const samplerDescriptor: GPUSamplerDescriptor = {
        addressModeU: 'repeat',
        addressModeV: 'repeat',
        addressModeW: 'repeat',
        // MagFilter: 'linear',
        // minFilter: 'nearest',
        mipmapFilter: 'nearest',
        lodMinClamp: 0
        // LodMaxClamp: 0,
        // compare: 'never'
    };

    const sampler = device.createSampler(samplerDescriptor);

    const renderBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {}
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {}
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {}
            }
        ]
    });

    const renderBindGroup = device.createBindGroup({
        layout: renderBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: renderBuffer
                }
            },
            {
                binding: 1,
                resource: textureView
            },
            {
                binding: 2,
                resource: sampler
            }
        ]
    });

    // X y z u v
    // triangle
    const vertices: Float32Array = new Float32Array(
        [
            0.0, 0.0, 0.5, 0.5, 0.0,
            0.0, -0.5, -0.5, 0.0, 1.0,
            0.0, 0.5, -0.5, 1.0, 1.0
        ]
    );

    const usage: GPUBufferUsageFlags = GPUBufferUsage.VERTEX |
        GPUBufferUsage.COPY_DST;
    // VERTEX: the buffer can be used as a vertex buffer
    // COPY_DST: data can be copied to the buffer

    const descriptor: GPUBufferDescriptor = {
        size: vertices.byteLength,
        usage: usage,
        mappedAtCreation: true
    };

    const vertexBuffer = device.createBuffer(descriptor);

    // Buffer has been created, now load in the vertices
    new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
    vertexBuffer.unmap();

    const bufferLayout: GPUVertexBufferLayout = {
        arrayStride: 20,
        attributes: [
            {
                shaderLocation: 0,
                format: 'float32x3',
                offset: 0
            },
            {
                shaderLocation: 1,
                format: 'float32x2',
                offset: 12
            }
        ]
    };


    const renderPipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [renderBindGroupLayout]
    });


    const renderModule = device.createShaderModule({
        code: `struct TransformData {
            model: mat4x4<f32>,
            view: mat4x4<f32>,
            projection: mat4x4<f32>,
        };
        @binding(0) @group(0) var<uniform> transformUBO: TransformData;
        @binding(1) @group(0) var myTexture: texture_2d<f32>;
        @binding(2) @group(0) var mySampler: sampler;

        struct Fragment {
            @builtin(position) Position : vec4<f32>,
            @location(0) TexCoord : vec2<f32>
        };

        @vertex
        fn vs_main(@location(0) vertexPostion: vec3<f32>, @location(1) vertexTexCoord: vec2<f32>) -> Fragment {

            var output : Fragment;
            output.Position = transformUBO.projection * transformUBO.view * transformUBO.model * vec4<f32>(vertexPostion, 1.0);
            output.TexCoord = vertexTexCoord;

            return output;
        }

        @fragment
        fn fs_main(@location(0) TexCoord : vec2<f32>) -> @location(0) vec4<f32> {
            return textureSample(myTexture, mySampler, TexCoord);
        }

        `
    });

    const renderPipeline = device.createRenderPipeline({
        vertex: {
            module: renderModule,
            entryPoint: 'vs_main',
            buffers: [
                bufferLayout
            ]
        },
        fragment: {
            module: renderModule,
            entryPoint: 'fs_main',
            targets: [{
                format: 'bgra8unorm'
            }]
        },
        primitive: {
            topology: 'triangle-list'
        },
        layout: renderPipelineLayout
    });

    const renderCommandEncoder = device.createCommandEncoder();

    const renderPass = renderCommandEncoder.beginRenderPass({
        colorAttachments: [{
            view: ctx.getCurrentTexture().createView(),
            // Christmassy green
            clearValue: { r: 0.0, g: 0.5, b: 0.0, a: 0.5 },
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });

    const t = 0.0;

    // Make transforms
    const projection = mat4.create();
    mat4.perspective(
        projection,
        Math.PI / 8,
        source.width / source.height,
        1,
        100
    );

    const view = mat4.create();
    mat4.lookAt(view, [-2, 0, 2], [0, 0, 0], [0, 0, 1]);

    const model = mat4.create();
    mat4.rotate(model, model, t, [0, 0, 0]);

    device.queue.writeBuffer(renderBuffer, 0, new Float32Array(model));
    device.queue.writeBuffer(renderBuffer, 64, new Float32Array(view));
    device.queue.writeBuffer(renderBuffer, 128, new Float32Array(projection));

    renderPass.setPipeline(renderPipeline);
    renderPass.setBindGroup(0, renderBindGroup);
    renderPass.setVertexBuffer(0, vertexBuffer);

    renderPass.draw(3, 1, 0, 0);
    renderPass.end();

    device.queue.submit([renderCommandEncoder.finish()]);

    const renderEnd = performance.now();

    /* eslint-disable no-console */
    console.log('render pass took:', renderEnd - renderStart, 'ms');
    /* eslint-enable no-console */
}

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

    // Buffer to pass parameters
    const paramsBuffer = device.createBuffer({
        mappedAtCreation: true,
        size: Uint32Array.BYTES_PER_ELEMENT * 1,
        usage: GPUBufferUsage.STORAGE
    });

    const paramsRange = paramsBuffer.getMappedRange();
    new Uint32Array(paramsRange)
        .set([
            BLOCK_SIZE
        ]);
    paramsBuffer.unmap();

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
                    type: 'read-only-storage'
                }
            },
            {
                binding: 2,
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
                    buffer: paramsBuffer
                }
            },
            {
                binding: 2,
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

    const workgroupSize = Math.ceil(height / BLOCK_SIZE);
    const numberOfWorkgroups = workgroupSize / BLOCK_SIZE;
    console.log(
        'Dispatching',
        Math.ceil(numberOfWorkgroups),
        'workgroups'
    ) ;

    passEncoder.dispatchWorkgroups(
        numberOfWorkgroups
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
    console.log('Compute pass done in', end - start, 'ms');
    console.log(copyArrayBuffer);

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

        const { shaderCode, renderPass } = options;
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

            if (renderPass) {
                const source = await createImageBitmap(
                    new ImageData(
                        new Uint8ClampedArray(copyArrayBuffer),
                        width,
                        height
                    )
                );

                postProcess(device, source, ctx);
                const blob = await offscreenCanvas.convertToBlob();

                self.postMessage({ done: true, blob });
                return;
            }

            // Bit of a workaround,
            // could be avoided if we don't set the context to webgpu earlier
            const tempCanvas = new OffscreenCanvas(width, height);
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
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
