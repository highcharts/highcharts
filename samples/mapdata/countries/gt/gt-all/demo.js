(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gt/gt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gt-qc', 10], ['gt-pe', 11], ['gt-hu', 12], ['gt-qz', 13],
        ['gt-re', 14], ['gt-sm', 15], ['gt-bv', 16], ['gt-av', 17],
        ['gt-es', 18], ['gt-cm', 19], ['gt-gu', 20], ['gt-su', 21],
        ['gt-sa', 22], ['gt-so', 23], ['gt-to', 24], ['gt-pr', 25],
        ['gt-sr', 26], ['gt-iz', 27], ['gt-cq', 28], ['gt-ja', 29],
        ['gt-ju', 30], ['gt-za', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gt/gt-all.topo.json">Guatemala</a>'
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
