(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-dr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-dr-gm1680', 10], ['nl-dr-gm1699', 11], ['nl-dr-gm0106', 12],
        ['nl-dr-gm0118', 13], ['nl-dr-gm0109', 14], ['nl-dr-gm1701', 15],
        ['nl-dr-gm1731', 16], ['nl-dr-gm1681', 17], ['nl-dr-gm1690', 18],
        ['nl-dr-gm0114', 19], ['nl-dr-gm0119', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-dr-all.topo.json">Drenthe</a>'
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
