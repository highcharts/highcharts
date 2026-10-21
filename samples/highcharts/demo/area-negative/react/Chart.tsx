import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Credits
} from '@highcharts/react';
import { AreaSeries } from '@highcharts/react/series/Area';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function AreaNegativeChart() {
    return (
        <Chart containerProps={{ style: { height: '400px' } }}>
            <Title>
                Production, consumption and trade surplus of electrical power
            </Title>
            <Subtitle>
                Source:{' '}
                <a
                    href="https://www.ssb.no/energi-og-industri/energi/statistikk/elektrisitet/artikler/lavere-kraftproduksjon"
                    target="_blank"
                >
                    SSB
                </a>
            </Subtitle>
            <XAxis
                categories={[
                    'Q1 2019',
                    'Q2 2019',
                    'Q3 2019',
                    'Q4 2019',
                    'Q1 2020',
                    'Q2 2020',
                    'Q3 2020',
                    'Q4 2020',
                    'Q1 2021',
                    'Q2 2021',
                    'Q3 2021'
                ]}
                lineWidth={0}
            />
            <YAxis
                plotLines={[
                    {
                        color: 'var(--highcharts-neutral-color-100, black)',
                        value: 0,
                        width: 2
                    }
                ]}
            >
                TWh
            </YAxis>
            <Credits enabled={false} />
            <Exporting />
            <Accessibility />
            <AreaSeries
                name="Total production"
                data={[
                    37.8, 29.3, 30.8, 36.8, 40.5, 35.3, 34.9, 43.6, 45.7, 35.9,
                    32.7
                ]}
            />
            <AreaSeries
                name="Gross consumption"
                data={[
                    39.9, 29.9, 26.7, 38.1, 39.3, 30.2, 27.5, 36.7, 42.7, 31.4,
                    27.5
                ]}
            />
            <AreaSeries
                name="Trade surplus"
                data={[
                    -2.2, -0.6, 4.1, -1.3, 1.2, 5.1, 7.4, 6.9, 2.9, 4.5, 5.2
                ]}
            />
        </Chart>
    );
}
