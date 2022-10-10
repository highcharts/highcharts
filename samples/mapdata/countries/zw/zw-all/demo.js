(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/zw/zw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['zw-ma', 10], ['zw-ms', 11], ['zw-bu', 12], ['zw-mv', 13],
        ['zw-mw', 14], ['zw-mc', 15], ['zw-ha', 16], ['zw-mn', 17],
        ['zw-mi', 18], ['zw-me', 19]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/zw/zw-all.topo.json">Zimbabwe</a>'
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
