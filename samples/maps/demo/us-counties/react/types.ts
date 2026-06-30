import type { MapSeries } from "@highcharts/react/series/Map";

export type TopoJSONGeometry = {
    properties: {
        "hc-key"?: string;
        "name"?: string;
    };
};

export type FetchedMapData = {
    objects: {
        default: {
            geometries: TopoJSONGeometry[];
        };
    };
};

export type MapSeriesData = NonNullable<
    Parameters<typeof MapSeries>[0]["data"]
>;
