function test(chart) { // eslint-disable-line no-unused-vars

    Array.prototype.item = function (i) { // eslint-disable-line no-extend-native
        return this[i];
    };


    chart.pointer.onContainerTouchStart({
        type: 'touchstart',
        touches: [{
            pageX: 300,
            pageY: 100
        }],
        preventDefault: function () {}
    });

    chart.pointer.onContainerTouchMove({
        type: 'touchmove',
        touches: [{
            pageX: 100,
            pageY: 100
        }],
        preventDefault: function () {}
    });

    chart.pointer.onDocumentTouchEnd({
        type: 'touchend',
        touches: [{
            pageX: 100,
            pageY: 100
        }]
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}