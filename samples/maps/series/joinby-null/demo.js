(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/nordic-countries-core.topo.json'
    ).then(response => response.json());

    const data = [1, 3, 5, 2, 4, 1, 3];


    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Data joined by <em>null</em>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {},

        series: [{
            data: data,
            mapData: topology,
            joinBy: null,
            name: 'Random data'
        }]
    });
})();