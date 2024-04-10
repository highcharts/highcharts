(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        Highcharts.mapChart('container', {

            chart: {
                width: 800
            },

            title: {
                text: 'Tooltip positioner demo'
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                }
            },

            tooltip: {
                positioner: function () {
                    return { x: 0, y: 250 };
                },
                borderWidth: 0,
                shadow: false
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