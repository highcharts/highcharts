(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-sh-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-sh-01054000', 10], ['de-sh-01051000', 11], ['de-sh-01055000', 12],
        ['de-sh-01056000', 13], ['de-sh-01061000', 14], ['de-sh-01053000', 15],
        ['de-sh-01002000', 16], ['de-sh-01059000', 17], ['de-sh-01001000', 18],
        ['de-sh-01062000', 19], ['de-sh-01003000', 20], ['de-sh-01060000', 21],
        ['de-sh-01004000', 22], ['de-sh-01058000', 23], ['de-sh-01057000', 24]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-sh-all.topo.json">Schleswig-Holstein</a>'
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
