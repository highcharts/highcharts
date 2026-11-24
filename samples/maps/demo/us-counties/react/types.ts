import type { MapSeriesProps } from '@highcharts/react/series/Map';

export type CountyTopology = {
    objects: {
        default: {
            geometries: Array<{
                properties: {
                    'name': string;
                    'hc-key'?: string;
                };
            }>;
        };
    };
};

export type MapData = NonNullable<MapSeriesProps['data']>;
