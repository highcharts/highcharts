import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title, YAxis, PlotOptions } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { FlagsSeries } from '@highcharts/react/series/Flags';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function FlagsPlacementChart() {
    const [data, setData] = useState<[number, number][] | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Load the dataset
        fetch('https://www.highcharts.com/samples/data/usdeur.json')
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

    const lastDate = data[data.length - 1][0], // Get year of last data point
        days = 24 * 36e5; // Milliseconds in a day

    return (
        <StockChart
            options={{
                rangeSelector: {
                    selected: 1
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>USD to EUR exchange rate</Title>
            <YAxis top="15%" height="85%">
                Exchange rate
            </YAxis>
            <YAxis height="15%" />
            <PlotOptions
                flags={{
                    accessibility: {
                        exposeAsGroupOnly: true,
                        description: 'Flagged events.'
                    }
                }}
            />
            <Exporting />
            <Accessibility />
            <LineSeries
                name="USD to EUR"
                data={data}
                id="dataseries"
                options={{
                    tooltip: {
                        valueDecimals: 4
                    }
                }}
            />
            <FlagsSeries
                name="Flags on series"
                data={[
                    {
                        x: lastDate - 60 * days,
                        title: 'On series'
                    },
                    {
                        x: lastDate - 30 * days,
                        title: 'On series'
                    }
                ]}
                options={{
                    onSeries: 'dataseries',
                    shape: 'squarepin'
                }}
            />
            <FlagsSeries
                name="Flags on axis"
                data={[
                    {
                        x: lastDate - 45 * days,
                        title: 'On axis'
                    },
                    {
                        x: lastDate - 15 * days,
                        title: 'On axis'
                    }
                ]}
                options={{
                    shape: 'squarepin'
                }}
            />
            <FlagsSeries
                name="Flags in pane"
                data={[
                    {
                        x: lastDate - 40 * days,
                        title: 'In pane'
                    },
                    {
                        x: lastDate - 15 * days,
                        title: 'In pane'
                    }
                ]}
                options={{
                    yAxis: 1,
                    shape: 'squarepin'
                }}
            />
        </StockChart>
    );
}
