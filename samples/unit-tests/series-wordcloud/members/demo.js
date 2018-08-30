QUnit.test('pointArrayMap', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype;
    assert.deepEqual(
        wordcloudPrototype.pointArrayMap,
        ['weight'],
        'pointArrayMap should be an Array with a single value "weight".'
    );
});

QUnit.test('hasData', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        hasData = wordcloudPrototype.hasData;
    assert.strictEqual(
      hasData.call(undefined),
      false,
      'should return false if series is not an object'
    );
    assert.strictEqual(
      hasData.call({
          visible: undefined,
          points: ["Point"]
      }),
      false,
      'should return false if series.visible is not explicitly true'
    );
    assert.strictEqual(
      hasData.call({
          visible: true,
          points: undefined
      }),
      false,
      'should return false if series.points is not an array'
    );
    assert.strictEqual(
      hasData.call({
          visible: true,
          points: []
      }),
      false,
      'should return false if series.points has length 0'
    );
    assert.strictEqual(
      hasData.call({
          visible: true,
          points: ["Point"]
      }),
      true,
      'should return true if series.visible is true, and series.points has length > 0'
    );
});

QUnit.test('extendPlayingField', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        extendPlayingField = wordcloudPrototype.utils.extendPlayingField,
        field = {
            width: 20,
            height: 40,
            ratioX: 1,
            ratioY: 2
        },
        rectangle = {
            left: -5,
            right: 5,
            top: -10,
            bottom: 10
        };

    assert.deepEqual(
        extendPlayingField(undefined, rectangle),
        undefined,
        'should return the existing field if parameter field is invalid.'
    );

    assert.deepEqual(
        extendPlayingField(field, undefined),
        {
            width: 20,
            height: 40,
            ratioX: 1,
            ratioY: 2
        },
        'should return the existing field if parameter rectangle is invalid.'
    );

    assert.deepEqual(
        extendPlayingField(field, rectangle),
        {
            width: 60,
            height: 120,
            ratioX: 1,
            ratioY: 2
        },
        'should return the existing field if parameter rectangle is invalid.'
    );
});

QUnit.test('getRotation', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        getRotation = wordcloudPrototype.utils.getRotation;
    assert.strictEqual(
        getRotation(undefined, 0, -60, 60),
        false,
        'should return false when orientations is not a Number.'
    );
    assert.strictEqual(
        getRotation(-1, 2, -60, 60),
        false,
        'should return false if orientations is negative.'
    );
    assert.strictEqual(
        getRotation(3, undefined, -60, 60),
        false,
        'should return false when index is not a Number.'
    );
    assert.strictEqual(
        getRotation(3, -1, -60, 60),
        false,
        'should return false if index is negative.'
    );
    assert.strictEqual(
        getRotation(3, 0, undefined, 60),
        false,
        'should return false when from is not a Number.'
    );
    assert.strictEqual(
        getRotation(1, 2, 60, -60),
        false,
        'should return false if from is larger then to.'
    );
    assert.strictEqual(
        getRotation(3, 0, -60, undefined),
        false,
        'should return false when from is not a Number.'
    );
    assert.strictEqual(
        getRotation(3, 0, -60, 60),
        -60,
        'should return -60 which is the 1st of 3 orientations between -60 to 60.'
    );
    assert.strictEqual(
        getRotation(3, 1, -60, 60),
        0,
        'should return 0 which is the 2nd of 3 orientations between -60 to 60.'
    );
    assert.strictEqual(
        getRotation(3, 2, -60, 60),
        60,
        'should return 60 which is the 3rd of 3 orientations between -60 to 60.'
    );
});

QUnit.test('deriveFontSize', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        deriveFontSize = wordcloudPrototype.deriveFontSize;

    assert.strictEqual(
        deriveFontSize(),
        1,
        'should return 1 when no parameters are given.'
    );

    assert.strictEqual(
        deriveFontSize(undefined, 10, 1),
        1,
        'should have relativeWeight default to 0.'
    );

    assert.strictEqual(
        deriveFontSize(1, undefined, 1),
        1,
        'should have maxFontSize default to 1.'
    );

    assert.strictEqual(
        deriveFontSize(1, 1),
        1,
        'should have minFontSize default to 1.'
    );

    assert.strictEqual(
        deriveFontSize(1, 10, 1),
        10,
        'should return result equal to maxFontSize when relativeWeight is 1.'
    );

    assert.strictEqual(
        deriveFontSize(0, 10, 1),
        1,
        'should return result equal to minFontSize when relativeWeight is 0.'
    );

    assert.strictEqual(
        deriveFontSize(1, 1.5),
        1,
        'should round the result down to the nearest integer.'
    );

    assert.strictEqual(
        deriveFontSize(0.5, 10, 1),
        5,
        'should return the relativeWeight times the maxFontSize.'
    );

    assert.strictEqual(
        deriveFontSize(0.1, 10, 5),
        5,
        'should return the minFontSize if the result of relativeWeight times maxFontSize is lower.'
    );
});

/**
 * TODO: isPolygonsColliding is a part of a mixin collision.js. This should have
 * its own seperate test, but it is currently not possible because
 * we can't test something that is not accesible on the Highcharts object.
 */
QUnit.test('isPolygonsColliding', function (assert) {
    console.clear();
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        isPolygonsColliding = wordcloudPrototype.utils.isPolygonsColliding,
        polygonA = [[10, 10], [20, 30], [30, 10]],
        polygonB = [[40, 10], [50, 30], [60, 10]],
        polygonC = [[20, 20], [30, 40], [40, 20]],
        polygonD = [[30, 0], [30, 40], [70, 40], [70, 0]],
        print = function (polygon) {
            return '((' + polygon.join('), (') + '))';
        };

    assert.strictEqual(
        isPolygonsColliding(polygonA, polygonB),
        false,
        'Polygons A' + print(polygonA) + '  and B' + print(polygonB) + ' are not overlapping.'
    );

    assert.strictEqual(
        isPolygonsColliding(polygonA, polygonC),
        true,
        'Polygons A' + print(polygonA) + '  and C' + print(polygonC) + ' are overlapping.'
    );

    assert.strictEqual(
        isPolygonsColliding(polygonB, polygonC),
        false,
        'Polygons B' + print(polygonB) + '  and C' + print(polygonC) + ' are not overlapping.'
    );

    assert.strictEqual(
        isPolygonsColliding(polygonC, polygonD),
        true,
        'Polygons C' + print(polygonC) + '  and D' + print(polygonD) + ' are overlapping.'
    );
});

QUnit.test('rotate2DToOrigin', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        rotate2DToOrigin = wordcloudPrototype.utils.rotate2DToOrigin;

    assert.deepEqual(
        rotate2DToOrigin([3, 0], 90),
        [0, -3],
        'Rotating (3, 0) 90° should equal (0, -3).'
    );

    assert.deepEqual(
        rotate2DToOrigin([3, 0], 360),
        [3, 0],
        'Rotating (3, 0) 360° should equal (3, 0).'
    );

    assert.deepEqual(
        rotate2DToOrigin([0, 3], 90),
        [3, 0],
        'Rotating (0, 3) 90° should equal (3, 0).'
    );
});

QUnit.test('rotate2DToPoint', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype,
        rotate2DToPoint = wordcloudPrototype.utils.rotate2DToPoint;

    assert.deepEqual(
        rotate2DToPoint([3, 0], [0, 0], 90),
        [0, -3],
        'Rotating (3, 0) 90° around (0,0) should equal (0, -3).'
    );

    assert.deepEqual(
        rotate2DToPoint([0, 6], [0, 3], 90),
        [3, 3],
        'Rotating (0, 6) 90° around (0, 3) should equal (3, 3).'
    );
});
