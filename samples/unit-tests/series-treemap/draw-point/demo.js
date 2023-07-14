QUnit.test('drawPoint', assert => {
    const { Renderer } = Highcharts;
    const { pointClass } = Highcharts.Series.types.treemap.prototype;
    const { draw } = pointClass.prototype;
    const point = {
        draw,
        shouldDraw: () => true,
        getClassName: function () {
            const point = this;
            return !point.graphic ? 'highcharts-point' : 'highcharts-updated';
        }
    };
    const renderer = new Renderer(
        document.getElementById('container'),
        200,
        200
    );
    const params = {
        renderer,
        shapeType: 'rect',
        animatableAttribs: {}
    };

    /**
     * First render of the point graphic.
     */
    point.draw(params);
    const el = point.graphic.element;
    assert.strictEqual(
        'highcharts-point',
        el.getAttribute('class'),
        'should set class attribute equal to result of point.getClassName.'
    );

    /**
     * Update the point graphic
     */
    point.draw(params);
    assert.strictEqual(
        'highcharts-updated',
        el.getAttribute('class'),
        'should on update remove the previous class attribute, and set it to the last result of point.getClassName.'
    );

});
