(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/asia.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ir', 10], ['ph', 11], ['sa', 12], ['jp', 13], ['th', 14], ['om', 15],
        ['ye', 16], ['in', 17], ['kr', 18], ['bd', 19], ['sp', 20], ['cn', 21],
        ['bh', 22], ['mm', 23], ['id', 24], ['sg', 25], ['ru', 26], ['sh', 27],
        ['my', 28], ['az', 29], ['am', 30], ['vn', 31], ['tj', 32], ['uz', 33],
        ['tl', 34], ['kh', 35], ['bt', 36], ['ge', 37], ['kz', 38], ['il', 39],
        ['sy', 40], ['jo', 41], ['tm', 42], ['cnm', 43], ['mn', 44], ['kw', 45],
        ['iq', 46], ['ae', 47], ['la', 48], ['pk', 49], ['jk', 50], ['qa', 51],
        ['tr', 52], ['bn', 53], ['af', 54], ['kp', 55], ['lb', 56], ['nc', 57],
        ['cy', 58], ['tw', 59], ['np', 60], ['lk', 61], ['kg', 62]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/asia.topo.json">Asia</a>'
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
