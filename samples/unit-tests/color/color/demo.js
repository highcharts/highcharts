QUnit.test('Interpolate colors', function (assert) {

    // Cache names from Boost module
    var colorNames = Highcharts.Color.prototype.names;
    Highcharts.Color.prototype.names = {};


    var Color = Highcharts.Color;

    assert.equal(
        Color('#FF0000').tweenTo(Color('#0000FF'), 0.5),
        'rgb(128,0,128)',
        'Hex colors'
    );

    assert.equal(
        Color('rgb(255, 0, 0)').tweenTo(Color('rgb(0, 0, 255)'), 0.5),
        'rgb(128,0,128)',
        'RGB colors'
    );

    assert.equal(
        Color('rgba(255, 0, 0, 1)').tweenTo(Color('rgba(0, 0, 255, 0.5)'), 0.5),
        'rgba(128,0,128,0.75)',
        'RGBA colors'
    );

    assert.equal(
        Color('red').tweenTo(Color('blue'), 0.5),
        'blue',
        'Named colors'
    );

    assert.equal(
        Color('red').tweenTo(Color('#FFFFFF'), 0.5),
        '#FFFFFF',
        'Named color to hex'
    );

    assert.equal(
        Color('#FFFFFF').tweenTo(Color('red'), 0.5),
        'red',
        'Hex to named color'
    );

    assert.equal(
        JSON.stringify(Color({
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, '#FF0000'],
                [1, '#00FF00']
            ]
        }).tweenTo(Color({
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
        Color().tweenTo(Color(), 0.5),
        'none',
        'Undefined colors'
    );

    Highcharts.Color.prototype.names = colorNames;


});