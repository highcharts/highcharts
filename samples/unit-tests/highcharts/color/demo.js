$(function () {

    var Color = Highcharts.Color;
    QUnit.test('Color object', function (assert) {

        assert.strictEqual(
            Color('#FF0000').get(),
            'rgb(255,0,0)',
            'Hex, no new'
        );
        assert.strictEqual(
            new Color('#FF0000').get(),
            'rgb(255,0,0)',
            'Hex, new'
        );
        assert.strictEqual(
            Color('#FF0000').get('rgb'),
            'rgb(255,0,0)',
            'Get RGB'
        );
        assert.strictEqual(
            Color('rgb(255, 0, 0)').get(),
            'rgb(255,0,0)',
            'RGB'
        );
        assert.strictEqual(
            Color('rgb(255,0,0)').get(),
            'rgb(255,0,0)',
            'RGB'
        );
        assert.strictEqual(
            Color('rgba(255, 0, 0, 0.9)').get(),
            'rgba(255,0,0,0.9)',
            'RGBA'
        );
        assert.strictEqual(
            Color('rgba(255,0,0,1)').get(),
            'rgb(255,0,0)',
            'RGBA'
        );

        assert.strictEqual(
            Color('#FF0000').brighten(0.2).get(),
            'rgb(255,51,51)',
            'Brighten'
        );

        assert.strictEqual(
            Color('#FF0000').setOpacity(0.2).get(),
            'rgba(255,0,0,0.2)',
            'Set opacity'
        );
    });
});