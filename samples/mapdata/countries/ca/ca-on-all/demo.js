(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-on-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-on-3559', 10], ['ca-on-3558', 11], ['ca-on-3511', 12],
        ['ca-on-3510', 13], ['ca-on-3544', 14], ['ca-on-3560', 15],
        ['ca-on-3551', 16], ['ca-on-3506', 17], ['ca-on-3507', 18],
        ['ca-on-3520', 19], ['ca-on-3521', 20], ['ca-on-3502', 21],
        ['ca-on-3556', 22], ['ca-on-3540', 23], ['ca-on-3523', 24],
        ['ca-on-3541', 25], ['ca-on-3518', 26], ['ca-on-3519', 27],
        ['ca-on-3542', 28], ['ca-on-3543', 29], ['ca-on-3538', 30],
        ['ca-on-3539', 31], ['ca-on-3531', 32], ['ca-on-3514', 33],
        ['ca-on-3513', 34], ['ca-on-3512', 35], ['ca-on-3548', 36],
        ['ca-on-3552', 37], ['ca-on-3516', 38], ['ca-on-3515', 39],
        ['ca-on-3557', 40], ['ca-on-3528', 41], ['ca-on-3532', 42],
        ['ca-on-3530', 43], ['ca-on-3534', 44], ['ca-on-3536', 45],
        ['ca-on-3537', 46], ['ca-on-3547', 47], ['ca-on-3509', 48],
        ['ca-on-3529', 49], ['ca-on-3549', 50], ['ca-on-3546', 51],
        ['ca-on-3526', 52], ['ca-on-3524', 53], ['ca-on-3525', 54],
        ['ca-on-3522', 55], ['ca-on-3501', 56], ['ca-on-3554', 57],
        ['ca-on-3553', 58]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-on-all.topo.json">Ontario</a>'
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
