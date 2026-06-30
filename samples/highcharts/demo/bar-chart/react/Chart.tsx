import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Credits,
    PlotOptions
} from "@highcharts/react";
import { BarSeries } from "@highcharts/react/series/Bar";
import { Exporting } from "@highcharts/react/modules/Exporting";
import { Accessibility } from "@highcharts/react/modules/Accessibility";

export default function BarChart() {
    return (
        <Chart containerProps={{ style: { height: "400px" } }}>
            <Title>Historic World Population by Region</Title>
            <Subtitle>
                {
                    'Source: <a href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"target="_blank">Wikipedia.org</a>'
                }
            </Subtitle>
            <XAxis
                categories={["Africa", "America", "Asia", "Europe"]}
                title={{ text: null }}
                gridLineWidth={1}
                lineWidth={0}
            />
            <YAxis
                min={0}
                title={{ align: "high" }}
                labels={{ overflow: "justify" }}
                gridLineWidth={0}
            >
                Population (millions)
            </YAxis>
            <Tooltip
                valueSuffix=" million"
                headerFormat={`<div style="display: flex">
                <div>
                    <svg width="10" height="30">
                    <path d="M 1.5 1.5 L 1.5 28.5" stroke="{series.color}"
                        stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
                <div>
                    <div class="highcharts-header">
                        {point.key}
                    </div>`}
                pointFormat={`<span style="color: var(--highcharts-neutral-color-40)">
                    {series.name}
                </span>
                <b style="padding-left: 0.5em">{point.y}</b>`}
                footerFormat="</div>"
            />
            <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                x={-40}
                y={80}
                floating={true}
                borderColor="var(--highcharts-neutral-color-10, #e6e6e6)"
                borderRadius={4}
                borderWidth={1}
                backgroundColor="var(--highcharts-background-color, #ffffff)"
            />
            <Credits enabled={false} />
            <PlotOptions
                bar={{
                    borderRadius: "50%",
                    dataLabels: { enabled: true },
                    groupPadding: 0.1
                }}
            />
            <BarSeries name="Year 1990" data={[632, 727, 3202, 721]} />
            <BarSeries name="Year 2000" data={[814, 841, 3714, 726]} />
            <BarSeries name="Year 2021" data={[1393, 1031, 4695, 745]} />
            <Exporting />
            <Accessibility />
        </Chart>
    );
}
