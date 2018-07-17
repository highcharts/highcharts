
QUnit.test('Show loading', function (assert) {

    var chart = Highcharts
        .chart('container', {

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

    var clock = TestUtilities.lolexInstall();

    try {

        var done = assert.async(),
            label;

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
        }, 50);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }

});