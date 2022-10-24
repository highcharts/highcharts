(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/middle-east.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sa', 10], ['bh', 11], ['tr', 12], ['om', 13], ['ir', 14], ['ye', 15],
        ['kw', 16], ['eg', 17], ['il', 18], ['jo', 19], ['iq', 20], ['qa', 21],
        ['ae', 22], ['sy', 23], ['lb', 24], ['cy', 25], ['nc', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/middle-east.topo.json">Middle East</a>'
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
