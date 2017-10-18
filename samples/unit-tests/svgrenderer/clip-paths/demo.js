QUnit.test('Verify that references to unused clip paths are removed after animation',
    function (assert) {

        // Hijack animation
        var clock = lolexInstall();

        var done = assert.async(2),
            // Get list of unique clip path references
            getClipPathSet = function (chart) {
                var clipPathList = [];
                Highcharts.each(
                    chart.container.querySelectorAll('[clip-path],[CLIP-PATH]'),
                    function (clipPath) {
                        var p = clipPath.getAttribute('clip-path');
                        if (p !== 'none' && Highcharts.inArray(p, clipPathList) < 0) {
                            clipPathList.push(p);
                        }
                    }
                );
                return clipPathList;
            };

        var chart = Highcharts.chart('container', {
            chart: {
                events: {
                    load: function () {
                        assert.strictEqual(getClipPathSet(this).length, 2,
                            'There are references to two different clipPaths');
                        done();
                    }
                }
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 1
                    }
                }
            },
            series: [{
                data: [1, 2, 3, 4]
            }, {
                data: [4, 3, 2, 1]
            }]
        });

        setTimeout(function () {
            assert.strictEqual(
                getClipPathSet(chart).length,
                1,
                'There are only references to one clipPath after animation'
            );
            done();
        }, 20);


        // Reset animation
        lolexRunAndUninstall(clock);
    });
