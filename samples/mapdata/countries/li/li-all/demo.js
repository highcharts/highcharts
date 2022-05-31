(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/li/li-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['li-6425', 10], ['li-6426', 11], ['li-6427', 12], ['li-6418', 13],
        ['li-3644', 14], ['li-6419', 15], ['li-6420', 16], ['li-6421', 17],
        ['li-6422', 18], ['li-6423', 19], ['li-6424', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/li/li-all.topo.json">Liechtenstein</a>'
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
