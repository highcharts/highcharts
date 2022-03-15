(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nr/nr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nr-6494', 10], ['nr-6495', 11], ['nr-6496', 12], ['nr-6497', 13],
        ['nr-6498', 14], ['nr-6499', 15], ['nr-6487', 16], ['nr-3591', 17],
        ['nr-6488', 18], ['nr-6489', 19], ['nr-6490', 20], ['nr-6491', 21],
        ['nr-6492', 22], ['nr-6493', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nr/nr-all.topo.json">Nauru</a>'
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
