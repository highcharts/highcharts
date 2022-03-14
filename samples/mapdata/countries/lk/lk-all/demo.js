(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/lk/lk-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['lk-bc', 10], ['lk-mb', 11], ['lk-ja', 12], ['lk-kl', 13],
        ['lk-ky', 14], ['lk-mt', 15], ['lk-nw', 16], ['lk-ap', 17],
        ['lk-pr', 18], ['lk-tc', 19], ['lk-ad', 20], ['lk-va', 21],
        ['lk-mp', 22], ['lk-kg', 23], ['lk-px', 24], ['lk-rn', 25],
        ['lk-gl', 26], ['lk-hb', 27], ['lk-mh', 28], ['lk-bd', 29],
        ['lk-mj', 30], ['lk-ke', 31], ['lk-co', 32], ['lk-gq', 33],
        ['lk-kt', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lk/lk-all.topo.json">Sri Lanka</a>'
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
