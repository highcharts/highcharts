import { useState, useEffect } from 'react';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import { Chart, Title, YAxis } from '@highcharts/react';
import { GaugeSeries } from '@highcharts/react/series/Gauge';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function GaugeSpeedometerChart() {
    const [speed, setSpeed] = useState(80);

    // Add some life
    useEffect(() => {
        const interval = setInterval(() => {
            const inc = Math.round((Math.random() - 0.5) * 20);

            setSpeed((y) => {
                let newVal = y + inc;
                if (newVal < 0 || newVal > 200) {
                    newVal = y - inc;
                }

                return newVal;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Chart
            height="80%"
            options={{
                pane: {
                    startAngle: -90,
                    endAngle: 90,
                    borderRadius: '50%'
                }
            }}
        >
            <Title>Speedometer</Title>
            {/* the value axis */}
            <YAxis
                min={0}
                max={200}
                tickPixelInterval={72}
                gridLineColor="var(--highcharts-background-color, #FFFFFF)"
                gridLineWidth={2}
                labels={{
                    distance: 20,
                    style: {
                        fontSize: '14px'
                    }
                }}
                plotBands={[
                    {
                        from: 0,
                        to: 120,
                        color: '#55BF3B' // green
                    },
                    {
                        from: 120,
                        to: 160,
                        color: '#DDDF0D' // yellow
                    },
                    {
                        from: 160,
                        to: 200,
                        color: '#DF5353' // red
                    }
                ]}
            />
            <Exporting />
            <Accessibility />
            <GaugeSeries
                name="Speed"
                data={[speed]}
                options={{
                    tooltip: {
                        valueSuffix: ' km/h'
                    },
                    dataLabels: {
                        format: '{y} km/h',
                        borderWidth: 0,
                        color:
                            (Highcharts.defaultOptions.title &&
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color) ||
                            '#333333',
                        style: {
                            fontSize: '16px'
                        }
                    }
                }}
            />
        </Chart>
    );
}
