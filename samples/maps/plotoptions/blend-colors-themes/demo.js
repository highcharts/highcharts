(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    const chart = Highcharts.mapChart('container', {

        chart: {
            map: topology
        },

        series: [{
            name: 'Basemap'
        }, {
            type: 'mapbubble',
            blendColors: [
                '#ff0000',
                '#ffff00',
                '#00ff00',
                '#00ffff',
                '#0000ff'
            ],
            marker: {
                lineWidth: 0
            },
            opacity: 0.75,
            data: [
                ['pl', 1],
                ['de', 1],
                ['ch', 1],
                ['be', 1],
                ['cz', 1]
            ]
        }]
    });

    document.getElementById('btn-color-theme-1').addEventListener(
        'click',
        function () {
            chart.series[1].update({
                // Temperature shades
                blendColors: [
                    '#ff0000',
                    '#ffff00',
                    '#00ff00',
                    '#00ffff',
                    '#0000ff'
                ]
            });
        }
    );

    document.getElementById('btn-color-theme-2').addEventListener(
        'click',
        function () {
            chart.series[1].update({
                blendColors: ['#ffff00', '#ff0001'] // fire shades
            });
        }
    );

})();
