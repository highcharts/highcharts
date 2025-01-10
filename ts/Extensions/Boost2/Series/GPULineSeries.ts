import Series from "../../../Core/Series/Series.js";
import SeriesRegistry from "../../../Core/Series/SeriesRegistry.js";

class GPULineSeries extends Series {
    public render(): void {
        const chart = this.chart as any;

        if (!chart.webGPUCanvas) {
            chart.webGPUCanvas = document.createElement('canvas');
            const canvas = chart.webGPUCanvas;

            canvas.style.left = chart.plotLeft + 'px';
            canvas.style.top = chart.plotTop + 'px';
            canvas.style.width = chart.plotWidth + 'px';
            canvas.style.height = chart.plotHeight + 'px';
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            canvas.style.position = 'absolute';
            this.chart.container.appendChild(canvas);
        }
    }
}

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        gpuline: typeof GPULineSeries;
    }
}
SeriesRegistry.registerSeriesType('gpuline', GPULineSeries);

export default GPULineSeries;
