(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bs/bs-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bs-rc', 10], ['bs-ri', 11], ['bs-ck', 12], ['bs-ak', 13],
        ['bs-bi', 14], ['bs-ht', 15], ['bs-ce', 16], ['bs-wg', 17],
        ['bs-eg', 18], ['bs-gc', 19], ['bs-co', 20], ['bs-so', 21],
        ['bs-mi', 22], ['bs-by', 23], ['bs-cs', 24], ['bs-sa', 25],
        ['bs-bp', 26], ['bs-ex', 27], ['bs-sw', 28], ['bs-hi', 29],
        ['bs-fp', 30], ['bs-ne', 31], ['bs-se', 32], ['bs-no', 33],
        ['bs-mc', 34], ['bs-ci', 35], ['bs-ss', 36], ['bs-li', 37],
        ['bs-mg', 38], ['bs-in', 39], ['bs-ns', 40], ['bs-nw', 41]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bs/bs-all.topo.json">The Bahamas</a>'
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
