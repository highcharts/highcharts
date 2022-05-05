(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kh/kh-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kh-kk', 10], ['kh-pp', 11], ['kh-ka', 12], ['kh-om', 13],
        ['kh-ba', 14], ['kh-po', 15], ['kh-si', 16], ['kh-oc', 17],
        ['kh-pl', 18], ['kh-km', 19], ['kh-kg', 20], ['kh-kn', 21],
        ['kh-ks', 22], ['kh-kt', 23], ['kh-py', 24], ['kh-ph', 25],
        ['kh-st', 26], ['kh-kh', 27], ['kh-mk', 28], ['kh-ro', 29],
        ['kh-kp', 30], ['kh-ke', 31], ['kh-sr', 32], ['kh-ta', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kh/kh-all.topo.json">Cambodia</a>'
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
