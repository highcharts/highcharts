import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title } from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import type { ColumnSeriesProps } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ColumnChart() {
    const [data, setData] = useState<NonNullable<
        ColumnSeriesProps['data']
    > | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch('https://demo-live-data.highcharts.com/aapl-v.json')
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

    if (!data) {
        return null;
    }

    return (
        <StockChart
            options={{
                chart: {
                    alignTicks: false
                },
                rangeSelector: {
                    selected: 1
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>AAPL Stock Volume</Title>
            <Exporting />
            <Accessibility />
            <ColumnSeries
                name="AAPL Stock Volume"
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
        </StockChart>
    );
}
