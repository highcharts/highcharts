(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    QUnit.test(
        'Test',
        function (assert) {

            Highcharts.mapChart('container', {
                chart: {
                    map: topology
                },
                series: [{}, {
                    type: 'temperaturemap',
                    data: [{
                        lat: 32,
                        lon: 6,
                        z: 2
                    }, {
                        lat: 58,
                        lon: -134,
                        z: 3
                    }, {
                        lat: 33,
                        lon: -112,
                        z: 14
                    }],
                    minSize: 10,
                    maxSize: '12%',
                    color: 'rgba(255,0,255,0)',
                    colors: ['red', 'blue', 'green'],
                    marker: {
                        fillColor: [
                            [0, '#0000ff'],
                            [0.25, '#00ffff'],
                            [0.5, '#00ff00'],
                            [0.75, '#ffff00'],
                            [1, '#ff0000']
                        ]
                    }
                }]
            });

            assert.ok(
                true,
                'No errors.'
            );
        });
})();