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
            text: 'Vertical gradient legend'
        },

        subtitle: {
            text: 'Population<br>density per km²',
            floating: true,
            align: 'left',
            verticalAlign: 'bottom',
            y: -80,
            x: 60
        },

        legend: {
            borderWidth: 0,
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            floating: true,
            width: 100
        },

        mapNavigation: {
            enabled: true
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