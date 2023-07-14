(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        chart: {
            width: 600,
            height: 500
        },

        title: {
            text: 'Set map view'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });


    const zoomToEurope = () => chart.mapView.setView(
        [10, 52],
        3.8
    );

    document.getElementById('setextremes').onclick = zoomToEurope;

})();