(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/european-union.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['dk', 10], ['de', 11], ['fr', 12], ['ie', 13], ['hr', 14], ['ee', 15],
        ['cy', 16], ['fi', 17], ['gr', 18], ['se', 19], ['nl', 20], ['es', 21],
        ['lt', 22], ['it', 23], ['mt', 24], ['nc', 25], ['pl', 26], ['sk', 27],
        ['hu', 28], ['lu', 29], ['si', 30], ['be', 31], ['cnm', 32], ['bg', 33],
        ['ro', 34], ['lv', 35], ['at', 36], ['cz', 37], ['pt', 38]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/european-union.topo.json">European Union</a>'
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
