QUnit.test('Credits href should be run through the allow list', function (
    assert
) {
    const errors = [],
        unbindError = Highcharts.addEvent(
            Highcharts,
            'displayError',
            function (e) {
                errors.push(e.code);
                // Keep the console clean
                e.preventDefault();
            }
        );

    try {
        const chart = Highcharts.chart('container', {
            credits: {
                // eslint-disable-next-line no-script-url
                href: 'javascript:window.creditsXss = true;',
                text: 'Credits'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        assert.ok(
            errors.indexOf(33) !== -1,
            'A warning should be reported for a disallowed credits URL'
        );

        chart.credits.element.dispatchEvent(
            new MouseEvent('click', { bubbles: true })
        );

        assert.strictEqual(
            window.creditsXss,
            void 0,
            'Clicking the credits should not run a javascript: URL'
        );

        errors.length = 0;

        chart.credits.update({
            href: 'https://www.example.com'
        });

        assert.strictEqual(
            errors.indexOf(33),
            -1,
            'An allowed credits URL should pass through the filter'
        );
    } finally {
        unbindError();
        delete window.creditsXss;
    }
});
