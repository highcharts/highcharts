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
            text: 'Destroy chart from button'
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

    // Activate the button
    const button = document.getElementById('destroy');
    console.log(button);
    button.disabled = false;
    console.log(button);

    // Disable the button when map has been destroyed
    button.onclick = () => {
        chart.destroy();
        button.disabled = true;
    };

})();