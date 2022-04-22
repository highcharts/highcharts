(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-ny-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ny-11', 10], ['us-ny-21', 11], ['us-ny-01', 12], ['us-ny-07', 13],
        ['us-ny-05', 14], ['us-ny-24', 15], ['us-ny-16', 16], ['us-ny-17', 17],
        ['us-ny-15', 18], ['us-ny-23', 19], ['us-ny-08', 20], ['us-ny-12', 21],
        ['us-ny-18', 22], ['us-ny-02', 23], ['us-ny-10', 24], ['us-ny-25', 25],
        ['us-ny-04', 26], ['us-ny-13', 27], ['us-ny-09', 28], ['us-ny-19', 29],
        ['us-ny-20', 30], ['us-ny-22', 31], ['us-ny-03', 32], ['us-ny-26', 33],
        ['us-ny-27', 34], ['us-ny-14', 35], ['us-ny-06', 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ny-congress-113.topo.json">New York congressional districts</a>'
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
