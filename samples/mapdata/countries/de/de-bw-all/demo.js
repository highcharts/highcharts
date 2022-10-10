(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-bw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-bw-08136000', 10], ['de-bw-08116000', 11], ['de-bw-08415000', 12],
        ['de-bw-08115000', 13], ['de-bw-08117000', 14], ['de-bw-08425000', 15],
        ['de-bw-08226000', 16], ['de-bw-08236000', 17], ['de-bw-08235000', 18],
        ['de-bw-08231000', 19], ['de-bw-08125000', 20], ['de-bw-08215000', 21],
        ['de-bw-08111000', 22], ['de-bw-08222000', 23], ['de-bw-08221000', 24],
        ['de-bw-08212000', 25], ['de-bw-08216000', 26], ['de-bw-08118000', 27],
        ['de-bw-08119000', 28], ['de-bw-08311000', 29], ['de-bw-08316000', 30],
        ['de-bw-08135000', 31], ['de-bw-08417000', 32], ['de-bw-08237000', 33],
        ['de-bw-08225000', 34], ['de-bw-08128000', 35], ['de-bw-08435000', 36],
        ['de-bw-08127000', 37], ['de-bw-08335000', 38], ['de-bw-08317000', 39],
        ['de-bw-08336000', 40], ['de-bw-08326000', 41], ['de-bw-08337000', 42],
        ['de-bw-08436000', 43], ['de-bw-08437000', 44], ['de-bw-08426000', 45],
        ['de-bw-08421000', 46], ['de-bw-08315000', 47], ['de-bw-08121000', 48],
        ['de-bw-08416000', 49], ['de-bw-08211000', 50], ['de-bw-08325000', 51],
        ['de-bw-08327000', 52], ['de-bw-08126000', 53]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-bw-all.topo.json">Baden-Württemberg</a>'
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
