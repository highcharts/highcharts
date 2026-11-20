import {
    Chart,
    Legend,
    Subtitle,
    Title,
    Tooltip,
    XAxis,
    YAxis
} from '@highcharts/react';
import { LollipopSeries } from '@highcharts/react/series/Lollipop';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function LollipopChart() {
    // Data retrieved from https://worldpopulationreview.com/countries
    return (
        <Chart>
            <Title>Top 10 Countries by Population</Title>
            <Subtitle>2024</Subtitle>
            <XAxis type="category" />
            <YAxis>Population</YAxis>
            <Legend enabled={false} />
            <Tooltip shared />
            <Exporting />
            <Accessibility
                point={{
                    valueDescriptionFormat:
                        '{index}. {xDescription}, {point.y}.'
                }}
            />
            <LollipopSeries
                name="Population"
                data={[
                    { name: 'India', y: 1441719852 },
                    { name: 'China', y: 1425178782 },
                    { name: 'United States', y: 341814420 },
                    { name: 'Indonesia', y: 279798049 },
                    { name: 'Pakistan', y: 245209815 },
                    { name: 'Nigeria', y: 229152217 },
                    { name: 'Brazil', y: 217637297 },
                    { name: 'Bangladesh', y: 174701211 },
                    { name: 'Russia', y: 143957079 },
                    { name: 'Ethiopia', y: 129719719 }
                ]}
            />
        </Chart>
    );
}
