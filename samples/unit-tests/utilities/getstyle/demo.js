


QUnit.test('Container with box-sizing', function (assert) {

    var div = document.createElement('div');
    div.style.boxSizing = 'border-box';
    div.style.width = '400px';
    div.style.height = '300px';
    div.style.margin = '20px auto';
    div.style.background = 'gray';
    div.style.padding = '20px';
    document.body.appendChild(div);


    var chart = Highcharts.chart(div, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        chart.chartWidth,
        360,
        'Chart width is inner box'
    );

    assert.strictEqual(
        chart.chartHeight,
        260,
        'Chart height is inner box'
    );

    document.body.removeChild(div);

});

QUnit.test('Container with overflow:auto', function (assert) {

    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.border = '5px solid green';
    div.style.padding = '5px';
    div.style.margin = '5px';
    div.style.overflow = 'auto';
    document.body.appendChild(div);

    var chart = Highcharts.chart(div, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        chart.chartWidth,
        200,
        'Chart width is inner box'
    );

    assert.strictEqual(
        chart.chartHeight,
        200,
        'Chart height is inner box'
    );

    document.body.removeChild(div);

});
