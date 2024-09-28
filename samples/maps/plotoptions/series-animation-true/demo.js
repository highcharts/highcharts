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
            text: 'Initial series animation enabled'
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
            animation: true,
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            allowPointSelect: true,
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