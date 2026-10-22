import { useEffect, useState } from 'react';
import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Legend,
    Tooltip
} from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { ForecastResponse, Forecast } from './types';

export default function LineForecastChart() {
    const [forecast, setForecast] = useState<Forecast | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch(
            'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=64.128288&lon=-21.827774'
        )
            .then((response) => response.json() as Promise<ForecastResponse>)
            .then((json) => {
                if (cancelled) return;
                const data = json.properties.timeseries
                        .slice(0, 10)
                        .map((el): [number, number] => [
                            new Date(el.time).getTime(),
                            el.data.instant.details.air_temperature
                        ]),
                    todayDate = new Date(),
                    today =
                        todayDate.getTime() -
                        todayDate.getTimezoneOffset() * 60 * 1000;
                setForecast({ data, today });
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!forecast) return null;

    return (
        <Chart>
            <Title>Hourly forecast temperatures in Reykjavík, Iceland</Title>
            <Subtitle>Dotted line typically signifies prognosis</Subtitle>
            <XAxis
                type="datetime"
                plotLines={[
                    {
                        color: '#4840d6',
                        width: 2,
                        value: forecast.today,
                        zIndex: 2,
                        dashStyle: 'Dash',
                        label: {
                            text: 'Current time',
                            rotation: 0,
                            y: 20,
                            style: {
                                color: 'var(--highcharts-neutral-color-60)'
                            }
                        }
                    }
                ]}
            />
            <YAxis>Temperature (°C)</YAxis>
            <Legend enabled={false} />
            <Tooltip valueSuffix="°C" />
            <Exporting />
            <Accessibility />
            <LineSeries
                name="Temperature in Reykjavík"
                data={forecast.data}
                color="light-dark(#5897ff, #fa4fed)"
                options={{
                    zoneAxis: 'x',
                    lineWidth: 4,
                    marker: {
                        lineWidth: 2,
                        lineColor: undefined,
                        fillColor: 'var(--highcharts-background-color)'
                    },
                    zones: [
                        {
                            value: forecast.today
                        },
                        {
                            dashStyle: 'Dot'
                        }
                    ]
                }}
            />
        </Chart>
    );
}
