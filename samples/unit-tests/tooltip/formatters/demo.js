QUnit.test('tooltipFooterHeaderFormatter', function (assert) {
	var formatter = Highcharts.Tooltip.prototype.tooltipFooterHeaderFormatter,
		labelConfig = {
			x: 'Category',
			y: 10,
			color: '#FF0000',
			key: 'pointName',
			series: {
				tooltipOptions: {
					headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
					footerFormat: ''
				},
				xAxis: {
					options: {
						type: undefined
					}
				}
			},
			point: {},
			percentage: undefined,
			total: 10
		};
    assert.strictEqual(
        formatter(labelConfig, false),
        '<span style="font-size: 10px">pointName</span><br/>',
        'headerFormat default'
    );
    assert.strictEqual(
        formatter(labelConfig, true),
        '',
        'footerFormat default'
    );
});
