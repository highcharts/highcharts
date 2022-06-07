(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ec/ec-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ec-gu', 10], ['ec-es', 11], ['ec-cr', 12], ['ec-im', 13],
        ['ec-su', 14], ['ec-se', 15], ['ec-sd', 16], ['ec-az', 17],
        ['ec-eo', 18], ['ec-lj', 19], ['ec-zc', 20], ['ec-cn', 21],
        ['ec-bo', 22], ['ec-ct', 23], ['ec-lr', 24], ['ec-mn', 25],
        ['ec-cb', 26], ['ec-ms', 27], ['ec-pi', 28], ['ec-pa', 29],
        ['ec-1076', 30], ['ec-na', 31], ['ec-tu', 32], ['ec-ga', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ec/ec-all.topo.json">Ecuador</a>'
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
