import React, { useEffect, useState } from 'react';
import { MapsChart } from '@highcharts/react/Maps';
import {
    Title,
    Subtitle,
    Legend,
    PlotOptions,
    Tooltip
} from '@highcharts/react';
import { MapSeries } from '@highcharts/react/series/Map';
import { MapLineSeries } from '@highcharts/react/series/MapLine';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { FetchedMapData, MapSeriesData } from './types';

const UsCounties = React.memo(function UsCounties() {
    const [mapData, setMapData] = useState<FetchedMapData | null>(null);
    const [data, setData] = useState<MapSeriesData | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetch(
                'https://code.highcharts.com/mapdata/countries/us/us-all-all.topo.json'
            ).then((response) => response.json() as Promise<FetchedMapData>),
            fetch(
                'https://www.highcharts.com/samples/data/us-counties-unemployment.json'
            ).then((response) => response.json() as Promise<MapSeriesData>)
        ])
            .then(([fetchedMapData, fetchedData]) => {
                if (cancelled) return;

                // Add state acronym for tooltip
                fetchedMapData.objects.default.geometries.forEach((g) => {
                    const properties = g.properties;
                    if (properties['hc-key']) {
                        properties.name =
                            (properties.name ?? '') +
                            ', ' +
                            properties['hc-key'].substr(3, 2).toUpperCase();
                    }
                });

                setMapData(fetchedMapData);
                setData(fetchedData);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, []);

    if (!mapData || !data) return null;

    return (
        <MapsChart
            options={{
                chart: {
                    map: mapData as unknown as import('highcharts').GeoJSON,
                    height: '80%'
                },
                mapNavigation: {
                    enabled: true
                },
                colorAxis: {
                    min: -1,
                    max: 26,
                    tickInterval: 5,
                    labels: {
                        format: '{value}%'
                    },
                    startOnTick: false,
                    endOnTick: false,
                    minColor: '#ebf1ff',
                    maxColor: '#0048ff',
                    // Dots for ticks, extended also by custom CSS
                    tickColor: '#ffffff',
                    tickLength: 0.1,
                    tickWidth: 6,
                    gridLineWidth: 0,
                    marker: {
                        symbol: 'circle',
                        color: 'transparent',
                        lineColor: '#fff',
                        lineWidth: 3
                    }
                }
            }}
            containerProps={{
                style: {
                    maxWidth: '800px',
                    minWidth: '360px',
                    margin: '0 auto'
                }
            }}
        >
            <Title align="left">US Counties unemployment rates</Title>
            <Subtitle align="left">January 2018</Subtitle>
            <Accessibility description="Demo showing a large dataset." />
            <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                y={42}
                margin={0}
                borderColor="var(--highcharts-neutral-color-5, #f2f2f2)"
                borderWidth={1}
                borderRadius={8}
                backgroundColor="var(--highcharts-background-color, white)"
                padding={10}
                shadow={{ width: 1, opacity: 0.03 }}
                symbolRadius={6}
            />
            <PlotOptions
                mapline={{ showInLegend: false, enableMouseTracking: false }}
            />
            <Tooltip>
                <div data-hc-option="headerFormat">
                    <b>{'{point.name}'}</b>
                    <hr style={{ border: '0', borderTop: '1px solid #8884' }} />
                </div>
                <div data-hc-option="pointFormat">
                    <span style={{ color: '{point.color}' }}>{'● '}</span>
                    <span
                        style={{
                            paddingRight: '1em',
                            color: 'var(--highcharts-neutral-color-40)'
                        }}
                    >
                        {'{series.name}'}
                    </span>
                    <b>{'{point.value}'}</b>
                </div>
            </Tooltip>
            <Exporting />
            <MapSeries
                data={data}
                name="Unemployment rate"
                options={
                    {
                        joinBy: ['hc-key', 'code'],
                        tooltip: { valueSuffix: '%' },
                        borderWidth: 0.5,
                        shadow: false,
                        accessibility: { enabled: false }
                    } as unknown as Parameters<typeof MapSeries>[0]['options']
                }
            />
            <MapLineSeries
                name="State borders"
                color="white"
                options={
                    {
                        shadow: false,
                        borderWidth: 2,
                        accessibility: { enabled: false }
                    } as unknown as Parameters<
                        typeof MapLineSeries
                    >[0]['options']
                }
            />
        </MapsChart>
    );
});

export default UsCounties;
