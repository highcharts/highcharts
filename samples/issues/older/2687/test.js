function test(chart) {

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}