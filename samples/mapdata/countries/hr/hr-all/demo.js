(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/hr/hr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['hr-5926', 10], ['hr-sb', 11], ['hr-zd', 12], ['hr-pg', 13],
        ['hr-ka', 14], ['hr-kz', 15], ['hr-zg', 16], ['hr-gz', 17],
        ['hr-va', 18], ['hr-is', 19], ['hr-2228', 20], ['hr-ob', 21],
        ['hr-sp', 22], ['hr-vs', 23], ['hr-vp', 24], ['hr-kk', 25],
        ['hr-me', 26], ['hr-dn', 27], ['hr-sd', 28], ['hr-ls', 29],
        ['hr-sm', 30], ['hr-bb', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/hr/hr-all.topo.json">Croatia</a>'
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
