(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-ze-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-ze-gm0716', 10], ['nl-ze-gm0717', 11], ['nl-ze-gm1714', 12],
        ['nl-ze-gm1676', 13], ['nl-ze-gm0678', 14], ['nl-ze-gm0703', 15],
        ['nl-ze-gm0664', 16], ['nl-ze-gm0687', 17], ['nl-ze-gm1695', 18],
        ['nl-ze-gm0718', 19], ['nl-ze-gm0654', 20], ['nl-ze-gm0715', 21],
        ['nl-ze-gm0677', 22]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ze-all.topo.json">Zeeland</a>'
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
