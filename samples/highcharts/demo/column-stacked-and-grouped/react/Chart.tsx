import {
    Chart,
    Highcharts,
    Title,
    XAxis,
    YAxis,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved from https://en.wikipedia.org/wiki/Winter_Olympic_Games
const dataTable = new Highcharts.DataTable({
    columns: {
        'Medal': ['Gold', 'Silver', 'Bronze'],
        'Norway': [148, 133, 124],
        'Germany': [102, 98, 65],
        'United States': [113, 122, 95],
        'Canada': [77, 72, 80]
    }
});

export default function ColumnStackedAndGroupedChart() {
    return (
        <Chart
            dataTable={dataTable}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title align="left">
                Olympic Games all-time medal table, grouped by continent
            </Title>
            <XAxis type="category" />
            <YAxis allowDecimals={false} min={0}>
                Count medals
            </YAxis>
            <Tooltip>
                {'<b>{key}</b><br/>{series.name}: {y}<br/>' +
                    'Total: {point.stackTotal}'}
            </Tooltip>
            <PlotOptions
                column={{
                    stacking: 'normal',
                    dataMapping: {
                        name: 'Medal'
                    }
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries
                options={{ dataMapping: { y: 'Norway' }, stack: 'Europe' }}
            />
            <ColumnSeries
                options={{ dataMapping: { y: 'Germany' }, stack: 'Europe' }}
            />
            <ColumnSeries
                options={{
                    dataMapping: { y: 'United States' },
                    stack: 'North America'
                }}
            />
            <ColumnSeries
                options={{
                    dataMapping: { y: 'Canada' },
                    stack: 'North America'
                }}
            />
        </Chart>
    );
}
