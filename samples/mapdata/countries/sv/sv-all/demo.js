(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sv/sv-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sv-un', 10], ['sv-li', 11], ['sv-pa', 12], ['sv-cu', 13],
        ['sv-so', 14], ['sv-ss', 15], ['sv-mo', 16], ['sv-sm', 17],
        ['sv-sv', 18], ['sv-us', 19], ['sv-ch', 20], ['sv-sa', 21],
        ['sv-ah', 22], ['sv-ca', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sv/sv-all.topo.json">El Salvador</a>'
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
