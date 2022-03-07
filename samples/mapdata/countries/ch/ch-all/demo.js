(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ch/ch-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ch-fr', 10], ['ch-lu', 11], ['ch-ni', 12], ['ch-vs', 13],
        ['ch-sg', 14], ['ch-ar', 15], ['ch-ti', 16], ['ch-gl', 17],
        ['ch-gr', 18], ['ch-sz', 19], ['ch-tg', 20], ['ch-sh', 21],
        ['ch-ur', 22], ['ch-zh', 23], ['ch-zg', 24], ['ch-vd', 25],
        ['ch-bl', 26], ['ch-be', 27], ['ch-bs', 28], ['ch-so', 29],
        ['ch-nw', 30], ['ch-ai', 31], ['ch-ge', 32], ['ch-ju', 33],
        ['ch-ne', 34], ['ch-ag', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ch/ch-all.topo.json">Switzerland</a>'
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
