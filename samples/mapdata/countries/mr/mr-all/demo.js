(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mr/mr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mr-4965', 10], ['mr-dn', 11], ['mr-in', 12], ['mr-no', 13],
        ['mr-br', 14], ['mr-tr', 15], ['mr-as', 16], ['mr-gd', 17],
        ['mr-go', 18], ['mr-ad', 19], ['mr-hc', 20], ['mr-hg', 21],
        ['mr-tg', 22], ['mr-tz', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mr/mr-all.topo.json">Mauritania</a>'
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
