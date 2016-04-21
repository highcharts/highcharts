QUnit.test('tooltipFormatter', function (assert) {
    var format = Highcharts.Point.prototype.tooltipFormatter,
        context = { 
            x: 0.45,
            y: 12.05,
            series: {
                tooltipOptions: {}
            }
        },
        simple = '{point.x} km: {point.y}°C',
        rounded = '{point.x} km: {point.y:.0f}°C';
        pad = '{point.x} km: {point.y:.4f}°C';

    assert.strictEqual(
        format.call(context, simple),
        '0.45 km: 12.05°C',
        'Display X and Y values'
    );
    assert.strictEqual(
        format.call(context, rounded),
        '0.45 km: 12°C',
        'Y-values are rounded'
    );
    assert.strictEqual(
        format.call(context, pad),
        '0.45 km: 12.0500°C',
        'Y-values are padded to 4 decimals'
    );

    // Override numberFormat to round all numbers
    Highcharts.numberFormat = function (num) {
        return Math.round(num);
    };
    assert.strictEqual(
        format.call(context, simple),
        '0 km: 12°C',
        'Override numberFormat to round all numbers'
    );
});
