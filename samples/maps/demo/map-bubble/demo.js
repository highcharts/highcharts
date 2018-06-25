
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population.json', function (data) {

    Highcharts.mapChart('container', {
        chart: {
            borderWidth: 1,
            map: 'custom/world'
        },

        title: {
            text: 'World population 2013 by country'
        },

        subtitle: {
            text: 'Demo of Highcharts map with bubbles'
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
            name: 'Population 2016',
            joinBy: ['iso-a3', 'code3'],
            data: data,
            minSize: 4,
            maxSize: '12%',
            tooltip: {
                pointFormat: '{point.properties.hc-a2}: {point.z} thousands'
            }
        }]
    });
});
