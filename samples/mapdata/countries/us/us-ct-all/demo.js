(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ct-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ct-09170', 10], ['us-ct-09120', 11], ['us-ct-09190', 12],
        ['us-ct-09160', 13], ['us-ct-09140', 14], ['us-ct-09130', 15],
        ['us-ct-09180', 16], ['us-ct-09150', 17], ['us-ct-09110', 18]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ct-all.topo.json">Connecticut</a>'
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
