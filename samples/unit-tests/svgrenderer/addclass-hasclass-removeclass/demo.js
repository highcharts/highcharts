(function () {
    function checkElement(key, elem, node, assert) {
        assert.strictEqual(
            elem.hasClass('touched'),
            false,
            key + ': Has class when empty'
        );

        elem.addClass('touched');

        assert.strictEqual(
            node.getAttribute('class'),
            'touched',
            key + ': Add class'
        );

        elem.addClass('touched-again');
        assert.strictEqual(
            node.getAttribute('class'),
            'touched touched-again',
            key + ': Add class twice'
        );


        assert.strictEqual(
            elem.hasClass('touched'),
            true,
            key + ': Has class'
        );

        elem.removeClass('touched');

        assert.strictEqual(
            node.getAttribute('class').trim(),
            'touched-again',
            key + ': Removed class'
        );
        assert.strictEqual(
            elem.hasClass('touched'),
            false,
            key + ': Has class'
        );
    }

    QUnit.test('Add and remove classes', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        var elem = ren.circle(100, 100, 50)
            .attr({
                fill: 'red'
            })
            .add();

        checkElement('SVG circle', elem, elem.element, assert);

    });

    QUnit.test('Add and remove classes in HTML elements', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        var g = ren.g().add();

        var elem = ren.text('HTML', 100, 300, true)
            .add(g);

        checkElement('HTML text', elem, elem.element, assert);

    });
    QUnit.test('Add and remove classes in HTML elements', function (assert) {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        var g = ren.g().add();

        ren.text('HTML', 100, 300, true).add(g);

        // The class names should now be set on g.div
        checkElement('HTML group', g, g.div, assert);

    });
}());