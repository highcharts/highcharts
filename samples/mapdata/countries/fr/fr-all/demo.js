(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-cor', 10], ['fr-bre', 11], ['fr-pdl', 12], ['fr-pac', 13],
        ['fr-occ', 14], ['fr-naq', 15], ['fr-bfc', 16], ['fr-cvl', 17],
        ['fr-idf', 18], ['fr-hdf', 19], ['fr-ara', 20], ['fr-ges', 21],
        ['fr-nor', 22], ['fr-lre', 23], ['fr-may', 24], ['fr-gf', 25],
        ['fr-mq', 26], ['fr-gua', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json">France</a>'
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
