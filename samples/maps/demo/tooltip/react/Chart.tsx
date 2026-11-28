import { useEffect, useState } from 'react';
import { MapsChart, Highcharts } from '@highcharts/react/Maps';
import { Title, Legend, Tooltip } from '@highcharts/react';
import { MapSeries } from '@highcharts/react/series/Map';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { Topology, DensityPoint } from './types';

export default function TooltipChart() {
    const [topology, setTopology] = useState<Topology | null>(null);
    const [data, setData] = useState<DensityPoint[] | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetch(
                'https://code.highcharts.com/mapdata/custom/world.topo.json'
            ).then((response) => response.json()),
            fetch(
                'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
            ).then((response) => response.json())
        ])
            .then(([topo, json]: [Topology, DensityPoint[]]) => {
                if (cancelled) return;

                // Prevent logarithmic errors in color calulcation
                json.forEach(function (p) {
                    p.value = p.value < 1 ? 1 : p.value;
                });

                setTopology(topo);
                setData(json);
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!topology || !data) return null;

    return (
        <MapsChart
            options={{
                chart: {
                    map: topology
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                colorAxis: {
                    min: 1,
                    max: 1000,
                    type: 'logarithmic'
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>Fixed tooltip with HTML</Title>
            <Legend
                title={{
                    text: 'Population density per km²',
                    style: {
                        color:
                            // theme
                            (Highcharts.defaultOptions &&
                                Highcharts.defaultOptions.legend &&
                                Highcharts.defaultOptions.legend.title &&
                                Highcharts.defaultOptions.legend.title.style &&
                                Highcharts.defaultOptions.legend.title.style
                                    .color) ||
                            'black'
                    }
                }}
            />
            <Tooltip
                fixed
                backgroundColor="none"
                padding={0}
                pointFormat={
                    '<span class="f32"><span class="flag ' +
                    '{point.properties.hc-key}">' +
                    '</span></span> {point.name}<br>' +
                    '<span style="font-size:30px">{point.value}/km²</span>'
                }
                position={{
                    verticalAlign: 'middle',
                    y: 50
                }}
            />
            <Exporting />
            <Accessibility />
            <MapSeries
                name="Population density"
                data={data}
                options={{
                    joinBy: ['iso-a3', 'code3']
                }}
            />
        </MapsChart>
    );
}
