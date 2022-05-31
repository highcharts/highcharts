(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/in-2013/custom/in-all-disputed-2013.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['in-an', 10], ['in-wb', 11], ['in-ld', 12], ['in-5390', 13],
        ['in-py', 14], ['in-3464', 15], ['in-mz', 16], ['in-as', 17],
        ['in-pb', 18], ['in-ga', 19], ['in-2984', 20], ['in-jk', 21],
        ['in-hr', 22], ['in-nl', 23], ['in-mn', 24], ['in-tr', 25],
        ['in-mp', 26], ['in-ct', 27], ['in-ar', 28], ['in-ml', 29],
        ['in-kl', 30], ['in-tn', 31], ['in-ap', 32], ['in-ka', 33],
        ['in-mh', 34], ['in-or', 35], ['in-dn', 36], ['in-dl', 37],
        ['in-hp', 38], ['in-rj', 39], ['in-up', 40], ['in-ut', 41],
        ['in-jh', 42], ['in-ch', 43], ['in-br', 44], ['in-sk', 45]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/in-2013/custom/in-all-disputed-2013.topo.json">India with disputed territories (2013)</a>'
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
