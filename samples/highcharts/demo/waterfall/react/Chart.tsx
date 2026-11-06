import { Chart, Title, XAxis, YAxis, Legend, Tooltip } from '@highcharts/react';
import { WaterfallSeries } from '@highcharts/react/series/Waterfall';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function WaterfallChart() {
    return (
        <Chart>
            <Title>Highcharts Waterfall</Title>
            <XAxis type="category" />
            <YAxis>USD</YAxis>
            <Legend enabled={false} />
            <Tooltip pointFormat="<b>${point.y:,.2f}</b> USD" />
            <Exporting />
            <Accessibility />
            <WaterfallSeries
                color="var(--highcharts-color-3)"
                data={[
                    {
                        name: 'Start',
                        y: 120000
                    },
                    {
                        name: 'Product Revenue',
                        y: 569000
                    },
                    {
                        name: 'Service Revenue',
                        y: 231000
                    },
                    {
                        name: 'Positive Balance',
                        isIntermediateSum: true,
                        color: 'var(--highcharts-color-1)'
                    },
                    {
                        name: 'Fixed Costs',
                        y: -342000
                    },
                    {
                        name: 'Variable Costs',
                        y: -233000
                    },
                    {
                        name: 'Balance',
                        isSum: true,
                        color: 'var(--highcharts-color-1)'
                    }
                ]}
                options={{
                    upColor: 'var(--highcharts-color-2)',
                    dataLabels: {
                        enabled: true,
                        backgroundColor: 'contrast',
                        format: '{divide y 1000}k'
                    },
                    pointPadding: 0
                }}
            />
        </Chart>
    );
}
