(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ht/ht-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ht-ou', 10], ['ht-gr', 11], ['ht-no', 12], ['ht-sd', 13],
        ['ht-ni', 14], ['ht-ar', 15], ['ht-ce', 16], ['ht-ne', 17],
        ['ht-nd', 18], ['ht-se', 19]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ht/ht-all.topo.json">Haiti</a>'
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
