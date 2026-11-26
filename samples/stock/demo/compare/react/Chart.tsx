import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { YAxis, PlotOptions, Tooltip } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { SeriesData } from './types';

/**
 * Create the chart when all data is loaded
 */
function Comparison({ series }: { series: SeriesData[] }) {
    return (
        <StockChart
            options={{
                rangeSelector: {
                    selected: 4
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <YAxis
                labels={{
                    format: '{#if (gt value 0)}+{/if}{value}%'
                }}
                plotLines={[
                    {
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }
                ]}
            />
            <PlotOptions
                series={{
                    compare: 'percent',
                    showInNavigator: true
                }}
            />
            <Tooltip
                pointFormat={
                    '<span style="color:{series.color}">' +
                    '{series.name}</span>: <b>{point.y}</b> ' +
                    '({point.change}%)<br/>'
                }
                valueDecimals={2}
                split
            />
            <Exporting />
            <Accessibility />
            {series.map(({ name, data }) => (
                <LineSeries key={name} name={name} data={data} />
            ))}
        </StockChart>
    );
}

// Data from nasdaq.com
const names = ['MSFT', 'AAPL', 'GOOG'];

export default function CompareChart() {
    const [series, setSeries] = useState<SeriesData[] | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all(
            names.map((name) =>
                fetch(
                    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/' +
                        'samples/data/' +
                        name.toLowerCase() +
                        '-c.json'
                )
                    .then((response) => response.json())
                    .then((data) => ({ name, data }))
            )
        )
            .then((result) => {
                if (!cancelled) {
                    setSeries(result);
                }
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!series) {
        return null;
    }

    return <Comparison series={series} />;
}
