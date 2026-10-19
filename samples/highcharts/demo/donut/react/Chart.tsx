import { Chart, Title, Tooltip } from '@highcharts/react';
import { PieSeries } from '@highcharts/react/series/Pie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/themes/adaptive.src.js';

export default function DonutChart() {
    return (
        <Chart>
            <Title>Charity allocations</Title>
            <Tooltip valueSuffix="%" />
            <PieSeries
                name="Allocation"
                data={[
                    ['Health care', 34],
                    ['Education', 27],
                    ['Youth programmes', 22],
                    ['Poverty measures', 8],
                    ['Elderly care', 6],
                    ['Other', 3]
                ]}
                options={{
                    borderRadius: 8, // Rounded slice corners
                    borderWidth: 3,
                    innerSize: '70%', // Turning the pie into a donut
                    // We can show multiple data labels per point
                    dataLabels: [
                        {
                            format: '{point.name}'
                        },
                        {
                            format: '{point.percentage:.0f}%',
                            distance: '-15%', // Placing the label inside
                            backgroundColor: 'contrast',
                            style: {
                                textOutline: 'none'
                            }
                        }
                    ]
                }}
            />
            <Exporting />
            <Accessibility />
        </Chart>
    );
}
