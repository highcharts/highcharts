$(function () {
    QUnit.test('Interpolate colors', function (assert) {

        var Color = Highcharts.Color,
            tweenColors = Highcharts.ColorAxis.prototype.tweenColors;

        assert.equal(
            tweenColors(Color('#FF0000'), Color('#0000FF'), 0.5),
            'rgb(128,0,128)',
            'Hex colors'
        );

        assert.equal(
            tweenColors(Color('rgb(255, 0, 0)'), Color('rgb(0, 0, 255)'), 0.5),
            'rgb(128,0,128)',
            'RGB colors'
        );

        assert.equal(
            tweenColors(Color('rgba(255, 0, 0, 1)'), Color('rgba(0, 0, 255, 0.5)'), 0.5),
            'rgba(128,0,128,0.75)',
            'RGBA colors'
        );

        assert.equal(
            tweenColors(Color('red'), Color('blue'), 0.5),
            'blue',
            'Named colors'
        );
        assert.equal(
            JSON.stringify(tweenColors(Color({
                radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                stops: [
                    [0, '#FF0000'],
                    [1, '#00FF00']
                ]
            }), Color({
                radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                stops: [
                    [0, '#FFFF00'],
                    [1, '#00FFFF']
                ]
            }), 0.5)),
            '{"radialGradient":{"cx":0.5,"cy":0.3,"r":0.7},"stops":[[0,"#FFFF00"],[1,"#00FFFF"]]}',
            'Gradients'
        );
        assert.equal(
            tweenColors(Color(), Color(), 0.5),
            'none',
            'Undefined colors'
        );

    });

});