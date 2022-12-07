Highcharts.chart('container', {
    chart: {
        type: 'timeline'
    },
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h5>{chartTitle}</h5>' +
                '<div>{typeDescription}</div>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{viewTableButton}</div>'
        },
        point: {
            valueDescriptionFormat: '{index}. {point.label}. {point.description}.'
        }
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
            name: '2000: Orbiting of an asteroid',
            description: '14 February 2000, first orbiting of an asteroid (433 Eros).'
        }, {
            name: '2005: Landing on Titan.',
            description: '14 January 2005, first soft landing on Titan also first soft landing in the outer Solar System.'
        }, {
            name: '2011: Orbit of Mercury',
            description: '18 March 2011, first spacecraft to orbit Mercury.'
        }, {
            name: '2015: Food eaten in space',
            description: '10 August 2015, first food grown in space and eaten (lettuce).'
        }, {
            name: '2019: Black hole photograph',
            description: '10 April 2019, first direct photograph of a black hole and its vicinity.'
        }, {
            name: '2020: Private spaceflight',
            description: '30 May 2020, first orbital human spaceflight launched by a private company (SpaceX).'
        }]
    }]
});