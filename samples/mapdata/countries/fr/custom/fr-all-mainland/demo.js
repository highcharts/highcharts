(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/custom/fr-all-mainland.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-bre', 10], ['fr-pdl', 11], ['fr-pac', 12], ['fr-occ', 13],
        ['fr-naq', 14], ['fr-bfc', 15], ['fr-cvl', 16], ['fr-idf', 17],
        ['fr-hdf', 18], ['fr-ara', 19], ['fr-ges', 20], ['fr-nor', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/custom/fr-all-mainland.topo.json">France, mainland</a>'
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
