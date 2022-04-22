(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sc/sc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sc-6700', 10], ['sc-6707', 11], ['sc-6708', 12], ['sc-6711', 13],
        ['sc-6714', 14], ['sc-6702', 15], ['sc-6703', 16], ['sc-6704', 17],
        ['sc-6705', 18], ['sc-6706', 19], ['sc-6709', 20], ['sc-6710', 21],
        ['sc-6712', 22], ['sc-6713', 23], ['sc-6715', 24], ['sc-6716', 25],
        ['sc-6717', 26], ['sc-6718', 27], ['sc-6694', 28], ['sc-6695', 29],
        ['sc-6696', 30], ['sc-6697', 31], ['sc-6698', 32], ['sc-6699', 33],
        ['sc-6701', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sc/sc-all.topo.json">Seychelles</a>'
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
