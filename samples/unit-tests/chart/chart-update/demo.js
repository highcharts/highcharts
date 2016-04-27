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

        testCredits(assert, chart);
        testLegend(assert, chart);
        testTitle(assert, chart);
        testSubtitle(assert, chart);

    });

});