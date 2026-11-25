import { useEffect, useState } from 'react';
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
import type { CountyTopology, MapData } from './types';
import { addStateAcronyms } from './utils';

export default function UsCountiesChart() {
    const [mapData, setMapData] = useState<CountyTopology | null>(null);
    const [data, setData] = useState<MapData | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetch(
                'https://code.highcharts.com/mapdata/countries/us/us-all-all.topo.json'
            ).then((response) => response.json()),
            fetch(
                'https://www.highcharts.com/samples/data/us-counties-unemployment.json'
            ).then((response) => response.json())
        ])
            .then(([topology, unemployment]: [CountyTopology, MapData]) => {
                if (cancelled) return;
                addStateAcronyms(topology);
                setMapData(topology);
                setData(unemployment);
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!mapData || !data) return <>Downloading map...</>;

    return (
        <MapsChart
            height="80%"
            options={{
                chart: {
                    map: mapData
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
            containerProps={{ id: 'container' }}
        >
            <Title align="left">US Counties unemployment rates</Title>
            <Subtitle align="left">January 2018</Subtitle>
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
                shadow={{
                    width: 1,
                    opacity: 0.03
                }}
                symbolRadius={6}
            />
            <PlotOptions
                mapline={{
                    showInLegend: false,
                    enableMouseTracking: false
                }}
            />
            <Tooltip>
                <div data-hc-option="headerFormat">
                    <b>{'{point.name}'}</b>
                    <hr style={{ border: 0, borderTop: '1px solid #8884' }} />
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
            <Accessibility description="Demo showing a large dataset." />
            <Exporting />
            <MapSeries
                name="Unemployment rate"
                data={data}
                options={{
                    joinBy: ['hc-key', 'code'],
                    tooltip: {
                        valueSuffix: '%'
                    },
                    borderWidth: 0.5,
                    accessibility: {
                        enabled: false
                    }
                }}
            />
            <MapLineSeries
                name="State borders"
                color="white"
                options={{
                    borderWidth: 2,
                    accessibility: {
                        enabled: false
                    }
                }}
            />
        </MapsChart>
    );
}
