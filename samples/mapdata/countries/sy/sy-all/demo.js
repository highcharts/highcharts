(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sy/sy-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sy-di', 10], ['sy-hl', 11], ['sy-hm', 12], ['sy-hi', 13],
        ['sy-id', 14], ['sy-ha', 15], ['sy-dy', 16], ['sy-su', 17],
        ['sy-rd', 18], ['sy-qu', 19], ['sy-dr', 20], ['sy-3686', 21],
        ['sy-la', 22], ['sy-ta', 23], ['sy-ra', 24]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sy/sy-all.topo.json">Syria</a>'
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
