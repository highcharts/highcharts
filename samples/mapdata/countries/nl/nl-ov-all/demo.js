(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-ov-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-ov-gm0166', 10], ['nl-ov-gm0168', 11], ['nl-ov-gm0148', 12],
        ['nl-ov-gm0160', 13], ['nl-ov-gm0158', 14], ['nl-ov-gm0164', 15],
        ['nl-ov-gm1896', 16], ['nl-ov-gm0193', 17], ['nl-ov-gm0153', 18],
        ['nl-ov-gm0173', 19], ['nl-ov-gm1774', 20], ['nl-ov-gm0163', 21],
        ['nl-ov-gm0175', 22], ['nl-ov-gm0177', 23], ['nl-ov-gm1708', 24],
        ['nl-ov-gm0180', 25], ['nl-ov-gm1742', 26], ['nl-ov-gm0147', 27],
        ['nl-ov-gm0141', 28], ['nl-ov-gm1773', 29], ['nl-ov-gm0189', 30],
        ['nl-ov-gm0183', 31], ['nl-ov-gm1735', 32], ['nl-ov-gm0150', 33],
        ['nl-ov-gm1700', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ov-all.topo.json">Overijssel</a>'
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
