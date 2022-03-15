(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ar/ar-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ar-tf', 10], ['ar-ba', 11], ['ar-sj', 12], ['ar-mz', 13],
        ['ar-nq', 14], ['ar-lp', 15], ['ar-rn', 16], ['ar-sl', 17],
        ['ar-cb', 18], ['ar-ct', 19], ['ar-lr', 20], ['ar-sa', 21],
        ['ar-se', 22], ['ar-tm', 23], ['ar-cc', 24], ['ar-fm', 25],
        ['ar-cn', 26], ['ar-er', 27], ['ar-ch', 28], ['ar-sf', 29],
        ['ar-mn', 30], ['ar-df', 31], ['ar-sc', 32], ['ar-jy', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ar/ar-all.topo.json">Argentina</a>'
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
