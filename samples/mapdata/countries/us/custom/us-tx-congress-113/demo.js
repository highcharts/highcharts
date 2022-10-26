(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-tx-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-tx-34', 10], ['us-tx-14', 11], ['us-tx-27', 12], ['us-tx-20', 13],
        ['us-tx-21', 14], ['us-tx-32', 15], ['us-tx-03', 16], ['us-tx-31', 17],
        ['us-tx-10', 18], ['us-tx-04', 19], ['us-tx-36', 20], ['us-tx-25', 21],
        ['us-tx-35', 22], ['us-tx-28', 23], ['us-tx-23', 24], ['us-tx-11', 25],
        ['us-tx-13', 26], ['us-tx-26', 27], ['us-tx-07', 28], ['us-tx-05', 29],
        ['us-tx-22', 30], ['us-tx-09', 31], ['us-tx-18', 32], ['us-tx-19', 33],
        ['us-tx-06', 34], ['us-tx-17', 35], ['us-tx-16', 36], ['us-tx-01', 37],
        ['us-tx-33', 38], ['us-tx-15', 39], ['us-tx-12', 40], ['us-tx-24', 41],
        ['us-tx-30', 42], ['us-tx-08', 43], ['us-tx-02', 44], ['us-tx-29', 45]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-tx-congress-113.topo.json">Texas congressional districts</a>'
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
