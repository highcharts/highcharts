(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/id/id-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['id-3700', 10], ['id-ac', 11], ['id-jt', 12], ['id-be', 13],
        ['id-bt', 14], ['id-kb', 15], ['id-bb', 16], ['id-ba', 17],
        ['id-ji', 18], ['id-ks', 19], ['id-nt', 20], ['id-se', 21],
        ['id-kr', 22], ['id-ib', 23], ['id-su', 24], ['id-ri', 25],
        ['id-sw', 26], ['id-ku', 27], ['id-la', 28], ['id-sb', 29],
        ['id-ma', 30], ['id-nb', 31], ['id-sg', 32], ['id-st', 33],
        ['id-pa', 34], ['id-jr', 35], ['id-ki', 36], ['id-1024', 37],
        ['id-jk', 38], ['id-go', 39], ['id-yo', 40], ['id-sl', 41],
        ['id-sr', 42], ['id-ja', 43], ['id-kt', 44]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/id/id-all.topo.json">Indonesia</a>'
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
