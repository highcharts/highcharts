function test(chart) {
    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}