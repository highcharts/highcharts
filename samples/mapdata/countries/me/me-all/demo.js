(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/me/me-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['me-an', 10], ['me-be', 11], ['me-bp', 12], ['me-kl', 13],
        ['me-da', 14], ['me-mk', 15], ['me-nk', 16], ['me-pu', 17],
        ['me-pl', 18], ['me-pg', 19], ['me-ti', 20], ['me-sa', 21],
        ['me-za', 22], ['me-ba', 23], ['me-ce', 24], ['me-bu', 25],
        ['me-ul', 26], ['me-ro', 27], ['me-pv', 28], ['me-hn', 29],
        ['me-kt', 30]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/me/me-all.topo.json">Montenegro</a>'
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
