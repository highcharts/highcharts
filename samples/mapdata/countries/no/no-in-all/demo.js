(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-in-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-in-3412', 10], ['no-in-3420', 11], ['no-in-3403', 12],
        ['no-in-3413', 13], ['no-in-3419', 14], ['no-in-3422', 15],
        ['no-in-3411', 16], ['no-in-3433', 17], ['no-in-3432', 18],
        ['no-in-3431', 19], ['no-in-3434', 20], ['no-in-3435', 21],
        ['no-in-3437', 22], ['no-in-3436', 23], ['no-in-3438', 24],
        ['no-in-3439', 25], ['no-in-3440', 26], ['no-in-3405', 27],
        ['no-in-3441', 28], ['no-in-3407', 29], ['no-in-3442', 30],
        ['no-in-3443', 31], ['no-in-3446', 32], ['no-in-3447', 33],
        ['no-in-3448', 34], ['no-in-3449', 35], ['no-in-3451', 36],
        ['no-in-3452', 37], ['no-in-3454', 38], ['no-in-3450', 39],
        ['no-in-3453', 40], ['no-in-3416', 41], ['no-in-3401', 42],
        ['no-in-3415', 43], ['no-in-3414', 44], ['no-in-3417', 45],
        ['no-in-3418', 46], ['no-in-3421', 47], ['no-in-3423', 48],
        ['no-in-3424', 49], ['no-in-3425', 50], ['no-in-3430', 51],
        ['no-in-3426', 52], ['no-in-3427', 53], ['no-in-3428', 54],
        ['no-in-3429', 55]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-in-all.topo.json">Innlandet</a>'
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
