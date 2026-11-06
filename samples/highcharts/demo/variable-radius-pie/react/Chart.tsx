import { Chart, Title, Tooltip } from '@highcharts/react';
import { VariablePieSeries } from '@highcharts/react/series/VariablePie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved from https://worldpopulationreview.com/country-rankings/countries-by-density

export default function VariableRadiusPieChart() {
    return (
        <Chart containerProps={{ style: { height: '500px' } }}>
            <Title>
                Countries compared by population density and total area, 2024
            </Title>
            <Exporting />
            <Accessibility />
            <Tooltip
                headerFormat=""
                pointFormat={
                    '<span style="color:{point.color}">●</span> <b> ' +
                    '{point.name}</b><br/>' +
                    'Area (square km): <b>{point.y}</b><br/>' +
                    'Population density (people per square km): <b>{point.z}</b><br/>'
                }
            />
            <VariablePieSeries
                name="countries"
                options={{
                    minPointSize: 10,
                    innerSize: '20%',
                    zMin: 0,
                    borderRadius: 5,
                    colors: [
                        '#4caefe',
                        '#3dc3e8',
                        '#2dd9db',
                        '#1feeaf',
                        '#0ff3a0',
                        '#00e887',
                        '#23e274'
                    ]
                }}
                data={[
                    {
                        name: 'Spain',
                        y: 505992,
                        z: 95
                    },
                    {
                        name: 'France',
                        y: 551695,
                        z: 118
                    },
                    {
                        name: 'Poland',
                        y: 312679,
                        z: 131
                    },
                    {
                        name: 'Czech Republic',
                        y: 78865,
                        z: 136
                    },
                    {
                        name: 'Italy',
                        y: 301336,
                        z: 198
                    },
                    {
                        name: 'Switzerland',
                        y: 41284,
                        z: 224
                    },
                    {
                        name: 'Germany',
                        y: 357114,
                        z: 238
                    }
                ]}
            />
        </Chart>
    );
}
