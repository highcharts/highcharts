QUnit.test('Clipping rectangle after set extremes (#6895)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [
            {
                boostThreshold: 1,
                data: [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                    [0, 3],
                    [0, 4]
                ]
            }
        ]
    });

    chart.yAxis[0].setExtremes(1, 2);

    assert.strictEqual(
        chart.series[0].boost.clipRect.attr('height'),
        chart.plotHeight,
        'Correct height of the clipping box.'
    );
});

QUnit.test(
    'Boost enabled false and boostThreshold conflict (#9052)',
    function (assert) {
        Highcharts.chart('container', {
            plotOptions: {
                series: {
                    boostThreshold: 1
                }
            },
            series: [
                {
                    data: [1, 3, 2, 4]
                }
            ],
            xAxis: {
                max: 10,
                min: -10
            },
            yAxis: {
                max: 10,
                min: -10
            },
            boost: {
                enabled: false
            }
        });

        assert.ok(true, 'The chart should not fail');
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Dynamically removing and adding series (#7499)',
    function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                height: 300
            },
            boost: {
                allowForce: true
            },
            plotOptions: {
                series: {
                    boostThreshold: 1
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4]
                },
                {
                    data: [2, 3, 4, 5]
                }
            ]
        });

        assert.strictEqual(chart.series.length, 2, 'Successfully initiated');

        assert.strictEqual(
            chart.series[0].boost.target,
            undefined,
            'No individual boost.target'
        );

        chart.series[1].remove();
        chart.series[0].remove();

        chart.addSeries({
            data: [4, 3, 2, 1]
        });

        assert.strictEqual(
            typeof chart.series[0].boost.target,
            'object',
            'Only one series, it should now have a boost.target'
        );

        chart.addSeries({
            data: [5, 4, 3, 2]
        });

        assert.strictEqual(chart.series.length, 2, 'Successfully updated');
        assert.notOk(
            chart.series[0].boost &&
            chart.series[0].boost.target,
            'No individual boost.target after the second series is added'
        );

        function getData(n) {
            const arr = new Array(n);

            let i = 0;
            let x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 36e5;

            for (; i < n; i = i + 1, x = x + 36e5) {
                arr[i] = [x, 2 * Math.sin(i / 100)];
            }

            return arr;
        }

        const done = assert.async();
        // wait for ~1 second
        setTimeout(() => {
            // Failure will be a global TypeError,
            // which QUnit catches by itself
            assert.ok(
                true,
                'Removing a series before it is fully rendered should not ' +
                'cause error'
            );
            done();
        }, 1000);

        // Add a series that takes enough time to process
        // that it will not be fully rendered before calling remove
        chart.addSeries({
            data: getData(5000)
        });

        chart.series[chart.series.length - 1].remove();

    }
);
QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Combination with non-boostable series types and null values (#7634)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            boost: {
                seriesThreshold: 1
            },

            series: [
                {
                    data: [1, 3, 2, 4],
                    boostThreshold: 1,
                    id: 'primary'
                },
                {
                    type: 'flags',
                    onSeries: 'primary',
                    data: [
                        {
                            x: 1,
                            title: 'C',
                            text: 'C text'
                        }
                    ]
                },
                {
                    data: [1, 2, 3, 4, 5],
                    boostThreshold: 0,
                    type: 'pie'
                }
            ]
        });

        assert.strictEqual(
            chart.series[1].points.length,
            1,
            '1 point should be generated for flags series'
        );
        assert.strictEqual(
            chart.series[2].points.length,
            5,
            '5 points should be generated for flags series'
        );

        chart.addSeries({
            data: [null, 9, 4, null]
        });

        assert.strictEqual(
            chart.series[3].points.length,
            2,
            'Null points should not be added to the series\' kd-tree (#19341)'
        );

        chart.update({
            xAxis: {
                min: 0,
                max: 10
            },

            yAxis: {
                min: 0,
                max: 10
            }
        });

        chart.addSeries({
            data: [1, 2, 3, 4, null, 6, 7],
            boostThreshold: 5
        });

        assert.ok(
            true,
            `There shouldn't be any error in the console, after chart render
            (#17014).`
        );
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Series update with shared tooltip (#9572)',
    function (assert) {
        var i = 0,
            chart,
            controller;

        assert.expect(0);

        function getData() {
            i++;
            return [
                ['Time', '2018-11-28', '2018-11-29', '2018-11-30'],
                ['s1', 1, i, 1],
                ['s2', 2, i, 2]
            ];
        }

        chart = Highcharts.chart('container', {
            data: {
                columns: getData()
            },
            chart: {
                width: 600
            },
            series: [
                {
                    boostThreshold: 1
                },
                {}
            ],
            tooltip: {
                shared: true
            }
        });

        controller = new TestController(chart);
        controller.moveTo(300, 200);
        chart.update({
            data: {
                columns: getData()
            },
            series: [{}, {}],
            tooltip: {}
        });
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    `Error handler while the series is not declared as an array of numbers and
    turbo threshold enabled, #13957.`,
    function (assert) {
        var done = assert.async(),
            remove = Highcharts.addEvent(
                Highcharts,
                'displayError',
                function (e) {
                    assert.strictEqual(
                        e.code, 12, 'Error 12 should be ' +
                        'invoked'
                    );
                    remove();
                    done();
                }
            );
        Highcharts.stockChart('container', {
            series: [
                {
                    data: [
                        [1, 2],
                        {
                            x: 2,
                            y: 46.7407
                        },
                        [3, 46.6135],
                        [4, 47.0005],
                        [5, 48.1701],
                        [6, 47.5816]
                    ],
                    turboThreshold: 2
                }
            ]
        });
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'The boost clip-path should have appropriate size, #14444, #17820.',
    function (assert) {
        function generataSeries() {
            const series = Array.from(Array(100)).map(function () {
                return {
                    data: Array.from(Array(10)).map(() =>
                        Math.round(Math.random() * 10)
                    )
                };
            });
            return series;
        }

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'line',
                zoomType: 'xy',
                inverted: true
            },
            boost: {
                enabled: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: generataSeries()
        });

        assert.strictEqual(
            chart.boost.clipRect.attr('height'),
            chart.plotHeight,
            'Height of the plot area and clip-path should be the same.'
        );
        assert.strictEqual(
            chart.boost.clipRect.attr('width'),
            chart.plotWidth,
            'Width of the plot area and clip-path should be the same.'
        );
        chart.update({
            xAxis: [
                {
                    max: 10,
                    height: '50%'
                },
                {
                    height: '50%',
                    max: 10,
                    linkedTo: 0
                }
            ],
            yAxis: [
                {
                    max: 10,
                    height: '50%'
                },
                {
                    max: 10,
                    height: '50%',
                    linkedTo: 0
                }
            ]
        });
        assert.strictEqual(
            chart.boost.clipRect.attr('height'),
            chart.yAxis[0].height,
            `After setting the axis position manually, the boost clip-path
            shouldn\'t be bigger than the axis size.`
        );

        // #17820
        chart.update({
            chart: {
                inverted: false
            },
            navigator: {
                enabled: true,
                height: 80,
                series: {
                    boostThreshold: 1,
                    color: 'red',
                    type: 'line',
                    dataGrouping: {
                        enabled: false
                    }
                }
            }
        });
        assert.strictEqual(
            chart.boost.clipRect.attr('height'),
            chart.navigator.top + chart.navigator.height - chart.plotTop,
            'Clip rect should take into account navigator boosted series, ' +
            '#17820.'
        );

        chart.update({
            chart: {
                inverted: true
            },
            navigator: {
                height: 40
            }
        });
        assert.strictEqual(
            chart.boost.clipRect.attr('height'),
            chart.plotHeight,
            `Clip rect height should take into account navigator boosted series
            on inverted charts, #20936.`
        );
        assert.strictEqual(
            chart.boost.clipRect.attr('width'),
            chart.plotWidth + chart.navigator.top + chart.navigator.height,
            `Clip rect width should take into account navigator boosted series
            on inverted charts, #20936.`
        );
        assert.strictEqual(
            chart.boost.clipRect.attr('x'),
            chart.navigator.left,
            `Clip rect 'x' should take into account navigator boosted
            series on inverted charts, #20936.`
        );

        chart.update({
            navigator: {
                opposite: true
            }
        });
        assert.strictEqual(
            chart.boost.clipRect.attr('x'),
            chart.plotLeft,
            `Clip rect 'x' should take into account opposite navigator boosted
            series on inverted charts, #20936.`
        );
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Boost handling of individual boostable series',
    function (assert) {
        const chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    boostThreshold: 5
                }
            },
            series: [{
                type: 'scatter',
                data: [
                    [1, 0],
                    [4, 0],
                    [8, 0]
                ]
            }, {
                data: [1, 0, 3, 4, 5, 6, 7, 8, 9, 10],
                zIndex: 2
            }]
        });

        assert.strictEqual(
            chart.boost.forceChartBoost,
            false,
            `Boost forcing for the entire chart should be turned off when one of
            the series has less points than the threshold. (#18815)`
        );

        assert.strictEqual(
            chart.series[0].boosted,
            false,
            'The first series should not be boosted. (#18815)'
        );

        assert.strictEqual(
            chart.series[1].boosted,
            true,
            'The second series should be boosted. (#18815)'
        );

        assert.strictEqual(
            chart.container.querySelector('image.highcharts-boost-canvas')
                .dataset
                .zIndex,
            '2',
            'The chart-level boost target should take the z-index of the ' +
            'series (#9819)'
        );

        chart.series[0].update({
            data: [
                [0, 10, 0],
                [8, 5, 1],
                [9, -4, 2],
                [1, -9, 3],
                [-7, -6, 4],
                [-9, 2, 5],
                [-2, 9, 6],
                [6, 7, 7],
                [9, -1, 8],
                [4, -9, 9],
                [-5, -8, 10],
                [-9, 0, 11],
                [-5, 8, 12],
                [4, 9, 13],
                [9, 1, 14],
                [6, -7, 15],
                [-2, -9, 16],
                [-9, -2, 17],
                [-7, 6, 18],
                [1, 9, 19],
                [9, 4, 20],
                [8, -5, 21],
                [0, -9, 22],
                [-8, -5, 23],
                [-9, 4, 24],
                [-1, 9, 25],
                [7, 6, 26],
                [9, -2, 27],
                [2, -9, 28],
                [-6, -7, 29],
                [-9, 1, 30],
                [-4, 9, 31],
                [5, 8, 32],
                [9, 0, 33],
                [5, -8, 34],
                [-4, -9, 35],
                [-9, -1, 36],
                [-6, 7, 37],
                [2, 9, 38],
                [9, 2, 39],
                [7, -6, 40],
                [-1, -9, 41],
                [-9, -3, 42],
                [-8, 5, 43],
                [0, 9, 44],
                [8, 5, 45],
                [9, -4, 46],
                [1, -9, 47],
                [-7, -6, 48],
                [-9, 3, 49],
                [-2, 9, 50],
                [6, 7, 51],
                [9, -1, 52],
                [3, -9, 53],
                [-5, -8, 54],
                [-9, 0, 55],
                [-5, 8, 56],
                [4, 8, 57],
                [9, 1, 58],
                [6, -7, 59],
                [-3, -9, 60],
                [-9, -2, 61],
                [-7, 6, 62],
                [1, 9, 63],
                [9, 3, 64],
                [8, -5, 65],
                [0, -9, 66],
                [-8, -5, 67],
                [-8, 4, 68],
                [-1, 9, 69],
                [7, 6, 70],
                [9, -3, 71],
                [2, -9, 72],
                [-6, -7, 73],
                [-9, 1, 74],
                [-3, 9, 75],
                [5, 8, 76],
                [9, 0, 77],
                [5, -8, 78],
                [-4, -8, 79],
                [-9, -1, 80],
                [-6, 7, 81],
                [3, 9, 82],
                [9, 2, 83],
                [7, -6, 84],
                [-1, -9, 85],
                [-9, -3, 86],
                [-8, 5, 87],
                [0, 9, 88],
                [8, 5, 89],
                [8, -4, 90],
                [1, -9, 91],
                [-7, -6, 92],
                [-9, 3, 93],
                [-2, 9, 94],
                [6, 7, 95],
                [9, -1, 96],
                [3, -9, 97],
                [-5, -8, 98],
                [-9, 0, 99],
                [-5, 8, 100],
                [4, 8, 101],
                [9, 1, 102],
                [6, -7, 103],
                [-3, -9, 104],
                [-9, -2, 105],
                [-7, 6, 106],
                [1, 9, 107],
                [9, 3, 108],
                [8, -5, 109],
                [0, -9, 110],
                [-8, -5, 111],
                [-8, 4, 112],
                [0, 9, 113],
                [7, 6, 114],
                [9, -3, 115],
                [2, -9, 116],
                [-6, -7, 117],
                [-9, 1, 118],
                [-3, 9, 119],
                [5, 8, 120],
                [9, 0, 121],
                [4, -8, 122],
                [-4, -8, 123],
                [-9, 0, 124],
                [-6, 7, 125],
                [3, 9, 126],
                [9, 2, 127],
                [7, -6, 128],
                [-1, -9, 129],
                [-9, -3, 130],
                [-8, 5, 131],
                [0, 9, 132],
                [8, 4, 133],
                [8, -4, 134],
                [0, -9, 135],
                [-7, -6, 136],
                [-9, 3, 137],
                [-2, 9, 138],
                [6, 7, 139],
                [9, -1, 140],
                [3, -9, 141],
                [-5, -8, 142],
                [-9, 0, 143],
                [-4, 8, 144],
                [4, 8, 145],
                [9, 0, 146],
                [6, -7, 147],
                [-3, -9, 148],
                [-9, -2, 149],
                [-7, 6, 150],
                [2, 9, 151],
                [9, 3, 152],
                [8, -5, 153],
                [0, -9, 154],
                [-8, -4, 155],
                [-8, 4, 156],
                [0, 9, 157],
                [7, 6, 158],
                [9, -3, 159],
                [2, -9, 160],
                [-7, -7, 161],
                [-9, 2, 162],
                [-3, 9, 163],
                [5, 8, 164],
                [9, 0, 165],
                [4, -8, 166],
                [-4, -8, 167],
                [-9, 0, 168],
                [-6, 7, 169],
                [3, 9, 170],
                [9, 2, 171],
                [7, -7, 172],
                [-2, -9, 173],
                [-9, -3, 174],
                [-8, 5, 175],
                [0, 9, 176],
                [8, 4, 177],
                [8, -4, 178],
                [0, -9, 179],
                [-8, -5, 180],
                [-9, 3, 181],
                [-2, 9, 182],
                [7, 7, 183],
                [9, -2, 184],
                [3, -9, 185],
                [-6, -7, 186],
                [-9, 0, 187],
                [-4, 8, 188],
                [4, 8, 189],
                [9, 0, 190],
                [5, -8, 191],
                [-3, -9, 192],
                [-9, -2, 193],
                [-7, 7, 194],
                [2, 9, 195],
                [9, 3, 196],
                [7, -6, 197],
                [0, -9, 198],
                [-8, -4, 199],
                [-8, 4, 200],
                [0, 9, 201],
                [8, 5, 202],
                [9, -3, 203],
                [2, -9, 204],
                [-7, -6, 205],
                [-9, 2, 206],
                [-3, 9, 207],
                [6, 7, 208],
                [9, 0, 209],
                [4, -8, 210],
                [-4, -8, 211],
                [-9, 0, 212],
                [-5, 8, 213],
                [3, 9, 214],
                [9, 1, 215],
                [6, -7, 216],
                [-2, -9, 217],
                [-9, -3, 218],
                [-7, 6, 219],
                [0, 9, 220],
                [8, 4, 221],
                [8, -4, 222],
                [0, -9, 223],
                [-8, -5, 224],
                [-9, 3, 225],
                [-1, 9, 226],
                [7, 6, 227],
                [9, -2, 228],
                [3, -9, 229],
                [-6, -7, 230],
                [-9, 0, 231],
                [-4, 8, 232],
                [4, 8, 233],
                [9, 0, 234],
                [5, -8, 235],
                [-3, -9, 236],
                [-9, -1, 237],
                [-6, 7, 238],
                [2, 9, 239],
                [9, 3, 240],
                [7, -6, 241],
                [0, -9, 242],
                [-8, -4, 243],
                [-8, 5, 244],
                [0, 9, 245],
                [8, 5, 246],
                [9, -3, 247],
                [1, -9, 248],
                [-7, -6, 249],
                [-9, 2, 250],
                [-3, 9, 251],
                [6, 7, 252],
                [9, -1, 253],
                [4, -8, 254],
                [-5, -8, 255],
                [-9, 0, 256],
                [-5, 8, 257],
                [3, 9, 258],
                [9, 1, 259],
                [6, -7, 260],
                [-2, -9, 261],
                [-9, -3, 262],
                [-7, 6, 263],
                [1, 9, 264],
                [8, 4, 265],
                [8, -5, 266],
                [0, -9, 267],
                [-8, -5, 268],
                [-9, 3, 269],
                [-1, 9, 270],
                [7, 6, 271],
                [9, -2, 272],
                [3, -9, 273],
                [-6, -7, 274],
                [-9, 1, 275],
                [-4, 8, 276],
                [5, 8, 277],
                [9, 0, 278],
                [5, -8, 279],
                [-3, -9, 280],
                [-9, -1, 281],
                [-6, 7, 282],
                [2, 9, 283],
                [9, 3, 284],
                [7, -6, 285],
                [-1, -9, 286],
                [-8, -4, 287],
                [-8, 5, 288],
                [0, 9, 289],
                [8, 5, 290],
                [9, -3, 291],
                [1, -9, 292],
                [-7, -6, 293],
                [-9, 2, 294],
                [-3, 9, 295],
                [6, 7, 296],
                [9, -1, 297],
                [4, -8, 298],
                [-5, -8, 299]
            ]
        });

        chart.series[1].update({
            data: [1, 100]
        });

        assert.strictEqual(
            chart.yAxis[0].max >= 100,
            true,
            'Y-Axis should take all series into account (#22183)'
        );

    }
);


QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Dynamic y-axis scale (#21068)',
    function (assert) {
        const chart = Highcharts.chart('container', {});

        chart.update({
            yAxis: {
                id: true
            },
            boost: {
                enabled: false,
                useGPUTranslations: true,
                usePreallocated: true
            },
            series: [{
                type: 'scatter',
                data: [
                    [0, 17844.9970195],
                    [3, 0],
                    [3, 0],
                    [15, 0],
                    [20, 3.251707695608],
                    [25, 0],
                    [48, 0],
                    [83, 4.613364613784801],
                    [101, 107.9853419401976],
                    [172, 40.15339203180021],
                    [207, 0],
                    [358, 0],
                    [882, 493.2697085333866],
                    [1083, 137.5775549],
                    [1174, 0],
                    [1338, 1169.8349916205545],
                    [1749, 515.4426648740781],
                    [2932, 2222.5919712993655],
                    [4616, 7394.206545882728],
                    [8680, 2851.592296281099],
                    [20078, 4845.327601560356],
                    [20770, 88484.33223818678],
                    [33848, 19836.59438924057],
                    [66751, -123728.19741115364],
                    [255763, 27663.11820818996],
                    [332189, 205914.7489098137],
                    [365274, 170649.91926368963]
                ]
            }]
        }, true, true);

        assert.notEqual(
            chart.yAxis[0].tickPositions.length,
            2,
            'The y-axis should have more than two ticks'
        );

        chart.update({
            chart: {
                animation: true
            },
            boost: {
                enabled: true,
                useGPUTranslations: false,
                usePreallocated: false
            },
            yAxis: [{
                id: 'a'
            }, {
                id: 'b',
                height: '10%',
                top: '90%'
            }],
            plotOptions: {
                series: {
                    animation: true,
                    states: {
                        hover: {
                            halo: {
                                size: 50
                            }
                        }
                    }
                }
            },
            series: [{
                type: 'line',
                yAxis: 'a',
                data: [8, 6, 4],
                boostThreshold: 1,
                stickyTracking: false
            }, {
                data: [4, 5, 7],
                yAxis: 'b',
                boostThreshold: 1,
                stickyTracking: false
            }]
        }, true, true);

        const controller = new TestController(chart);
        controller.moveTo(
            chart.plotLeft + chart.series[1].points[1].plotX,
            chart.plotTop + chart.plotHeight - chart.series[1].points[1].plotY
        );
        controller.moveTo(
            chart.plotLeft + chart.series[0].points[1].plotX,
            chart.plotTop + chart.plotHeight - chart.series[0].points[1].plotY
        );

        assert.strictEqual(
            chart.series[1].halo.visibility,
            'hidden',
            `Halo shouldn't be rendered in wrong position between hovering
            points from multiple series on multiple y-axes, #21176.`
        );
    }
);
