import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title, YAxis, PlotOptions } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { FlagsSeries } from '@highcharts/react/series/Flags';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function FlagsShapesChart() {
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

    const year = new Date(data[data.length - 1][0]).getFullYear(); // Get year of last data point

    return (
        <StockChart
            options={{
                rangeSelector: {
                    selected: 4
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>USD to EUR exchange rate</Title>
            <YAxis>Exchange rate</YAxis>
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
                data={[
                    {
                        x: Date.UTC(year, 1, 22),
                        title: 'A',
                        text: 'Shape: "squarepin"'
                    },
                    {
                        x: Date.UTC(year, 3, 28),
                        title: 'A',
                        text: 'Shape: "squarepin"'
                    }
                ]}
                options={{
                    onSeries: 'dataseries',
                    shape: 'squarepin',
                    borderRadius: 3,
                    width: 16
                }}
            />
            <FlagsSeries
                data={[
                    {
                        x: Date.UTC(year, 2, 1),
                        title: 'B',
                        text: 'Shape: "circlepin"'
                    },
                    {
                        x: Date.UTC(year, 3, 1),
                        title: 'B',
                        text: 'Shape: "circlepin"'
                    }
                ]}
                options={{
                    shape: 'circlepin',
                    width: 16
                }}
            />
            <FlagsSeries
                data={[
                    {
                        x: Date.UTC(year, 2, 10),
                        title: 'C',
                        text: 'Shape: "flag"'
                    },
                    {
                        x: Date.UTC(year, 3, 11),
                        title: 'C',
                        text: 'Shape: "flag"'
                    }
                ]}
                color="var(--highcharts-color-0)" // same as onSeries
                options={{
                    fillColor: 'var(--highcharts-color-0)',
                    onSeries: 'dataseries',
                    width: 16,
                    style: {
                        // text style
                        color: 'white'
                    },
                    states: {
                        hover: {
                            fillColor: '#395C84' // darker
                        }
                    }
                }}
            />
        </StockChart>
    );
}
