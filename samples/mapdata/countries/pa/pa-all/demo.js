(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pa/pa-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pa-ch', 10], ['pa-sb', 11], ['pa-vr', 12], ['pa-bc', 13],
        ['pa-nb', 14], ['pa-em', 15], ['pa-cl', 16], ['pa-he', 17],
        ['pa-ls', 18], ['pa-dr', 19], ['pa-1119', 20], ['pa-cc', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pa/pa-all.topo.json">Panama</a>'
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
