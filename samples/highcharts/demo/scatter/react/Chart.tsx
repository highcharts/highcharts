import { useEffect, useState } from 'react';
import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Legend,
    PlotOptions,
    Tooltip
} from '@highcharts/react';
import { ScatterSeries } from '@highcharts/react/series/Scatter';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { Athlete, ScatterSeriesConfig } from './types';

const seriesTemplate: Omit<ScatterSeriesConfig, 'data'>[] = [
    { id: 'triathlon', name: 'Triathlon', marker: { symbol: 'triangle' } },
    { id: 'volleyball', name: 'Volleyball', marker: { symbol: 'square' } },
    { id: 'basketball', name: 'Basketball', marker: { symbol: 'circle' } }
];

async function getData(): Promise<Athlete[]> {
    const response = await fetch(
        'https://www.highcharts.com/samples/data/olympic2012.json'
    );
    return response.json();
}

export default function ScatterChart() {
    const [series, setSeries] = useState<ScatterSeriesConfig[] | null>(null);

    useEffect(() => {
        let cancelled = false;

        getData()
            .then((data) => {
                if (cancelled) return;
                setSeries(
                    seriesTemplate.map((template) => ({
                        ...template,
                        data: data
                            .filter(
                                (athlete) =>
                                    athlete.sport === template.id &&
                                    athlete.weight > 0 &&
                                    athlete.height > 0 &&
                                    athlete.continent === 'Europe'
                            )
                            .map((athlete): [number, number] => [
                                athlete.weight,
                                athlete.height
                            ])
                    }))
                );
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!series) return null;

    return (
        <Chart
            options={{
                chart: {
                    plotBorderColor:
                        'var(--highcharts-neutral-color-10, #e6e6e6)',
                    plotBorderWidth: 1,
                    plotBorderRadius: 5,
                    zooming: {
                        type: 'xy'
                    }
                }
            }}
            containerProps={{
                style: { maxWidth: '800px', height: '500px', margin: 'auto' }
            }}
        >
            <Accessibility />
            <Exporting />
            <Title align="left">
                European olympic athletes by height and weight
            </Title>
            {/* @ts-expect-error */}
            <Subtitle align="left">
                Source:{' '}
                <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">
                    The Guardian
                </a>
            </Subtitle>
            <XAxis
                labels={{ format: '{value} kg' }}
                gridLineWidth={1}
                lineWidth={0}
                startOnTick
                endOnTick
                tickLength={0}
            />
            <YAxis labels={{ format: '{value:.1f} m' }}>Height</YAxis>
            <Legend enabled padding={0} />
            <PlotOptions
                scatter={{
                    marker: {
                        states: {
                            hover: {
                                enabled: true,
                                lineColor:
                                    'var(--highcharts-neutral-color-60, #666)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    jitter: {
                        x: 0.005
                    }
                }}
            />
            <Tooltip pointFormat="Weight: {point.x} kg <br/> Height: {point.y:.2f} m" />
            {series.map((s) => (
                <ScatterSeries
                    key={s.id}
                    id={s.id}
                    name={s.name}
                    data={s.data}
                    options={{ marker: s.marker }}
                />
            ))}
        </Chart>
    );
}
