import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SunburstDataLabelOptions from './SunburstDataLabelOptions';
import type SunburstSeries from './SunburstSeries';
import type {
    TreemapSeriesLevelsColorVariationOptions,
    TreemapSeriesLevelsOptions,
    TreemapSeriesOptions
} from '../Treemap/TreemapSeriesOptions';

export interface SunburstSeriesLevelsColorVariationOptions extends TreemapSeriesLevelsColorVariationOptions {
    key?: string;
    to?: number;
}

export interface SunburstSeriesLevelSizeOptions {
    unit?: string;
    value?: number;
}

export interface SunburstSeriesLevelOptions extends TreemapSeriesLevelsOptions {
    borderColor?: ColorType;
    borderDashStyle?: DashStyleValue;
    borderWidth?: number;
    color?: ColorType;
    colorVariation?: SunburstSeriesLevelsColorVariationOptions;
    dataLabels?: SunburstDataLabelOptions;
    levelSize?: unknown;
    rotation?: number;
    rotationMode?: string;
}

export interface SunburstSeriesOptions extends TreemapSeriesOptions {
    center?: Array<(number|string|null)>;
    dataLabels?: (SunburstDataLabelOptions|Array<SunburstDataLabelOptions>);
    endAngle?: number;
    levels?: Array<SunburstSeriesLevelOptions>;
    levelSize?: SunburstSeriesLevelSizeOptions;
    mapIdToNode?: SunburstSeries['nodeMap'];
    rootId?: string;
    slicedOffset?: number;
    startAngle?: number;
    states?: SeriesStatesOptions<SunburstSeries>;
}

export default SunburstSeriesOptions;
