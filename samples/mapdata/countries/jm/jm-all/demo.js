(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/jm/jm-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['jm-ha', 10], ['jm-ma', 11], ['jm-se', 12], ['jm-sj', 13],
        ['jm-tr', 14], ['jm-we', 15], ['jm-ki', 16], ['jm-po', 17],
        ['jm-sn', 18], ['jm-sc', 19], ['jm-sm', 20], ['jm-sd', 21],
        ['jm-st', 22], ['jm-cl', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/jm/jm-all.topo.json">Jamaica</a>'
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
