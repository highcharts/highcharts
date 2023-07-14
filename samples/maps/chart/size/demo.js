(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            width: 500,
            height: 300
        },

        title: {
            text: 'Chart with explicit width and height'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        legend: {
            enabled: false
        },

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            borderWidth: 0.5,
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
})();