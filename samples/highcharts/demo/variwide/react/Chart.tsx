import { Chart, Title, Subtitle, XAxis, Legend } from '@highcharts/react';
import { VariwideSeries } from '@highcharts/react/series/Variwide';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function VariwideChart() {
    return (
        <Chart
            caption="Column widths are proportional to GDP"
            containerProps={{ style: { height: '500px' } }}
        >
            <Title>Labor Costs in Europe, 2023</Title>
            <Subtitle>
                Source:{' '}
                <a href="http://ec.europa.eu/eurostat/web/labour-market/labour-costs/main-tables">
                    eurostat
                </a>
            </Subtitle>
            <XAxis type="category" />
            <Legend enabled={false} />
            <Exporting />
            <Accessibility />
            <VariwideSeries
                name="Labor Costs"
                data={[
                    ['Norway', 51.9, 448716],
                    ['Denmark', 48.1, 376430],
                    ['Belgium', 47.1, 584699],
                    ['Netherlands', 43.3, 1034086],
                    ['France', 42.2, 2822455],
                    ['Germany', 41.3, 4122210],
                    ['Austria', 40.9, 478190],
                    ['Ireland', 40.2, 504620],
                    ['Sweden', 38.9, 540651],
                    ['Finland', 37.1, 274880],
                    ['Italy', 29.8, 2085375],
                    ['Spain', 24.6, 1461889],
                    ['Czech Republic', 18.0, 317387],
                    ['Portugal', 17.0, 265525],
                    ['Greece', 15.7, 220303],
                    ['Poland', 14.5, 750801],
                    ['Romania', 11.0, 324578]
                ]}
                options={{
                    dataLabels: {
                        enabled: true,
                        format: '€{point.y:.0f}'
                    },
                    tooltip: {
                        pointFormat:
                            'Labor Costs: <b>€ {point.y}/h</b><br>' +
                            'GDP: <b>€ {point.z} million</b><br>'
                    },
                    borderRadius: 3,
                    colorByPoint: true
                }}
            />
        </Chart>
    );
}
