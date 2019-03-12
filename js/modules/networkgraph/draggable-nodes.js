import H from '../../parts/Globals.js';

var Chart = H.Chart,
    addEvent = H.addEvent;
/*
 * Draggable mode:
 */
addEvent(
    Chart,
    'load',
    function () {
        var chart = this,
            mousedownUnbinder,
            mousemoveUnbinder,
            mouseupUnbinder;

        if (chart.container) {
            mousedownUnbinder = addEvent(
                chart.container,
                'mousedown',
                function (event) {
                    var point = chart.hoverPoint;
                    if (
                        point &&
                        point.series &&
                        point.series.hasDraggableNodes &&
                        point.series.options.draggable
                    ) {
                        point.series.onMouseDown(point, event);
                        mousemoveUnbinder = addEvent(
                            chart.container,
                            'mousemove',
                            function (e) {
                                return point &&
                                    point.series &&
                                    point.series.onMouseMove(point, e);
                            }
                        );
                        mouseupUnbinder = addEvent(
                            chart.container.ownerDocument,
                            'mouseup',
                            function (e) {
                                mousemoveUnbinder();
                                mouseupUnbinder();
                                return point &&
                                    point.series &&
                                    point.series.onMouseUp(point, e);
                            }
                        );
                    }
                }
            );
        }

        addEvent(chart, 'destroy', function () {
            mousedownUnbinder();
        });
    }
);
