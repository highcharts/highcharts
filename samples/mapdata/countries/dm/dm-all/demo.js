(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/dm/dm-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['dm-lu', 10], ['dm-ma', 11], ['dm-pk', 12], ['dm-da', 13],
        ['dm-pl', 14], ['dm-pr', 15], ['dm-an', 16], ['dm-go', 17],
        ['dm-jn', 18], ['dm-jh', 19]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/dm/dm-all.topo.json">Dominica</a>'
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
