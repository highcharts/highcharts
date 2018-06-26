
(function () {

    function getStockConfig() {
        return {
            chart: {
                animation: false,
                height: 300,
                plotBackgroundColor: '#eff'
            },

            series: [{
                animation: false,
                pointStart: Date.UTC(2016, 0, 1),
                pointInterval: 24 * 36e5,
                data: [1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                    1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                    1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2,
                    1, 3, 5, 6, 7, 3, 5, 4, 6, 5, 4, 3, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 4, 3, 2]
            }]
        };
    }



    /*QUnit.test('Navigator update', function (assert) {
        var chart = Highcharts.stockChart($('<div>').appendTo('#container')[0], getStockConfig()),
            originalPlotHeight = document.querySelector('.highcharts-plot-background').getBBox().height;

        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height,
            'number',
            'Height is valid'
        );
        assert.ok(
            chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height < 60,
            'Height is 40'
        );

        chart.update({
            navigator: {
                height: 100
            }
        });

        assert.ok(
            chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height > 60,
            'Height is updated'
        );

        chart.update({
            navigator: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-navigator rect'),
            null,
            'Navigator element is missing'
        );

        assert.ok(
            document.querySelector('.highcharts-plot-background').getBBox().height > originalPlotHeight,
            'Plot area is now higher than it was'
        );

        chart.update({
            navigator: {
                enabled: true
            }
        });


        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-navigator'),
            'object',
            'Navigator element added'
        );
        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-navigator-mask-inside').getBBox().height,
            'number',
            'Height is valid'
        );
    });

    QUnit.test('Scrollbar update', function (assert) {
        var chart = Highcharts.stockChart($('<div>').appendTo('#container')[0], getStockConfig());

        assert.strictEqual(
            typeof chart.container.querySelector('.highcharts-scrollbar').getBBox().height,
            'number',
            'Height is valid'
        );

        chart.update({
            scrollbar: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelector('.highcharts-scrollbar'),
            null,
            'Scrollbar is gone'
        );
    });*/

    QUnit.test('Range selector update', function (assert) {

        var chart = Highcharts.stockChart($('<div>').appendTo('#container')[0], getStockConfig());

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-range-selector-buttons .highcharts-button').length,
            6,
            '6 range selector buttons'
        );

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            4,
            '2 inputs and 2 labels'
        );

        chart.update({
            rangeSelector: {
                inputEnabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            0,
            'No inputs'
        );

        chart.update({
            rangeSelector: {
                enabled: false
            }
        });

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-range-selector-buttons .highcharts-button').length,
            0,
            'No buttons'
        );

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            0,
            'No inputs'
        );

        chart.update({
            rangeSelector: {
                enabled: true,
                inputEnabled: true
            }
        });

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-range-selector-buttons .highcharts-button').length,
            6,
            '6 range selector buttons'
        );

        assert.strictEqual(
            chart.container.querySelectorAll('g.highcharts-input-group .highcharts-label').length,
            4,
            '2 inputs and 2 labels'
        );

    });

}());
