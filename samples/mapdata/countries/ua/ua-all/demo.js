(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ua/ua-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ua-my', 10], ['ua-ks', 11], ['ua-kc', 12], ['ua-zt', 13],
        ['ua-sm', 14], ['ua-dt', 15], ['ua-dp', 16], ['ua-kk', 17],
        ['ua-lh', 18], ['ua-pl', 19], ['ua-zp', 20], ['ua-sc', 21],
        ['ua-kr', 22], ['ua-ch', 23], ['ua-rv', 24], ['ua-cv', 25],
        ['ua-if', 26], ['ua-km', 27], ['ua-lv', 28], ['ua-tp', 29],
        ['ua-zk', 30], ['ua-vo', 31], ['ua-ck', 32], ['ua-kh', 33],
        ['ua-kv', 34], ['ua-mk', 35], ['ua-vi', 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ua/ua-all.topo.json">Ukraine</a>'
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
