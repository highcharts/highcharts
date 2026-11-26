import { useState, useEffect } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title, Subtitle, XAxis } from '@highcharts/react';
import { AreaSeries } from '@highcharts/react/series/Area';
import type { AreaSeriesProps } from '@highcharts/react/series/Area';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function IntradayBreaksChart() {
    const [data, setData] = useState<NonNullable<
        AreaSeriesProps['data']
    > | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Load the dataset
        fetch('https://www.highcharts.com/samples/data/new-intraday.json')
            .then((response) => response.json())
            .then((json: NonNullable<AreaSeriesProps['data']>) => {
                if (!cancelled) setData(json);
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!data) return null;

    return (
        <StockChart
            options={{
                rangeSelector: {
                    buttons: [
                        {
                            type: 'hour',
                            count: 1,
                            text: '1h'
                        },
                        {
                            type: 'day',
                            count: 1,
                            text: '1D'
                        },
                        {
                            type: 'all',
                            count: 1,
                            text: 'All'
                        }
                    ],
                    selected: 1,
                    inputEnabled: false
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>AAPL stock price by minute</Title>
            <Subtitle>Using explicit breaks for nights and weekends</Subtitle>
            <XAxis
                breaks={[
                    {
                        // Nights
                        from: '2011-10-06 16:00',
                        to: '2011-10-07 08:00',
                        repeat: 24 * 36e5
                    },
                    {
                        // Weekends
                        from: '2011-10-07 16:00',
                        to: '2011-10-10 08:00',
                        repeat: 7 * 24 * 36e5
                    }
                ]}
            />
            <Exporting />
            <Accessibility />
            <AreaSeries
                name="AAPL"
                data={data}
                options={{
                    gapSize: 5,
                    tooltip: {
                        valueDecimals: 2
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, 'var(--highcharts-color-0, #2caffe)'],
                            [
                                1,
                                `color-mix(
                            in srgb,
                            var(--highcharts-color-0, #2caffe) 25%,
                            transparent
                        )`
                            ]
                        ]
                    },
                    threshold: null
                }}
            />
        </StockChart>
    );
}
