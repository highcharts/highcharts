QUnit.test('Zero height', function (assert) {
    var container = document.createElement('div');
    container.style.minHeight = 0;
    document.getElementById('container').appendChild(container);

    var chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    try {
        assert.strictEqual(
            chart.chartHeight,
            400,
            '400px'
        );

    } finally {
        chart.destroy();
        container.remove();
    }
});

QUnit.test('1px height (#6261)', function (assert) {
    var container = document.createElement('div');
    container.style.minHeight = '1px';
    document.getElementById('container').appendChild(container);

    var chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    try {
        assert.strictEqual(
            chart.chartHeight,
            400,
            '400px'
        );

    } finally {
        chart.destroy();
        container.remove();
    }
});

QUnit.test('10px height (#6217)', function (assert) {
    var container = document.createElement('div');
    container.style.minHeight = '10px';
    document.getElementById('container').appendChild(container);

    var chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    try {
        assert.strictEqual(
            chart.chartHeight,
            10,
            '10px'
        );

    } finally {
        chart.destroy();
        container.remove();
    }
});

QUnit.test('Transform (#9871)', assert => {
    const container = document.createElement('div');
    container.style.transform = 'scale(0.7)';
    container.style.width = '400px';
    document.getElementById('container').appendChild(container);

    const chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    try {
        assert.strictEqual(
            chart.chartWidth,
            400,
            "Transforms shouln't confuse the chart sizing"
        );
    } finally {
        chart.destroy();
        container.remove();
    }
});