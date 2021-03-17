QUnit.test('Stocktools GUI', function (assert) {
    /*const chart = */Highcharts.stockChart('container', {
        stockTools: {
            gui: {
                enabled: true,
                definitions: {
                    measure: {
                        items: ['measureX']
                    }
                }
            }
        },
        title: {
            text: 'Chart title',
            align: 'left'
        },
        legend: {
            enabled: true,
            align: 'left'
        },
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    assert.ok(
        1,
        'No errors should be thrown after setting just one item (#10980)'
    );

    // This doesnt work outside highcharts-utils, possibly because it needs
    // the css
    /*
    const spacing = Highcharts.defaultOptions.chart.spacing[3];
    const offset = spacing + chart.stockTools.listWrapper.offsetWidth;

    assert.strictEqual(
        chart.legend.group.translateX,
        offset,
        '#9744: Legend should have correct position'
    );
    assert.strictEqual(
        chart.title.attr('x'),
        offset,
        '#9744: Title should have the correct position'
    );

    Highcharts.fireEvent(chart.stockTools.showhideBtn, 'click');

    assert.strictEqual(
        chart.legend.group.translateX,
        spacing,
        '#9744: Legend should have correct position after hiding toolbar'
    );
    assert.strictEqual(
        chart.title.attr('x'),
        spacing,
        '#9744: Title should have the correct position after hiding toolbar'
    );
    */
});

QUnit.test('Disabling and enabling stock tools buttons, when series are invisible, #14192',
    function (assert) {
        var wasInitCalled = false;

        // Creating test controller and adding styles to button.
        const toolsContainer = document.createElement('div'),
            button = document.createElement('button');

        toolsContainer.className += 'tools-container';
        button.className += 'dummy-button';
        button.innerHTML = 'dummy button';
        toolsContainer.appendChild(button);

        document.getElementById('container').parentNode
            .insertBefore(toolsContainer, document.getElementById('container'));

        var chart = Highcharts.stockChart('container', {
            stockTools: {
                gui: {
                    enabled: false // disable the built-in toolbar
                }
            },
            navigation: {
                bindings: {
                    dummyButton: {
                        className: 'dummy-button',
                        init: function () {
                            wasInitCalled = true;
                        }
                    }
                },
                bindingsClassName: 'tools-container'
            }
        });

        var controller = new TestController(chart);
        toolsContainer.style.position = 'absolute';
        toolsContainer.style['z-index'] = 99999;

        controller.click(10, 10);
        assert.equal(wasInitCalled,
            false,
            'Init function should not be executed, when there is no series.'
        );

        wasInitCalled = false;
        chart.addSeries({
            data: [1, 2, 3, 2, 3, 2]
        });

        controller.click(10, 10);
        assert.equal(wasInitCalled,
            true,
            'Init function should be executed, after series was added.'
        );

        chart.series[0].setVisible(false);
        wasInitCalled = false;
        controller.click(10, 10);
        assert.equal(wasInitCalled,
            false,
            'Init function should not be called, when series are invisible.'
        );

        chart.series[0].setVisible(true);
        wasInitCalled = false;
        controller.click(10, 10);
        assert.equal(wasInitCalled,
            true,
            'Init function should not be called, when series are visible.'
        );

        chart.series[0].remove();
        wasInitCalled = false;
        controller.click(10, 10);
        assert.equal(wasInitCalled,
            false,
            'Init function should not be called, after deleting the series.'
        );

        chart.addSeries({
            data: [1, 2, 3, 2, 3, 2]
        }, false);

        chart.update({
            navigation: {
                bindings: {
                    dummyButton: {
                        className: 'dummy-button',
                        noDataState: 'normal',
                        init: function () {
                            wasInitCalled = true;
                        }
                    }
                }
            }
        }, false);

        chart.series[0].setVisible(false, false);
        chart.redraw();
        wasInitCalled = false;
        controller.click(10, 10);
        assert.equal(
            wasInitCalled,
            true,
            'Init function should be always called for button with alwaysVisible property defined.'
        );

        button.remove();
        toolsContainer.remove();
    });