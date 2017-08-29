QUnit.test('pointArrayMap', function (assert) {
    var wordcloudPrototype = Highcharts.seriesTypes.wordcloud.prototype;
    assert.deepEqual(
        wordcloudPrototype.pointArrayMap,
        ['weight'],
        'pointArrayMap should be an Array with a single value "weight".'
    );
});
