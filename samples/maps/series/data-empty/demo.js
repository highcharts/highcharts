(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Empty map'
        },

        series: [{
            mapData: topology,
            name: 'World map'
        }]
    });
})();