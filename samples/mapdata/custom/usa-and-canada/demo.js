(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/usa-and-canada.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ca', 10], ['us-or', 11], ['us-nd', 12], ['ca-sk', 13],
        ['us-mt', 14], ['us-az', 15], ['us-nv', 16], ['us-al', 17],
        ['us-nm', 18], ['us-co', 19], ['us-wy', 20], ['us-wi', 21],
        ['us-ks', 22], ['us-ne', 23], ['us-ok', 24], ['us-mi', 25],
        ['us-ak', 26], ['us-oh', 27], ['ca-bc', 28], ['ca-nu', 29],
        ['ca-nt', 30], ['ca-ab', 31], ['us-ma', 32], ['us-vt', 33],
        ['us-mn', 34], ['us-wa', 35], ['us-id', 36], ['us-ar', 37],
        ['us-tx', 38], ['us-ri', 39], ['us-fl', 40], ['us-ms', 41],
        ['us-ut', 42], ['us-nc', 43], ['us-ga', 44], ['us-va', 45],
        ['us-tn', 46], ['us-ia', 47], ['us-md', 48], ['us-de', 49],
        ['us-mo', 50], ['us-pa', 51], ['us-nj', 52], ['us-ny', 53],
        ['us-la', 54], ['us-nh', 55], ['us-me', 56], ['us-sd', 57],
        ['us-ct', 58], ['us-il', 59], ['us-in', 60], ['us-ky', 61],
        ['us-wv', 62], ['us-dc', 63], ['ca-on', 64], ['ca-qc', 65],
        ['ca-nb', 66], ['ca-ns', 67], ['ca-nl', 68], ['ca-mb', 69],
        ['us-sc', 70], ['ca-yt', 71], ['ca-pe', 72], [null, 73]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/usa-and-canada.topo.json">Canada and United States of America</a>'
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
