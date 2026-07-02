(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Miller projection clipped in Bering Strait'
        },

        subtitle: {
            text: 'Rotated 11 degrees to avoid the eastern tip of ' +
                'Russia being rendered to the left'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'Miller',
                // Rotate to make sure the clip is in the Bering Strait, not on
                // the eastern tip of Russia
                rotation: [-11]
            }
        },

        series: [{
            data,
            mapData,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
})();
