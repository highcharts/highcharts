import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title, Tooltip } from '@highcharts/react';
import { ColumnRangeSeries } from '@highcharts/react/series/ColumnRange';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { TemperatureData } from './types';

import 'highcharts/es-modules/masters/modules/coloraxis.src.js';

export default function ColumnrangeChart() {
    const [data, setData] = useState<TemperatureData | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Notice that the dataset has missing data
        fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@d2270f7c/samples/data/temp-range.json'
        )
            .then((response) => response.json())
            .then((json: TemperatureData) => {
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
                colorAxis: {
                    stops: [
                        [0, '#1E90FF'],
                        [0.5, '#FFFF99'],
                        [1, '#FF3333']
                    ]
                },
                rangeSelector: {
                    selected: 2
                }
            }}
            containerProps={{
                style: { minWidth: '310px', height: '400px', margin: '0 auto' }
            }}
        >
            <Title>Temperature variation by day</Title>
            <Tooltip valueSuffix="°C" />
            <Exporting />
            <Accessibility />
            <ColumnRangeSeries name="Temperatures" data={data} />
        </StockChart>
    );
}
