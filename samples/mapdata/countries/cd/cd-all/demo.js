(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cd/cd-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cd-bc', 10], ['cd-kv', 11], ['cd-eq', 12], ['cd-hc', 13],
        ['cd-bn', 14], ['cd-kn', 15], ['cd-kr', 16], ['cd-kt', 17],
        ['cd-kc', 18], ['cd-1694', 19], ['cd-1697', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cd/cd-all.topo.json">Democratic Republic of the Congo</a>'
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
