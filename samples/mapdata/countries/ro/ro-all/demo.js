(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ro/ro-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ro-bi', 10], ['ro-cs', 11], ['ro-tm', 12], ['ro-bt', 13],
        ['ro-bn', 14], ['ro-cj', 15], ['ro-ab', 16], ['ro-hd', 17],
        ['ro-mm', 18], ['ro-ms', 19], ['ro-sj', 20], ['ro-sm', 21],
        ['ro-ag', 22], ['ro-sb', 23], ['ro-vl', 24], ['ro-bv', 25],
        ['ro-cv', 26], ['ro-hr', 27], ['ro-is', 28], ['ro-nt', 29],
        ['ro-ph', 30], ['ro-sv', 31], ['ro-bc', 32], ['ro-br', 33],
        ['ro-bz', 34], ['ro-gl', 35], ['ro-vs', 36], ['ro-vn', 37],
        ['ro-if', 38], ['ro-tl', 39], ['ro-dj', 40], ['ro-gj', 41],
        ['ro-mh', 42], ['ro-ot', 43], ['ro-tr', 44], ['ro-cl', 45],
        ['ro-db', 46], ['ro-gr', 47], ['ro-il', 48], ['ro-ct', 49],
        ['ro-ar', 50], ['ro-bh', 51]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ro/ro-all.topo.json">Romania</a>'
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
