(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ba/ba-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ba-3177', 10], ['ba-6333', 11], ['ba-3178', 12], ['ba-6334', 13],
        ['ba-3179', 14], ['ba-6335', 15], ['ba-3180', 16], ['ba-6336', 17],
        ['ba-6337', 18], ['ba-6331', 19], ['ba-2216', 20], ['ba-2217', 21],
        ['ba-2218', 22], ['ba-2220', 23], ['ba-2219', 24], ['ba-3181', 25],
        ['ba-sr', 26], ['ba-6332', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ba/ba-all.topo.json">Bosnia and Herzegovina</a>'
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
