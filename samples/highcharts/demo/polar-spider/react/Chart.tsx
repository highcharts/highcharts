import { Chart, Title, XAxis, YAxis, Tooltip, Legend } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/highcharts-more.src.js';

export default function PolarSpiderChart() {
    return (
        <Chart
            options={{
                chart: {
                    polar: true
                },
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                title: {
                                    x: 0
                                },
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                pane: {
                                    size: '70%'
                                }
                            }
                        }
                    ]
                }
            }}
        >
            <Title x={-80}>Budget vs spending</Title>
            <XAxis
                categories={[
                    'Sales',
                    'Marketing',
                    'Development',
                    'Customer Support',
                    'Information Technology',
                    'Administration'
                ]}
                tickmarkPlacement="on"
                lineWidth={0}
            />
            <YAxis gridLineInterpolation="polygon" lineWidth={0} min={0} />
            <Tooltip
                shared
                pointFormat={
                    '<span style="color:{series.color}">{series.name}: <b>' +
                    '${point.y:,.0f}</b><br/>'
                }
            />
            <Legend align="right" verticalAlign="middle" layout="vertical" />
            <Exporting />
            <Accessibility
                description={
                    'A spiderweb chart compares the allocated budget ' +
                    'against actual spending within an organization. The spider ' +
                    'chart has six spokes. Each spoke represents one of the 6 ' +
                    'departments within the organization: sales, marketing, ' +
                    'development, customer support, information technology and ' +
                    'administration. The chart is interactive, and each data point ' +
                    'is displayed upon hovering. The chart clearly shows that 4 of ' +
                    'the 6 departments have overspent their budget with Marketing ' +
                    'responsible for the greatest overspend of $20,000. The ' +
                    'allocated budget and actual spending data points for each ' +
                    'department are as follows: Sales. Budget equals $43,000; ' +
                    'spending equals $50,000. Marketing. Budget equals $19,000; ' +
                    'spending equals $39,000. Development. Budget equals $60,000; ' +
                    'spending equals $42,000. Customer support. Budget equals $35,' +
                    '000; spending equals $31,000. Information technology. Budget ' +
                    'equals $17,000; spending equals $26,000. Administration. Budget ' +
                    'equals $10,000; spending equals $14,000.'
                }
            />
            <LineSeries
                name="Allocated Budget"
                data={[43000, 19000, 60000, 35000, 17000, 10000]}
                options={{
                    pointPlacement: 'on'
                }}
            />
            <LineSeries
                name="Actual Spending"
                data={[50000, 39000, 42000, 31000, 26000, 14000]}
                options={{
                    pointPlacement: 'on'
                }}
            />
        </Chart>
    );
}
