function test(chart) { // eslint-disable-line no-unused-vars
    chart.series[0].points[4].select();
    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}