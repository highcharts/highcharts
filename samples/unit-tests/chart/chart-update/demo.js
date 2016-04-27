/* eslint func-style:0 */
$(function () {

    function testCredits(assert, chart) {

        chart.update({
            credits: {
                enabled: false
            }
        });

        assert.ok(
            chart.credits === null,
            'Credits removed'
        );

        chart.update({
            credits: {
                text: 'Updated chart'
            }
        });

        assert.ok(
            chart.credits === null,
            'Still removed'
        );

        chart.update({
            credits: {
                enabled: true
            }
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            'Updated chart',
            'Stepwise update'
        );
    }

    function testLegend(assert, chart) {
        assert.ok(
            chart.legend.group.translateX < chart.chartWidth / 2,
            'Legend is centered'
        );
        chart.update({
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'
            }
        });
        assert.ok(
            chart.legend.group.translateX > chart.chartWidth / 2,
            'Legend is to the right of the middle'
        );


        chart.update({
            legend: {
                itemStyle: {
                    color: 'gray'
                }
            }
        });
        assert.strictEqual(
            chart.series[0].legendItem.styles.fill,
            'gray',
            'Text color is updated'
        );
    }

    function testTitle(assert, chart) {

        chart.update({
            title: {
                text: ''
            }
        });

        assert.strictEqual(
            chart.title,
            null,
            'Removed title'
        );

        chart.update({
            title: {
                text: 'Updated title'
            }
        });

        assert.strictEqual(
            chart.title.element.textContent,
            'Updated title',
            'Updated title'
        );

    }

    function testSubtitle(assert, chart) {

        chart.update({
            subtitle: {
                text: 'Updated subtitle'
            }
        });

        assert.strictEqual(
            chart.subtitle.element.textContent,
            'Updated subtitle',
            'Updated subtitle'
        );

    }

    function testColors(assert, chart) {
        chart.update({
            colors: ['#68266f', '#96a537', '#953255', '#679933']
        });

        assert.strictEqual(
            chart.series[0].color,
            '#68266f',
            'Color updated'
        );
    }

    function testLoading(assert, chart) {
        chart.update({
            loading: {
                showDuration: 0,
                style: {
                    background: 'black'
                },
                labelStyle: {
                    color: 'white'
                }
            }
        });
        chart.showLoading();
        assert.strictEqual(
            chart.loadingDiv.style.background,
            'black',
            'Background OK'
        );
        assert.strictEqual(
            chart.loadingSpan.style.color,
            'white',
            'Font color ok'
        );

        chart.update({
            loading: {
                showDuration: 0,
                style: {
                    background: 'white'
                },
                labelStyle: {
                    color: 'black'
                }
            }
        });
        chart.showLoading();

        assert.strictEqual(
            chart.loadingDiv.style.background,
            'white',
            'Background OK'
        );
        assert.strictEqual(
            chart.loadingSpan.style.color,
            'black',
            'Font color ok'
        );

        chart.hideLoading();
        
    }

    QUnit.test('Chart update', function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: 'column',
                animation: false,
                height: 300
            },

            series: [{
                data: [1, 3, 2, 4],
                name: 'First'
            }, {
                data: [5, 3, 4, 1],
                name: 'Last'
            }]

        });

        assert.strictEqual(
            chart.hasRendered,
            true,
            'Chart OK'
        );

        // One-to-one options/objects
        testCredits(assert, chart);
        testLegend(assert, chart);
        testTitle(assert, chart);
        testSubtitle(assert, chart);

        // Other option structures
        //testColors(assert, chart);
        testLoading(assert, chart);
    });

});