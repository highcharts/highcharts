QUnit.test('Tests event order of TestController.moveTo', function (assert) {

    var browserOrder = [
            'mouseover rect 5 0',
            'mouseover DIV 5 0',
            'mouseenter DIV 5 0',
            'mouseenter DIV 5 0',
            'mouseenter rect 5 0',
            'mouseenter DIV 5 0',
            'mousemove rect 5 0',
            'mousemove DIV 5 0',
            'mousemove rect 5 1',
            'mousemove DIV 5 1',
            'mouseout rect 5 1',
            'mouseout DIV 5 1',
            'mouseleave rect 5 1',
            'mouseleave DIV 5 1',
            'mouseover circle 5 2',
            'mouseover DIV 5 2',
            'mouseenter circle 5 2',
            'mouseenter DIV 5 2',
            'mousemove circle 5 2',
            'mousemove DIV 5 2',
            'mousemove circle 5 3',
            'mousemove DIV 5 3',
            'mousemove circle 5 4',
            'mousemove DIV 5 4',
            'mousemove circle 5 5',
            'mousemove DIV 5 5',
            'mousemove circle 5 5',
            'mousemove DIV 5 5',
            'mousemove circle 5 4',
            'mousemove DIV 5 4',
            'mousemove circle 5 3',
            'mousemove DIV 5 3',
            'mousemove circle 5 2',
            'mousemove DIV 5 2',
            'mouseout circle 5 2',
            'mouseout DIV 5 2',
            'mouseleave circle 5 2',
            'mouseleave DIV 5 2',
            'mouseover rect 5 1',
            'mouseover DIV 5 1',
            'mouseenter rect 5 1',
            'mouseenter DIV 5 1',
            'mousemove rect 5 1',
            'mousemove DIV 5 1',
            'mousemove rect 5 0',
            'mousemove DIV 5 0',
            'mouseout rect 5 0',
            'mouseout DIV 5 0',
            'mouseleave rect 5 0',
            'mouseleave DIV 5 0',
            'mouseleave DIV 5 0',
            'mouseleave DIV 5 0'
        ],
        capturedOrder = [],
        chart = Highcharts.chart('container', {
            chart: {
                backgroundColor: null
            }
        }),
        container = chart.container,
        controller = new TestController(chart),
        pointer = chart.pointer,
        renderer = chart.renderer,
        rect1 = renderer
            .rect(0, 0, 9, 9)
            .attr({ fill: 'rgba(255, 0, 0, 0.5)' })
            .add()
            .element,
        circle1 = renderer
            .circle(4.5, 4.5, 3.5)
            .attr({ fill: 'rgba(0, 255, 0, 0.5)' })
            .add()
            .element,
        rect2 = renderer
            .rect(3, 3, 3, 3)
            .attr({ fill: 'rgba(0, 0, 255, 0.5)' })
            .css({ pointerEvents: 'none' })
            .add()
            .element;

    controller.moveTo(5, -1);

    function captureEvent(e) {
        pointer.normalize(e);
        var type = (e && e.type);
        if (type) {
            // console.log(type, e.currentTarget.nodeName, e.chartX, e.chartY);
            capturedOrder.push(
                type + ' ' +
                e.currentTarget.nodeName + ' ' +
                e.chartX + ' ' +
                e.chartY
            );
        }
    }

    function addEvents(element) {
        element.addEventListener('mouseover', captureEvent);
        element.addEventListener('mouseenter', captureEvent);
        element.addEventListener('mousemove', captureEvent);
        element.addEventListener('mouseout', captureEvent);
        element.addEventListener('mouseleave', captureEvent);
    }

    function removeEvents(element) {
        element.removeEventListener('mouseover', captureEvent);
        element.removeEventListener('mouseenter', captureEvent);
        element.removeEventListener('mousemove', captureEvent);
        element.removeEventListener('mouseout', captureEvent);
        element.removeEventListener('mouseleave', captureEvent);
    }

    addEvents(container);
    addEvents(rect1);
    addEvents(circle1);
    addEvents(rect2);

    controller.moveTo(5, 5);
    controller.moveTo(5, -1);

    capturedOrder.every(function (capture, index) {
        assert.strictEqual(
            capture,
            browserOrder[index],
            'The event order of TestController should be in order at index ' + index + '.'
        );
        return (capture === browserOrder[index]);
    });

    removeEvents(container);
    removeEvents(rect1);
    removeEvents(circle1);
    removeEvents(rect2);

});
