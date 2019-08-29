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
        container.parentNode.removeChild(container);
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
        container.parentNode.removeChild(container);
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
        container.parentNode.removeChild(container);
    }
});

QUnit.test('Transformed container parents', assert => {
    const container1 = document.createElement('div');
    container1.style.transform = 'scale(0.7)';
    container1.style.width = '400px';
    document.getElementById('container').appendChild(container1);

    const container2 = document.createElement('div');
    container2.style.transform = 'scale(0.7)';
    container2.style.width = '400px';
    container1.appendChild(container2);

    const chart = Highcharts.chart(container2, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    try {
        assert.strictEqual(
            chart.chartWidth,
            400,
            "Transforms shouln't confuse the chart sizing (#9871, #10498)"
        );
    } finally {
        chart.destroy();
        container2.parentNode.removeChild(container2);
        container1.parentNode.removeChild(container1);
    }
});