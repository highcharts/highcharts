QUnit.test('Add and remove classes', function (assert) {

    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        400,
        400
    );

    var circ = ren.circle(100, 100, 50)
        .attr({
            fill: 'red'
        })
        .add();

    assert.strictEqual(
        circ.hasClass('touched'),
        false,
        'Has class when empty'
    );

    circ.addClass('touched');

    assert.strictEqual(
        circ.element.getAttribute('class'),
        'touched',
        'Add class'
    );

    circ.addClass('touched-again');
    assert.strictEqual(
        circ.element.getAttribute('class'),
        'touched touched-again',
        'Add class twice'
    );


    assert.strictEqual(
        circ.hasClass('touched'),
        true,
        'Has class'
    );

    circ.removeClass('touched');

    assert.strictEqual(
        circ.element.getAttribute('class').trim(),
        'touched-again',
        'Removed class'
    );
    assert.strictEqual(
        circ.hasClass('touched'),
        false,
        'Has class'
    );

});