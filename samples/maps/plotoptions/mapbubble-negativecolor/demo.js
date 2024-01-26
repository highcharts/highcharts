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
            text: 'Negative color demo. Red bubbles are smaller than the UK.'
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
            negativeColor: '#FF0022',
            zThreshold: 62036,
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

})();