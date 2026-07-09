import { StockChart } from '@highcharts/react/Stock';
import { Title, Subtitle, Tooltip, YAxis } from '@highcharts/react';
import { CandlestickSeries } from '@highcharts/react/series/Candlestick';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import { useEffect, useState } from 'react';
import type { CandlestickData } from './types';

export default function CandlestickChart() {
    const [data, setData] = useState<CandlestickData | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch('https://demo-live-data.highcharts.com/aapl-ohlc.json')
            .then((response) => response.json())
            .then((json: CandlestickData) => {
                if (!cancelled) {
                    setData(json);
                }
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
                    selected: 1
                },
                scrollbar: {
                    enabled: false
                },
                navigator: {
                    height: 72,
                    maskFill: 'rgba(44, 175, 254, 0.15)',
                    handles: {
                        width: 12,
                        borderRadius: 4
                    },
                    series: {
                        fillColor: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(0, 117, 219, 0.12)'],
                                [1, 'rgba(0, 113, 219, 0)']
                            ]
                        }
                    } as unknown as Highcharts.NavigatorSeriesOptions,
                    xAxis: {
                        lineWidth: 1,
                        lineColor: 'var(--highcharts-neutral-color-40, #999)'
                    },
                    yAxis: {
                        lineWidth: 1,
                        lineColor: 'var(--highcharts-neutral-color-40, #999)'
                    }
                }
            }}
            containerProps={{ style: { height: '600px', minWidth: '310px' } }}
        >
            <Title align="left">AAPL Stock Price</Title>
            <Subtitle align="left">Generated from Google Finance API</Subtitle>
            <YAxis maxPadding={0.25} />
            <Tooltip
                fixed
                header={{
                    borderColor: 'var(--highcharts-neutral-color-20)',
                    borderWidth: 1
                }}
                valueDecimals={2}
                valuePrefix="$"
                pointFormat={`
                <table>
                    <tr>
                        <td rowspan="5" style="vertical-align: top;">
                            <svg width="14" height="14">
                                <circle cx="6" cy="7" r="5" fill="{point.color}"
                                    stroke="var(--highcharts-neutral-color-80)"
                                    stroke-width="1" />
                            </svg>
                        </td>
                        <td colspan="2"><b>{series.name}</b></td>
                    </tr>
                    <tr>
                        <th>Open</th>
                        <td>{point.open}</td>
                    </tr>
                    <tr>
                        <th>High</th>
                        <td>{point.high}</td>
                    </tr>
                    <tr>
                        <th>Low</th>
                        <td>{point.low}</td>
                    </tr>
                    <tr>
                        <th>Close</th>
                        <td>{point.close}</td>
                    </tr>
                </table>`}
            />
            <CandlestickSeries
                name="AAPL Stock Price"
                data={data}
                options={{
                    dataGrouping: {
                        units: [
                            [
                                'week', // unit name
                                [1] // allowed multiples
                            ],
                            ['month', [1, 2, 3, 4, 6]]
                        ]
                    }
                }}
            />
            <Exporting />
            <Accessibility />
        </StockChart>
    );
}
