function test(chart) { // eslint-disable-line no-unused-vars
    // First drill down
    chart.get('top').points[1].doDrilldown();

    // Back to top
    chart.drillUp();


    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}