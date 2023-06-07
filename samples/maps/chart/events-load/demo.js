(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        Highcharts.mapChart('container', {

            chart: {
                events: {
                    load: e => e.target.addSeries({
                        type: 'mappoint',
                        colorAxis: false,
                        data: [{
                            lon: 6.58,
                            lat: 61.09,
                            name: 'Point added on chart load'
                        }],
                        name: 'Series added on chart load'
                    })
                }
            },

            title: {
                text: 'Add series on chart load'
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
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });

})();