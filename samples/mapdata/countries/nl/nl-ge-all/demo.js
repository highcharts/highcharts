(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-ge-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-ge-gm0293', 10], ['nl-ge-gm0299', 11], ['nl-ge-gm0222', 12],
        ['nl-ge-gm1586', 13], ['nl-ge-gm0225', 14], ['nl-ge-gm0209', 15],
        ['nl-ge-gm0733', 16], ['nl-ge-gm0304', 17], ['nl-ge-gm0668', 18],
        ['nl-ge-gm1955', 19], ['nl-ge-gm1705', 20], ['nl-ge-gm0202', 21],
        ['nl-ge-gm0226', 22], ['nl-ge-gm1740', 23], ['nl-ge-gm0232', 24],
        ['nl-ge-gm0269', 25], ['nl-ge-gm0230', 26], ['nl-ge-gm0301', 27],
        ['nl-ge-gm0285', 28], ['nl-ge-gm1876', 29], ['nl-ge-gm0302', 30],
        ['nl-ge-gm0243', 31], ['nl-ge-gm0233', 32], ['nl-ge-gm0267', 33],
        ['nl-ge-gm0203', 34], ['nl-ge-gm0273', 35], ['nl-ge-gm0279', 36],
        ['nl-ge-gm0200', 37], ['nl-ge-gm1734', 38], ['nl-ge-gm0241', 39],
        ['nl-ge-gm0252', 40], ['nl-ge-gm0265', 41], ['nl-ge-gm0213', 42],
        ['nl-ge-gm0277', 43], ['nl-ge-gm0236', 44], ['nl-ge-gm0216', 45],
        ['nl-ge-gm0281', 46], ['nl-ge-gm0275', 47], ['nl-ge-gm0196', 48],
        ['nl-ge-gm0296', 49], ['nl-ge-gm0228', 50], ['nl-ge-gm0289', 51],
        ['nl-ge-gm0214', 52], ['nl-ge-gm0263', 53], ['nl-ge-gm0246', 54],
        ['nl-ge-gm0282', 55], ['nl-ge-gm0297', 56], ['nl-ge-gm0262', 57],
        ['nl-ge-gm0244', 58], ['nl-ge-gm1509', 59], ['nl-ge-gm0197', 60],
        ['nl-ge-gm0294', 61], ['nl-ge-gm0274', 62], ['nl-ge-gm1859', 63],
        ['nl-ge-gm0221', 64], ['nl-ge-gm0268', 65]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ge-all.topo.json">Gelderland</a>'
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
