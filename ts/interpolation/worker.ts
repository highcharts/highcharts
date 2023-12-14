self.addEventListener('message', function (e): void {
    async function doTheWork(): Promise<void> {
        let offscreenCanvas = e.data.canvas;

        let pixelData = e.data.pixelData;
        const { width, height } = e.data;
        let ctx = offscreenCanvas.getContext('2d');

        // Example color modification: inverting colors
        // for (let i = 0; i < pixelData.length; i += 4) {
        //     pixelData[i] = 255 - pixelData[i];     // Red
        //     pixelData[i + 1] = 255 - pixelData[i + 1]; // Green
        //     pixelData[i + 2] = 255 - pixelData[i + 2]; // Blue
        // }

        ctx.putImageData(
            new ImageData(
                pixelData,
                width,
                height
            ),
            0,
            0
        );

        const blob = await offscreenCanvas.convertToBlob({
            type: 'image/png'
        });

        self.postMessage({ done: true, blob });
    }

    doTheWork();
});
