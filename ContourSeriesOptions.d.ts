import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

export default interface ContourOptions extends ScatterSeriesOptions {
    smoothColoring?: boolean;
    showContourLines?: boolean;
    contourInterval?: number;
}
