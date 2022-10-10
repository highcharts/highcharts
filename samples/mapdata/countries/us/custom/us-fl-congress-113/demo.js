(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-fl-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-fl-16', 10], ['us-fl-26', 11], ['us-fl-02', 12], ['us-fl-25', 13],
        ['us-fl-19', 14], ['us-fl-27', 15], ['us-fl-14', 16], ['us-fl-13', 17],
        ['us-fl-24', 18], ['us-fl-11', 19], ['us-fl-15', 20], ['us-fl-12', 21],
        ['us-fl-20', 22], ['us-fl-18', 23], ['us-fl-22', 24], ['us-fl-06', 25],
        ['us-fl-08', 26], ['us-fl-17', 27], ['us-fl-09', 28], ['us-fl-10', 29],
        ['us-fl-07', 30], ['us-fl-23', 31], ['us-fl-03', 32], ['us-fl-05', 33],
        ['us-fl-04', 34], ['us-fl-01', 35], ['us-fl-21', 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-fl-congress-113.topo.json">Florida congressional districts</a>'
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
