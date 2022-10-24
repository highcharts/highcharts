(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/lc/lc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['lc-6591', 10], ['lc-6585', 11], ['lc-6586', 12], ['lc-3607', 13],
        ['lc-6590', 14], ['lc-6588', 15], ['lc-6587', 16], ['lc-6592', 17],
        ['lc-6589', 18], ['lc-6593', 19], ['lc-6594', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lc/lc-all.topo.json">Saint Lucia</a>'
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
