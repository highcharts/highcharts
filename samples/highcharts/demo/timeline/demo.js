Highcharts.chart('container', {
    chart: {
        type: 'timeline'
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false
    },
    title: {
        text: 'Timeline of Space Exploration'
    },
    subtitle: {
        text: 'Info source: <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">www.wikipedia.org</a>'
    },
    colors: [
        '#4185F3',
        '#427CDD',
        '#406AB2',
        '#3E5A8E',
        '#3B4A68',
        '#363C46'
    ],
    series: [{
        data: [{
            name: 'First dogs',
            label: '1951: First dogs in space',
            description: '22 July 1951 First dogs in space (Dezik and Tsygan) '
        }, {
            name: 'Sputnik 1',
            label: '1957: First artificial satellite',
            description: '4 October 1957 First artificial satellite. First signals from space.'
        }, {
            name: 'First human spaceflight',
            label: '1961: First human spaceflight (Yuri Gagarin)',
            description: 'First human spaceflight (Yuri Gagarin), and the first human-crewed orbital flight'
        }, {
            name: 'First human on the Moon',
            label: '1969: First human on the Moon',
            description: 'First human on the Moon, and first space launch from a celestial body other than the Earth. First sample return from the Moon'
        }, {
            name: 'First space station',
            label: '1971: First space station',
            description: 'Salyut 1 was the first space station of any kind, launched into low Earth orbit by the Soviet Union on April 19, 1971.'
        }, {
            name: 'Apollo–Soyuz Test Project',
            label: '1975: First multinational manned mission',
            description: 'The mission included both joint and separate scientific experiments, and provided useful engineering experience for future joint US–Russian space flights, such as the Shuttle–Mir Program and the International Space Station.'
        }]
    }]
});