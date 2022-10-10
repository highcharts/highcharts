(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ve/ve-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ve-3609', 10], ['ve-dp', 11], ['ve-ne', 12], ['ve-su', 13],
        ['ve-da', 14], ['ve-bo', 15], ['ve-ap', 16], ['ve-ba', 17],
        ['ve-me', 18], ['ve-ta', 19], ['ve-tr', 20], ['ve-zu', 21],
        ['ve-co', 22], ['ve-po', 23], ['ve-ca', 24], ['ve-la', 25],
        ['ve-ya', 26], ['ve-fa', 27], ['ve-am', 28], ['ve-an', 29],
        ['ve-ar', 30], ['ve-213', 31], ['ve-df', 32], ['ve-gu', 33],
        ['ve-mi', 34], ['ve-mo', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ve/ve-all.topo.json">Venezuela</a>'
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
