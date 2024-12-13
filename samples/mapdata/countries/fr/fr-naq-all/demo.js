(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-naq-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-naq-cm', 10], ['fr-naq-lg', 11], ['fr-naq-cr', 12],
        ['fr-naq-ds', 13], ['fr-naq-hv', 14], ['fr-naq-dd', 15],
        ['fr-naq-ct', 16], ['fr-naq-gi', 17], ['fr-naq-ld', 18],
        ['fr-naq-vn', 19], ['fr-naq-cz', 20], ['fr-naq-pa', 21]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-naq-all.topo.json">Nouvelle-Aquitaine</a>'
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
