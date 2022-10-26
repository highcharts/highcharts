(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/lr/lr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['lr-gp', 10], ['lr-bg', 11], ['lr-586', 12], ['lr-cm', 13],
        ['lr-lf', 14], ['lr-mo', 15], ['lr-mg', 16], ['lr-ni', 17],
        ['lr-ri', 18], ['lr-gd', 19], ['lr-si', 20], ['lr-rg', 21],
        ['lr-gk', 22], ['lr-my', 23], ['lr-bm', 24]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lr/lr-all.topo.json">Liberia</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
