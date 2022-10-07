(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/nato.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['dk', 10], ['de', 11], ['gl', 12], ['fr', 13], ['no', 14], ['us', 15],
        ['ca', 16], ['hr', 17], ['gb', 18], ['ee', 19], ['gr', 20], ['nl', 21],
        ['es', 22], ['lt', 23], ['it', 24], ['tr', 25], ['pl', 26], ['sk', 27],
        ['bg', 28], ['lv', 29], ['hu', 30], ['lu', 31], ['si', 32], ['be', 33],
        ['al', 34], ['ro', 35], ['pt', 36], ['is', 37], ['cz', 38]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/nato.topo.json">North Atlantic Treaty Organization</a>'
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
