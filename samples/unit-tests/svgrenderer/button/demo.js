QUnit.test('Dynamic fontWeight - button width (#12163)', function (assert) {
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
        'Width of button should be updated.'
    );
});
