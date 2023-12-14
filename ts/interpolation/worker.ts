self.addEventListener('message', function (e): void {
    async function doTheWork(): Promise<void> {
        let offscreenCanvas = e.data.canvas;

        let pixelData = e.data.pixelData;
        const { width, height } = e.data;
        let ctx = offscreenCanvas.getContext('2d');

        // Mostly copy-pasted from https://developer.chrome.com/docs/capabilities/web-apis/gpu-compute
        if('gpu' in navigator){
            let start = performance.now();
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) { return; }
            const device = await adapter.requestDevice();

            const gpuBuffer = device.createBuffer({
                mappedAtCreation: true,
                size: pixelData.byteLength,
                usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC
            });

            new Uint8ClampedArray(gpuBuffer.getMappedRange()).set(pixelData);

            gpuBuffer.unmap();

            const gpuReadBuffer = device.createBuffer({
                size: pixelData.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            });

            // Encode commands for copying buffer to buffer.
            const copyEncoder = device.createCommandEncoder();
            copyEncoder.copyBufferToBuffer(
                gpuBuffer /* source buffer */,
                0 /* source offset */,
                gpuReadBuffer /* destination buffer */,
                0 /* destination offset */,
                pixelData.byteLength
            );


            // Submit copy commands.
            const copyCommands = copyEncoder.finish();
            device.queue.submit([copyCommands]);

            await gpuReadBuffer.mapAsync(GPUMapMode.READ);
            const copyArrayBuffer = gpuReadBuffer.getMappedRange();

            let end = performance.now();
            console.log(end - start);

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
