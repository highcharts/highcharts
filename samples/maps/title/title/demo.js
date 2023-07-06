(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            align: 'left',
            floating: true,
            style: {
                color: '#303030',
                fontSize: '18px',
                fontWeight: 'bold'
            },
            text: 'Title options demo',
            verticalAlign: 'middle',
            x: 0,
            y: 80
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