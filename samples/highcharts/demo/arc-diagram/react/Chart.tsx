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
                    { from: 'Hamburg', to: 'Stuttgart', weight: 1 },
                    { from: 'Hamburg', to: 'Frankfurt', weight: 1 },
                    { from: 'Hamburg', to: 'München', weight: 1 },
                    { from: 'Hannover', to: 'Wien', weight: 1 },
                    { from: 'Hannover', to: 'München', weight: 1 },
                    { from: 'Berlin', to: 'Wien', weight: 1 },
                    { from: 'Berlin', to: 'München', weight: 1 },
                    { from: 'Berlin', to: 'Stuttgart', weight: 1 },
                    { from: 'Berlin', to: 'Frankfurt', weight: 1 },
                    { from: 'Berlin', to: 'Köln', weight: 1 },
                    { from: 'Berlin', to: 'Düsseldorf', weight: 1 },
                    { from: 'München', to: 'Düsseldorf', weight: 1 },
                    { from: 'München', to: 'Wien', weight: 1 },
                    { from: 'München', to: 'Frankfurt', weight: 1 },
                    { from: 'München', to: 'Köln', weight: 1 },
                    { from: 'München', to: 'Amsterdam', weight: 1 },
                    { from: 'Stuttgart', to: 'Wien', weight: 1 },
                    { from: 'Frankfurt', to: 'Wien', weight: 1 },
                    { from: 'Frankfurt', to: 'Amsterdam', weight: 1 },
                    { from: 'Frankfurt', to: 'Paris', weight: 1 },
                    { from: 'Frankfurt', to: 'Budapest', weight: 1 },
                    { from: 'Düsseldorf', to: 'Wien', weight: 1 },
                    { from: 'Düsseldorf', to: 'Hamburg', weight: 1 },
                    { from: 'Amsterdam', to: 'Paris', weight: 1 },
                    { from: 'Paris', to: 'Brest', weight: 1 },
                    { from: 'Paris', to: 'Nantes', weight: 1 },
                    { from: 'Paris', to: 'Bayonne', weight: 1 },
                    { from: 'Paris', to: 'Bordeaux', weight: 1 },
                    { from: 'Paris', to: 'Toulouse', weight: 1 },
                    { from: 'Paris', to: 'Montpellier', weight: 1 },
                    { from: 'Paris', to: 'Marseille', weight: 1 },
                    { from: 'Paris', to: 'Nice', weight: 1 },
                    { from: 'Paris', to: 'Milano', weight: 1 },
                    { from: 'Nantes', to: 'Nice', weight: 1 },
                    { from: 'Bordeaux', to: 'Lyon', weight: 1 },
                    { from: 'Nantes', to: 'Lyon', weight: 1 },
                    { from: 'Milano', to: 'München', weight: 1 },
                    { from: 'Milano', to: 'Roma', weight: 1 },
                    { from: 'Milano', to: 'Bari', weight: 1 },
                    { from: 'Milano', to: 'Napoli', weight: 1 },
                    { from: 'Milano', to: 'Brindisi', weight: 1 },
                    { from: 'Milano', to: 'Lamezia Terme', weight: 1 },
                    { from: 'Torino', to: 'Roma', weight: 1 },
                    { from: 'Venezia', to: 'Napoli', weight: 1 },
                    { from: 'Roma', to: 'Bari', weight: 1 },
                    { from: 'Roma', to: 'Catania', weight: 1 },
                    { from: 'Roma', to: 'Brindisi', weight: 1 },
                    { from: 'Catania', to: 'Milano', weight: 1 }
                ]}
            />
        </Chart>
    );
}
