QUnit.test('point.isValid', function (assert) {
    var isValid = Highcharts.seriesTypes.treemap.prototype.pointClass.prototype.isValid,
        context = {};
    assert.strictEqual(
        typeof isValid,
        "function",
        'point.isValid exists'
    );

    // Check against an undefined value
    context.value = undefined;
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Undefined should return false'
    );

    // Check against a null value
    context.value = null;
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Null should return false'
    );

    // Check against a boolean value
    context.value = true;
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Boolean should return false'
    );

    // Check against a number value
    context.value = 1;
    assert.strictEqual(
        isValid.call(context),
        true,
        'point.value with type of Number should return true'
    );

    // Check against a string value
    context.value = "1";
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of String should return false'
    );

    // Check against a function value
    context.value = function () {};
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Function should return false'
    );

    // Check against a object value
    context.value = {};
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Object should return false'
    );
});