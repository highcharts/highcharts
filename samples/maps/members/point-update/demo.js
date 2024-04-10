(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        const chart = Highcharts.mapChart('container', {

            title: {
                text: 'Update point'
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
                allowPointSelect: true,
                cursor: 'pointer',
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });

        // Set button text
        const point = chart.series[0].points.find(p => p.name === 'Greenland'),
            button = document.getElementById('update');
        button.textContent = 'Update population of ' + point.name;

        // Activate the button
        button.disabled = false;

        // When the button is clicked
        button.onclick = () => {
            point.update(10000000);
        };
    });

})();