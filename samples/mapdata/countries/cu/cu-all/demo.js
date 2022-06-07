(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cu/cu-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cu-ho', 10], ['cu-ar', 11], ['cu-ma', 12], ['cu-vc', 13],
        ['cu-5812', 14], ['cu-ij', 15], ['cu-ss', 16], ['cu-ca', 17],
        ['cu-cm', 18], ['cu-ch', 19], ['cu-cf', 20], ['cu-gu', 21],
        ['cu-gr', 22], ['cu-lt', 23], ['cu-sc', 24], ['cu-mq', 25],
        ['cu-pr', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cu/cu-all.topo.json">Cuba</a>'
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
