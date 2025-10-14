import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

export default interface ContourOptions extends ScatterSeriesOptions {
    smoothColoring?: boolean;
    showContourLines?: boolean;
    contourInterval?: number;
    // Defaults to black
    clearValue?: GPUColor;
    // No transparency, defaults to black
    contourLineColor?: [number, number, number];
    // Defaults to 1. Device Pixel Ratio insted?
    contourLineWidth?: number;
}
