(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/np/np-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['np-750', 10], ['np-751', 11], ['np-752', 12], ['np-753', 13],
        ['np-754', 14], ['np-755', 15], ['np-756', 16], ['np-757', 17],
        ['np-354', 18], ['np-1278', 19], ['np-746', 20], ['np-747', 21],
        ['np-748', 22], ['np-749', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/np/np-all.topo.json">Nepal</a>'
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
