(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-fi-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-fi-5605', 10], ['no-fi-5614', 11], ['no-fi-5616', 12],
        ['no-fi-5618', 13], ['no-fi-5620', 14], ['no-fi-5622', 15],
        ['no-fi-5626', 16], ['no-fi-5630', 17], ['no-fi-5632', 18],
        ['no-fi-5634', 19], ['no-fi-5607', 20], ['no-fi-5636', 21],
        ['no-fi-5628', 22], ['no-fi-5610', 23], ['no-fi-5612', 24],
        ['no-fi-5624', 25], ['no-fi-5601', 26], ['no-fi-5603', 27]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-fi-all.topo.json">Finnmark</a>'
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
