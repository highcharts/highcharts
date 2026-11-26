import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { AreaSplineSeries } from '@highcharts/react/series/AreaSpline';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { SeriesLabel } from '@highcharts/react/modules/SeriesLabel';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function AreaStackedInvertedChart() {
    return (
        <Chart
            inverted
            colors={[
                '#4D0066',
                '#5533DD',
                '#2FA5DA',
                '#4FE8F7',
                '#9FFFFF',
                '#D9FFCC',
                '#D9FFCC'
            ]}
            options={{
                chart: {
                    plotBorderRadius: 8,
                    plotBorderWidth: 1
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title align="left">MSIS atmospheric composition by height</Title>
            <Subtitle align="left">
                Source:{' '}
                <a
                    href="https://en.wikipedia.org/wiki/Atmosphere_of_Earth"
                    target="_blank"
                >
                    Wikipedia.org
                </a>
            </Subtitle>
            <XAxis
                minPadding={0}
                maxPadding={0}
                opposite
                reversed={false}
                tickWidth={0}
                lineWidth={0}
                gridLineWidth={1}
                crosshair={{ width: 2, zIndex: 3 }}
                tickInterval={200}
            >
                Height (km)
            </XAxis>
            <YAxis labels={{ format: '{value} %' }} reversedStacks={false}>
                Volume fraction
            </YAxis>
            <Tooltip
                shared
                headerFormat="At {point.x} km:<table>"
                pointFormat={`<tr>
                    <td><span style="color:{series.color};">\u2b24</span></td>
                    <td>{series.name}</td>
                    <td style="text-align: right"><b>{point.y} %</b></td>
                </tr>`}
                footerFormat="</table>"
            />
            <PlotOptions
                series={{
                    marker: {
                        enabled: false
                    }
                }}
                areaspline={{
                    stacking: 'percent',
                    lineColor: '#666666',
                    pointInterval: 100,
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        fillColor: '#666666',
                        lineColor: '#666666',
                        radius: 1,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
                    label: {
                        style: {
                            fontSize: '16px'
                        }
                    },
                    states: {
                        hover: {
                            halo: {
                                size: 0
                            }
                        }
                    }
                }}
            />
            <Exporting />
            <SeriesLabel />
            <Accessibility />
            <AreaSplineSeries
                name="N2"
                data={[78, 76, 38, 10, 2.5, 0, 0, 0, 0, 0, 0]}
            />
            <AreaSplineSeries
                name="O2"
                data={[21, 20, 2, 0.5, 0, 0, 0, 0, 0, 0, 0]}
            />
            <AreaSplineSeries
                name="O"
                data={[0, 3, 59, 84, 70, 32, 8, 3, 1, 0, 0]}
            />
            <AreaSplineSeries
                name="Ar"
                data={[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
            />
            <AreaSplineSeries
                name="He"
                data={[0, 0, 1, 5, 25, 62, 82, 82, 78, 71, 62]}
            />
            <AreaSplineSeries
                name="H"
                data={[0, 0, 0, 0.5, 2.5, 6, 10, 15, 21, 29, 38]}
            />
        </Chart>
    );
}
