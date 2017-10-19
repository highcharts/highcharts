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
