(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/in/in-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['in-tn', 10], ['in-py', 11], ['in-hp', 12], ['in-sk', 13],
        ['in-dl', 14], ['in-up', 15], ['in-hr', 16], ['in-pb', 17],
        ['in-ch', 18], ['in-rj', 19], ['in-jk', 20], ['in-gj', 21],
        ['in-mp', 22], ['in-mh', 23], ['in-dh', 24], ['in-br', 25],
        ['in-wb', 26], ['in-jh', 27], ['in-cg', 28], ['in-od', 29],
        ['in-kl', 30], ['in-ka', 31], ['in-ap', 32], ['in-an', 33],
        ['in-as', 34], ['in-tr', 35], ['in-ar', 36], ['in-ld', 37],
        ['in-ml', 38], ['in-mn', 39], ['in-nl', 40], ['in-mz', 41],
        ['in-ts', 42], ['in-la', 43], ['in-uk', 44], ['in-ga', 45]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/in/in-all.topo.json">India</a>'
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
