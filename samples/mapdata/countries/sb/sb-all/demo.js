(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sb/sb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sb-4191', 10], ['sb-ml', 11], ['sb-rb', 12], ['sb-1014', 13],
        ['sb-is', 14], ['sb-te', 15], ['sb-3343', 16], ['sb-ch', 17],
        ['sb-mk', 18], ['sb-6633', 19], ['sb-gc', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sb/sb-all.topo.json">Solomon Islands</a>'
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
