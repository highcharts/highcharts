QUnit.test('Show loading', function (assert) {
    var chart = Highcharts.charts[0],
        label,
        done = assert.async();

    chart.showLoading('Loading AJAX...');

    label = document.querySelector('.highcharts-loading span');
    assert.equal(
        label.innerHTML,
        'Loading AJAX...',
        'First text'
    );

    chart.showLoading('Loading image...');

    assert.equal(
        label.innerHTML,
        'Loading image...',
        'Second text'
    );

    chart.showLoading();

    assert.equal(
        label.innerHTML,
        'Loading...',
        'Default text'
    );

    chart.options.loading.hideDuration = 1;
    chart.hideLoading();
    setTimeout(function () {
        assert.strictEqual(
            window.getComputedStyle(label.parentNode, '').display,
            'none',
            'Label is hidden'
        );
        done();
    }, 13);

});