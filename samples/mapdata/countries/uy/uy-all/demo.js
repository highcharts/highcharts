(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/uy/uy-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['uy-sa', 10], ['uy-so', 11], ['uy-cl', 12], ['uy-du', 13],
        ['uy-rv', 14], ['uy-ta', 15], ['uy-tt', 16], ['uy-ca', 17],
        ['uy-fd', 18], ['uy-la', 19], ['uy-ma', 20], ['uy-mo', 21],
        ['uy-ro', 22], ['uy-co', 23], ['uy-sj', 24], ['uy-ar', 25],
        ['uy-fs', 26], ['uy-pa', 27], ['uy-rn', 28]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/uy/uy-all.topo.json">Uruguay</a>'
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
