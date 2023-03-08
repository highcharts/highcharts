(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-nh-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-3557-gm0381', 10], ['nl-3557-gm0377', 11], ['nl-3557-gm0363', 12],
        ['nl-3557-gm0376', 13], ['nl-3557-gm0420', 14], ['nl-3557-gm0424', 15],
        ['nl-3557-gm0448', 16], ['nl-3557-gm0453', 17], ['nl-3557-gm0383', 18],
        ['nl-3557-gm1911', 19], ['nl-3557-gm0398', 20], ['nl-3557-gm0479', 21],
        ['nl-3557-gm0362', 22], ['nl-3557-gm0393', 23], ['nl-3557-gm0498', 24],
        ['nl-3557-gm0405', 25], ['nl-3557-gm0388', 26], ['nl-3557-gm0425', 27],
        ['nl-3557-gm0402', 28], ['nl-3557-gm0457', 29], ['nl-3557-gm0406', 30],
        ['nl-3557-gm0392', 31], ['nl-3557-gm0394', 32], ['nl-3557-gm0375', 33],
        ['nl-3557-gm0437', 34], ['nl-3557-gm1598', 35], ['nl-3557-gm0417', 36],
        ['nl-3557-gm0432', 37], ['nl-3557-gm0358', 38], ['nl-3557-gm0365', 39],
        ['nl-3557-gm0370', 40], ['nl-3557-gm0361', 41], ['nl-3557-gm0373', 42],
        ['nl-3557-gm0416', 43], ['nl-3557-gm0415', 44], ['nl-3557-gm0439', 45],
        ['nl-3557-gm0441', 46], ['nl-3557-gm0396', 47], ['nl-3557-gm0852', 48],
        ['nl-3557-gm0451', 49], ['nl-3557-gm0880', 50], ['nl-3557-gm0431', 51],
        ['nl-3557-gm0384', 52], ['nl-3557-gm0532', 53], ['nl-3557-gm1696', 54],
        ['nl-3557-gm0400', 55], ['nl-3557-gm0399', 56], ['nl-3557-gm0385', 57],
        ['nl-3557-gm0478', 58], ['nl-3557-gm0473', 59], ['nl-3557-gm0397', 60],
        ['nl-3557-gm0458', 61], ['nl-3557-gm0450', 62]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-nh-all.topo.json">Noord-Holland</a>'
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
