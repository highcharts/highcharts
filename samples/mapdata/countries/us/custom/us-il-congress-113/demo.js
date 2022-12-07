(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-il-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-il-12', 10], ['us-il-01', 11], ['us-il-11', 12], ['us-il-04', 13],
        ['us-il-07', 14], ['us-il-05', 15], ['us-il-08', 16], ['us-il-09', 17],
        ['us-il-02', 18], ['us-il-18', 19], ['us-il-15', 20], ['us-il-16', 21],
        ['us-il-14', 22], ['us-il-13', 23], ['us-il-17', 24], ['us-il-06', 25],
        ['us-il-03', 26], ['us-il-10', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-il-congress-113.topo.json">Illinois congressional districts</a>'
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
