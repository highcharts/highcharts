(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/la/la-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['la-ou', 10], ['la-ph', 11], ['la-bl', 12], ['la-kh', 13],
        ['la-at', 14], ['la-bk', 15], ['la-xe', 16], ['la-lm', 17],
        ['la-xa', 18], ['la-ch', 19], ['la-sl', 20], ['la-sv', 21],
        ['la-vt', 22], ['la-vi', 23], ['la-xi', 24], ['la-ho', 25],
        ['la-lp', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/la/la-all.topo.json">Laos</a>'
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
