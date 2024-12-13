(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-all-mainland.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ma', 10], ['us-wa', 11], ['us-ca', 12], ['us-or', 13],
        ['us-wi', 14], ['us-me', 15], ['us-mi', 16], ['us-nv', 17],
        ['us-nm', 18], ['us-co', 19], ['us-wy', 20], ['us-ks', 21],
        ['us-ne', 22], ['us-ok', 23], ['us-mo', 24], ['us-il', 25],
        ['us-in', 26], ['us-vt', 27], ['us-ar', 28], ['us-tx', 29],
        ['us-ri', 30], ['us-al', 31], ['us-ms', 32], ['us-nc', 33],
        ['us-va', 34], ['us-ia', 35], ['us-md', 36], ['us-de', 37],
        ['us-pa', 38], ['us-nj', 39], ['us-ny', 40], ['us-id', 41],
        ['us-sd', 42], ['us-ct', 43], ['us-nh', 44], ['us-ky', 45],
        ['us-oh', 46], ['us-tn', 47], ['us-wv', 48], ['us-dc', 49],
        ['us-la', 50], ['us-fl', 51], ['us-ga', 52], ['us-sc', 53],
        ['us-mn', 54], ['us-mt', 55], ['us-nd', 56], ['us-az', 57],
        ['us-ut', 58]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-all-mainland.topo.json">United States of America, mainland</a>'
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
