(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/az/az-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['az-cf', 10], ['az-sh', 11], ['az-qz', 12], ['az-ba', 13],
        ['az-6369', 14], ['az-sa', 15], ['az-ga', 16], ['az-xr', 17],
        ['az-na', 18], ['az-gr', 19], ['az-ka', 20], ['az-yv', 21],
        ['az-as', 22], ['az-dv', 23], ['az-bs', 24], ['az-st', 25],
        ['az-sq', 26], ['az-xi', 27], ['az-si', 28], ['az-qa', 29],
        ['az-qb', 30], ['az-805', 31], ['az-xd', 32], ['az-qd', 33],
        ['az-2051', 34], ['az-xc', 35], ['az-bb', 36], ['az-la', 37],
        ['az-sl', 38], ['az-ab', 39], ['az-sb', 40], ['az-7025', 41],
        ['az-kg', 42], ['az-af', 43], ['az-ds', 44], ['az-sx', 45],
        ['az-to', 46], ['az-ta', 47], ['az-am', 48], ['az-ha', 49],
        ['az-au', 50], ['az-br', 51], ['az-yr', 52], ['az-cl', 53],
        ['az-zg', 54], ['az-cb', 55], ['az-zr', 56], ['az-bq', 57],
        ['az-im', 58], ['az-ku', 59], ['az-uc', 60], ['az-gy', 61],
        ['az-is', 62], ['az-ln', 63], ['az-ma', 64], ['az-ne', 65],
        ['az-ac', 66], ['az-og', 67], ['az-qx', 68], ['az-sk', 69],
        ['az-qr', 70], ['az-xz', 71], ['az-zq', 72], ['az-bl', 73],
        ['az-sd', 74], ['az-or', 75], ['az-sr', 76], ['az-gd', 77],
        ['az-sm', 78], ['az-ar', 79], ['az-aa', 80], ['az-fu', 81],
        ['az-le', 82], ['az-qo', 83], ['az-sy', 84], ['az-nx', 85],
        ['az-mi', 86], ['az-ye', 87]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/az/az-all.topo.json">Azerbaijan</a>'
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
