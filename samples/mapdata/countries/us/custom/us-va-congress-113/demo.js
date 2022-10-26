(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-va-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-va-02', 10], ['us-va-11', 11], ['us-va-10', 12], ['us-va-08', 13],
        ['us-va-03', 14], ['us-va-04', 15], ['us-va-07', 16], ['us-va-01', 17],
        ['us-va-05', 18], ['us-va-06', 19], ['us-va-09', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-va-congress-113.topo.json">Virginia congressional districts</a>'
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
