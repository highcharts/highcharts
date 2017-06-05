QUnit.test('Legend border should contain items with checkboxes (#4853)',
  function (assert) {
    var chart = Highcharts.chart('container', {
      legend: {
        borderWidth: 1,
        itemDistance: 80
      },
      plotOptions: {
        series: {
          showCheckbox: true
        }
      },

      series: [{
        data: [1, 2, 3]
      }, {
        data: [4, 3, 2]
      }]
    });

    assert.strictEqual(
      chart.legend.box.width,
      351,
      'Legend box contains checkboxes - 2 items'
    );

    chart.series[0].remove();

    assert.strictEqual(
      chart.legend.box.width,
      183,
      'Legend box contains checkbox - 1 item'
    );

    chart.update({
      plotOptions: {
        series: {
          showCheckbox: false
        }
      }
    });

    assert.strictEqual(
      chart.legend.box.width,
      83,
      'Legend box without checkboxes is of proper size - 1 item'
    );

    chart.addSeries({
      data: [5, 2, 4]
    });
    chart.addSeries({
      data: [15, 12, 14]
    });
    chart.addSeries({
      data: [2, 2, 2]
    });

    assert.strictEqual(
      chart.legend.box.width,
      380,
      'Legend box without checkboxes is of proper size - 4 items'
    );

    chart.update({
      plotOptions: {
        series: {
          showCheckbox: true
        }
      }
    });

    assert.strictEqual(
      chart.legend.box.width,
      520,
      'Legend box contains checkboxes - 4 items'
    );
});