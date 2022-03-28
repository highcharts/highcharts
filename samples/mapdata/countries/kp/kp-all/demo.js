(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kp/kp-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kp-5044', 10], ['kp-wn', 11], ['kp-pb', 12], ['kp-nj', 13],
        ['kp-wb', 14], ['kp-py', 15], ['kp-hg', 16], ['kp-kw', 17],
        ['kp-ch', 18], ['kp-hn', 19], ['kp-pn', 20], ['kp-yg', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kp/kp-all.topo.json">North Korea</a>'
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
