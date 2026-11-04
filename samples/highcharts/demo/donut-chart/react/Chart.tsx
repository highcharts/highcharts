import { Chart, Title, Subtitle, Tooltip, Legend } from '@highcharts/react';
import { PieSeries } from '@highcharts/react/series/Pie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function DonutChart() {
    return (
        <Chart
            options={{
                chart: {
                    events: {
                        render() {
                            // Center the caption based on the center of the pie
                            const centerXChart = this.plotWidth / 2,
                                centerXPie = this.series[0].center[0];
                            this.caption.update({
                                // Set x offset from chart center
                                x: centerXPie - centerXChart
                            });
                        }
                    }
                },
                caption: {
                    text: 'Total<br/><strong>2 877 820</strong>',
                    align: 'center',
                    verticalAlign: 'middle',
                    style: {
                        color: 'var(--highcharts-neutral-color-100, #000)',
                        fontSize: '1.5em'
                    },
                    y: 40
                }
            }}
        >
            <Title>2023 Norway car registrations</Title>
            <Subtitle>
                Source:{' '}
                <a href="https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport">
                    SSB
                </a>
            </Subtitle>
            <Tooltip pointFormat="{series.name}: <b>{point.percentage:.0f}%</b>" />
            <Legend enabled={false} />
            <Exporting />
            <Accessibility point={{ valueSuffix: '%' }} />
            <PieSeries
                name="Registrations"
                data={[
                    {
                        name: 'EV',
                        y: 23.9
                    },
                    {
                        name: 'Hybrids',
                        y: 12.6
                    },
                    {
                        name: 'Diesel',
                        y: 37.0
                    },
                    {
                        name: 'Petrol',
                        y: 26.4
                    }
                ]}
                options={{
                    innerSize: '75%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderRadius: 8,
                    dataLabels: [
                        {
                            enabled: true,
                            distance: 20,
                            format: '{point.name}'
                        },
                        {
                            enabled: true,
                            backgroundColor: 'contrast',
                            distance: -18,
                            format: '{point.percentage:.0f}%',
                            style: {
                                fontSize: '0.9em'
                            }
                        }
                    ],
                    showInLegend: true
                }}
            />
        </Chart>
    );
}
