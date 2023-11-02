(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Dashed borders'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
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

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            dashStyle: 'dot',
            borderColor: 'gray',
            states: {
                hover: {
                    color: '#a4edba'
                },
                select: {
                    color: 'black'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
})();