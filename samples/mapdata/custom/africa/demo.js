(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/africa.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ug', 10], ['ng', 11], ['st', 12], ['tz', 13], ['sl', 14], ['gw', 15],
        ['cv', 16], ['sc', 17], ['tn', 18], ['mg', 19], ['ke', 20], ['cd', 21],
        ['fr', 22], ['mr', 23], ['dz', 24], ['er', 25], ['gq', 26], ['mu', 27],
        ['sn', 28], ['km', 29], ['et', 30], ['ci', 31], ['gh', 32], ['zm', 33],
        ['na', 34], ['rw', 35], ['sx', 36], ['so', 37], ['cm', 38], ['cg', 39],
        ['eh', 40], ['bj', 41], ['bf', 42], ['tg', 43], ['ne', 44], ['ly', 45],
        ['lr', 46], ['mw', 47], ['gm', 48], ['td', 49], ['ga', 50], ['dj', 51],
        ['bi', 52], ['ao', 53], ['gn', 54], ['zw', 55], ['za', 56], ['mz', 57],
        ['sz', 58], ['ml', 59], ['bw', 60], ['sd', 61], ['ma', 62], ['eg', 63],
        ['ls', 64], ['ss', 65], ['cf', 66]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/africa.topo.json">Africa</a>'
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
