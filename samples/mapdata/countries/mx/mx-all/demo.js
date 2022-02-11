(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mx/mx-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mx-3622', 10], ['mx-bc', 11], ['mx-bs', 12], ['mx-so', 13],
        ['mx-cl', 14], ['mx-na', 15], ['mx-cm', 16], ['mx-qr', 17],
        ['mx-mx', 18], ['mx-mo', 19], ['mx-df', 20], ['mx-qt', 21],
        ['mx-tb', 22], ['mx-cs', 23], ['mx-nl', 24], ['mx-si', 25],
        ['mx-ch', 26], ['mx-ve', 27], ['mx-za', 28], ['mx-ag', 29],
        ['mx-ja', 30], ['mx-mi', 31], ['mx-oa', 32], ['mx-pu', 33],
        ['mx-gr', 34], ['mx-tl', 35], ['mx-tm', 36], ['mx-co', 37],
        ['mx-yu', 38], ['mx-dg', 39], ['mx-gj', 40], ['mx-sl', 41],
        ['mx-hg', 42]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mx/mx-all.topo.json">Mexico</a>'
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
