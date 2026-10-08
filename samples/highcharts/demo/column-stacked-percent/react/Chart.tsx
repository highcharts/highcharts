import {
    Chart,
    Highcharts,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

const dataTable = new Highcharts.DataTable({
    columns: {
        Year: ['2019', '2020', '2021'],
        Road: [434, 290, 307],
        Rail: [272, 153, 156],
        Air: [13, 7, 8],
        Sea: [55, 35, 41]
    }
});

export default function ColumnStackedPercentChart() {
    return (
        <Chart
            dataTable={dataTable}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title>
                Domestic passenger transport by mode of transport, Norway
            </Title>
            <Subtitle>
                Source:{' '}
                <a href="https://www.ssb.no/transport-og-reiseliv/landtransport/statistikk/innenlandsk-transport">
                    SSB
                </a>
            </Subtitle>
            <XAxis type="category" />
            <YAxis min={0}>Percent</YAxis>
            <Tooltip
                headerFormat="<table>"
                pointFormat={`<tr>
                    <td style="color:{series.color}">{series.name}</td>
                    <td> <b>{point.y}</b></td>
                    <td> ({point.percentage:.0f}%)</td>
                </tr>`}
                footerFormat="</table>"
                shared={true}
            />
            <PlotOptions
                column={{
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.0f}%'
                    },
                    dataMapping: {
                        name: 'Year'
                    }
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries options={{ dataMapping: { y: 'Road' } }} />
            <ColumnSeries options={{ dataMapping: { y: 'Rail' } }} />
            <ColumnSeries options={{ dataMapping: { y: 'Air' } }} />
            <ColumnSeries options={{ dataMapping: { y: 'Sea' } }} />
        </Chart>
    );
}
