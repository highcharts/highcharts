(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tn/tn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tn-4431', 10], ['tn-sf', 11], ['tn-me', 12], ['tn-to', 13],
        ['tn-mn', 14], ['tn-bj', 15], ['tn-ba', 16], ['tn-bz', 17],
        ['tn-je', 18], ['tn-nb', 19], ['tn-tu', 20], ['tn-kf', 21],
        ['tn-ks', 22], ['tn-gb', 23], ['tn-gf', 24], ['tn-sz', 25],
        ['tn-sl', 26], ['tn-mh', 27], ['tn-ms', 28], ['tn-kr', 29],
        ['tn-ss', 30], ['tn-za', 31], ['tn-kb', 32], ['tn-ta', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tn/tn-all.topo.json">Tunisia</a>'
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
