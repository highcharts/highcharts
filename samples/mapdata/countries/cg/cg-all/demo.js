(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cg/cg-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cg-ni', 10], ['cg-pl', 11], ['cg-br', 12], ['cg-7280', 13],
        ['cg-bo', 14], ['cg-li', 15], ['cg-sa', 16], ['cg-cu', 17],
        ['cg-po', 18], ['cg-co', 19], ['cg-ko', 20], ['cg-le', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cg/cg-all.topo.json">Republic of the Congo</a>'
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
