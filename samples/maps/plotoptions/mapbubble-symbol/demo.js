(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            borderWidth: 1,
            map: topology
        },

        title: {
            text: 'World population 2010 by country'
        },

        subtitle: {
            text: 'Map bubble symbol demo'
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
            color: Highcharts.getOptions().colors[5],
            joinBy: ['iso-a2', 'code'],
            data: data,
            name: 'Population 2010',
            marker: {
                symbol: 'mapmarker'
            },
            minSize: 4,
            maxSize: '12%',
            tooltip: {
                pointFormat: '{point.code}: {point.z} thousands'
            }
        }]
    });

})();