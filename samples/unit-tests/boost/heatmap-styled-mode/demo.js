QUnit.test('Boosted heatmap with styled mode (#6650)', function (assert) {
    const GROUPCT = 5,
        list = [...Array(GROUPCT).keys()],
        xCate = list.map(i => `X${i + 1}`),
        yCate = list.map(i => `Y${i + 1}`);

    let data = [];
    list.forEach(x =>
        list.forEach(y => data.push([x, y, Math.random() * GROUPCT]))
    );

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        plotOptions: {
            series: {
                boostThreshold: 1
            }
        },
        xAxis: {
            categories: xCate,
            min: 0,
            max: GROUPCT - 1,
            scrollbar: {
                enabled: true,
                showFull: false
            }
        },
        yAxis: {
            categories: yCate,
            min: 0,
            max: GROUPCT - 1,
            scrollbar: {
                enabled: true,
                showFull: false
            }
        },
        series: [{
            data
        }]
    });

    chart.xAxis[0].setExtremes(1, 3, false);
    chart.yAxis[0].setExtremes(1, 3);

    assert.notEqual(
        chart.yAxis[0].scrollbar.from,
        0,
        'Y-axis scrollbar should be shown for boosted heatmap, #23335.'
    );

    assert.notEqual(
        chart.yAxis[0].scrollbar.to,
        1,
        'Y-axis scrollbar should be shown for boosted heatmap, #23335.'
    );

    var xsize = 26;
    var ysize = 100;
    // Add some random data
    data = new Array(xsize * ysize);
    for (var i = 0; i < xsize * ysize; i++) {
        var row = new Array(3);
        row[0] = Math.floor(i / ysize);
        row[1] = -i % ysize;

        row[2] = (row[1] / ysize) * 125;
        // row[2] = Math.random() * -125;
        data[i] = row;
    }

    Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            styledMode: true,
            margin: [60, 10, 80, 50]
        },

        boost: {
            useGPUTranslations: true
        },

        title: {
            text: 'Swept Spectrogram',
            align: 'left',
            x: 40
        },

        xAxis: {
            type: 'number',
            title: {
                text: 'Channel'
            },
            min: 0,
            max: 25,
            showLastLabel: true
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}s'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            min: -99,
            max: 0,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0, '#FF0000'],
                [0.25, '#FFFF00'],
                [0.5, '#00FF00'],
                [0.75, '#00FFFF'],
                [1, '#0000FF']
            ],
            min: -125,
            max: 0,
            startOnTick: false,
            endOnTick: false,
            reversed: true,
            labels: {
                format: '{value} dBm'
            }
        },

        series: [
            {
                boostThreshold: 100,
                borderWidth: 0,
                // nullColor: '#000000',
                // colsize: 100*26, // one full buffer ? no idea...
                data: data
            }
        ]
    });
});

QUnit.test('Boost in styled mode', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                styledMode: true
            },
            series: [{
                marker: {
                    radius: 30,
                    enabled: true,
                    symbol: 'square'
                },
                data: [1, 2, 1, 2],
                boostThreshold: 1
            }, {
                marker: {
                    radius: 60,
                    enabled: true,
                    symbol: 'square'
                },
                data: [9, 8, 9, 8],
                boostThreshold: 1
            }]
        }),
        gl = chart.boost.wgl.gl,
        firstColor = window.getComputedStyle(
            chart.series[0].legendItem.symbol.element, null
        ).getPropertyValue('fill'),
        secondColor = window.getComputedStyle(
            chart.series[1].legendItem.symbol.element, null
        ).getPropertyValue('fill'),
        width = gl.canvas.width,
        height = gl.canvas.height,
        colors = [
            [-1, -1, -1],
            [-1, -1, -1]
        ],
        pxBuffer = new Uint8Array(width * height * 4);

    // Read pixel data
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pxBuffer);

    // Loop from the start - canvas bottom - find 1st series color
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let pxIndex = (y * width + x) * 4; // RGBA format
            if (
                pxBuffer[pxIndex + 3] !== 0
            ) {
                // Found a non-zero pixel, but due to blending move a bit
                pxIndex += (5 * width + 5) * 4;
                colors[0] = [
                    pxBuffer[pxIndex],
                    pxBuffer[pxIndex + 1],
                    pxBuffer[pxIndex + 2]
                ];

                // Quit the loops
                x = width;
                y = height;
            }
        }
    }

    // Loop from the end - canvas top - find 2nd series color
    for (let y = height - 1; y >= 0; y--) {
        for (let x = width - 1; x >= 0; x--) {
            let pxIndex = (y * width + x) * 4; // RGBA format
            if (
                pxBuffer[pxIndex + 3] !== 0
            ) {
                // Found a non-zero pixel, but due to blending move a bit
                pxIndex -= (5 * width + 5) * 4;
                colors[1] = [
                    pxBuffer[pxIndex],
                    pxBuffer[pxIndex + 1],
                    pxBuffer[pxIndex + 2]
                ];

                // Quit the loops
                x = y = 0;
            }
        }
    }

    assert.ok(
        colors[0][0] !== -1 && colors[1][0] !== -1,
        'any colors should be found in the canvas'
    );

    assert.strictEqual(
        `${colors[0][0]},${colors[0][1]},${colors[0][2]}`,
        firstColor.split('rgb(')[1].split(')')[0].replace(/\s/g, ''),
        '1st series should be colored correctly'
    );

    assert.strictEqual(
        `${colors[1][0]},${colors[1][1]},${colors[1][2]}`,
        secondColor.split('rgb(')[1].split(')')[0].replace(/\s/g, ''),
        '2nd series should be colored correctly'
    );
});
