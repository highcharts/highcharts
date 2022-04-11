(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cf/cf-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cf-vk', 10], ['cf-hk', 11], ['cf-hm', 12], ['cf-mb', 13],
        ['cf-bg', 14], ['cf-mp', 15], ['cf-lb', 16], ['cf-hs', 17],
        ['cf-op', 18], ['cf-se', 19], ['cf-nm', 20], ['cf-kg', 21],
        ['cf-kb', 22], ['cf-bk', 23], ['cf-uk', 24], ['cf-ac', 25],
        ['cf-bb', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cf/cf-all.topo.json">Central African Republic</a>'
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
