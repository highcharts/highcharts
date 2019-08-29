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
        }]
    }]
});