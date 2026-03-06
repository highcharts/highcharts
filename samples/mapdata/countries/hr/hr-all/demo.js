(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/hr/hr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['hr-sb', 10], ['hr-zd', 11], ['hr-pg', 12], ['hr-ka', 13],
        ['hr-kz', 14], ['hr-zg', 15], ['hr-gz', 16], ['hr-va', 17],
        ['hr-is', 18], ['hr-2228', 19], ['hr-ob', 20], ['hr-sp', 21],
        ['hr-vs', 22], ['hr-vp', 23], ['hr-kk', 24], ['hr-me', 25],
        ['hr-dn', 26], ['hr-sd', 27], ['hr-ls', 28], ['hr-sm', 29],
        ['hr-bb', 30]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/hr/hr-all.topo.json">Croatia</a>'
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
