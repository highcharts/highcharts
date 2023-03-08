(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/td/td-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['td-ma', 10], ['td-sa', 11], ['td-nj', 12], ['td-lo', 13],
        ['td-mw', 14], ['td-br', 15], ['td-ti', 16], ['td-en', 17],
        ['td-cg', 18], ['td-bg', 19], ['td-si', 20], ['td-mo', 21],
        ['td-hd', 22], ['td-km', 23], ['td-lc', 24], ['td-bi', 25],
        ['td-ba', 26], ['td-gr', 27], ['td-oa', 28], ['td-lr', 29],
        ['td-me', 30], ['td-ta', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/td/td-all.topo.json">Chad</a>'
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
