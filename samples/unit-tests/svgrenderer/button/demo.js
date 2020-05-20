QUnit.test('General button() tests', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        500,
        300
    );

    var button = ren.button('quite long text', 10, 10,
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
    ).add();

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
});
