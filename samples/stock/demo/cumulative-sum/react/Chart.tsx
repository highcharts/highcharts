import { StockChart } from '@highcharts/react/Stock';
import {
    Title,
    Subtitle,
    Highcharts,
    PlotOptions,
    Tooltip,
    XAxis
} from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

const dataTable = new Highcharts.DataTable({
    columns: {
        'Date': [
            '2023-01-01',
            '2023-01-02',
            '2023-01-03',
            '2023-01-04',
            '2023-01-05',
            '2023-01-06',
            '2023-01-07',
            '2023-01-08',
            '2023-01-09',
            '2023-01-10'
        ],
        'The Local Bakery': [
            678.78, 545.33, 788.72, 406.2, 744.87, 466.03, 822.7, 337.52,
            396.67, 470.89
        ],
        'The Local Fishmarket': [
            1340.72, 982.43, 1437.99, 1476.2, 670.23, 429.58, 897.52, 845.11,
            1275.79, 1843.01
        ]
    }
});

export default function CumulativeSumChart() {
    return (
        <StockChart
            dataTable={dataTable}
            options={{
                rangeSelector: {
                    enabled: false
                }
            }}
            containerProps={{
                style: {
                    height: '400px',
                    minWidth: '360px',
                    maxWidth: '800px',
                    margin: '0 auto'
                }
            }}
        >
            <Title align="left">Cumulative Sum</Title>
            <Subtitle align="left">
                Displays the sum of all the previous values and the current
                value (only within visible range)
            </Subtitle>
            <PlotOptions
                series={{
                    cumulative: true,
                    dataMapping: {
                        x: 'Date'
                    }
                }}
            />
            <Tooltip
                pointFormat={
                    '<span style="color:{series.color}">{series.name}</span>' +
                    ': <b>{point.y}</b> (${point.cumulativeSum})<br/>'
                }
                changeDecimals={2}
                valueDecimals={2}
                valuePrefix="$"
                valueSuffix=" USD"
            />
            <XAxis minRange={3 * 24 * 36e5} max="2023-01-06" />
            <Exporting />
            <Accessibility />
            <LineSeries
                options={{
                    dataMapping: {
                        y: 'The Local Bakery'
                    }
                }}
            />
            <LineSeries
                options={{
                    dataMapping: {
                        y: 'The Local Fishmarket'
                    }
                }}
            />
        </StockChart>
    );
}
