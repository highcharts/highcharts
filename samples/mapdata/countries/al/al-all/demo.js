(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/al/al-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['al-vr', 10], ['al-ke', 11], ['al-du', 12], ['al-fi', 13],
        ['al-sd', 14], ['al-kk', 15], ['al-be', 16], ['al-eb', 17],
        ['al-gk', 18], ['al-db', 19], ['al-lz', 20], ['al-ti', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/al/al-all.topo.json">Albania</a>'
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
