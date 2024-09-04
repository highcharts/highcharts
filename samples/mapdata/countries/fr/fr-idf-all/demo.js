(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-idf-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-idf-se', 10], ['fr-idf-hd', 11], ['fr-idf-ss', 12],
        ['fr-idf-es', 13], ['fr-idf-vo', 14], ['fr-idf-vp', 15],
        ['fr-idf-vm', 16], ['fr-idf-yv', 17]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-idf-all.topo.json">Île-de-France</a>'
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
