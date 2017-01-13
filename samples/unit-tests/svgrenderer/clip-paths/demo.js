QUnit.test('Verify that references to unused clip paths are removed after animation',
    function (assert) {
        var done = assert.async(2),
            // Get list of unique clip path references
            getClipPathSet = function (chart) {
                var clipPathList = [];
                Highcharts.each(
                    chart.container.querySelectorAll('[clip-path]'),
                    function (clipPath) {
                        var p = clipPath.getAttribute('clip-path');
                        if (p !== 'none' && Highcharts.inArray(p, clipPathList) < 0) {
                            clipPathList.push(p);
                        }
                    }
                );
                return clipPathList;
            };

        Highcharts.chart('container', {
            chart: {
                events: {
                    load: function () {
                        assert.strictEqual(getClipPathSet(this).length, 2,
                            'There are references to two different clipPaths');
                        done();
                    }
                }
            },
            series: [{
                data: [1, 2, 3, 4],
                animation: {
                    duration: 1
                },
                events: {
                    afterAnimate: function () {
                        assert.strictEqual(getClipPathSet(this.chart).length, 1,
                    'There are only references to one clipPath after animation');
                        done();
                    }
                }
            }]
        });
    });
