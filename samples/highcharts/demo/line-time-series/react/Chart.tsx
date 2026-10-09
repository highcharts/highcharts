import { useEffect, useState } from 'react';
import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Legend,
    PlotOptions
} from '@highcharts/react';
import { AreaSeries } from '@highcharts/react/series/Area';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function LineTimeSeriesChart() {
    const [data, setData] = useState<[number, number][] | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch('https://www.highcharts.com/samples/data/usdeur.json')
            .then((response) => response.json())
            .then((result: [number, number][]) => {
                if (!cancelled) setData(result);
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!data) return null;

    return (
        <Chart
            options={{
                chart: {
                    zooming: {
                        type: 'x'
                    }
                }
            }}
        >
            <Title>USD to EUR exchange rate over time</Title>
            <Subtitle>
                {document.ontouchstart === undefined
                    ? 'Click and drag in the plot area to zoom in'
                    : 'Pinch the chart to zoom in'}
            </Subtitle>
            <XAxis type="datetime" />
            <YAxis>Exchange rate</YAxis>
            <Legend enabled={false} />
            <PlotOptions
                area={{
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    color: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, 'rgb(199, 113, 243)'],
                            [0.7, 'rgb(76, 175, 254)']
                        ]
                    },
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }}
            />
            <Exporting />
            <Accessibility />
            <AreaSeries name="USD to EUR" data={data} />
        </Chart>
    );
}
