function test(chart) { // eslint-disable-line no-unused-vars

    chart.pointer.onContainerClick({
        pageX: 100,
        pageY: 100
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}