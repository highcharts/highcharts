import { useState, useEffect } from 'react';
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
import type { Athlete, SeriesData } from './types';

export default function Scatter() {
    const [seriesData, setSeriesData] = useState<SeriesData | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch('https://www.highcharts.com/samples/data/olympic2012.json')
            .then((res) => res.json() as Promise<Athlete[]>)
            .then((data) => {
                if (cancelled) return;

                const filterBySport = (sport: string): [number, number][] =>
                    data
                        .filter(
                            (a) =>
                                a.sport === sport &&
                                a.weight > 0 &&
                                a.height > 0 &&
                                a.continent === 'Europe'
                        )
                        .map((a) => [a.weight, a.height]);

                setSeriesData({
                    triathlon: filterBySport('triathlon'),
                    volleyball: filterBySport('volleyball'),
                    basketball: filterBySport('basketball')
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setSeriesData({
                        triathlon: [],
                        volleyball: [],
                        basketball: []
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (!seriesData) return null;

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
            <Exporting />
            <Accessibility />
            <Title align="left">
                European olympic athletes by height and weight
            </Title>
            <Subtitle align="left">
                {
                    'Source: <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">The Guardian</a>'
                }
            </Subtitle>
            <XAxis
                labels={{ format: '{value} kg' }}
                gridLineWidth={1}
                lineWidth={0}
                startOnTick={true}
                endOnTick={true}
                tickLength={0}
            />
            <YAxis labels={{ format: '{value:.1f} m' }}>Height</YAxis>
            <Legend enabled={true} padding={0} />
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
            <ScatterSeries
                name="Triathlon"
                id="triathlon"
                options={{ marker: { symbol: 'triangle' } }}
                data={seriesData.triathlon}
            />
            <ScatterSeries
                name="Volleyball"
                id="volleyball"
                options={{ marker: { symbol: 'square' } }}
                data={seriesData.volleyball}
            />
            <ScatterSeries
                name="Basketball"
                id="basketball"
                options={{ marker: { symbol: 'circle' } }}
                data={seriesData.basketball}
            />
        </Chart>
    );
}
