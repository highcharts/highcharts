(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cl/cl-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cl-2730', 10], ['cl-bi', 11], ['cl-ll', 12], ['cl-li', 13],
        ['cl-ai', 14], ['cl-ma', 15], ['cl-co', 16], ['cl-at', 17],
        ['cl-vs', 18], ['cl-rm', 19], ['cl-ar', 20], ['cl-ml', 21],
        ['cl-ta', 22], ['cl-2740', 23], ['cl-an', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cl/cl-all.topo.json">Chile</a>'
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
