import type { ScatterSeriesProps } from '@highcharts/react/series/Scatter';

export type Athlete = {
    sport: string;
    weight: number;
    height: number;
    continent: string;
};

export type ScatterSeriesConfig = {
    id: string;
    name: string;
    marker: { symbol: string };
    data: NonNullable<ScatterSeriesProps['data']>;
};
