(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bw/bw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bw-6964', 10], ['bw-6963', 11], ['bw-6967', 12], ['bw-6966', 13],
        ['bw-kg', 14], ['bw-se', 15], ['bw-ne', 16], ['bw-6962', 17],
        ['bw-gh', 18], ['bw-nw', 19], ['bw-ce', 20], ['bw-kl', 21],
        ['bw-kw', 22], ['bw-6965', 23], ['bw-so', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bw/bw-all.topo.json">Botswana</a>'
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
