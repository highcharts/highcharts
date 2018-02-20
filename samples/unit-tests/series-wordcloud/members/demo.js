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
