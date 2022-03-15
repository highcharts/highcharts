(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-gr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-gr-gm1651', 10], ['nl-gr-gm1663', 11], ['nl-gr-gm1895', 12],
        ['nl-gr-gm0037', 13], ['nl-gr-gm0056', 14], ['nl-gr-gm0053', 15],
        ['nl-gr-gm0047', 16], ['nl-gr-gm1730', 17], ['nl-gr-gm0048', 18],
        ['nl-gr-gm0765', 19], ['nl-gr-gm1987', 20], ['nl-gr-gm0024', 21],
        ['nl-gr-gm0005', 22], ['nl-gr-gm0040', 23], ['nl-gr-gm0007', 24],
        ['nl-gr-gm0009', 25], ['nl-gr-gm0014', 26], ['nl-gr-gm0018', 27],
        ['nl-gr-gm0010', 28], ['nl-gr-gm0003', 29], ['nl-gr-gm0022', 30],
        ['nl-gr-gm0017', 31], ['nl-gr-gm0015', 32], ['nl-gr-gm0025', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-gr-all.topo.json">Groningen</a>'
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
