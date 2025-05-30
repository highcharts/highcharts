(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kz/kz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kz-23', 10], ['kz-27', 11], ['kz-15', 12], ['kz-47', 13],
        ['kz-63', 14], ['kz-19', 15], ['kz-31', 16], ['kz-43', 17],
        ['kz-61', 18], ['kz-11', 19], ['kz-59', 20], ['kz-55', 21],
        ['kz-35', 22], ['kz-39', 23], ['kz-75', 24], ['kz-71', 25],
        ['kz-79', 26], ['kz-10', 27], ['kz-33', 28], ['kz-62', 29]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kz/kz-all.topo.json">Kazakhstan</a>'
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
