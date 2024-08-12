(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/me/me-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['me-hn', 10], ['me-pl', 11], ['me-ro', 12], ['me-an', 13],
        ['me-ba', 14], ['me-pg', 15], ['me-br', 16], ['me-bp', 17],
        ['me-bd', 18], ['me-ct', 19], ['me-dg', 20], ['me-kl', 21],
        ['me-ko', 22], ['me-mk', 23], ['me-nk', 24], ['me-pv', 25],
        ['me-pž', 26], ['me-tv', 27], ['me-ul', 28], ['me-ša', 29],
        ['me-žb', 30], ['me-gu', 31], ['me-pe', 32], ['me-tu', 33],
        ['me-ze', 34]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/me/me-all.topo.json">Montenegro</a>'
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
