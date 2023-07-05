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
            marginLeft: 70
        },

        title: {
            text: 'Legend alignment'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            },
            align: 'left',
            verticalAlign: 'middle',
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: 'white'
        },

        mapNavigation: {
            enabled: true,
            enableButtons: false
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
})();