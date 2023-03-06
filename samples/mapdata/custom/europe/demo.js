(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['dk', 10], ['fo', 11], ['hr', 12], ['nl', 13], ['ee', 14], ['bg', 15],
        ['es', 16], ['it', 17], ['sm', 18], ['va', 19], ['tr', 20], ['mt', 21],
        ['fr', 22], ['no', 23], ['de', 24], ['ie', 25], ['ua', 26], ['fi', 27],
        ['se', 28], ['ru', 29], ['gb', 30], ['cy', 31], ['pt', 32], ['gr', 33],
        ['lt', 34], ['si', 35], ['ba', 36], ['mc', 37], ['al', 38], ['cnm', 39],
        ['nc', 40], ['rs', 41], ['ro', 42], ['me', 43], ['li', 44], ['at', 45],
        ['sk', 46], ['hu', 47], ['ad', 48], ['lu', 49], ['ch', 50], ['be', 51],
        ['kv', 52], ['pl', 53], ['mk', 54], ['lv', 55], ['by', 56], ['is', 57],
        ['md', 58], ['cz', 59]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/europe.topo.json">Europe</a>'
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
