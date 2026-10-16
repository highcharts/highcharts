import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title, Tooltip } from '@highcharts/react';
import { AreaRangeSeries } from '@highcharts/react/series/AreaRange';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { TemperatureData } from './types';

export default function ArearangeChart() {
    const [data, setData] = useState<TemperatureData | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Notice that the dataset has missing data
        // Data taken from https://seklima.met.no/
        fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@d2270f7c/samples/data/temp-range.json'
        )
            .then((response) => response.json())
            .then((json: TemperatureData) => {
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
            <AreaRangeSeries name="Temperatures" data={data} />
        </StockChart>
    );
}
