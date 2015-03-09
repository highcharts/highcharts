$(function () {
    QUnit.test('Replacement in tooltip', function (assert) {

        var point = {
            color: '#00FF00',
            series: {
                tooltipOptions: {

                }
            },
            y: 100
        };
        
        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>100</b><br/>',
            'Simple format'
        );

        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>100.00</b><br/>',
            'Number format'
        );

        // Add valuePrefix and suffix
        point.series.tooltipOptions.valuePrefix = '$';
        point.series.tooltipOptions.valueSuffix = ' USD';

        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>$100 USD</b><br/>',
            'Prefix and suffix'
        );

        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>$100.00 USD</b><br/>',
            'Combined prefix and suffix with format'
        );

        // Four value decimals
        point.series.tooltipOptions.valueDecimals = 4;

        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>$100.0000 USD</b><br/>',
            'Value decimals, no formatting'
        );

        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>$100.0000 USD</b><br/>',
            'Value decimals with formatting'
        );

        // Zero valueDecimals
        point.series.tooltipOptions.valueDecimals = 0;
        assert.equal(
            Highcharts.Point.prototype.tooltipFormatter.call(point, '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>'),
            '<span style="color:#00FF00">●</span> : <b>$100 USD</b><br/>',
            'Zero value decimals'
        );


    });

});