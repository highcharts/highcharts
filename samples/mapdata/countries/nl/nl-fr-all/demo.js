(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-fr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-fr-gm0058', 10], ['nl-fr-gm0060', 11], ['nl-fr-gm0093', 12],
        ['nl-fr-gm0063', 13], ['nl-fr-gm0079', 14], ['nl-fr-gm1891', 15],
        ['nl-fr-gm0072', 16], ['nl-fr-gm1722', 17], ['nl-fr-gm0088', 18],
        ['nl-fr-gm0096', 19], ['nl-fr-gm1900', 20], ['nl-fr-gm0140', 21],
        ['nl-fr-gm0070', 22], ['nl-fr-gm0055', 23], ['nl-fr-gm0051', 24],
        ['nl-fr-gm0653', 25], ['nl-fr-gm1908', 26], ['nl-fr-gm0081', 27],
        ['nl-fr-gm0737', 28], ['nl-fr-gm0090', 29], ['nl-fr-gm0082', 30],
        ['nl-fr-gm0098', 31], ['nl-fr-gm0080', 32], ['nl-fr-gm0085', 33],
        ['nl-fr-gm0059', 34], ['nl-fr-gm0086', 35], ['nl-fr-gm0074', 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-fr-all.topo.json">Friesland</a>'
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
