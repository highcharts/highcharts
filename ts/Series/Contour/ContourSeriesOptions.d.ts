import ColorType from '../../Core/Color/ColorType';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

export default interface ContourSeriesOptions extends ScatterSeriesOptions {
    smoothColoring?: boolean;
    showContourLines?: boolean;
    contourInterval?: number;
    // No transparency, defaults to black
    lineColor?: ColorType;
    // Defaults to 1. Device Pixel Ratio insted?
    lineWidth?: number;
}
