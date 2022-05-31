(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ws/ws-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ws-3586', 10], ['ws-6500', 11], ['ws-6501', 12], ['ws-6502', 13],
        ['ws-6503', 14], ['ws-6504', 15], ['ws-6505', 16], ['ws-6506', 17],
        ['ws-6507', 18], ['ws-6508', 19], ['ws-6509', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ws/ws-all.topo.json">Samoa</a>'
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
