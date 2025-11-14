(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sa/sa-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sa-tb', 10], ['sa-jz', 11], ['sa-nj', 12], ['sa-ri', 13],
        ['sa-md', 14], ['sa-ha', 15], ['sa-qs', 16], ['sa-hs', 17],
        ['sa-jf', 18], ['sa-sh', 19], ['sa-ba', 20], ['sa-as', 21],
        ['sa-mk', 22]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sa/sa-all.topo.json">Saudi Arabia</a>'
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
