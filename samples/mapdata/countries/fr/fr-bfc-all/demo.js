(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-bfc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-bfc-hn', 10], ['fr-bfc-sl', 11], ['fr-bfc-db', 12],
        ['fr-bfc-ni', 13], ['fr-bfc-tb', 14], ['fr-bfc-ju', 15],
        ['fr-bfc-yo', 16], ['fr-bfc-co', 17]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-bfc-all.topo.json">Bourgogne-Franche-Comté</a>'
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
