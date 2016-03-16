function test(chart) {

    Array.prototype.item = function (i) { // eslint-disable-line no-extend-native
        return this[i];
    };

    chart.xAxis[0].setExtremes(2, 6, true, false);


    chart.pointer.onContainerTouchStart({
        type: 'touchstart',
        touches: [{
            pageX: 100,
            pageY: 100
        }],
        preventDefault: function () {}
    });

    chart.pointer.onContainerTouchMove({
        type: 'touchmove',
        touches: [{
            pageX: 400,
            pageY: 100
        }],
        preventDefault: function () {}
    });

    chart.pointer.onDocumentTouchEnd({
        type: 'touchend',
        touches: [{
            pageX: 400,
            pageY: 100
        }]
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}