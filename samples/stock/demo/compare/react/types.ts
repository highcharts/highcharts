import type { LineSeriesProps } from '@highcharts/react/series/Line';

export type SeriesData = {
    name: string;
    data: NonNullable<LineSeriesProps['data']>;
};
