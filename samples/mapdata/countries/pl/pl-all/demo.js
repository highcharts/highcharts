(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pl/pl-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pl-ld', 10], ['pl-mz', 11], ['pl-sk', 12], ['pl-pd', 13],
        ['pl-lu', 14], ['pl-pk', 15], ['pl-op', 16], ['pl-ma', 17],
        ['pl-wn', 18], ['pl-pm', 19], ['pl-ds', 20], ['pl-zp', 21],
        ['pl-lb', 22], ['pl-wp', 23], ['pl-kp', 24], ['pl-sl', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pl/pl-all.topo.json">Poland</a>'
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
