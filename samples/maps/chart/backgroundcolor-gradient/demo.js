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
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#cddee4'],
                    [1, '#4b96af']
                ]
            }
        },

        title: {
            text: 'Chart with a background gradient'
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
            type: 'logarithmic',
            minColor: '#e6e696',
            maxColor: '#003700'
        },

        legend: {
            title: {
                text: 'Population per km²'
            },
            backgroundColor: 'rgba(255,255,255,0.85)'
        },

        series: [{
            data: data,
            mapData: topology,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            borderColor: '#555',
            borderWidth: 0.5,
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
})();