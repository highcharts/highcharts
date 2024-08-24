(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/la/la-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['la-at', 10], ['la-bk', 11], ['la-bl', 12], ['la-ch', 13],
        ['la-ho', 14], ['la-kh', 15], ['la-lm', 16], ['la-lp', 17],
        ['la-ou', 18], ['la-ph', 19], ['la-xa', 20], ['la-sl', 21],
        ['la-sv', 22], ['la-vt', 23], ['la-vi', 24], ['la-xs', 25],
        ['la-xe', 26], ['la-xi', 27]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/la/la-all.topo.json">Laos</a>'
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
