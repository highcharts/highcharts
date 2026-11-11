import { Chart, Title, Tooltip, XAxis, YAxis } from '@highcharts/react';
import { ParetoSeries } from '@highcharts/react/series/Pareto';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ParetoChart() {
    return (
        <Chart>
            <Title>Restaurants Complaints</Title>
            <Tooltip shared />
            <XAxis
                categories={[
                    'Overpriced',
                    'Small portions',
                    'Wait time',
                    'Food is tasteless',
                    'No atmosphere',
                    'Not clean',
                    'Too noisy',
                    'Unfriendly staff'
                ]}
                crosshair
            />
            <YAxis>{''}</YAxis>
            <YAxis
                minPadding={0}
                maxPadding={0}
                max={100}
                min={0}
                opposite
                labels={{ format: '{value}%' }}
            >
                {''}
            </YAxis>
            <Exporting />
            <Accessibility />
            <ParetoSeries
                name="Pareto"
                options={{
                    yAxis: 1,
                    zIndex: 10,
                    baseSeries: 1,
                    tooltip: {
                        valueDecimals: 2,
                        valueSuffix: '%'
                    }
                }}
            />
            <ColumnSeries
                name="Complaints"
                options={{ zIndex: 2 }}
                data={[755, 222, 151, 86, 72, 51, 36, 10]}
            />
        </Chart>
    );
}
