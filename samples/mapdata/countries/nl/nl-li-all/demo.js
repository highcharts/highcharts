(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-li-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-li-gm0889', 10], ['nl-li-gm0899', 11], ['nl-li-gm0882', 12],
        ['nl-li-gm0917', 13], ['nl-li-gm0951', 14], ['nl-li-gm0971', 15],
        ['nl-li-gm0888', 16], ['nl-li-gm0881', 17], ['nl-li-gm1883', 18],
        ['nl-li-gm0928', 19], ['nl-li-gm0944', 20], ['nl-li-gm1711', 21],
        ['nl-li-gm0946', 22], ['nl-li-gm0938', 23], ['nl-li-gm1641', 24],
        ['nl-li-gm0957', 25], ['nl-li-gm1669', 26], ['nl-li-gm0962', 27],
        ['nl-li-gm0965', 28], ['nl-li-gm0935', 29], ['nl-li-gm1729', 30],
        ['nl-li-gm1507', 31], ['nl-li-gm0994', 32], ['nl-li-gm0893', 33],
        ['nl-li-gm0986', 34], ['nl-li-gm0983', 35], ['nl-li-gm1640', 36],
        ['nl-li-gm0984', 37], ['nl-li-gm1894', 38], ['nl-li-gm0981', 39],
        ['nl-li-gm0988', 40], ['nl-li-gm1903', 41], ['nl-li-gm0907', 42]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-li-all.topo.json">Limburg</a>'
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
