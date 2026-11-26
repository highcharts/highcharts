import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title, Tooltip } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import type { LineSeriesProps } from '@highcharts/react/series/Line';
import { TrendLineSeries } from '@highcharts/react/indicators/TrendLine';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function MarkersOnlyChart() {
    const [data, setData] = useState<NonNullable<
        LineSeriesProps['data']
    > | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Load the dataset
        fetch('https://demo-live-data.highcharts.com/aapl-c.json')
            .then((response) => response.json())
            .then((json) => {
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

    // Create the chart
    return (
        <StockChart
            options={{
                rangeSelector: {
                    selected: 2
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>AAPL Stock Price</Title>
            <Tooltip valueDecimals={2} valueSuffix=" USD" />
            <Exporting />
            <Accessibility />
            <LineSeries
                name="AAPL Stock Price"
                id="aapl"
                data={data}
                options={{
                    lineWidth: 0,
                    marker: {
                        enabled: true,
                        radius: 2
                    },
                    states: {
                        hover: {
                            lineWidthPlus: 0
                        }
                    }
                }}
            />
            <TrendLineSeries
                options={{
                    linkedTo: 'aapl',
                    marker: {
                        enabled: false
                    }
                }}
            />
        </StockChart>
    );
}
