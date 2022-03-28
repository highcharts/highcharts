(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-zh-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-3560-gm0627', 10], ['nl-3560-gm1672', 11], ['nl-3560-gm1924', 12],
        ['nl-3560-gm0537', 13], ['nl-3560-gm1525', 14], ['nl-3560-gm0576', 15],
        ['nl-3560-gm0617', 16], ['nl-3560-gm1901', 17], ['nl-3560-gm0623', 18],
        ['nl-3560-gm0545', 19], ['nl-3560-gm0620', 20], ['nl-3560-gm1621', 21],
        ['nl-3560-gm0637', 22], ['nl-3560-gm0499', 23], ['nl-3560-gm0512', 24],
        ['nl-3560-gm0523', 25], ['nl-3560-gm0531', 26], ['nl-3560-gm0482', 27],
        ['nl-3560-gm0546', 28], ['nl-3560-gm0534', 29], ['nl-3560-gm0553', 30],
        ['nl-3560-gm0585', 31], ['nl-3560-gm0638', 32], ['nl-3560-gm1916', 33],
        ['nl-3560-gm0568', 34], ['nl-3560-gm0612', 35], ['nl-3560-gm0505', 36],
        ['nl-3560-gm0590', 37], ['nl-3560-gm0503', 38], ['nl-3560-gm0599', 39],
        ['nl-3560-gm1926', 40], ['nl-3560-gm1892', 41], ['nl-3560-gm0644', 42],
        ['nl-3560-gm0491', 43], ['nl-3560-gm0608', 44], ['nl-3560-gm0610', 45],
        ['nl-3560-gm0530', 46], ['nl-3560-gm0614', 47], ['nl-3560-gm0584', 48],
        ['nl-3560-gm0611', 49], ['nl-3560-gm0588', 50], ['nl-3560-gm0501', 51],
        ['nl-3560-gm0613', 52], ['nl-3560-gm0622', 53], ['nl-3560-gm0556', 54],
        ['nl-3560-gm0629', 55], ['nl-3560-gm0547', 56], ['nl-3560-gm0642', 57],
        ['nl-3560-gm0489', 58], ['nl-3560-gm1927', 59], ['nl-3560-gm0597', 60],
        ['nl-3560-gm0542', 61], ['nl-3560-gm0502', 62], ['nl-3560-gm0513', 63],
        ['nl-3560-gm0518', 64], ['nl-3560-gm1783', 65], ['nl-3560-gm1842', 66],
        ['nl-3560-gm0575', 67], ['nl-3560-gm0603', 68], ['nl-3560-gm0569', 69],
        ['nl-3560-gm1884', 70], ['nl-3560-gm0484', 71], ['nl-3560-gm0626', 72],
        ['nl-3560-gm0643', 73], ['nl-3560-gm0689', 74], ['nl-3560-gm0707', 75],
        ['nl-3560-gm0579', 76], ['nl-3560-gm0606', 77]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-zh-all.topo.json">Zuid-Holland</a>'
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
