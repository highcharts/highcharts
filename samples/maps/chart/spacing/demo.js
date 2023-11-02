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
            borderWidth: 2,
            spacingTop: 100,
            spacingRight: 100,
            spacingBottom: 100,
            spacingLeft: 100,
            // spacing: [100, 100, 100, 100], // equivalent of the above
            plotBackgroundColor: '#E0E0E0'
        },

        title: {
            text: 'Chart with a 100px spacing all around'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        legend: {
            title: {
                text: 'Population per km²'
            }
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