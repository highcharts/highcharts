QUnit.test('Touch event test on popup', function (assert) {

    // ADD CSS STYLES
    var css = '.highcharts-popup.highcharts-annotation-toolbar {right: 10%;left: auto;height: 40px;padding-right: 40px;width: auto;}.highcharts-popup.highcharts-annotation-toolbar > span {display:block;float:left;padding: 12px;}.highcharts-popup {background-color: #fff;color: #666;display: none;font-size: 0.876em;height: 70%;top: 15%;left: 25%;position: absolute;width: 50%;z-index: 100;-webkit-box-shadow: 0px 0px 8px 0px rgba(61,61,61,0.3);-moz-box-shadow: 0px 0px 8px 0px rgba(61,61,61,0.3);box-shadow: 0px 0px 8px 0px rgba(61,61,61,0.3);}.highcharts-popup button {float: right;border: none;background: #f7f7f7;color: #666;margin-left:5px;}.highcharts-popup button.highcharts-annotation-edit-button,.highcharts-popup button.highcharts-annotation-remove-button {width: 20px;height: 40px;padding: 20px;}',
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
                    align: 'left'
                }
            },
            annotations: [{
                langKey: 'rect',
                shapes: [{
                    langKey: 'rect',
                    point: '0',
                    type: 'rect',
                    width: 700,
                    height: 700
                }]
            }],
            series: [{
                keys: ['y', 'id'],
                data: [
                    [229.9, '0'],
                    [76.0, '1']
                ]
            }],
            stockTools: {
                gui: {
                    enabled: false
                }
            }
        }),
        testController = new TestController(chart);

    // show toolbar
    testController.triggerEvent('click', 100, 100, {}, true);

    var rangeSelector = chart.rangeSelector,
        inputGroup = rangeSelector.inputGroup;

    // click on the first button
    testController.triggerEvent('touchstart', inputGroup.translateX +
            rangeSelector.minDateBox.x + 80, chart.plotTop + inputGroup.translateY, {}, true);

    assert.strictEqual(
        chart.navigationBindings.popup.container.className.indexOf('highcharts-annotation-toolbar'),
        -1,
        'Edit popup is displayed by touch event.'
    );

    // REMOVE CSS STYLES
    style.parentNode.removeChild(style);
});
