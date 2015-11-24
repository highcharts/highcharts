/* global toggleDataLabels */
function test(chart) {
    toggleDataLabels(chart);
    chart.series[0].hide();
    chart.series[1].hide();
    chart.series[2].hide();

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}