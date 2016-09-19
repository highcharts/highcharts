function test(chart) { // eslint-disable-line no-unused-vars
    chart.toggleDataLabels();
    chart.series[0].hide();
    chart.series[1].hide();
    chart.series[2].hide();

    chart.getSVG = function () {
        return this.container.innerHTML;
    };
}