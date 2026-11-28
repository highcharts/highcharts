import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title } from '@highcharts/react';
import { SplineSeries } from '@highcharts/react/series/Spline';
import type { SplineSeriesProps } from '@highcharts/react/series/Spline';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function SplineChart() {
    const [data, setData] = useState<NonNullable<
        SplineSeriesProps['data']
    > | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Load the dataset
        fetch('https://demo-live-data.highcharts.com/aapl-c.json')
            .then((response) => response.json())
            .then((json: NonNullable<SplineSeriesProps['data']>) => {
                if (!cancelled) {
                    setData(json);
                }
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!data) {
        return null;
    }

    return (
        <StockChart
            options={{
                rangeSelector: {
                    selected: 1
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>AAPL Stock Price</Title>
            <Exporting />
            <Accessibility />
            <SplineSeries
                name="AAPL Stock Price"
                data={data}
                options={{
                    tooltip: {
                        valueDecimals: 2
                    }
                }}
            />
        </StockChart>
    );
}
