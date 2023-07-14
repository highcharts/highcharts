QUnit.test('General button() tests', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        500,
        300
    );

    var button = ren
        .button(
            'quite long text',
            10,
            10,
            function () {
                this.setState(this.state === 2 ? 0 : 2);
            },
            {
                height: 18,
                width: null,
                style: {
                    fontSize: '20px',
                    fontWeight: 'normal'
                }
            }
        )
        .add();

    // #12165 - button should not return errors when width: null
    const normalButtonWidth = button.width;

    assert.strictEqual(
        normalButtonWidth > 0,
        true,
        'Button should be genereted.'
    );

    // #12163 - button's width update when change font-weight
    // simplified simulation of clicked state
    button.css({
        color: 'red',
        fontWeight: 'bold'
    });

    assert.strictEqual(
        button.width > normalButtonWidth,
        true,
        'Width of button should be updated  when fontWeight has changed (#12163)'
    );

    assert.notStrictEqual(
        button.attr('style'),
        '[Object object]',
        'Button should not set wrong styles (#9424).'
    );

    button.destroy();

    // #13798 - button text style not applied to all buttons.
    var normalState = {
            style: {
                color: 'blue',
                fontWeight: 'bold'
            }
        },
        buttons = [],
        btn;

    ['One', 'Two'].forEach((s, i) => {
        btn = ren.button(s, 20, i * 30 + 30, undefined, normalState).add();
        buttons.push(btn);
    });

    assert.strictEqual(
        buttons[1].text.styles.color,
        'blue',
        'Button function should not mutate its options (#13798).'
    );

    const chart = Highcharts.chart('container', {});
    const controller = new TestController(chart);
    let clickedHTMLButton = false;
    chart.renderer.button(
        'Klikk',
        100,
        100,
        function () {
            clickedHTMLButton = true;
        },
        {},
        undefined,
        undefined,
        undefined,
        undefined,
        true
    ).add();

    controller.click(120, 110);

    assert.ok(
        clickedHTMLButton,
        'The useHTML button should respond to click'
    );


});
