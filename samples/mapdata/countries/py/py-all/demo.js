(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/py/py-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['py-ag', 10], ['py-bq', 11], ['py-cn', 12], ['py-ph', 13],
        ['py-cr', 14], ['py-sp', 15], ['py-ce', 16], ['py-mi', 17],
        ['py-ne', 18], ['py-gu', 19], ['py-pg', 20], ['py-am', 21],
        ['py-aa', 22], ['py-cg', 23], ['py-cz', 24], ['py-cy', 25],
        ['py-it', 26], ['py-as', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/py/py-all.topo.json">Paraguay</a>'
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
