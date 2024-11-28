Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'x'
        },
        type: 'timeline'
    },
    xAxis: {
        type: 'datetime',
        visible: false
    },
    yAxis: {
        gridLineWidth: 1,
        title: null,
        labels: {
            enabled: false
        }
    },
    legend: {
        enabled: false
    },
    title: {
        text: 'Timeline of Space Exploration'
    },
    subtitle: {
        text: 'Info source: <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">www.wikipedia.org</a>'
    },
    tooltip: {
        style: {
            width: 300
        }
    },
    series: [{
        dataLabels: {
            allowOverlap: false,
            format: '<span style="color:{point.color}">● </span><span ' +
                'style="font-weight: bold;" > ' +
                '{point.x:%d %b %Y}</span><br/>{point.label}'
        },
        marker: {
            symbol: 'circle'
        },
        data: [{
            x: '1951-06-22',
            name: 'First dogs in space',
            label: 'First dogs in space',
            description: 'Dezik and Tsygan were the first dogs to make a ' +
                'sub-orbital flight on 22 July 1951. Both dogs were ' +
                'recovered unharmed after travelling to a maximum altitude ' +
                'of 110 km.'
        }, {
            x: '1957-10-04',
            name: 'First artificial satellite',
            label: 'First artificial satellite',
            description: 'Sputnik 1 was the first artificial Earth ' +
                'satellite. The Soviet Union launched it into an elliptical ' +
                'low Earth orbit on 4 October 1957, orbiting for three weeks ' +
                'before its batteries died, then silently for two more ' +
                'months before falling back into the atmosphere.'
        }, {
            x: '1959-01-04',
            name: 'First artificial satellite to reach the Moon',
            label: 'First artificial satellite to reach the Moon',
            description: 'Luna 1 was the first artificial satellite to reach ' +
                'the Moon vicinity and first artificial satellite in ' +
                'heliocentric orbit.'
        }, {
            x: '1961-04-12',
            name: 'First human spaceflight',
            label: 'First human spaceflight',
            description: 'Yuri Gagarin was a Soviet pilot and cosmonaut. He ' +
                'became the first human to journey into outer space when his ' +
                'Vostok spacecraft completed one orbit of the Earth on 12 ' +
                'April 1961.'
        }, {
            x: '1966-02-03',
            name: 'First soft landing on the Moon',
            label: 'First soft landing on the Moon',
            description: 'Yuri Gagarin was a Soviet pilot and cosmonaut. He ' +
                'became the first human to journey into outer space when his ' +
                'Vostok spacecraft completed one orbit of the Earth on 12 ' +
                'April 1961.'
        }, {
            x: '1969-07-20',
            name: 'First human on the Moon',
            label: 'First human on the Moon',
            description: 'Apollo 11 was the spaceflight that landed the ' +
                'first two people on the Moon. Commander Neil Armstrong and ' +
                'lunar module pilot Buzz Aldrin, both American, landed the ' +
                'Apollo Lunar Module Eagle on July 20, 1969, at 20:17 UTC.'
        }, {
            x: '1971-04-19',
            name: 'First space station',
            label: 'First space station',
            description: 'Salyute 1 was the first space station of any kind, ' +
                'launched into low Earth orbit by the Soviet Union on April ' +
                '19, 1971. The Salyut program followed this with five more ' +
                'successful launches out of seven more stations.'
        }, {
            x: '1971-12-02',
            name: 'First soft Mars landing',
            label: 'First soft Mars landing',
            description: 'Mars 3 was an unmanned space probe of the Soviet ' +
                'Mars program which spanned the years between 1960 and 1973. ' +
                'Mars 3 was launched May 28, 1971, nine days after its twin ' +
                'spacecraft Mars 2. The probes were identical robotic ' +
                'spacecraft launched by Proton-K rockets with a Blok D upper ' +
                'stage, each consisting of an orbiter and an attached lander.'
        }, {
            x: '1976-04-17',
            name: 'Closest flyby of the Sun',
            label: 'Closest flyby of the Sun',
            description: 'Helios-A and Helios-B (also known as Helios 1 and ' +
                'Helios 2) are a pair of probes launched into heliocentric ' +
                'orbit for the purpose of studying solar processes. A joint ' +
                'venture of West Germany\'s space agency DFVLR (70 percent ' +
                'share) and NASA (30 percent), the probes were launched from ' +
                'Cape Canaveral Air Force Station, Florida.'
        }, {
            x: '1978-12-04',
            name: 'First orbital exploration of Venus',
            label: 'First orbital exploration of Venus',
            description: 'The Pioneer Venus Orbiter entered orbit around ' +
                'Venus on December 4, 1978, and performed observations to ' +
                'characterize the atmosphere and surface of Venus. It ' +
                'continued to transmit data until October 1992.'
        }, {
            x: '1986-02-19',
            name: 'First inhabited space station',
            label: 'First inhabited space station',
            description: 'was a space station that operated in low Earth ' +
                'orbit from 1986 to 2001, operated by the Soviet Union and ' +
                'later by Russia. Mir was the first modular space station ' +
                'and was assembled in orbit from 1986 to 1996. It had a ' +
                'greater mass than any previous spacecraft.'
        }, {
            x: '1989-08-08',
            name: 'First astrometric satellite',
            label: 'First astrometric satellite',
            description: 'Hipparcos was a scientific satellite of the ' +
                'European Space Agency (ESA), launched in 1989 and operated ' +
                'until 1993. It was the first space experiment devoted to ' +
                'precision astrometry, the accurate measurement of the ' +
                'positions of celestial objects on the sky.'
        }, {
            x: '1998-11-20',
            name: 'First multinational space station',
            label: 'First multinational space station',
            description: 'The International Space Station (ISS) is a space ' +
                'station, or a habitable artificial satellite, in low Earth ' +
                'orbit. Its first component was launched into orbit in 1998, ' +
                'with the first long-term residents arriving in November ' +
                '2000.[7] It has been inhabited continuously since that date.'
        }]
    }]
});