(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        Highcharts.mapChart('container', {

            title: {
                text: 'Tooltip format demo'
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


            tooltip: {
                headerFormat: '<span style="font-size:10px">{series.name}</span><br/>',
                pointFormat: '{point.name}: <b>{point.value:.1f} individuals/km²</b><br/>',
                footerFormat: '<span style="font-size:10px">Source: Wikipedia</span><br/>'
            },

            series: [{
                data: data,
                mapData: topology,
                joinBy: ['iso-a2', 'code'],
                name: 'Population density'
            }]
        });
    });
})();