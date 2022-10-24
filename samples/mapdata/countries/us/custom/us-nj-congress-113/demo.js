(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-nj-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nj-02', 10], ['us-nj-07', 11], ['us-nj-01', 12], ['us-nj-09', 13],
        ['us-nj-06', 14], ['us-nj-10', 15], ['us-nj-12', 16], ['us-nj-03', 17],
        ['us-nj-11', 18], ['us-nj-04', 19], ['us-nj-05', 20], ['us-nj-08', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-nj-congress-113.topo.json">New Jersey congressional districts</a>'
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
