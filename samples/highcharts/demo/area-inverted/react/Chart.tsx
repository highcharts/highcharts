import {
    Chart,
    Title,
    Tooltip,
    Legend,
    YAxis,
    PlotOptions
} from '@highcharts/react';
import { AreaSeries } from '@highcharts/react/series/Area';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved from https://companiesmarketcap.com/
export default function AreaInvertedChart() {
    return (
        <Chart inverted containerProps={{ style: { height: '410px' } }}>
            <Title>Alibaba and Meta (Facebook) revenue</Title>
            <Tooltip valuePrefix="$" valueSuffix=" B" />
            <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                x={-150}
                y={100}
                floating
                borderWidth={1}
                backgroundColor="var(--highcharts-background-color, #ffffff)"
            />
            <YAxis labels={{ format: '${text}' }}>Revenue (billions USD)</YAxis>
            <PlotOptions
                series={{ pointStart: 2014 }}
                area={{ fillOpacity: 0.5 }}
            />
            <Exporting />
            <Accessibility
                keyboardNavigation={{ seriesNavigation: { mode: 'serialize' } }}
            />
            <AreaSeries
                name="Alibaba"
                data={[
                    11.44, 14.89, 21.4, 34.03, 51.52, 70.49, 94.46, 129.44,
                    127.84, 130.8
                ]}
            />
            <AreaSeries
                name="Meta (Facebook)"
                data={[
                    11.49, 17.08, 26.88, 39.94, 55.01, 69.65, 84.17, 117.93,
                    116.61, 134.9
                ]}
            />
        </Chart>
    );
}
