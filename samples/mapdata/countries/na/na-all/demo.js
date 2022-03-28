(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/na/na-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['na-os', 10], ['na-on', 11], ['na-ow', 12], ['na-ot', 13],
        ['na-oh', 14], ['na-ok', 15], ['na-ca', 16], ['na-ka', 17],
        ['na-ha', 18], ['na-kh', 19], ['na-ku', 20], ['na-er', 21],
        ['na-od', 22]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/na/na-all.topo.json">Namibia</a>'
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
