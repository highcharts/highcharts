$(function () {
  QUnit.test('Highstock should not nullify options.series in user variable.', function (assert) {
    var options = {
          series: [{
            data: [10, 20]
          }]
        },
        chart = $('#container').highcharts('StockChart', options);

    assert.strictEqual(
      options.series !== null,
      true,
      'Series info is not removed.'
    );
  });
});