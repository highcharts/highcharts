(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/am/am-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['am-gr', 10], ['am-av', 11], ['am-sh', 12], ['am-ar', 13],
        ['am-tv', 14], ['am-kt', 15], ['am-lo', 16], ['am-er', 17],
        ['am-su', 18], ['am-vd', 19], ['am-ag', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/am/am-all.topo.json">Armenia</a>'
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
