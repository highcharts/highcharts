
$.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population.json', function (data) {

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
            enabled: true,
            align: 'left',
            itemMarginTop: 20,
            verticalAlign: 'middle',
            layout: 'vertical',
            floating: true,
            bubbleLegend: {
                enabled: true,
                connectorColor: '#000000',
                borderWidth: 0,
                ranges: [{
                    color: '#1500ff'
                }, {
                    color: '#83d18e'
                }, {
                    color: '#ff0000'
                }]
            }
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
            showInLegend: false,
            colorAxis: true,
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
