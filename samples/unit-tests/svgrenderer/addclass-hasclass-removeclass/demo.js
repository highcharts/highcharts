(function () {
    function checkElement(key, elem, node, assert) {
        assert.strictEqual(
            elem.hasClass('touched'),
            false,
            key + ': Has class when empty'
        );

        elem.addClass('  string       with       excessive       spaces  ');
        assert.strictEqual(
            node.getAttribute('class'),
            'string with excessive spaces',
            key + ': Add class, excessive spaces, no replace'
        );

        elem.addClass('  string       with       excessive       spaces  ', true);
        assert.strictEqual(
            node.getAttribute('class'),
            'string with excessive spaces',
            key + ': Add class, excessive spaces, replacing text'
        );

        elem.addClass('touched', true);

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
            node.getAttribute('class'),
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

    QUnit.test('Add multiple class names', assert => {
        const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        );

        const circle = ren.circle(100, 100, 100)
            .attr({
                fill: 'blue'
            })
            .add();

        circle.addClass('highcharts-point highcharts-point-select');
        circle.addClass('highcharts-point-select highcharts-point');

        assert.strictEqual(
            circle.element.getAttribute('class'),
            'highcharts-point highcharts-point-select',
            'Duplicate class names should not occur (#10265)'
        );
    });
}());