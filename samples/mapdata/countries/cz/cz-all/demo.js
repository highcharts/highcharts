(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cz/cz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cz-2293', 10], ['cz-6305', 11], ['cz-6306', 12], ['cz-6307', 13],
        ['cz-6308', 14], ['cz-kk', 15], ['cz-ck', 16], ['cz-jk', 17],
        ['cz-sk', 18], ['cz-lk', 19], ['cz-hk', 20], ['cz-vk', 21],
        ['cz-6303', 22], ['cz-6304', 23]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cz/cz-all.topo.json">Czech Republic</a>'
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
