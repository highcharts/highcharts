(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-in-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-in-3430', 10], ['no-in-3427', 11], ['no-in-3426', 12],
        ['no-in-3425', 13], ['no-in-3421', 14], ['no-in-3424', 15],
        ['no-in-3429', 16], ['no-in-3423', 17], ['no-in-3441', 18],
        ['no-in-3451', 19], ['no-in-3443', 20], ['no-in-3452', 21],
        ['no-in-3428', 22], ['no-in-3435', 23], ['no-in-3453', 24],
        ['no-in-3431', 25], ['no-in-3436', 26], ['no-in-3416', 27],
        ['no-in-3450', 28], ['no-in-3454', 29], ['no-in-3446', 30],
        ['no-in-3439', 31], ['no-in-3442', 32], ['no-in-3419', 33],
        ['no-in-3401', 34], ['no-in-3420', 35], ['no-in-3432', 36],
        ['no-in-3422', 37], ['no-in-3412', 38], ['no-in-3434', 39],
        ['no-in-3449', 40], ['no-in-3413', 41], ['no-in-3447', 42],
        ['no-in-3418', 43], ['no-in-3440', 44], ['no-in-3411', 45],
        ['no-in-3414', 46], ['no-in-3433', 47], ['no-in-3415', 48],
        ['no-in-3417', 49], ['no-in-3448', 50], ['no-in-3405', 51],
        ['no-in-3403', 52], ['no-in-3407', 53], ['no-in-3438', 54],
        ['no-in-3437', 55]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-in-all.topo.json">Innlandet</a>'
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
