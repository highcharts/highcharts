(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gw/gw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gw-bm', 10], ['gw-bl', 11], ['gw-ga', 12], ['gw-to', 13],
        ['gw-bs', 14], ['gw-ca', 15], ['gw-oi', 16], ['gw-qu', 17],
        ['gw-ba', 18]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gw/gw-all.topo.json">Guinea Bissau</a>'
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
