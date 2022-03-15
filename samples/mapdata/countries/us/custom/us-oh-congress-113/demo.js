(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-oh-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-oh-13', 10], ['us-oh-09', 11], ['us-oh-04', 12], ['us-oh-01', 13],
        ['us-oh-11', 14], ['us-oh-05', 15], ['us-oh-16', 16], ['us-oh-14', 17],
        ['us-oh-08', 18], ['us-oh-12', 19], ['us-oh-03', 20], ['us-oh-02', 21],
        ['us-oh-06', 22], ['us-oh-15', 23], ['us-oh-10', 24], ['us-oh-07', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-oh-congress-113.topo.json">Ohio congressional districts</a>'
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
