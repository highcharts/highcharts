function test(chart) { // eslint-disable-line no-unused-vars
    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}