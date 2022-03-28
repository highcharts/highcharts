(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/my/my-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['my-sa', 10], ['my-sk', 11], ['my-la', 12], ['my-pg', 13],
        ['my-kh', 14], ['my-sl', 15], ['my-ph', 16], ['my-kl', 17],
        ['my-pj', 18], ['my-pl', 19], ['my-jh', 20], ['my-pk', 21],
        ['my-kn', 22], ['my-me', 23], ['my-ns', 24], ['my-te', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/my/my-all.topo.json">Malaysia</a>'
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
