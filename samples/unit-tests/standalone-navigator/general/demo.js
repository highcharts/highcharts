QUnit.test('Standalone navigator general tests', function (assert) {
    const series = [{
        data: [1, 2, 3, 4, 3, 2, 1],
        pointInterval: 10000000000
    }];
    const container1 = document.createElement('div');
    document.getElementById('container').appendChild(container1);
    container1.id = 'navigator';
    const container2 = document.createElement('div');
    document.getElementById('container').appendChild(container2);
    container2.id = 'chart';

    const navigator = Highcharts.navigator('navigator', {
        height: 150,
        series
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        150,
        'Standalone navigator container should have correct height, #21268.'
    );

    navigator.update({
        height: 200
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        200,
        `Standalone navigator container should have correct height after update,
        #21268.`
    );

    // #23809
    const chart = Highcharts.stockChart('chart', {
        series,
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            minRange: 1
        }
    });

    navigator.bind(chart);

    const rangeSelector = chart.rangeSelector;
    rangeSelector.clickButton(1);

    assert.strictEqual(
        navigator.getRange().min,
        chart.xAxis[0].getExtremes().min,
        `Standalone navigator min should be equal to chart min, after clicking
        range selector button, #23809.`
    );

    assert.strictEqual(
        navigator.getRange().max,
        chart.xAxis[0].getExtremes().max,
        `Standalone navigator max should be equal to chart max, after clicking
        range selector button, #23809.`
    );

    rangeSelector.setInputValue('min', 0);
    Highcharts.fireEvent(rangeSelector.minInput, 'change');

    assert.strictEqual(
        navigator.getRange().min,
        0,
        `Standalone navigator should react to range selector input value change,
        #23809.`
    );

    // Cleanup after appending multiple containers
    navigator.destroy();
    container1.parentNode.removeChild(container1);
    chart.destroy();
    container2.parentNode.removeChild(container2);
});