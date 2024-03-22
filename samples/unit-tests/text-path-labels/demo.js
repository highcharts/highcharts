QUnit.test('textPath labels', function (assert) {
    const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        ),
        curvedPath = ren.path([
            ['M', 120, 100, 'C', 440, 200, 100, 420, 220, 170],
            ['L', 500, 200]
        ])
            .add(),
        curvedText = ren
            .text('2. Text outside<br> span', 0, 0)
            .attr({
                opacity: 0.5
            })
            .setTextPath(curvedPath, {
                enabled: true
            })
            .add(),
        curvedTextPolygon = [
            [
                218.1408634045683,
                221.68703594538644
            ],
            [
                199.95599227437273,
                216.1815421457188
            ],
            [
                212.35127076948302,
                184.15399174751474
            ],
            [
                194.88588250262225,
                176.67333584794275
            ],
            [
                182.13731587497819,
                209.64381712882494
            ],
            [
                173.58918327736288,
                247.19831329543663
            ],
            [
                185.51668766194072,
                294.2141108047104
            ],
            [
                200.610488311308,
                282.6738689546814
            ],
            [
                192.3945087831647,
                250.0174222480964
            ],
            [
                211.23825265456753,
                252.44915350565086
            ],
            [
                218.1408634045683,
                221.68703594538644
            ]
        ];

    assert.deepEqual(
        curvedTextPolygon,
        curvedText.polygon,
        'Curved text labels have befitting polygons'
    );
});