function test(chart) {

    chart.pointer.onContainerClick({
        pageX: 100,
        pageY: 100
    });

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}