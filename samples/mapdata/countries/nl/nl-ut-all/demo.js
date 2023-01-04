(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-ut-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-3559-gm0351', 10], ['nl-3559-gm0632', 11], ['nl-3559-gm1904', 12],
        ['nl-3559-gm0352', 13], ['nl-3559-gm0355', 14], ['nl-3559-gm0345', 15],
        ['nl-3559-gm1581', 16], ['nl-3559-gm0307', 17], ['nl-3559-gm0313', 18],
        ['nl-3559-gm0308', 19], ['nl-3559-gm0356', 20], ['nl-3559-gm0317', 21],
        ['nl-3559-gm0736', 22], ['nl-3559-gm0327', 23], ['nl-3559-gm0342', 24],
        ['nl-3559-gm0339', 25], ['nl-3559-gm0340', 26], ['nl-3559-gm0331', 27],
        ['nl-3559-gm0589', 28], ['nl-3559-gm0312', 29], ['nl-3559-gm0321', 30],
        ['nl-3559-gm0310', 31], ['nl-3559-gm0344', 32], ['nl-3559-gm0335', 33],
        ['nl-3559-gm0353', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ut-all.topo.json">Utrecht</a>'
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
