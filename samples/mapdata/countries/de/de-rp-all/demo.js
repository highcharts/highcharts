(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-rp-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-rp-07211000', 10], ['de-rp-07138000', 11], ['de-rp-07143000', 12],
        ['de-rp-07313000', 13], ['de-rp-07317000', 14], ['de-rp-07131000', 15],
        ['de-rp-07319000', 16], ['de-rp-07137000', 17], ['de-rp-07231000', 18],
        ['de-rp-07134000', 19], ['de-rp-07235000', 20], ['de-rp-07141000', 21],
        ['de-rp-07233000', 22], ['de-rp-07318000', 23], ['de-rp-07314000', 24],
        ['de-rp-07331000', 25], ['de-rp-07336000', 26], ['de-rp-07232000', 27],
        ['de-rp-07132000', 28], ['de-rp-07135000', 29], ['de-rp-07311000', 30],
        ['de-rp-07315000', 31], ['de-rp-07333000', 32], ['de-rp-07133000', 33],
        ['de-rp-07111000', 34], ['de-rp-07312000', 35], ['de-rp-07332000', 36],
        ['de-rp-07340000', 37], ['de-rp-07335000', 38], ['de-rp-07316000', 39],
        ['de-rp-07338000', 40], ['de-rp-07320000', 41], ['de-rp-07337000', 42],
        ['de-rp-07339000', 43], ['de-rp-07140000', 44], ['de-rp-07334000', 45]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-rp-all.topo.json">Rheinland-Pfalz</a>'
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
