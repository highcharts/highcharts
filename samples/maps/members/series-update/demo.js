(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: 'Update series'
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
        }]
    });

    // Activate the button
    const button = document.getElementById('update');
    button.disabled = false;

    // When the button is clicked
    button.onclick = () => {
        chart.series[0].update({
            name: 'Updated series name',
            borderColor: 'black',
            dashStyle: 'dot'
        });
    };

})();