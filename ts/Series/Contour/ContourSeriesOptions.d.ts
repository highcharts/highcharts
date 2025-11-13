import ColorType from '../../Core/Color/ColorType';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

export default interface ContourSeriesOptions extends ScatterSeriesOptions {
    smoothColoring?: boolean;
    showContourLines?: boolean;
    contourInterval?: number;
    contourOffsets?: number[];
    lineColor?: ColorType; // Kept because we might want alternate docs
    lineWidth?: number; // Kept because we might want alternate docs
}
