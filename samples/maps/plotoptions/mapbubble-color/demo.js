

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/world-population.json', function (data) {

    Highcharts.mapChart('container', {
        chart: {
            borderWidth: 1,
            map: 'custom/world'
        },

        title: {
            text: 'World population 2010 by country'
        },

        subtitle: {
            text: 'Map bubble color demo'
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [{
            name: 'Countries',
            color: '#E0E0E0',
            enableMouseTracking: false
        }, {
            type: 'mapbubble',
            color: '#FF0088',
            joinBy: ['iso-a2', 'code'],
            data: data,
            name: 'Population 2010',

            minSize: 4,
            maxSize: '12%',
            tooltip: {
                pointFormat: '{point.code}: {point.z} thousands'
            }
        }]
    });

});
