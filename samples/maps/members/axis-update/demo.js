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
            text: 'Update the color axis'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic',
            minColor: '#FFFFFF',
            maxColor: '#000000',
            tickPixelInterval: 100
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

    let blackAndWhite = true,
        log = true;

    document.getElementById('update-color').onclick = () => {
        const colorAxis = chart.colorAxis[0];

        colorAxis.update({
            maxColor: blackAndWhite ? '#980043' : '#000000'
        });
        blackAndWhite = !blackAndWhite;
    };

    document.getElementById('update-linlog').onclick = () => {
        const colorAxis = chart.colorAxis[0];

        colorAxis.update({
            type: log ? 'linear' : 'logarithmic'
        });
        log = !log;
    };

})();