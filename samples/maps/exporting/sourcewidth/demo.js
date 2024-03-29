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
            width: 800,
            height: 500
        },

        title: {
            text: 'Exporting sourceWidth and sourceHeight demo'
        },

        subtitle: {
            text: 'The on-screen chart is 800x500.<br/>The exported chart is ' +
                '800x400<br/>(sourceWidth and sourceHeight<br/>multiplied by ' +
                'scale)',
            floating: true,
            align: 'left',
            y: 300
        },

        legend: {
            title: {
                text: 'Population density per km²'
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
            tooltip: {
                valueSuffix: '/km²'
            }
        }],

        exporting: {
            sourceWidth: 400,
            sourceHeight: 200,
            // scale: 2 (default)
            chartOptions: {
                subtitle: null
            }
        }
    });
})();