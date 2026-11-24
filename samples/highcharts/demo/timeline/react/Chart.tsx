import { Chart, XAxis, YAxis, Title, Subtitle } from '@highcharts/react';
import { TimelineSeries } from '@highcharts/react/series/Timeline';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function TimelineChart() {
    return (
        <Chart
            colors={[
                '#2caffe',
                '#33a6f3',
                '#3a9dea',
                '#4194e0',
                '#488bd7',
                '#406ab2'
            ]}
        >
            <XAxis visible={false} />
            <YAxis visible={false} />
            <Title>Timeline of Space Exploration</Title>
            <Subtitle>
                Info source:{' '}
                <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">
                    www.wikipedia.org
                </a>
            </Subtitle>
            <Accessibility
                screenReaderSection={{
                    beforeChartFormat:
                        '<h5>{chartTitle}</h5>' +
                        '<div>{typeDescription}</div>' +
                        '<div>{chartSubtitle}</div>' +
                        '<div>{chartLongdesc}</div>' +
                        '<div>{viewTableButton}</div>'
                }}
                point={{
                    valueDescriptionFormat:
                        '{index}. {point.label}. ' + '{point.description}.'
                }}
            />
            <Exporting />
            <TimelineSeries
                data={[
                    {
                        name: '2000: Orbiting of an asteroid',
                        description:
                            '14 February 2000, first orbiting of an asteroid ' +
                            '(433 Eros).'
                    },
                    {
                        name: '2005: Landing on Titan.',
                        description:
                            '14 January 2005, first soft landing on Titan also ' +
                            'first soft landing in the outer Solar System.'
                    },
                    {
                        name: '2011: Orbit of Mercury',
                        description:
                            '18 March 2011, first spacecraft to orbit Mercury.'
                    },
                    {
                        name: '2015: Food eaten in space',
                        description:
                            '10 August 2015, first food grown in space and ' +
                            'eaten (lettuce).'
                    },
                    {
                        name: '2019: Black hole photograph',
                        description:
                            '10 April 2019, first direct photograph of a black ' +
                            'hole and its vicinity.'
                    },
                    {
                        name: '2024: Moon Sample',
                        description:
                            '25 June 2024, First samples returned from the far ' +
                            'side of the Moon.'
                    }
                ]}
            />
        </Chart>
    );
}
