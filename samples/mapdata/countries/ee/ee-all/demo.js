(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ee/ee-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ee-74', 10], ['ee-68', 11], ['ee-39', 12], ['ee-56', 13],
        ['ee-45', 14], ['ee-37', 15], ['ee-60', 16], ['ee-79', 17],
        ['ee-81', 18], ['ee-84', 19], ['ee-64', 20], ['ee-52', 21],
        ['ee-71', 22], ['ee-87', 23], ['ee-50', 24]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ee/ee-all.topo.json">Estonia</a>'
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
