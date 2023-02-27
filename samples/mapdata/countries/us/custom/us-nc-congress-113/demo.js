(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-nc-congress-113.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nc-03', 10], ['us-nc-07', 11], ['us-nc-08', 12], ['us-nc-09', 13],
        ['us-nc-01', 14], ['us-nc-13', 15], ['us-nc-06', 16], ['us-nc-10', 17],
        ['us-nc-05', 18], ['us-nc-11', 19], ['us-nc-02', 20], ['us-nc-12', 21],
        ['us-nc-04', 22]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-nc-congress-113.topo.json">North Carolina congressional districts</a>'
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
