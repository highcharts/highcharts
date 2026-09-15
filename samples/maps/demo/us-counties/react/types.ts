import type { MapSeries } from '@highcharts/react/series/Map';

export type MapPointData = NonNullable<Parameters<typeof MapSeries>[0]['data']>;
