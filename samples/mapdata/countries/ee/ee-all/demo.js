(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ee/ee-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ee-6019', 10], ['ee-ha', 11], ['ee-ta', 12], ['ee-hi', 13],
        ['ee-ln', 14], ['ee-pr', 15], ['ee-sa', 16], ['ee-iv', 17],
        ['ee-jr', 18], ['ee-jn', 19], ['ee-lv', 20], ['ee-pl', 21],
        ['ee-ra', 22], ['ee-vg', 23], ['ee-vd', 24], ['ee-vr', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ee/ee-all.topo.json">Estonia</a>'
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
