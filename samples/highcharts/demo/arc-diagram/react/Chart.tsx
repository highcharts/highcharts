import { Chart, Title } from '@highcharts/react';
import { ArcDiagramSeries } from '@highcharts/react/series/ArcDiagram';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ArcDiagramChart() {
    return (
        <Chart
            containerProps={{
                style: { height: '400px', maxWidth: '800px', margin: '0 auto' }
            }}
        >
            <Title>Main train connections in Europe</Title>
            <Accessibility
                description={
                    'Arc diagram chart with circles of different sizes ' +
                    'along the X axis, and connections drawn as arcs between them. ' +
                    'From the chart we can see that Paris is the city with the most ' +
                    'connections to other cities.'
                }
                point={{
                    valueDescriptionFormat:
                        'Connection from {point.from} to ' + '{point.to}.'
                }}
            />
            <ArcDiagramSeries
                name="Train connections"
                options={{
                    keys: ['from', 'to', 'weight'],
                    linkWeight: 1.5,
                    centeredLinks: true,
                    dataLabels: {
                        rotation: 90,
                        y: 30,
                        verticalAlign: 'top',
                        color: 'var(--highcharts-neutral-color-100, black)',
                        padding: 0
                    },
                    offset: '65%'
                }}
                data={[
                    ['Hamburg', 'Stuttgart', 1],
                    ['Hamburg', 'Frankfurt', 1],
                    ['Hamburg', 'München', 1],
                    ['Hannover', 'Wien', 1],
                    ['Hannover', 'München', 1],
                    ['Berlin', 'Wien', 1],
                    ['Berlin', 'München', 1],
                    ['Berlin', 'Stuttgart', 1],
                    ['Berlin', 'Frankfurt', 1],
                    ['Berlin', 'Köln', 1],
                    ['Berlin', 'Düsseldorf', 1],
                    ['München', 'Düsseldorf', 1],
                    ['München', 'Wien', 1],
                    ['München', 'Frankfurt', 1],
                    ['München', 'Köln', 1],
                    ['München', 'Amsterdam', 1],
                    ['Stuttgart', 'Wien', 1],
                    ['Frankfurt', 'Wien', 1],
                    ['Frankfurt', 'Amsterdam', 1],
                    ['Frankfurt', 'Paris', 1],
                    ['Frankfurt', 'Budapest', 1],
                    ['Düsseldorf', 'Wien', 1],
                    ['Düsseldorf', 'Hamburg', 1],
                    ['Amsterdam', 'Paris', 1],
                    ['Paris', 'Brest', 1],
                    ['Paris', 'Nantes', 1],
                    ['Paris', 'Bayonne', 1],
                    ['Paris', 'Bordeaux', 1],
                    ['Paris', 'Toulouse', 1],
                    ['Paris', 'Montpellier', 1],
                    ['Paris', 'Marseille', 1],
                    ['Paris', 'Nice', 1],
                    ['Paris', 'Milano', 1],
                    ['Nantes', 'Nice', 1],
                    ['Bordeaux', 'Lyon', 1],
                    ['Nantes', 'Lyon', 1],
                    ['Milano', 'München', 1],
                    ['Milano', 'Roma', 1],
                    ['Milano', 'Bari', 1],
                    ['Milano', 'Napoli', 1],
                    ['Milano', 'Brindisi', 1],
                    ['Milano', 'Lamezia Terme', 1],
                    ['Torino', 'Roma', 1],
                    ['Venezia', 'Napoli', 1],
                    ['Roma', 'Bari', 1],
                    ['Roma', 'Catania', 1],
                    ['Roma', 'Brindisi', 1],
                    ['Catania', 'Milano', 1]
                ]}
            />
        </Chart>
    );
}
