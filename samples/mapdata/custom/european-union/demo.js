(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/european-union.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['dk', 10], ['de', 11], ['fr', 12], ['ie', 13], ['hr', 14], ['gb', 15],
        ['ee', 16], ['cy', 17], ['fi', 18], ['gr', 19], ['se', 20], ['nl', 21],
        ['es', 22], ['lt', 23], ['it', 24], ['mt', 25], ['nc', 26], ['pl', 27],
        ['sk', 28], ['hu', 29], ['lu', 30], ['si', 31], ['be', 32], ['cnm', 33],
        ['bg', 34], ['ro', 35], ['lv', 36], ['at', 37], ['cz', 38], ['pt', 39]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/european-union.topo.json">European Union</a>'
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
