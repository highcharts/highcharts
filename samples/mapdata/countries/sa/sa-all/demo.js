(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sa/sa-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sa-4293', 10], ['sa-tb', 11], ['sa-jz', 12], ['sa-nj', 13],
        ['sa-ri', 14], ['sa-md', 15], ['sa-ha', 16], ['sa-qs', 17],
        ['sa-hs', 18], ['sa-jf', 19], ['sa-sh', 20], ['sa-ba', 21],
        ['sa-as', 22], ['sa-mk', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sa/sa-all.topo.json">Saudi Arabia</a>'
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
