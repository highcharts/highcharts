var data = [
    ['eu', 0],
    ['oc', 1],
    ['af', 2],
    ['as', 3],
    ['na', 4],
    ['sa', 5]
];

Highcharts.mapChart('container', {
    chart: {
        map: 'custom/world-continents'
    },

    title: {
        text: 'POPULATION OF THE WORLD AND ITS MAJOR AREAS, 1750-2150'
    },

    subtitle: {
        text: 'Source <a href="http://www.un.org/esa/population/publications/sixbillion/sixbilpart1.pdf">UN.org</a>'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    legend: {
        enabled: false
    },
    colorAxis: {
        dataClasses: [{ // europe
            to: 0,
            color: '#f15c80'
        }, { // oceania
            from: 1,
            to: 1,
            color: '#f7a35c'
        }, { // africa
            from: 2,
            to: 2,
            color: '#90ed7d'
        }, { // asia
            from: 3,
            to: 3,
            color: '#8085e9'
        }, { // north america
            from: 4,
            to: 4,
            color: '#434348'
        }, { // south america
            from: 5,
            to: 5,
            color: '#7cb5ec'
        }]
    },

    series: [{
        data: data,
        name: 'Random data',
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }]
});
