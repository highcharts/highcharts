function test(chart) {
    chart.series[0].hide();

    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}