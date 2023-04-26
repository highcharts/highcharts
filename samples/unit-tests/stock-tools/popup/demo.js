QUnit.test('Touch event test on popup', function (assert) {
    // ADD CSS STYLES
    var css =
            '.highcharts-popup.highcharts-annotation-toolbar {right: 10%;left: auto;height: 40px;padding-right: 40px;width: auto;}.highcharts-popup.highcharts-annotation-toolbar > span {display:block;float:left;padding: 12px;}.highcharts-popup {background-color: #fff;color: #666;display: none;font-size: 0.876em;height: 70%;top: 15%;left: 25%;position: absolute;width: 50%;z-index: 100;-webkit-box-shadow: 0px 0px 8px 0px rgba(61,61,61,0.3);-moz-box-shadow: 0px 0px 8px 0px rgba(61,61,61,0.3);box-shadow: 0px 0px 8px 0px rgba(61,61,61,0.3);}.highcharts-popup button {float: right;border: none;background: #f7f7f7;color: #666;margin-left:5px;}.highcharts-popup button.highcharts-annotation-edit-button,.highcharts-popup button.highcharts-annotation-remove-button {width: 20px;height: 40px;padding: 20px;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    var chart = Highcharts.stockChart('container', {
            chart: {
                width: 800
            },
            yAxis: {
                labels: {
                    align: 'left',
                    x: 10
                }
            },
            annotations: [
                {
                    langKey: 'rect',
                    shapes: [
                        {
                            langKey: 'rect',
                            point: '0',
                            type: 'rect',
                            width: 700,
                            height: 700
                        }
                    ]
                }
            ],
            series: [
                {
                    keys: ['y', 'id'],
                    data: [
                        [229.9, '0'],
                        [76.0, '1']
                    ]
                }
            ],
            stockTools: {
                gui: {
                    enabled: false
                }
            }
        }),
        testController = new TestController(chart);

    // show toolbar
    testController.triggerEvent('click', 100, 100);

    var rangeSelector = chart.rangeSelector,
        inputGroup = rangeSelector.inputGroup;

    // click on the first button
    testController.touchStart(
        chart.plotWidth - 120,
        chart.plotTop + inputGroup.translateY,
        undefined,
        undefined
    );

    assert.strictEqual(
        chart.navigationBindings.popup.container.className.indexOf(
            'highcharts-annotation-toolbar'
        ),
        -1,
        'Edit popup should be displayed by touch event'
    );


    let chartPos = Highcharts.offset(chart.container);
    let { left, top } = Highcharts.offset(
        chart.navigationBindings.popup.container
    );

    testController.moveTo(left - chartPos.left + 5, top - chartPos.top + 5);
    assert.ok(
        chart.tooltip.isHidden,
        '#14403: Tooltip should be hidden when hovering popup'
    );

    testController.moveTo(left - chartPos.left - 5, top - chartPos.top + 5);
    assert.notOk(
        chart.tooltip.isHidden,
        '#14403: Tooltip should not be hidden when not hovering popup'
    );

    let fired = false;
    // adding event to check, if closePopup event was fired, when closing popup
    Highcharts.addEvent(chart.navigationBindings, 'closePopup', () => {
        fired = true;
    });

    // closing popup

    const closeButton = chart.container.getElementsByClassName('highcharts-popup-close')[0];
    // css are not loaded in karma, so it is mandatory to set the position of the button manually
    closeButton.style.position = 'absolute';
    closeButton.style.top = 0;
    closeButton.style.height = 40;
    closeButton.style.width = 40;
    closeButton.style.right = 0;
    ({ left, top } = Highcharts.offset(closeButton));

    chartPos = Highcharts.offset(chart.container);
    testController.triggerEvent('click', left - chartPos.left + 20, top - chartPos.top + 20, {}, true);

    assert.equal(
        fired,
        true,
        'Event "closePopup" should be fired when closing popup'
    );
    // REMOVE CSS STYLES
    style.parentNode.removeChild(style);
});
