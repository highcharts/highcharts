(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tz/tz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tz-09', 10], ['tz-13', 11], ['tz-26', 12], ['tz-01', 13],
        ['tz-05', 14], ['tz-14', 15], ['tz-23', 16], ['tz-17', 17],
        ['tz-04', 18], ['tz-12', 19], ['tz-24', 20], ['tz-19', 21],
        ['tz-21', 22], ['tz-16', 23], ['tz-20', 24], ['tz-08', 25],
        ['tz-25', 26], ['tz-03', 27], ['tz-11', 28], ['tz-06', 29],
        ['tz-07', 30], ['tz-15', 31], ['tz-10', 32], ['tz-28', 33],
        ['tz-29', 34], ['tz-27', 35], ['tz-30', 36], ['tz-18', 37],
        ['tz-22', 38], ['tz-02', 39], ['tz-31', 40]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/tz/tz-all.topo.json">Tanzania</a>'
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
