(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fi/fi-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fi-3280', 10], ['fi-3272', 11], ['fi-3275', 12], ['fi-3281', 13],
        ['fi-3279', 14], ['fi-3276', 15], ['fi-3287', 16], ['fi-3286', 17],
        ['fi-3290', 18], ['fi-3291', 19], ['fi-3292', 20], ['fi-3293', 21],
        ['fi-3294', 22], ['fi-3295', 23], ['fi-3296', 24], ['fi-3288', 25],
        ['fi-3285', 26], ['fi-3289', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fi/fi-all.topo.json">Finland</a>'
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
