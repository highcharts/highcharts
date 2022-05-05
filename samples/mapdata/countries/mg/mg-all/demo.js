(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mg/mg-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mg-987', 10], ['mg-993', 11], ['mg-7296', 12], ['mg-7287', 13],
        ['mg-997', 14], ['mg-7285', 15], ['mg-7289', 16], ['mg-7283', 17],
        ['mg-7290', 18], ['mg-7292', 19], ['mg-7297', 20], ['mg-7294', 21],
        ['mg-7286', 22], ['mg-995', 23], ['mg-994', 24], ['mg-996', 25],
        ['mg-7293', 26], ['mg-7284', 27], ['mg-7298', 28], ['mg-7295', 29],
        ['mg-7288', 30], ['mg-7291', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mg/mg-all.topo.json">Madagascar</a>'
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
