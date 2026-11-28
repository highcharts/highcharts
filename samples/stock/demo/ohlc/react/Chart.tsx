import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title } from '@highcharts/react';
import { OHLCSeries } from '@highcharts/react/series/OHLC';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { OhlcData } from './types';

export default function OhlcChart() {
    const [data, setData] = useState<OhlcData | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Load the dataset
        fetch('https://demo-live-data.highcharts.com/aapl-ohlc.json')
            .then((response) => response.json())
            .then((json: OhlcData) => {
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
                    selected: 2
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>AAPL Stock Price</Title>
            <Exporting />
            <Accessibility />
            <OHLCSeries
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
        </StockChart>
    );
}
