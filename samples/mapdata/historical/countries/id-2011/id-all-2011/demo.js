(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/id-2011/id-all-2011.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['id-3700', 10], ['id-ac', 11], ['id-ki', 12], ['id-jt', 13],
        ['id-be', 14], ['id-bt', 15], ['id-kb', 16], ['id-bb', 17],
        ['id-ba', 18], ['id-ji', 19], ['id-ks', 20], ['id-nt', 21],
        ['id-se', 22], ['id-kr', 23], ['id-ib', 24], ['id-su', 25],
        ['id-ri', 26], ['id-sw', 27], ['id-la', 28], ['id-sb', 29],
        ['id-ma', 30], ['id-nb', 31], ['id-sg', 32], ['id-st', 33],
        ['id-pa', 34], ['id-jr', 35], ['id-1024', 36], ['id-jk', 37],
        ['id-go', 38], ['id-yo', 39], ['id-kt', 40], ['id-sl', 41],
        ['id-sr', 42], ['id-ja', 43]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/id-2011/id-all-2011.topo.json">Indonesia (2011)</a>'
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
