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
            type: 'temperaturemap',
            temperatureColors: [
                [0.05, '#ff0000'],
                [0.2, '#ffff00'],
                [0.4, '#00ff00'],
                [1, '#0000ff']
            ],
            data: [
                ['pl', 1],
                ['de', 1],
                ['ch', 1],
                ['be', 1],
                ['cz', 1]
            ]
        }]
    });

    document.getElementById('btn-color-size-1').addEventListener(
        'click',
        function () {
            chart.series[1].update({
                temperatureColors: [
                    [0.05, '#ff0000'],
                    [0.2, '#ffff00'],
                    [0.4, '#00ff00'],
                    [1, '#0000ff']
                ]
            });
        }
    );

    document.getElementById('btn-color-size-2').addEventListener(
        'click',
        function () {
            chart.series[1].update({
                temperatureColors: [
                    [0.15, '#ff0000'],
                    [0.3, '#ffff00'],
                    [0.55, '#00ff00'],
                    [1, '#0000ff']
                ]
            });
        }
    );

})();
