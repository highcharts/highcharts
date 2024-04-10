(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        Highcharts.mapChart('container', {

            chart: {
                borderWidth: 1
                // reflow: true // by default
            },

            title: {
                text: 'Chart with reflow enabled'
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
                },
                backgroundColor: 'rgba(255,255,255,0.85)'
            },

            // The map series
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
    });
})();