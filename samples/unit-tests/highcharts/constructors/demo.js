$(function () {

    QUnit.test('Highcharts', function (assert) {

        var chart,
            calledBack;

        Highcharts.setOptions({
            plotOptions: {
                series: {
                    animation: false
                }
            }
        });

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'Chart constructor, renderTo string option'
        );

        chart = new Highcharts.Chart({
            chart: {
                renderTo: document.getElementById('container')
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'Chart constructor, renderTo DOM option'
        );

        calledBack = false;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }, function () {
            calledBack = true;
        });
        assert.strictEqual(
            calledBack,
            true,
            'Chart constructor, renderTo string option, callback fired'
        );

        chart = $('#container').highcharts({
            series: [{
                data: [1, 2, 3, 4]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'jQuery plugin constructor'
        );

    });


    QUnit.test('Highstock', function (assert) {

        var chart,
            calledBack;

        Highcharts.setOptions({
            plotOptions: {
                series: {
                    animation: false
                }
            }
        });

        chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'StockChart constructor, renderTo string option'
        );
        assert.strictEqual(
            typeof chart.rangeSelector,
            'object',
            'Is stock chart'
        );

        chart = new Highcharts.StockChart({
            chart: {
                renderTo: document.getElementById('container')
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'StockChart constructor, renderTo DOM option'
        );
        assert.strictEqual(
            typeof chart.rangeSelector,
            'object',
            'Is stock chart'
        );

        calledBack = false;
        chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }, function () {
            calledBack = true;
        });
        assert.strictEqual(
            calledBack,
            true,
            'StockChart constructor, renderTo string option, callback fired'
        );
        assert.strictEqual(
            typeof chart.rangeSelector,
            'object',
            'Is stock chart'
        );

        chart = $('#container').highcharts('StockChart', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'jQuery plugin constructor'
        );
        assert.strictEqual(
            typeof chart.rangeSelector,
            'object',
            'Is stock chart'
        );

    });

    QUnit.test('Highmaps', function (assert) {

        var chart,
            calledBack;

        Highcharts.setOptions({
            plotOptions: {
                series: {
                    animation: false
                }
            }
        });

        chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        });

        assert.strictEqual(
            chart.series[0].points.length,
            1,
            'Map constructor, renderTo string option'
        );
        assert.strictEqual(
            chart.series[0].type,
            'map',
            'Is map chart'
        );

        chart = new Highcharts.Map({
            chart: {
                renderTo: document.getElementById('container')
            },
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        });

        assert.strictEqual(
            chart.series[0].points.length,
            1,
            'Map constructor, renderTo DOM option'
        );
        assert.strictEqual(
            chart.series[0].type,
            'map',
            'Is map chart'
        );

        calledBack = false;
        chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        }, function () {
            calledBack = true;
        });
        assert.strictEqual(
            calledBack,
            true,
            'Map constructor, renderTo string option, callback fired'
        );
        assert.strictEqual(
            chart.series[0].type,
            'map',
            'Is map chart'
        );

        chart = $('#container').highcharts('Map', {
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].points.length,
            1,
            'jQuery plugin constructor, Map'
        );
        assert.strictEqual(
            chart.series[0].type,
            'map',
            'Is map chart'
        );

    });

    QUnit.test('Lower case constructors, no new', function (assert) {
        var chart;

        chart = Highcharts.chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'chart constructor'
        );

        chart = Highcharts.stockChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'stockChart constructor'
        );

        assert.strictEqual(
            typeof chart.rangeSelector,
            'object',
            'Is stock chart'
        );

        chart = Highcharts.mapChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        });

        assert.strictEqual(
            chart.series[0].points.length,
            1,
            'jQuery plugin constructor, Map'
        );
        assert.strictEqual(
            chart.series[0].type,
            'map',
            'Is map chart'
        );
    });

    QUnit.test('renderTo as first argument', function (assert) {
        var chart,
            calledBack;

        chart = new Highcharts.Chart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'String renderTo, new Chart'
        );


        chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'String renderTo'
        );

        chart = Highcharts.chart(document.getElementById('container'), {
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'DOM renderTo'
        );

        chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.strictEqual(
            chart.series[0].yData.join(','),
            '1,2,3,4',
            'stockChart constructor, string renderTo'
        );

        assert.strictEqual(
            typeof chart.rangeSelector,
            'object',
            'Is stock chart'
        );

        chart = Highcharts.mapChart('container', {
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        });

        assert.strictEqual(
            chart.series[0].points.length,
            1,
            'mapChart constructor, string renderTo'
        );
        assert.strictEqual(
            chart.series[0].type,
            'map',
            'Is map chart'
        );

        calledBack = false;
        chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }, function () {
            calledBack = true;
        });
        assert.strictEqual(
            calledBack,
            true,
            'chart constructor, string renderTo, callback'
        );

        calledBack = false;
        chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }, function () {
            calledBack = true;
        });
        assert.strictEqual(
            calledBack,
            true,
            'stockChart constructor, string renderTo, callback'
        );

        calledBack = false;
        chart = Highcharts.mapChart('container', {
            series: [{
                data: [{
                    path: 'M 0 0 L 100 0 100 100 0 100',
                    value: 1
                }]
            }]
        }, function () {
            calledBack = true;
        });
        assert.strictEqual(
            calledBack,
            true,
            'mapChart constructor, string renderTo, callback'
        );

    });
});