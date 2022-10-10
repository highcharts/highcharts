(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tt/tt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tt-180', 10], ['tt-dm', 11], ['tt-tp', 12], ['tt-sf', 13],
        ['tt-ch', 14], ['tt-ps', 15], ['tt-193', 16], ['tt-6597', 17],
        ['tt-si', 18], ['tt-sn', 19], ['tt-mr', 20], ['tt-sl', 21],
        ['tt-pt', 22], ['tt-ct', 23], ['tt-pd', 24], ['tt-pf', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tt/tt-all.topo.json">Trinidad and Tobago</a>'
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
