QUnit.test(
    'Pointer#destroy should clear container\'s inline handlers (#25305)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                series: [{
                    data: [1, 2, 3]
                }]
            }),
            container = chart.container,
            svg = container.querySelector('svg');

        let caughtError;
        const onGlobalError = e => {
                caughtError = e.error || new Error(e.message);
            },
            destroyChart = () => {
                chart.destroy();
            };

        document.body.addEventListener('click', destroyChart, {
            capture: true
        });
        window.addEventListener('error', onGlobalError);

        svg.dispatchEvent(
            new MouseEvent('click', { bubbles: true })
        );

        assert.deepEqual(
            [
                container.onclick,
                container.onmousedown,
                container.onmousemove
            ],
            [null, null, null],
            'Container\'s stale onclick/onmousedown/onmousemove should ' +
            'be cleared before the bubble phase reaches it.'
        );

        assert.notOk(
            caughtError,
            'Container\'s stale onclick/onmousedown/onmousemove should ' +
            'not cause an error.'
        );

        window.removeEventListener('error', onGlobalError);
        document.body.removeEventListener('click', destroyChart, {
            capture: true
        });
    }
);
