(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ma/ma-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ma-rz', 10], ['ma-mt', 11], ['ma-td', 12], ['ma-or', 13],
        ['ma-fb', 14], ['ma-sm', 15], ['ma-mk', 16], ['ma-da', 17],
        ['ma-ge', 18], ['ma-lb', 19], ['ma-od', 20], ['ma-to', 21],
        ['ma-th', 22], ['ma-gb', 23], ['ma-co', 24], ['ma-gc', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ma/ma-all.topo.json">Morocco</a>'
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
