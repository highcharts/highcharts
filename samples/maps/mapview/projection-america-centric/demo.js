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
            text: 'America-centric Miller projection'
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
                rotation: [90]
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
