(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/be/be-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['be-3530', 10], ['be-3534', 11], ['be-3528', 12], ['be-3529', 13],
        ['be-3532', 14], ['be-489', 15], ['be-3535', 16], ['be-490', 17],
        ['be-3526', 18], ['be-3527', 19], ['be-3533', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/be/be-all.topo.json">Belgium</a>'
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
