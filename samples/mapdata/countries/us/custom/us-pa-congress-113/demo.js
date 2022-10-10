(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-pa-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-pa-18', 10], ['us-pa-01', 11], ['us-pa-13', 12], ['us-pa-08', 13],
        ['us-pa-07', 14], ['us-pa-02', 15], ['us-pa-03', 16], ['us-pa-05', 17],
        ['us-pa-10', 18], ['us-pa-04', 19], ['us-pa-17', 20], ['us-pa-06', 21],
        ['us-pa-14', 22], ['us-pa-16', 23], ['us-pa-11', 24], ['us-pa-09', 25],
        ['us-pa-15', 26], ['us-pa-12', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-pa-congress-113.topo.json">Pennsylvania congressional districts</a>'
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
