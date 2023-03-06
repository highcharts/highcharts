(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-ca-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ca-26', 10], ['us-ca-24', 11], ['us-ca-47', 12], ['us-ca-14', 13],
        ['us-ca-51', 14], ['us-ca-28', 15], ['us-ca-33', 16], ['us-ca-36', 17],
        ['us-ca-31', 18], ['us-ca-45', 19], ['us-ca-48', 20], ['us-ca-46', 21],
        ['us-ca-34', 22], ['us-ca-40', 23], ['us-ca-30', 24], ['us-ca-12', 25],
        ['us-ca-18', 26], ['us-ca-13', 27], ['us-ca-20', 28], ['us-ca-16', 29],
        ['us-ca-37', 30], ['us-ca-43', 31], ['us-ca-32', 32], ['us-ca-35', 33],
        ['us-ca-42', 34], ['us-ca-44', 35], ['us-ca-09', 36], ['us-ca-15', 37],
        ['us-ca-10', 38], ['us-ca-41', 39], ['us-ca-08', 40], ['us-ca-27', 41],
        ['us-ca-17', 42], ['us-ca-53', 43], ['us-ca-52', 44], ['us-ca-49', 45],
        ['us-ca-25', 46], ['us-ca-07', 47], ['us-ca-06', 48], ['us-ca-04', 49],
        ['us-ca-39', 50], ['us-ca-38', 51], ['us-ca-05', 52], ['us-ca-02', 53],
        ['us-ca-11', 54], ['us-ca-03', 55], ['us-ca-23', 56], ['us-ca-50', 57],
        ['us-ca-01', 58], ['us-ca-21', 59], ['us-ca-22', 60], ['us-ca-19', 61],
        ['us-ca-29', 62]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ca-congress-113.topo.json">California congressional districts</a>'
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
